'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    if (!token) {
        return (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Invalid or missing reset token.
            </div>
        );
    }

    const onSubmit = async (values: ResetPasswordValues) => {
        setError(null);
        setSuccess(null);
        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: values.newPassword,
            });
            setSuccess('Password has been successfully reset. You can now login.');
        } catch (err: unknown) {
            const message =
                err && typeof err === 'object' && 'response' in err
                    ? (err as any).response?.data?.message
                    : undefined;
            setError(message || 'Failed to reset password. The link might have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 p-3 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 p-3 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {success}
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('newPassword')}
                    disabled={isLoading || success !== null}
                />
                {errors.newPassword && (
                    <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    disabled={isLoading || success !== null}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={isLoading || success !== null}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                    </>
                ) : (
                    'Reset Password'
                )}
            </Button>
        </form>
    );
}
