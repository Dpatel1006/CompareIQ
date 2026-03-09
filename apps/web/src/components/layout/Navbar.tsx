'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Compare<span className="text-indigo-600">IQ</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-indigo-600',
                    pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/compare"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-indigo-600',
                    pathname === '/compare' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  Compare
                </Link>
                <Link
                  href="/history"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-indigo-600',
                    pathname === '/history' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  History
                </Link>
                <Link
                  href="/settings"
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-indigo-600',
                    pathname === '/settings' ? 'text-indigo-600' : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  Settings
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-sm text-gray-500">{user?.name || user?.email}</span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </>
            ) : !isAuthPage ? (
              <>
                <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-300">
                  Pricing
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started Free</Button>
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-950 px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="block text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link href="/compare" className="block text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Compare</Link>
              <Link href="/history" className="block text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>History</Link>
              <Link href="/settings" className="block text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
              <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/pricing" className="block text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">Log In</Button>
              </Link>
              <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" className="w-full">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
