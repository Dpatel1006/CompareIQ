'use client';

import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WinnerBadgeProps {
  winner: string;
  className?: string;
}

export function WinnerBadge({ winner, className }: WinnerBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold shadow-lg',
        className,
      )}
    >
      <Trophy className="h-5 w-5" />
      <span>{winner} Wins!</span>
    </div>
  );
}
