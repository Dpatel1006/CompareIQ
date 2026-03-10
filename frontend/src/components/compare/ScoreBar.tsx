'use client';

import { cn } from '@/lib/utils';

interface ScoreBarProps {
  label: string;
  scoreA: number;
  scoreB: number;
  maxScore?: number;
}

export function ScoreBar({ label, scoreA, scoreB, maxScore = 10 }: ScoreBarProps) {
  const percentA = (scoreA / maxScore) * 100;
  const percentB = (scoreB / maxScore) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <div className="flex items-center gap-4 text-xs">
          <span className={cn('font-semibold', scoreA >= scoreB ? 'text-indigo-600' : 'text-gray-500')}>
            {scoreA.toFixed(1)}
          </span>
          <span className={cn('font-semibold', scoreB >= scoreA ? 'text-violet-600' : 'text-gray-500')}>
            {scoreB.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="flex gap-1 h-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-l-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-l-full transition-all duration-500',
              scoreA >= scoreB ? 'bg-indigo-600' : 'bg-indigo-400',
            )}
            style={{ width: `${percentA}%` }}
          />
        </div>
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-r-full overflow-hidden flex justify-end">
          <div
            className={cn(
              'h-full rounded-r-full transition-all duration-500',
              scoreB >= scoreA ? 'bg-violet-600' : 'bg-violet-400',
            )}
            style={{ width: `${percentB}%` }}
          />
        </div>
      </div>
    </div>
  );
}
