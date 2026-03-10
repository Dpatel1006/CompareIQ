'use client';

import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import { QuickCompareWidget } from '@/components/dashboard/QuickCompareWidget';
import { RecentComparisons } from '@/components/dashboard/RecentComparisons';
import { BarChart3, Clock, Trophy, Zap, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

// ── Animated stat card ─────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  gradient,
  delay = 0,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        style={{
          background: 'var(--surface-0)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '120px',
            height: '120px',
            background: gradient,
            opacity: 0.06,
            borderRadius: '50%',
            transform: 'translate(30px, -30px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {title}
            </p>
            <p
              className="animate-count-up"
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginTop: '6px',
                animationDelay: `${delay + 100}ms`,
              }}
            >
              {value}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {description}
            </p>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: 0.85,
            }}
          >
            <Icon style={{ width: 20, height: 20, color: 'white' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <div
        style={{
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border)',
          background: 'var(--surface-0)',
        }}
      >
        <div className="skeleton" style={{ height: '12px', width: '60%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '32px', width: '40%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '10px', width: '50%' }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useHistory(1, 5);

  const comparisons = data?.data || [];
  const totalComparisons = data?.total || 0;
  const thisMonth = comparisons.filter(
    (c: { createdAt: string }) =>
      new Date(c.createdAt).getMonth() === new Date().getMonth(),
  ).length;
  const comparisonsLeft = user?.tier === 'FREE' ? Math.max(0, 5 - totalComparisons) : Infinity;

  return (
    <div className="space-y-8 py-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="text-indigo-600 font-bold">{user?.name?.split(' ')[0]}</span>. Here is your comparison summary.
          </p>
        </div>
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-0.5"
        >
          <Sparkles className="h-4 w-4" />
          New Comparison
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [0, 1, 2, 3].map(i => <StatCardSkeleton key={i} delay={i * 50} />)
        ) : (
          <>
            <StatCard
              title="Total Comparisons"
              value={totalComparisons}
              icon={BarChart3}
              description="All time"
              gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
              delay={50}
            />
            <StatCard
              title="This Month"
              value={thisMonth}
              icon={Clock}
              description="Active sessions"
              gradient="linear-gradient(135deg, #06b6d4, #0ea5e9)"
              delay={150}
            />
            <StatCard
              title="Plan"
              value={user?.tier || 'FREE'}
              icon={Zap}
              description={user?.tier === 'FREE' ? 'Basic Access' : 'Pro Features'}
              gradient="linear-gradient(135deg, #f59e0b, #f97316)"
              delay={250}
            />
            <StatCard
              title="Credit Balance"
              value={comparisonsLeft === Infinity ? 'Unlimited' : comparisonsLeft}
              icon={Trophy}
              description="Remaining credits"
              gradient="linear-gradient(135deg, #10b981, #059669)"
              delay={350}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentComparisons comparisons={comparisons} />
        </div>
        <div className="space-y-6">
          <QuickCompareWidget />
          {user?.tier === 'FREE' && (
            <div className="rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/50">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Upgrade to Pro</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Unlock unlimited deep-dive comparisons, priority AI processing, and advanced category breakdowns.
              </p>
              <Link href="/pricing" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-4">
                View Pricing →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
