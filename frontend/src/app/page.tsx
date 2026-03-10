import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  BarChart3,
  Zap,
  Search,
  Trophy,
  Laptop,
  Smartphone,
  Tv,
  ShoppingBag,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 mb-6">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              Powered by AI
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto">
              Compare Any Two Products{' '}
              <span className="text-indigo-600">Instantly</span> with AI
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter two products. Our AI analyzes specs, reviews, and performance
              to give you a clear winner with detailed reasoning. Make smarter
              purchasing decisions in seconds.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition-colors"
              >
                Start Comparing Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-8 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 mx-auto max-w-4xl rounded-xl border bg-white dark:bg-gray-900 shadow-2xl p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-center">
                <Smartphone className="h-8 w-8 mx-auto text-indigo-600 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">iPhone 15 Pro</p>
                <p className="text-sm text-gray-500">$999</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg shrink-0">
                VS
              </div>
              <div className="flex-1 w-full rounded-lg bg-gray-50 dark:bg-gray-800 p-4 text-center">
                <Smartphone className="h-8 w-8 mx-auto text-violet-600 mb-2" />
                <p className="font-semibold text-gray-900 dark:text-white">Galaxy S24 Ultra</p>
                <p className="text-sm text-gray-500">$1,199</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                  Winner: iPhone 15 Pro
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                The iPhone 15 Pro offers better performance with the A17 Pro chip,
                superior video capabilities, and a more polished ecosystem experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Three simple steps to smarter decisions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Enter Products',
                description: 'Type in any two products you want to compare. Our search helps you find exactly what you need.',
                step: '1',
              },
              {
                icon: Zap,
                title: 'AI Analyzes',
                description: 'Our AI engine analyzes specs, reviews, pricing, and real-world performance data in seconds.',
                step: '2',
              },
              {
                icon: Trophy,
                title: 'Get Results',
                description: 'Receive a detailed breakdown with scores, pros & cons, and a clear recommendation.',
                step: '3',
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center p-8 rounded-xl border bg-gray-50 dark:bg-gray-900 hover:shadow-lg transition-shadow">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <item.icon className="h-10 w-10 mx-auto text-indigo-600 mb-4 mt-2" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Compare Anything
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              From electronics to home appliances, we cover it all
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Laptop, label: 'Electronics' },
              { icon: Smartphone, label: 'Smartphones' },
              { icon: Tv, label: 'Home Appliances' },
              { icon: ShoppingBag, label: 'Sports & Gear' },
            ].map((cat) => (
              <div
                key={cat.label}
                className="flex flex-col items-center p-6 rounded-xl border bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all cursor-pointer"
              >
                <cat.icon className="h-10 w-10 text-indigo-600 mb-3" />
                <span className="font-medium text-gray-900 dark:text-white">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Comparison */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              See What You Get
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Rich, detailed comparisons at a glance
            </p>
          </div>
          <div className="max-w-3xl mx-auto rounded-xl border bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
            {[
              { category: 'Performance', scoreA: 9, scoreB: 8 },
              { category: 'Value for Money', scoreA: 7, scoreB: 8 },
              { category: 'Design', scoreA: 9, scoreB: 9 },
              { category: 'Battery Life', scoreA: 8, scoreB: 9 },
            ].map((item) => (
              <div key={item.category} className="px-6 py-4 border-b last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.category}
                  </span>
                  <div className="flex gap-4 text-xs">
                    <span className="text-indigo-600 font-semibold">{item.scoreA}/10</span>
                    <span className="text-violet-600 font-semibold">{item.scoreB}/10</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${item.scoreA * 10}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                      className="bg-violet-600 h-2.5 rounded-full"
                      style={{ width: `${item.scoreB * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Simple Pricing
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="rounded-xl border bg-white dark:bg-gray-800 p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Free</h3>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">$0</p>
              <ul className="mt-6 space-y-3">
                {['5 comparisons/month', 'Basic AI analysis', 'Share results'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-6 block w-full text-center rounded-lg border border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
              >
                Get Started
              </Link>
            </div>
            <div className="rounded-xl border-2 border-indigo-600 bg-white dark:bg-gray-800 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                $9.99<span className="text-base font-normal text-gray-500">/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {['Unlimited comparisons', 'Advanced AI analysis', 'Priority support', 'Export results'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="h-4 w-4 text-green-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-6 block w-full text-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
