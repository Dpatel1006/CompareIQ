'use client';

import { useState } from 'react';
import { useHistory, useDeleteComparison } from '@/hooks/useHistory';
import { HistoryCard } from '@/components/history/HistoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useHistory(page, 10);
  const deleteComparison = useDeleteComparison();

  const comparisons = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / 10);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this comparison?')) {
      await deleteComparison.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comparison History
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {total} comparison{total !== 1 ? 's' : ''} total
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : comparisons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Clock className="h-12 w-12 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            No comparisons yet
          </h2>
          <p className="text-gray-500">
            Start comparing products to see your history here.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/compare">Start Comparing</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {comparisons.map((item: any) => (
              <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
