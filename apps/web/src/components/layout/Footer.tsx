import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Compare<span className="text-indigo-600">IQ</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              AI-powered product comparison platform. Make smarter purchasing decisions with
              detailed, unbiased analysis powered by artificial intelligence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pricing" className="text-sm text-gray-500 hover:text-indigo-600">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-gray-500 hover:text-indigo-600">
                  Compare Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-gray-500 hover:text-indigo-600">
                  Log In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-500 hover:text-indigo-600">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} CompareIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
