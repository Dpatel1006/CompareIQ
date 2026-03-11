'use client';

import { ScoreBar } from './ScoreBar';

interface CategoryScore {
  // new AI shape
  name?: string;
  reasoning?: string;
  // old AI shape fallbacks
  category?: string;
  scoreA?: number;
  scoreB?: number;
  explanation?: string;
  [key: string]: any;
}

interface CategoryBreakdownProps {
  categories: CategoryScore[];
  products: Record<string, { name: string }>;
}

const COLOR_MAP = [
  'bg-indigo-600',
  'bg-violet-600',
  'bg-purple-600',
  'bg-fuchsia-600',
];

export function CategoryBreakdown({ categories, products }: CategoryBreakdownProps) {
  const productIds = Object.keys(products || {});

  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Breakdown
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {productIds.map((id, index) => (
            <div key={id} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${COLOR_MAP[index % COLOR_MAP.length]}`} />
              <span className="text-gray-500">{products[id].name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, i) => {
          const label = cat.name ?? cat.category ?? `Category ${i + 1}`;
          const explanation = cat.reasoning ?? cat.explanation ?? '';

          const scores = productIds.map(id => ({
            id,
            name: products[id].name,
            score: Number(cat[`${id}Score`]) || 0
          }));

          return (
            <div key={`${label}-${i}`} className="space-y-1">
              <ScoreBar label={label} scores={scores} />
              {explanation && (
                <p className="text-xs text-gray-500 pl-1">{explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
