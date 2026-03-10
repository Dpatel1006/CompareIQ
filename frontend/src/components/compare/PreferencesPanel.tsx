'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Sparkles, SlidersHorizontal } from 'lucide-react';

interface PreferencesPanelProps {
  productAName: string;
  productBName: string;
  preferences: {
    budget?: string;
    priorities?: string[];
    useCase?: string;
  };
  onChange: (preferences: { budget?: string; priorities?: string[]; useCase?: string }) => void;
}

// ---- Category detection (mirrors backend logic) ----

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  skincare: [
    'sunscreen', 'spf', 'serum', 'moisturizer', 'cream', 'lotion', 'toner', 'face wash',
    'cleanser', 'mask', 'sheet mask', 'eye cream', 'lip balm', 'exfoliator', 'scrub',
    'dot & key', 'hyphen', 'minimalist', 'plum', 'mamaearth', 'wow', 'cetaphil', 'neutrogena',
    'cerave', 'the ordinary', 'simple', 'lacto calamine',
  ],
  haircare: [
    'shampoo', 'conditioner', 'hair oil', 'hair serum', 'hair mask', 'head & shoulders',
    'dove', 'tresemme', 'pantene', 'indulekha', 'biotique', 'khadi', 'pilgrim',
  ],
  electronics: [
    'phone', 'iphone', 'samsung', 'oneplus', 'pixel', 'realme', 'redmi', 'xiaomi', 'oppo',
    'vivo', 'motorola', 'laptop', 'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer',
    'tablet', 'ipad', 'headphone', 'earphone', 'airpods', 'earbuds', 'speaker',
    'smartwatch', 'camera', 'tv', 'monitor', 'gaming', 'console', 'ps5', 'xbox',
  ],
  clothing: [
    'shirt', 'tshirt', 't-shirt', 'jeans', 'pants', 'jacket', 'hoodie', 'dress', 'saree',
    'kurta', 'suit', 'blazer', 'shorts', 'skirt', 'leggings', 'sneakers', 'shoes', 'sandals',
    'boots', 'nike', 'adidas', 'puma', 'reebok', 'zara', 'h&m',
  ],
  food: [
    'protein powder', 'whey', 'supplement', 'vitamin', 'probiotic', 'energy bar', 'granola',
    'chocolate', 'coffee', 'tea', 'oats', 'muesli', 'peanut butter', 'snack', 'amul', 'britannia',
  ],
  appliances: [
    'refrigerator', 'fridge', 'washing machine', 'microwave', 'oven', 'blender', 'mixer',
    'iron', 'air conditioner', 'ac', 'fan', 'heater', 'vacuum', 'purifier', 'whirlpool',
    'lg', 'godrej', 'bosch', 'ifb', 'philips', 'havells', 'bajaj',
  ],
  vehicles: [
    'car', 'bike', 'scooter', 'motorcycle', 'suv', 'sedan', 'ev', 'maruti', 'hyundai',
    'tata', 'honda', 'toyota', 'kia', 'royal enfield', 'yamaha',
  ],
};

