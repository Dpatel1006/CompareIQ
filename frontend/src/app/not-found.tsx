import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
          <SearchX className="h-10 w-10 text-indigo-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Page not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button asChild className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/compare">
              <ArrowLeft className="h-4 w-4" />
              Compare
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
