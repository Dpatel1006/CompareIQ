'use client';

import { ScoreBar } from './ScoreBar';

// Accepts both old AI shape and new AI shape
interface CategoryScore {
  // new AI shape
  name?: string;
  productAScore?: number;
  productBScore?: number;
  reasoning?: string;
  // old AI shape fallbacks
  category?: string;
  scoreA?: number;
  scoreB?: number;
  explanation?: string;
}

interface CategoryBreakdownProps {
  categories: CategoryScore[];
  productAName: string;
  productBName: string;
}

export function CategoryBreakdown({ categories, productAName, productBName }: CategoryBreakdownProps) {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Category Breakdown
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-600" />
            <span className="text-gray-500">{productAName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-violet-600" />
            <span className="text-gray-500">{productBName}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, i) => {
          // Normalise: accept both old and new AI field names
          const label = cat.name ?? cat.category ?? `Category ${i + 1}`;
          const sA = cat.productAScore ?? cat.scoreA ?? 0;
          const sB = cat.productBScore ?? cat.scoreB ?? 0;
          const explanation = cat.reasoning ?? cat.explanation ?? '';
          return (
            <div key={`${label}-${i}`} className="space-y-1">
              <ScoreBar label={label} scoreA={sA} scoreB={sB} />
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