// Priorities per category
const CATEGORY_PRIORITIES: Record<string, { value: string; label: string; emoji: string }[]> = {
  skincare: [
    { value: 'SPF & UV Protection', label: 'SPF & UV Protection', emoji: '☀️' },
    { value: 'Ingredients Quality', label: 'Ingredients Quality', emoji: '🧪' },
    { value: 'Hydration & Moisturizing', label: 'Hydration', emoji: '💧' },
    { value: 'Non-Greasy Feel', label: 'Non-Greasy Feel', emoji: '✨' },
    { value: 'Skin Sensitivity (Fragrance-Free)', label: 'Fragrance-Free', emoji: '🌿' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Packaging & Pump', label: 'Packaging', emoji: '📦' },
    { value: 'White Cast', label: 'No White Cast', emoji: '🎨' },
  ],
  haircare: [
    { value: 'Hair Fall Control', label: 'Hair Fall Control', emoji: '💆' },
    { value: 'Scalp Health', label: 'Scalp Health', emoji: '🌱' },
    { value: 'Dandruff Control', label: 'Dandruff Control', emoji: '❄️' },
    { value: 'Shine & Smoothness', label: 'Shine & Smoothness', emoji: '✨' },
    { value: 'Fragrance', label: 'Fragrance', emoji: '🌸' },
    { value: 'Sulphate & Paraben Free', label: 'Sulphate-Free', emoji: '🌿' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
  ],
  electronics: [
    { value: 'Performance', label: 'Performance', emoji: '⚡' },
    { value: 'Battery Life', label: 'Battery Life', emoji: '🔋' },
    { value: 'Camera Quality', label: 'Camera Quality', emoji: '📸' },
    { value: 'Display Quality', label: 'Display Quality', emoji: '🖥️' },
    { value: 'Build Quality', label: 'Build Quality', emoji: '🏗️' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Software & Updates', label: 'Software', emoji: '💻' },
    { value: 'Gaming', label: 'Gaming', emoji: '🎮' },
  ],
  clothing: [
    { value: 'Fabric Quality & Comfort', label: 'Fabric Quality', emoji: '🧵' },
    { value: 'Fit & Sizing', label: 'Fit & Sizing', emoji: '📏' },
    { value: 'Durability', label: 'Durability', emoji: '💪' },
    { value: 'Style & Design', label: 'Style & Design', emoji: '🎨' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Ease of Washing', label: 'Easy Care', emoji: '🫧' },
  ],
  food: [
    { value: 'Nutritional Value', label: 'Nutritional Value', emoji: '💊' },
    { value: 'Taste & Flavor', label: 'Taste', emoji: '😋' },
    { value: 'Ingredient Quality', label: 'Ingredient Quality', emoji: '🌾' },
    { value: 'Low Sugar / Low Calorie', label: 'Low Sugar', emoji: '🩺' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Availability', label: 'Availability', emoji: '🛒' },
  ],
  appliances: [
    { value: 'Performance', label: 'Performance', emoji: '⚡' },
    { value: 'Energy Efficiency', label: 'Energy Efficiency', emoji: '🌿' },
    { value: 'Durability', label: 'Durability', emoji: '💪' },
    { value: 'Features & Technology', label: 'Features', emoji: '🔧' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'After-Sales Service', label: 'Service', emoji: '🛠️' },
  ],
  vehicles: [
    { value: 'Performance', label: 'Performance', emoji: '🏎️' },
    { value: 'Fuel Efficiency', label: 'Fuel Efficiency', emoji: '⛽' },
    { value: 'Safety Features', label: 'Safety', emoji: '🛡️' },
    { value: 'Comfort & Interior', label: 'Comfort', emoji: '🛋️' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Maintenance Cost', label: 'Maintenance Cost', emoji: '🔧' },
  ],
  general: [
    { value: 'Performance', label: 'Performance', emoji: '⚡' },
    { value: 'Value for Money', label: 'Value for Money', emoji: '💰' },
    { value: 'Design & Build Quality', label: 'Design', emoji: '🎨' },
    { value: 'Features', label: 'Features', emoji: '🔧' },
    { value: 'Durability', label: 'Durability', emoji: '💪' },
    { value: 'Ease of Use', label: 'Ease of Use', emoji: '✨' },
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  skincare: 'Skincare',
  haircare: 'Haircare',
  electronics: 'Electronics',
  clothing: 'Clothing',
  food: 'Food & Nutrition',
  appliances: 'Home Appliances',
  vehicles: 'Vehicles',
  general: 'General',
};

function detectCategory(name: string): string {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return cat;
  }
  return 'general';
}

export function PreferencesPanel({
  productAName,
  productBName,
  preferences,
  onChange,
}: PreferencesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedCategory, setDetectedCategory] = useState('general');

  const bothFilled = productAName.trim().length > 1 && productBName.trim().length > 1;

  // Detect category whenever product names change
  useEffect(() => {
    const catA = detectCategory(productAName);
    const catB = detectCategory(productBName);
    const cat = catA !== 'general' ? catA : catB !== 'general' ? catB : 'general';
    if (cat !== detectedCategory) {
      setDetectedCategory(cat);
      // Clear priorities when category changes
      onChange({ ...preferences, priorities: [] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productAName, productBName]);

  const priorityOptions = CATEGORY_PRIORITIES[detectedCategory] || CATEGORY_PRIORITIES.general;

  const togglePriority = (value: string) => {
    const current = preferences.priorities || [];
    const updated = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    onChange({ ...preferences, priorities: updated });
  };

  // Auto-open when both products are filled
  useEffect(() => {
    if (bothFilled && !isOpen) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bothFilled]);

  if (!bothFilled) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-4 text-center text-sm text-gray-400 dark:text-gray-500">
        <SlidersHorizontal className="h-5 w-5 mx-auto mb-2 opacity-50" />
        Fill in both products above to unlock smart preferences
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-900 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          Preferences
          <Badge variant="secondary" className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800">
            {CATEGORY_LABELS[detectedCategory]}
          </Badge>
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-5 space-y-5 border-t border-gray-100 dark:border-gray-800 pt-4">

          {/* Smart Priority Checkboxes */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">What matters most to you?</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {priorityOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 text-sm cursor-pointer px-3 py-2 rounded-lg border transition-all
                    ${(preferences.priorities || []).includes(opt.value)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                >
                  <Checkbox
                    checked={(preferences.priorities || []).includes(opt.value)}
                    onCheckedChange={() => togglePriority(opt.value)}
                    className="hidden"
                  />
                  <span>{opt.emoji}</span>
                  <span className="text-xs font-medium">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <Label htmlFor="budget" className="text-sm font-medium">Budget</Label>
            <Input
              id="budget"
              placeholder="e.g., under ₹500 or under $20"
              value={preferences.budget || ''}
              onChange={(e) => onChange({ ...preferences, budget: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Use Case */}
          <div className="space-y-1.5">
            <Label htmlFor="useCase" className="text-sm font-medium">Use Case</Label>
            <Textarea
              id="useCase"
              placeholder="e.g., daily outdoor use for oily skin, or for someone who sweats a lot"
              value={preferences.useCase || ''}
              onChange={(e) => onChange({ ...preferences, useCase: e.target.value })}
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
