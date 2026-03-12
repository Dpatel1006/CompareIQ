// ============================================================
// CompareIQ — Smart Comparison Prompt Builder
// Detects product category and uses relevant comparison axes
// ============================================================

interface Preferences {
  budget?: string;
  priorities?: string[];
  useCase?: string;
}

// Category detection keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  skincare: [
    'sunscreen',
    'spf',
    'serum',
    'moisturizer',
    'cream',
    'lotion',
    'toner',
    'face wash',
    'cleanser',
    'mask',
    'sheet mask',
    'eye cream',
    'lip balm',
    'exfoliator',
    'scrub',
    'dot & key',
    'hyphen',
    'minimalist',
    'plum',
    'mamaearth',
    'wow',
    'cetaphil',
    'neutrogena',
    'cerave',
    'the ordinary',
    'simple',
    'lacto calamine',
  ],
  haircare: [
    'shampoo',
    'conditioner',
    'hair oil',
    'hair serum',
    'hair mask',
    'hair color',
    'hair dye',
    'hair spray',
    'hair gel',
    'head & shoulders',
    'dove',
    'tresemme',
    'pantene',
    'indulekha',
    'biotique',
    'khadi',
    'pilgrim',
  ],
  electronics: [
    'phone',
    'iphone',
    'samsung',
    'oneplus',
    'pixel',
    'realme',
    'redmi',
    'xiaomi',
    'oppo',
    'vivo',
    'motorola',
    'nokia',
    'laptop',
    'macbook',
    'dell',
    'hp',
    'lenovo',
    'asus',
    'acer',
    'tablet',
    'ipad',
    'headphone',
    'earphone',
    'airpods',
    'earbuds',
    'speaker',
    'bluetooth',
    'smartwatch',
    'watch',
    'camera',
    'tv',
    'television',
    'monitor',
    'keyboard',
    'mouse',
    'processor',
    'gpu',
    'cpu',
    'ssd',
    'hard disk',
    'router',
    'gaming',
    'console',
    'ps5',
    'xbox',
  ],
  clothing: [
    'shirt',
    'tshirt',
    't-shirt',
    'jeans',
    'pants',
    'trouser',
    'jacket',
    'coat',
    'hoodie',
    'dress',
    'saree',
    'kurta',
    'suit',
    'blazer',
    'shorts',
    'skirt',
    'leggings',
    'sneakers',
    'shoes',
    'sandals',
    'boots',
    'nike',
    'adidas',
    'puma',
    'reebok',
    'zara',
    'h&m',
    'uniqlo',
    'allen solly',
    'peter england',
    'van heusen',
    'arrow',
  ],
  food: [
    'protein powder',
    'whey',
    'supplement',
    'vitamin',
    'probiotic',
    'energy bar',
    'granola',
    'chocolate',
    'coffee',
    'tea',
    'juice',
    'oats',
    'muesli',
    'peanut butter',
    'biscuit',
    'snack',
    'ragi',
    'sattu',
    'amul',
    'britannia',
    'parle',
    'nestle',
  ],
  appliances: [
    'refrigerator',
    'fridge',
    'washing machine',
    'dishwasher',
    'microwave',
    'oven',
    'blender',
    'mixer',
    'juicer',
    'toaster',
    'iron',
    'air conditioner',
    'ac',
    'cooler',
    'fan',
    'heater',
    'vacuum cleaner',
    'purifier',
    'air purifier',
    'water purifier',
    'ro',
    'whirlpool',
    'lg',
    'samsung appliance',
    'godrej',
    'bosch',
    'ifb',
    'philips',
    'havells',
    'bajaj',
  ],
  vehicles: [
    'car',
    'bike',
    'scooter',
    'motorcycle',
    'suv',
    'sedan',
    'hatchback',
    'ev',
    'electric vehicle',
    'maruti',
    'hyundai',
    'tata',
    'honda',
    'toyota',
    'kia',
    'bajaj',
    'tvs',
    'hero',
    'royal enfield',
    'yamaha',
    'suzuki',
  ],
  books: [
    'book',
    'novel',
    'textbook',
    'kindle',
    'ereader',
    'fiction',
    'non-fiction',
    'autobiography',
    'self-help',
    'academic',
    'course',
  ],
};

