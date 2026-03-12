'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  BarChart3, User, LogOut, CreditCard,
  LayoutDashboard, GitCompare, History, Settings, Shield,
  Menu, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// ── Nav links base ────────────────────────────────────────────────────────────
const BASE_NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/pricing', label: 'Pricing', icon: CreditCard },
];

// ── Profile Dropdown ─────────────────────────────────────────────────────────
function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [onClose]);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div
      ref={ref}
      className="animate-scale-in"
      style={{
        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
        width: '200px', borderRadius: '12px',
        background: 'white',
        border: '1px solid var(--border)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        overflow: 'hidden', zIndex: 200,
        transformOrigin: 'top right',
      }}
    >
      {/* Mini header */}
      <div style={{
        padding: '12px',
        background: 'rgba(99,102,241,0.03)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '8px'
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: '0.7rem',
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-primary)', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'User'}
          </p>
          <span style={{ fontSize: '9px', color: 'var(--brand-600)', fontWeight: 700, textTransform: 'uppercase' }}>
            {user?.tier || 'FREE'}
          </span>
        </div>
      </div>

      <div style={{ padding: '4px' }}>
        {[
          { href: '/settings', icon: User, label: 'Profile' },
          { href: '/pricing', icon: CreditCard, label: 'Pricing' },
        ].map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} onClick={onClose} style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 10px', borderRadius: '6px',
            textDecoration: 'none', color: 'var(--text-secondary)',
            fontSize: '0.8rem', transition: 'background 0.15s ease',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(99,102,241,0.06)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
          >
            <Icon style={{ width: 14, height: 14, color: '#6366f1' }} />
            {label}
          </Link>
        ))}
      </div>

      <div style={{ padding: '4px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => { logout(); onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
            padding: '8px 10px', borderRadius: '6px', border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: '#ef4444', fontSize: '0.8rem', transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          <LogOut style={{ width: 14, height: 14 }} />
          Logout
        </button>
      </div>
    </div>
  );
}

// ── Main Navbar ──────────────────────────────────────────────────────────────
export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('main');
    if (!el) return;
    const fn = () => setScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, []);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const navLinks = [...BASE_NAV_LINKS];
  if (user?.role === 'ADMIN') {
    navLinks.push({ href: '/admin', label: 'Admin', icon: Shield });
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  return (
    <header
      style={{
        height: '60px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: scrolled ? 'rgba(255,255,255,1)' : 'white',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.2s ease',
        position: 'relative',
        zIndex: 100,
      }}
    >
      {/* ── LEFT: Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          {isAuthenticated && (
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          )}

          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BarChart3 style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              CompareIQ
            </span>
          </Link>
        </div>

        {/* ── CENTER: Nav Links (Desktop) ── */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    color: isActive ? '#6366f1' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.04)'; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
                >
                  <link.icon
                    style={{
                      width: 16, height: 16, flexShrink: 0,
                      color: isActive ? '#6366f1' : 'currentColor',
                    }}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* ── RIGHT: Auth/Profile ── */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {!isAuthenticated && !isAuthPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/login" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none' }}>Login</Link>
            <Link href="/register" style={{
              padding: '8px 16px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(99,102,241,0.25)',
            }}>
              Join Free
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* User Info (Desktop only) */}
            <div className="hidden lg:flex flex-col items-end" style={{ lineHeight: 1.2 }}>
               <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
               <span style={{ fontSize: '10px', color: 'var(--brand-600)', fontWeight: 700, textTransform: 'uppercase' }}>{user?.tier || 'FREE'}</span>
            </div>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                style={{
                  width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white', fontWeight: 700, fontSize: '0.85rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: profileOpen ? '0 0 0 2px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                }}
              >
                {initials}
              </button>
              {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE: Menu Drawer ── */}
      {isAuthenticated && mobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-[190] bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="md:hidden fixed left-0 top-[60px] bottom-0 w-64 z-[200] bg-white border-right border-gray-200 shadow-2xl animate-slide-left p-4 flex flex-col gap-2"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    color: isActive ? '#6366f1' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                  }}
                >
                  <link.icon style={{ width: 18, height: 18 }} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </header>
  );
}
