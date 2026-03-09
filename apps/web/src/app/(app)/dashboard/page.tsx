'use client';

import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentComparisons } from '@/components/dashboard/RecentComparisons';
import { QuickCompareWidget } from '@/components/dashboard/QuickCompareWidget';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Clock, Trophy, Zap } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useHistory(1, 5);

  const comparisons = data?.data || [];
  const totalComparisons = data?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here&apos;s an overview of your comparison activity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Total Comparisons"
              value={totalComparisons}
              icon={BarChart3}
              description="All time"
            />
            <StatsCard
              title="This Month"
              value={comparisons.filter(
                (c: any) => new Date(c.createdAt).getMonth() === new Date().getMonth(),
              ).length}
              icon={Clock}
              description="Active this month"
            />
            <StatsCard
              title="Tier"
              value={user?.tier || 'FREE'}
              icon={Zap}
              description={user?.tier === 'FREE' ? 'Upgrade for more' : 'Premium features'}
            />
            <StatsCard
              title="Comparisons Left"
              value={user?.tier === 'FREE' ? `${Math.max(0, 5 - totalComparisons)}` : '∞'}
              icon={Trophy}
              description={user?.tier === 'FREE' ? 'of 5 free comparisons' : 'Unlimited access'}
            />
          </>
        )}
      </div>

      <QuickCompareWidget />

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <RecentComparisons comparisons={comparisons} />
      )}
    </div>
  );
}
