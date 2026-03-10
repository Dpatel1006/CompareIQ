'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime } from '@/lib/utils';
import { ArrowRight, Trophy } from 'lucide-react';

interface ComparisonItem {
  id: string;
  productAName: string;
  productBName: string;
  winner: string;
  createdAt: string;
}

interface RecentComparisonsProps {
  comparisons: ComparisonItem[];
}

export function RecentComparisons({ comparisons }: RecentComparisonsProps) {
  if (comparisons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Comparisons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-2">
            <p className="text-gray-500 dark:text-gray-400">No comparisons yet</p>
            <Link
              href="/compare"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Start your first comparison →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Comparisons</CardTitle>
        <Link
          href="/history"
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {comparisons.map((comp) => (
            <Link
              key={comp.id}
              href={`/compare/${comp.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {comp.productAName} vs {comp.productBName}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Trophy className="h-3 w-3 text-yellow-500" />
                      {comp.winner}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(comp.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
