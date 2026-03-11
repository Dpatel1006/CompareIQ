'use client';

import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface ProductCardProps {
  name: string;
  brand?: string;
  score: number;
  pros: string[];
  cons: string[];
  isWinner: boolean;
  accentColor: 'indigo' | 'violet' | 'purple' | 'fuchsia';
}

export function ProductCard({
  name,
  brand,
  score,
  pros,
  cons,
  isWinner,
  accentColor,
}: ProductCardProps) {
  const colors = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-600',
      ring: 'ring-indigo-500',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      border: 'border-violet-200 dark:border-violet-800',
      text: 'text-violet-600 dark:text-violet-400',
      badge: 'bg-violet-600',
      ring: 'ring-violet-500',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-600',
      ring: 'ring-purple-500',
    },
    fuchsia: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/30',
      border: 'border-fuchsia-200 dark:border-fuchsia-800',
      text: 'text-fuchsia-600 dark:text-fuchsia-400',
      badge: 'bg-fuchsia-600',
      ring: 'ring-fuchsia-500',
    },
  };

  const c = colors[accentColor];

  return (
    <div
      className={cn(
        'rounded-xl border p-6 space-y-4 transition-all',
        isWinner ? `${c.bg} ${c.border} ring-2 ring-offset-2 ${c.ring}` : 'bg-white dark:bg-gray-900',
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
          {brand && <p className="text-sm text-gray-500">{brand}</p>}
        </div>
        <div className="flex flex-col items-center">
          <div className={cn('text-2xl font-bold', c.text)}>
            {typeof score === 'number' && isFinite(score) ? score.toFixed(1) : '—'}
          </div>
          <div className="text-xs text-gray-500">/10</div>
        </div>
      </div>

      {isWinner && (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
          <Star className="h-3 w-3 fill-current" />
          Winner
        </div>
      )}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
            <ThumbsUp className="h-3.5 w-3.5" />
            Pros
          </div>
          <ul className="space-y-1">
            {pros.map((pro, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-green-500 mt-1 shrink-0">+</span>
                {pro}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400">
            <ThumbsDown className="h-3.5 w-3.5" />
            Cons
          </div>
          <ul className="space-y-1">
            {cons.map((con, i) => (
              <li key={i} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-red-500 mt-1 shrink-0">−</span>
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
