'use client';

import { cn } from '@/lib/utils';

interface ScoreBarProps {
  label: string;
  scores: { id: string; name: string; score: number }[];
  maxScore?: number;
}

const COLOR_MAP = [
  { bg: 'bg-indigo-600', text: 'text-indigo-600' },
  { bg: 'bg-violet-600', text: 'text-violet-600' },
  { bg: 'bg-purple-600', text: 'text-purple-600' },
  { bg: 'bg-fuchsia-600', text: 'text-fuchsia-600' },
];

export function ScoreBar({ label, scores, maxScore = 10 }: ScoreBarProps) {
  const maxActualScore = Math.max(...scores.map((s) => s.score));

  return (
    <div className="space-y-2 mb-4">
      <div className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-1">{label}</div>
      {scores.map((item, index) => {
        const percent = (item.score / maxScore) * 100;
        const isWinner = item.score === maxActualScore;
        const color = COLOR_MAP[index % COLOR_MAP.length];

        return (
          <div key={item.id} className="flex items-center gap-3 text-xs w-full">
            <span className={cn('w-1/4 truncate', isWinner ? color.text + ' font-bold' : 'text-gray-500 font-medium')}>
              {item.name}
            </span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-500', color.bg)}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className={cn('w-8 text-right font-semibold', isWinner ? color.text : 'text-gray-600')}>
              {item.score.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