// Comparison categories per product type
const CATEGORY_AXES: Record<string, string[]> = {
  skincare: [
    'Effectiveness & Results',
    'Ingredients Quality',
    'SPF / UV Protection',
    'Texture & Skin Feel',
    'Value for Money',
    'Packaging & Ease of Use',
  ],
  haircare: [
    'Effectiveness & Results',
    'Ingredients Quality',
    'Fragrance & Sensory Experience',
    'Scalp & Hair Health',
    'Value for Money',
    'Lather & Texture',
  ],
  electronics: [
    'Performance',
    'Build Quality & Design',
    'Battery Life',
    'Display',
    'Camera Quality',
    'Value for Money',
  ],
  clothing: [
    'Fabric Quality & Comfort',
    'Fit & Sizing Accuracy',
    'Durability',
    'Style & Design',
    'Value for Money',
    'Ease of Care',
  ],
  food: [
    'Nutritional Value',
    'Taste & Flavor',
    'Ingredient Quality',
    'Value for Money',
    'Availability',
    'Packaging',
  ],
  appliances: [
    'Performance & Efficiency',
    'Energy Consumption',
    'Build Quality & Durability',
    'Features & Technology',
    'Value for Money',
    'After-Sales Service',
  ],
  vehicles: [
    'Performance & Power',
    'Fuel Efficiency / Range',
    'Safety Features',
    'Comfort & Interior',
    'Value for Money',
    'Service & Maintenance Cost',
  ],
  books: [
    'Content Quality & Depth',
    'Writing Style & Clarity',
    'Relevance & Usefulness',
    'Value for Money',
    'Readability',
    'Author Credibility',
  ],
  general: [
    'Performance',
    'Value for Money',
    'Design & Build Quality',
    'Features',
    'Durability & Reliability',
    'User Experience',
  ],
};

/**
 * Detect the product category from a product name.
 * Returns a category key or 'general' as fallback.
 */
export function detectProductCategory(productName: string): string {
  const lower = productName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category;
    }
  }
  return 'general';
}

/**
 * Build a tailored comparison prompt for 2 to 4 products.
 */
export function buildComparisonPrompt(
  productNames: string[],
  preferences?: Preferences,
): string {
  // Detect category using all product names
  const categories = productNames.map(detectProductCategory);
  // Use the most specific category
  const category = categories.find((c) => c !== 'general') || 'general';
  const axes = CATEGORY_AXES[category];

  let preferencesSection = '';
  if (preferences) {
    const parts: string[] = [];
    if (preferences.budget) parts.push(`Budget: ${preferences.budget}`);
    if (preferences.priorities?.length) {
      parts.push(`User priorities: ${preferences.priorities.join(', ')}`);
    }
    if (preferences.useCase) parts.push(`Use case: ${preferences.useCase}`);
    if (parts.length > 0) {
      preferencesSection = `\n\nUser Preferences (factor these heavily into scores and recommendation):\n${parts.join('\n')}`;
    }
  }

  const axesList = axes.map((a, i) => `${i + 1}. ${a}`).join('\n');
  const productsList = productNames
    .map((name, i) => `Product ${String.fromCharCode(65 + i)}: ${name}`)
    .join('\n');

  const idList = productNames.map(
    (_, i) => `product${String.fromCharCode(65 + i)}`,
  );

  return `You are an expert product comparison analyst specializing in ${category} products.

Compare the following ${productNames.length} products in detail:

${productsList}${preferencesSection}

Analyze all products across these specific categories for ${category}:
${axesList}

For each category, score each product from 0-10 and provide clear reasoning.

Return a comparison with:
- A clear winner
- A 2-3 sentence summary verdict
- Pros and cons for each product (minimum 3 each)
- Key specifications and attributes relevant to ${category}
- Who each product is best suited for
- A detailed recommendation paragraph

You MUST respond with valid JSON matching this exact structure:
{
  "winner": "${idList.join(' | ')} | tie",
  "winnerName": "string (name of winner)",
  "summary": "string",
  "categories": [
    {
      "name": "string",
      ${idList.map((id) => `"${id}Score": number`).join(',\n      ')},
      "winner": "${idList.join(' | ')} | tie",
      "reasoning": "string"
    }
  ],
  "products": {
    ${idList
      .map(
        (id) => `"${id}": {
      "name": "string",
      "price": number | null,
      "pros": ["string"],
      "cons": ["string"],
      "rating": number | null,
      "keySpecs": { "key": "value" },
      "bestFor": "string"
    }`,
      )
      .join(',\n    ')}
  },
  "recommendation": "string"
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences, no extra text before or after.`;
}
