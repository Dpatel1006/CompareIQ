import { Suspense } from 'react';
import { CompareForm } from '@/components/compare/CompareForm';
import { Sparkles, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';

export const metadata = {
  title: 'Compare Products | CompareIQ',
  description: 'Compare any two products with AI-powered analysis.',
};

const popularComparisons = [
  { a: 'iPhone 15 Pro', b: 'Samsung Galaxy S24 Ultra' },
  { a: 'MacBook Air M3', b: 'Dell XPS 13' },
  { a: 'PlayStation 5', b: 'Xbox Series X' },
  { a: 'AirPods Pro 2', b: 'Sony WF-1000XM5' },
];

export default function ComparePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">
          <Sparkles className="h-4 w-4" />
          AI-Powered Analysis
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Compare Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Enter two products to get a detailed, AI-powered comparison with scores,
          pros & cons, and a clear winner recommendation.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-sm p-6">
          <CompareForm />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
            <Zap className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Fast Analysis</p>
            <p className="text-xs text-gray-500">Results in ~10 seconds</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
            <BarChart3 className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Detailed Scores</p>
            <p className="text-xs text-gray-500">Multi-category scoring</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Unbiased</p>
            <p className="text-xs text-gray-500">AI-driven objectivity</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">
          Popular Comparisons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularComparisons.map((comp, i) => (
            <button
              key={i}
              className="flex items-center justify-between px-4 py-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm group"
            >
              <span className="text-gray-700 dark:text-gray-300">{comp.a}</span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 mx-2 shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{comp.b}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
