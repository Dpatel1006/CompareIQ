'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <KeyRound className="h-10 w-10 text-indigo-600 mx-auto" />
                        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                            Set new password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please enter your new password below
                        </p>
                    </div>

                    <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm">
                        <Suspense fallback={<div className="text-center py-4">Loading...</div>}>
                            <ResetPasswordForm />
                        </Suspense>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            <p>
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
