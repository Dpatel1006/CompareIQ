'use client';

import { useParams } from 'next/navigation';
import { useComparison } from '@/hooks/useComparison';
import { ComparisonResult } from '@/components/compare/ComparisonResult';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ComparisonResultPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: comparison, isLoading, error } = useComparison(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-40" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-10 w-48 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comparison not found
        </h2>
        <p className="text-gray-500">
          The comparison you&apos;re looking for doesn&apos;t exist or has been deleted.
        </p>
        <Button asChild>
          <Link href="/compare">Start Comparing</Link>
        </Button>
      </div>
    );
  }

  return <ComparisonResult comparison={comparison} />;
}
