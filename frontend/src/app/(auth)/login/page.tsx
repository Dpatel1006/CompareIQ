'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { LoginForm } from '@/components/auth/LoginForm';
import { BarChart3 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <BarChart3 className="h-10 w-10 text-indigo-600 mx-auto" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to your CompareIQ account
            </p>
          </div>

          <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
            <LoginForm />

            <div className="mt-4 space-y-2 text-center text-sm text-gray-500">
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </Link>
              </p>
              <p>
                <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
