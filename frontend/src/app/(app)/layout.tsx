'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore } from '@/store/authStore';
import { PageLoader } from '@/components/ui/PageLoader';

const HEADER_HEIGHT = 60; // px — keep in sync with Navbar height

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, loadUser } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const [pageKey, setPageKey] = useState(pathname);

  useEffect(() => {
    const init = async () => {
      if (!user) await loadUser();
      setInitialized(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => { setPageKey(pathname); }, [pathname]);

  useEffect(() => {
    if (initialized && !isLoading && !isAuthenticated) router.replace('/login');
  }, [initialized, isLoading, isAuthenticated, router]);

  if (!initialized || isLoading) return <PageLoader message="Authenticating" />;
  if (!isAuthenticated) return <PageLoader message="Redirecting" />;

  return (
    // ── Root shell: full viewport, no overflow ───────────────────────────────
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface-0)' }}>

      {/* ── Header — fixed at top, full width ── */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: `${HEADER_HEIGHT}px`, zIndex: 100 }}>
        <Navbar />
      </div>

      {/* ── Body row: sidebar + main — positioned below fixed header ── */}
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: `${HEADER_HEIGHT}px`,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* ── Sidebar — fixed height, its own scroll if content overflows ── */}
        <Sidebar />

        {/* ── Main content — only this scrolls ── */}
        <main
          key={pageKey}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '2rem 2.5rem',
            animation: 'fadeInUp 0.35s cubic-bezier(0,0,0.2,1) both',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
