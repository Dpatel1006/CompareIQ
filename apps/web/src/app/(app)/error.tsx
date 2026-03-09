'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>

      <div className="text-center space-y-2 max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          There was an error loading this page. Please try again.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={reset} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <RotateCcw className="h-4 w-4" />
          Try Again
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
