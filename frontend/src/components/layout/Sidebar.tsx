'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, createContext, useContext } from 'react';
import {
  LayoutDashboard, GitCompare, History, Settings,
  CreditCard, LogOut, User, ChevronUp, Zap,
  PanelLeftClose, PanelLeftOpen, Menu, Shield,
} from 'lucide-react';

// ── Nav links base ────────────────────────────────────────────────────────────
const BASE_NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
];
// ── Sidebar Context (share collapsed state with Navbar toggle) ────────────────
const SidebarCtx = createContext<{ collapsed: boolean; toggle: () => void }>({
  collapsed: false,
  toggle: () => { },
});
export const useSidebar = () => useContext(SidebarCtx);

// ── User Footer with pop-up submenu ──────────────────────────────────────────
function UserFooter({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const displayName = user?.name || 'User';
  const email = user?.email || '';

  return (
    <div ref={ref} className="relative">
      {/* ── Pop-up submenu ── */}
      {open && (
        <div
          className="animate-scale-in absolute bottom-full mb-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl overflow-hidden z-50"
          style={{
            left: collapsed ? '4px' : '8px',
            right: collapsed ? '4px' : '8px',
            minWidth: collapsed ? '200px' : 'auto',
            transformOrigin: 'bottom left',
          }}
        >
          {/* User info header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.875rem',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
                }}
              >
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                  {displayName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                  {email}
                </p>
                <span
                  style={{
                    display: 'inline-block', marginTop: '4px',
                    padding: '1px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600,
                    background: 'rgba(99,102,241,0.12)', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}
                >
                  {user?.tier || 'FREE'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ padding: '6px' }}>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span>Profile & Settings</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Zap className="h-4 w-4 text-gray-400" />
              <span>Upgrade Plan</span>
            </Link>
          </div>

          <div style={{ padding: '6px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        title={collapsed ? displayName : undefined}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: collapsed ? '12px 10px' : '10px 12px',
          borderRadius: '12px',
          cursor: 'pointer',
          background: open ? 'rgba(99,102,241,0.08)' : 'transparent',
          border: 'none',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; }}
        onMouseLeave={(e) => { if (!open) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '0.8rem',
            boxShadow: '0 2px 6px rgba(99,102,241,0.35)',
          }}
        >
          {initials}
        </div>

        {/* Name + email — hidden when collapsed */}
        {!collapsed && (
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
              {displayName}
            </p>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
              {email}
            </p>
          </div>
        )}

        {/* Chevron — hidden when collapsed */}
        {!collapsed && (
          <ChevronUp
            className="h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        )}
      </button>
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const W = collapsed ? 68 : 240;

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const { user } = useAuth();
  const navLinks = [...BASE_NAV_LINKS];
  if (user?.role === 'ADMIN') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: Shield });
  }

  const NavContent = (
    <>
      {/* ── Nav links ── */}
      <nav style={{ flex: 1, padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px 0' : '9px 12px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                color: isActive ? '#6366f1' : 'var(--text-secondary)',
                background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
            >
              {/* Active dot */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '20px', borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                    display: collapsed ? 'none' : 'block',
                  }}
                />
              )}
              <link.icon
                style={{
                  width: 18, height: 18, flexShrink: 0,
                  color: isActive ? '#6366f1' : 'currentColor',
                }}
              />
              {!collapsed && <span style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div
        style={{
          padding: '8px 6px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <UserFooter collapsed={collapsed} />
      </div>
    </>
  );

  return (
    <>
      {/* ══ DESKTOP SIDEBAR ══ */}
      <aside
        style={{
          width: `${W}px`,
          minHeight: 'calc(100vh - 64px)',
          borderRight: '1px solid var(--border)',
          background: 'var(--surface-0)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
        className="hidden lg:flex"
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute',
            top: '12px',
            right: collapsed ? '50%' : '12px',
            transform: collapsed ? 'translateX(50%)' : 'none',
            width: '28px', height: '28px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--surface-0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20,
            transition: 'all 0.25s ease',
            color: 'var(--text-muted)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#6366f1'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#6366f1'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'; }}
        >
          {collapsed
            ? <PanelLeftOpen style={{ width: 14, height: 14 }} />
            : <PanelLeftClose style={{ width: 14, height: 14 }} />
          }
        </button>

        {/* Add top spacing for the toggle button */}
        <div style={{ paddingTop: '52px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {NavContent}
        </div>
      </aside>

      {/* ══ MOBILE: hamburger button ══ */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg flex items-center justify-center"
        style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* ══ MOBILE: overlay + drawer ══ */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 flex flex-col animate-slide-left"
            style={{
              width: '260px',
              background: 'var(--surface-0)',
              borderRight: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ paddingTop: '16px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {NavContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
