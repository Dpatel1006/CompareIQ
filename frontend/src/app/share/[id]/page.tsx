'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ComparisonResult } from '@/components/compare/ComparisonResult';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Share2 } from 'lucide-react';
import api from '@/lib/api';

export default function SharePage() {
  const params = useParams();
  const token = params.id as string;
  const [comparison, setComparison] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const { data } = await api.get(`/comparisons/share/${token}`);
        setComparison(data);
      } catch {
        setError('This shared comparison was not found or is no longer available.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparison();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 mb-6">
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">Shared Comparison</span>
          </div>
          <Skeleton className="h-10 w-48 rounded-full mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 space-y-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Comparison Not Found
        </h2>
        <p className="text-gray-500 text-center max-w-md">
          {error || 'This shared comparison does not exist.'}
        </p>
        <a
          href="/"
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          ← Go to CompareIQ
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-indigo-600 mb-6">
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium">Shared Comparison • CompareIQ</span>
        </div>
        <ComparisonResult comparison={comparison} showShare={false} />
      </div>
    </div>
  );
}
