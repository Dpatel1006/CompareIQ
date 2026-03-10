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
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Analysis
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Compare Products
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">
          Enter two products to get a detailed, AI-powered comparison with scores,
          pros & cons, and a clear winner recommendation.
        </p>
      </div>

      <div className="rounded-2xl border bg-white dark:bg-gray-900 shadow-sm p-6 sm:p-8">
        <CompareForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Zap, title: "Fast Analysis", desc: "Results in ~10 seconds", color: "indigo" },
          { icon: BarChart3, title: "Detailed Scores", desc: "Multi-category scoring", color: "violet" },
          { icon: Shield, title: "Unbiased", desc: "AI-driven objectivity", color: "green" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent">
            <div className={`p-2 rounded-lg bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
              <item.icon className={`h-5 w-5 text-${item.color}-600 dark:text-${item.color}-400`} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-[11px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 text-center">
          Popular Comparisons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularComparisons.map((comp, i) => (
            <button
              key={i}
              className="flex items-center justify-between px-5 py-3.5 rounded-xl border bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm group"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">{comp.a}</span>
                <span className="text-xs text-gray-400 italic">vs</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{comp.b}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
