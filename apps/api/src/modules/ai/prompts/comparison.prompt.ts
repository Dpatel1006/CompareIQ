export function buildComparisonPrompt(
  productAName: string,
  productBName: string,
  preferences?: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  },
): string {
  let preferencesSection = '';

  if (preferences) {
    const parts: string[] = [];
    if (preferences.budget) {
      parts.push(`Budget: ${preferences.budget}`);
    }
    if (preferences.priorities?.length) {
      parts.push(`Priorities: ${preferences.priorities.join(', ')}`);
    }
    if (preferences.useCase) {
      parts.push(`Use case: ${preferences.useCase}`);
    }
    if (parts.length > 0) {
      preferencesSection = `\n\nUser Preferences:\n${parts.join('\n')}`;
    }
  }

  return `You are an expert product comparison analyst. Compare the following two products in detail.

Product A: ${productAName}
Product B: ${productBName}${preferencesSection}

Analyze both products across these categories:
1. Performance
2. Value for Money
3. Design & Build Quality
4. Features
5. Durability & Reliability
6. User Experience

For each category, score each product from 0-10 and explain your reasoning.

Provide:
- A clear winner (or tie)
- A 2-3 sentence summary verdict
- Pros and cons for each product
- Key specifications for each product
- Who each product is best for
- A full recommendation paragraph

You MUST respond with valid JSON matching this exact schema:
{
  "winner": "productA" | "productB" | "tie",
  "winnerName": "string (the actual product name of the winner)",
  "summary": "string (2-3 sentence plain English verdict)",
  "categories": [
    {
      "name": "string (category name)",
      "productAScore": number (0-10),
      "productBScore": number (0-10),
      "winner": "productA" | "productB" | "tie",
      "reasoning": "string (1-2 sentence explanation)"
    }
  ],
  "productA": {
    "name": "string",
    "price": number | null,
    "pros": ["string"],
    "cons": ["string"],
    "rating": number | null (out of 5),
    "keySpecs": { "key": "value" }
  },
  "productB": {
    "name": "string",
    "price": number | null,
    "pros": ["string"],
    "cons": ["string"],
    "rating": number | null (out of 5),
    "keySpecs": { "key": "value" }
  },
  "bestFor": {
    "productA": "string (Best for users who...)",
    "productB": "string (Best for users who...)"
  },
  "recommendation": "string (1 paragraph full recommendation)"
}

IMPORTANT: Return ONLY valid JSON. No markdown, no code fences, no extra text.`;
}
