import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildComparisonPrompt } from './prompts/comparison.prompt';

interface ComparisonResult {
  winner: 'productA' | 'productB' | 'tie';
  winnerName: string;
  summary: string;
  categories: Array<{
    name: string;
    productAScore: number;
    productBScore: number;
    winner: 'productA' | 'productB' | 'tie';
    reasoning: string;
  }>;
  productA: {
    name: string;
    price: number | null;
    pros: string[];
    cons: string[];
    rating: number | null;
    keySpecs: Record<string, string>;
  };
  productB: {
    name: string;
    price: number | null;
    pros: string[];
    cons: string[];
    rating: number | null;
    keySpecs: Record<string, string>;
  };
  bestFor: {
    productA: string;
    productB: string;
  };
  recommendation: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<string>('GEMINI_API_KEY')!,
    );
  }

  async compareProducts(
    productAName: string,
    productBName: string,
    preferences?: {
      budget?: string;
      priorities?: string[];
      useCase?: string;
    },
  ): Promise<ComparisonResult> {
    const prompt = buildComparisonPrompt(productAName, productBName, preferences);

    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 4000,
        },
        systemInstruction:
          'You are a product comparison expert. Always respond with valid JSON only. No markdown formatting.',
      });

      const response = await model.generateContent(prompt);
      const content = response.response.text();

      if (!content) {
        throw new InternalServerErrorException('AI returned empty response');
      }

      // Strip markdown code fences if present
      const cleaned = content.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const result = JSON.parse(cleaned) as ComparisonResult;

      // Validate the response structure
      this.validateResult(result);

      return result;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      this.logger.error('AI comparison failed', error);
      throw new InternalServerErrorException(
        'Failed to generate comparison. Please try again.',
      );
    }
  }

  private validateResult(result: ComparisonResult): void {
    if (!result.winner || !['productA', 'productB', 'tie'].includes(result.winner)) {
      throw new InternalServerErrorException('Invalid AI response: missing or invalid winner');
    }

    if (!result.summary || typeof result.summary !== 'string') {
      throw new InternalServerErrorException('Invalid AI response: missing summary');
    }

    if (!Array.isArray(result.categories) || result.categories.length === 0) {
      throw new InternalServerErrorException('Invalid AI response: missing categories');
    }

    for (const cat of result.categories) {
      if (
        typeof cat.productAScore !== 'number' ||
        typeof cat.productBScore !== 'number' ||
        cat.productAScore < 0 ||
        cat.productAScore > 10 ||
        cat.productBScore < 0 ||
        cat.productBScore > 10
      ) {
        throw new InternalServerErrorException(
          `Invalid AI response: invalid scores in category ${cat.name}`,
        );
      }
    }

    if (!result.productA?.pros || !result.productB?.pros) {
      throw new InternalServerErrorException('Invalid AI response: missing product analysis');
    }

    if (!result.bestFor?.productA || !result.bestFor?.productB) {
      throw new InternalServerErrorException('Invalid AI response: missing bestFor');
    }

    if (!result.recommendation) {
      throw new InternalServerErrorException('Invalid AI response: missing recommendation');
    }
  }
}
