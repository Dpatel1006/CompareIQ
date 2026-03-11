'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { Trophy, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  id: string;
  products: { id: string; name: string }[];
  winner: string;
  createdAt: string;
}

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
}

export function HistoryCard({ item, onDelete }: HistoryCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-white dark:bg-gray-900 hover:shadow-sm transition-shadow group">
      <Link
        href={`/compare/${item.id}`}
        className="flex-1 min-w-0 flex items-center gap-4"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2 text-sm">
            {item.products?.map((p, i) => (
              <span key={p.id || i} className="font-medium text-gray-900 dark:text-white truncate flex items-center">
                {p.name}
                {i < item.products.length - 1 && <span className="text-gray-400 mx-2 font-normal shrink-0">vs</span>}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs gap-1">
              <Trophy className="h-3 w-3 text-yellow-500" />
              {item.winner}
            </Badge>
            <span className="text-xs text-gray-400">
              {formatRelativeTime(item.createdAt)}
            </span>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0" />
      </Link>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.preventDefault();
          onDelete(item.id);
        }}
        className="ml-2 text-gray-400 hover:text-red-600 shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
