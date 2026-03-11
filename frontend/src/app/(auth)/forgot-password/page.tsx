'use client';

import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <KeyRound className="h-10 w-10 text-indigo-600 mx-auto" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                            Reset your password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Enter your email and we'll send you a reset link
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
                        <ForgotPasswordForm />

                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>
                                Remember your password?{' '}
                                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Back to login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
