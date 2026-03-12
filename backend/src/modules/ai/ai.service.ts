import {
  Injectable,
  Logger,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import * as crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildComparisonPrompt } from './prompts/comparison.prompt';

interface ComparisonResult {
  winner: string;
  winnerName: string;
  summary: string;
  categories: Array<{
    name: string;
    [key: string]: any; // e.g. productAScore, productBScore, etc.
    winner: string;
    reasoning: string;
  }>;
  products: Record<
    string,
    {
      name: string;
      price: number | null;
      pros: string[];
      cons: string[];
      rating: number | null;
      keySpecs: Record<string, string>;
      bestFor: string;
    }
  >;
  recommendation: string;
}

// Checks if an error means "try next model" (rate limit OR model not available)
function isQuotaError(error: unknown): boolean {
  const msg = (error as Error)?.message || '';
  return (
    msg.includes('429') ||
    msg.includes('404') ||
    msg.includes('Too Many Requests') ||
    msg.includes('quota') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('not found for API version') ||
    msg.includes('is not supported')
  );
}

// Sleep helper for retry backoff
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  // Model priority order: primary + fallbacks
  private readonly modelChain: string[];

  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') ?? '';
    this.genAI = new GoogleGenerativeAI(apiKey);

    const primary =
      this.configService.get<string>('GEMINI_MODEL') || 'gemini-1.5-flash';
    const fallbackStr =
      this.configService.get<string>('GEMINI_FALLBACK_MODELS') ||
      'gemini-2.0-flash-lite,gemini-1.5-flash-8b';
    const fallbacks = fallbackStr
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    // Deduplicate: primary first, then fallbacks
    this.modelChain = [primary, ...fallbacks.filter((m) => m !== primary)];
    this.logger.log(`AI model chain: ${this.modelChain.join(' → ')}`);
  }

  async compareProducts(
    productNames: string[],
    preferences?: {
      budget?: string;
      priorities?: string[];
      useCase?: string;
    },
  ): Promise<ComparisonResult> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new InternalServerErrorException(
        'AI service not configured. Please set GEMINI_API_KEY in backend/.env',
      );
    }

    // 1. Check Redis Cache
    const cacheKey = this.generateCacheKey(productNames, preferences);
    if (this.redis.status === 'ready') {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          this.logger.log(
            `🚀 Cache hit for comparison: ${productNames.join(' vs ')}`,
          );
          return JSON.parse(cached);
        }
      } catch (e) {
        this.logger.error('Redis error during cache check', e);
        // Continue without cache on error
      }
    }

    const prompt = buildComparisonPrompt(productNames, preferences);
    const maxTokens =
      this.configService.get<number>('GEMINI_MAX_TOKENS') || 4000;
    const temperature =
      this.configService.get<number>('GEMINI_TEMPERATURE') || 0.4;

    let lastError: unknown;
    let result: ComparisonResult | undefined;

    // Try each model in the chain
    for (const modelName of this.modelChain) {
      try {
        result = await this.callModel(
          modelName,
          prompt,
          maxTokens,
          temperature,
        );
        break;
      } catch (error) {
        if (isQuotaError(error)) {
          this.logger.warn(
            `Model "${modelName}" hit quota limit — trying next model in chain...`,
          );
          lastError = error;
          // Small backoff before trying next model
          await sleep(500);
          continue;
        }
        // Non-quota error — log and rethrow immediately
        this.logger.error(`Model "${modelName}" failed with non-quota error`, {
          message: (error as Error)?.message,
        });
        throw new InternalServerErrorException(
          `AI comparison failed: ${(error as Error)?.message || 'Unknown error'}`,
        );
      }
    }

    if (!result) {
      // All models exhausted
      this.logger.error(
        'All Gemini models hit quota. Daily free-tier limit reached.',
      );
      const retryMsg = isQuotaError(lastError)
        ? 'You have exceeded the Gemini free-tier quota for today. Please wait until midnight (Pacific Time) for the quota to reset, or add billing at https://aistudio.google.com'
        : 'All AI models are currently unavailable. Please try again later.';

      throw new InternalServerErrorException(retryMsg);
    }

    // After successful AI call, store in Redis
    if (this.redis.status === 'ready') {
      try {
        const ttl = this.configService.get<number>('REDIS_TTL', 86400);
        await this.redis.set(cacheKey, JSON.stringify(result), 'EX', ttl);
        this.logger.log(`💾 Results cached with TTL ${ttl}s`);
      } catch (e) {
        this.logger.error('Redis error during cache storage', e);
      }
    }

    return result;
  }

  private generateCacheKey(productNames: string[], prefs?: any): string {
    const keyString = `${productNames
      .map((p) => p.toLowerCase())
      .sort()
      .join('_')}:${JSON.stringify(prefs || {})}`;
    const hash = crypto.createHash('sha256').update(keyString).digest('hex');
    return `compare:${hash}`;
  }

  // ── Private: call a single model and parse result ──────────────────────────

  private async callModel(
    modelName: string,
    prompt: string,
    maxTokens: number,
    temperature: number,
  ): Promise<ComparisonResult> {
    this.logger.log(`Calling Gemini model: ${modelName}`);

    const genModel = this.genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature,
        maxOutputTokens: maxTokens,
      },
      systemInstruction:
        'You are a precise product comparison expert. You MUST respond with valid, parseable JSON ONLY. Do not include any text before or after the JSON block. Do not use markdown formatting. Ensure all strings are properly escaped and there are no trailing commas.',
    });

    const response = await genModel.generateContent(prompt);
    const content = response.response.text();

    if (!content) {
      throw new InternalServerErrorException('AI returned empty response');
    }

    this.logger.debug(`Raw AI content length: ${content.length}`);

    // 1. Aggressive JSON extraction: find the outermost { } block
    let jsonString = '';
    const firstBrace = content.indexOf('{');
    const lastBrace = content.lastIndexOf('}');

    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonString = content.substring(firstBrace, lastBrace + 1);
    } else {
      // Fallback: strip common markdown fences
      jsonString = content
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
    }

    // 2. Multi-step Sanitize
    jsonString = this.sanitizeJson(jsonString);

    let result: ComparisonResult;
    try {
      result = JSON.parse(jsonString) as ComparisonResult;
    } catch (err: any) {
      // 3. Last resort: Try one more aggressive cleanup if simple parsing fails
      try {
        this.logger.warn('First JSON parse failed, trying aggressive repair...');
        const repairedJson = this.aggressiveJsonRepair(jsonString);
        result = JSON.parse(repairedJson) as ComparisonResult;
      } catch (repairErr: any) {
        this.logger.error(
          `AI JSON Parse Failed. Model: ${modelName}. Error: ${err.message}. Position: ${err.message.match(/position (\d+)/)?.[1] || 'unknown'}`,
        );
        this.logger.debug(`Failed JSON Content: ${jsonString}`);

        throw new InternalServerErrorException(
          'The AI returned a malformed response. Please try one more time.',
        );
      }
    }

    this.validateResult(result);
    this.logger.log(
      `✅ Comparison complete via ${modelName}. Winner: ${result.winner}`,
    );
    return result;
  }

  /**
   * Cleans common LLM JSON errors like trailing commas or unescaped newlines.
   */
  private sanitizeJson(json: string): string {
    return (
      json
        // Remove potential markdown fences that might have leaked
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        // Remove trailing commas before closing braces/brackets
        .replace(/,\s*([\]}])/g, '$1')
        .trim()
    );
  }

  /**
   * Handles more complex issues like unescaped quotes inside strings or literal newlines in strings.
   */
  private aggressiveJsonRepair(json: string): string {
    // 1. Remove literal newlines that occur INSIDE strings
    // This is a common AI error where it doesn't escape a newline.
    let repaired = json;
    
    // Attempt to fix unescaped newlines in values
    // Matches something like: "key": "value (newline) continued"
    repaired = repaired.replace(/: "([^"]*?)\n([^"]*?)"/g, ': "$1\\n$2"');

    // 2. Remove trailing commas (again)
    repaired = repaired.replace(/,\s*([\]}])/g, '$1');
    
    // 3. Fix double commas
    repaired = repaired.replace(/,,/g, ',');

    return repaired;
  }

  // ── Private: validate response structure ───────────────────────────────────

  private validateResult(result: ComparisonResult): void {
    if (!result.winner) {
      throw new InternalServerErrorException(
        'Invalid AI response: missing or invalid winner',
      );
    }
    if (!result.summary || typeof result.summary !== 'string') {
      throw new InternalServerErrorException(
        'Invalid AI response: missing summary',
      );
    }
    if (!Array.isArray(result.categories) || result.categories.length === 0) {
      throw new InternalServerErrorException(
        'Invalid AI response: missing categories',
      );
    }

    // Dynamically validate categories logic
    for (const cat of result.categories) {
      const scoreKeys = Object.keys(cat).filter((k) => k.endsWith('Score'));
      if (scoreKeys.length < 2) {
        throw new InternalServerErrorException(
          `Invalid AI response: missing scores in category "${cat.name}"`,
        );
      }
      for (const key of scoreKeys) {
        const score = cat[key];
        if (typeof score !== 'number' || score < 0 || score > 10) {
          throw new InternalServerErrorException(
            `Invalid AI response: invalid score for ${key} in category "${cat.name}"`,
          );
        }
      }
    }

    if (!result.products || Object.keys(result.products).length < 2) {
      throw new InternalServerErrorException(
        'Invalid AI response: missing products analysis',
      );
    }
    for (const key of Object.keys(result.products)) {
      if (!result.products[key].pros || !result.products[key].bestFor) {
        throw new InternalServerErrorException(
          `Invalid AI response: missing pros or bestFor for product ${key}`,
        );
      }
    }
    if (!result.recommendation) {
      throw new InternalServerErrorException(
        'Invalid AI response: missing recommendation',
      );
    }
  }
}
