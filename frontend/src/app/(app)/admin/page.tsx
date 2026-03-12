'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, LayoutDashboard, Search, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalComparisons: number;
  totalProducts: number;
  activeUsersToday: number;
  comparisonsToday: number;
}

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, isLoading, router]);

  if (isLoading || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        <p>{error}</p>
        <Link href="/dashboard" className="mt-4 text-indigo-600 underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">System Overview & Analytics</p>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to App
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500 border-none shrink-0">Total Users</CardTitle>
            <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+{stats?.activeUsersToday} active today</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Comparisons</CardTitle>
            <Search className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalComparisons.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+{stats?.comparisonsToday} today</p>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 dark:border-indigo-900/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-gray-500">Products Cached</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
