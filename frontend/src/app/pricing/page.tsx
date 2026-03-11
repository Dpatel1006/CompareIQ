'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Sparkles, Zap, Building2, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// ── Real pricing in INR (Indian base prices) ──────────────────────────────────
// These are real, market-competitive SaaS prices for India
const PLANS_INR = [
  {
    name: 'Free',
    monthlyINR: 0,
    yearlyINR: 0,
    description: 'Perfect for trying out CompareIQ.',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #64748b, #94a3b8)',
    features: [
      { name: '5 AI comparisons / month', included: true },
      { name: 'Smart category preferences', included: true },
      { name: 'Share comparisons publicly', included: true },
      { name: 'Comparison history (30 days)', included: true },
      { name: 'Unlimited comparisons', included: false },
      { name: 'Priority AI (faster results)', included: false },
      { name: 'Export to PDF', included: false },
      { name: 'API access', included: false },
    ],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    monthlyINR: 499,
    yearlyINR: 3999,   // ~₹333/mo — save 33%
    description: 'For individuals who compare frequently.',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    features: [
      { name: '100 AI comparisons / month', included: true },
      { name: 'Smart category preferences', included: true },
      { name: 'Share comparisons publicly', included: true },
      { name: 'Full comparison history', included: true },
      { name: 'Priority AI (faster results)', included: true },
      { name: 'Export to PDF', included: true },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Upgrade to Pro',
    href: '/register',
    popular: true,
  },
  {
    name: 'Business',
    monthlyINR: 1499,
    yearlyINR: 11999,   // ~₹1000/mo — save 33%
    description: 'For teams and power users.',
    icon: Building2,
    gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    features: [
      { name: 'Unlimited comparisons', included: true },
      { name: 'Smart category preferences', included: true },
      { name: 'Share comparisons publicly', included: true },
      { name: 'Full comparison history', included: true },
      { name: 'Priority AI (fastest results)', included: true },
      { name: 'Export to PDF', included: true },
      { name: 'API access', included: true },
      { name: 'Custom branding', included: true },
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@compareiq.app',
    popular: false,
  },
];

// ── Currency definitions with real approximate exchange rates (base: INR) ──────
const CURRENCIES: Record<string, {
  code: string; symbol: string; name: string; rateFromINR: number; locale: string;
}> = {
  IN: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateFromINR: 1, locale: 'en-IN' },
  US: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromINR: 0.012, locale: 'en-US' },
  GB: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromINR: 0.0094, locale: 'en-GB' },
  EU: { code: 'EUR', symbol: '€', name: 'Euro', rateFromINR: 0.011, locale: 'de-DE' },
  AU: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateFromINR: 0.018, locale: 'en-AU' },
  CA: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateFromINR: 0.016, locale: 'en-CA' },
  SG: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateFromINR: 0.016, locale: 'en-SG' },
  AE: { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rateFromINR: 0.044, locale: 'ar-AE' },
  NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rateFromINR: 20.0, locale: 'en-NG' },
  PK: { code: 'PKR', symbol: 'Rs', name: 'Pakistani Rupee', rateFromINR: 3.35, locale: 'ur-PK' },
  BD: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateFromINR: 1.33, locale: 'bn-BD' },
  JP: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateFromINR: 1.82, locale: 'ja-JP' },
  DEFAULT: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromINR: 0.012, locale: 'en-US' },
};

// Countries using Euro
const EUR_COUNTRIES = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'FI', 'IE', 'LU', 'SK', 'SI', 'HR'];

function getCurrencyForCountry(countryCode: string) {
  if (EUR_COUNTRIES.includes(countryCode)) return CURRENCIES['EU'];
  return CURRENCIES[countryCode] || CURRENCIES['DEFAULT'];
}

// Format number nicely in local currency
function formatPrice(amountINR: number, currency: typeof CURRENCIES['IN'], yearly: boolean): string {
  if (amountINR === 0) return `${currency.symbol}0`;
  const base = yearly ? amountINR : amountINR;
  const converted = Math.round(base * currency.rateFromINR);

  // Use Intl API for proper formatting
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(converted);
  } catch {
    return `${currency.symbol}${converted.toLocaleString()}`;
  }
}

// ── Currency flag emoji by country code ─────────────────────────────────────
function flagEmoji(countryCode: string): string {
  const map: Record<string, string> = {
    IN: '🇮🇳', US: '🇺🇸', GB: '🇬🇧', AU: '🇦🇺',
    CA: '🇨🇦', SG: '🇸🇬', AE: '🇦🇪', NG: '🇳🇬',
    PK: '🇵🇰', BD: '🇧🇩', JP: '🇯🇵',
  };
  if (EUR_COUNTRIES.includes(countryCode)) return '🇪🇺';
  return map[countryCode] || '🌍';
}

// ── Plan Card ─────────────────────────────────────────────────────────────────
function PlanCard({
  plan,
  currency,
  yearly,
  index,
  onUpgrade,
  isUpgrading,
}: {
  plan: (typeof PLANS_INR)[0];
  currency: typeof CURRENCIES['IN'];
  yearly: boolean;
  index: number;
  onUpgrade?: (tier: string) => void;
  isUpgrading?: string | null;
}) {
  const { user } = useAuth();
  const Icon = plan.icon;
  const priceINR = yearly ? plan.yearlyINR : plan.monthlyINR;
  const monthlyEquivINR = yearly && plan.yearlyINR > 0
    ? Math.round(plan.yearlyINR / 12)
    : plan.monthlyINR;

  const savingsPercent = plan.monthlyINR > 0
    ? Math.round((1 - plan.yearlyINR / (plan.monthlyINR * 12)) * 100)
    : 0;

  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 120}ms`, display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          borderRadius: '20px',
          border: plan.popular ? '2px solid #6366f1' : '1px solid var(--border)',
          background: 'var(--surface-0)',
          padding: '2rem',
          boxShadow: plan.popular ? '0 8px 40px rgba(99,102,241,0.2)' : 'var(--shadow-sm)',
          transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = '0 12px 50px rgba(99,102,241,0.25)';
          if (!plan.popular) el.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = plan.popular ? '0 8px 40px rgba(99,102,241,0.2)' : 'var(--shadow-sm)';
          el.style.transform = plan.popular ? 'scale(1.03)' : 'scale(1)';
        }}
      >
        {/* Popular badge */}
        {plan.popular && (
          <div
            style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              padding: '4px 16px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', whiteSpace: 'nowrap', letterSpacing: '0.04em', textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
            }}
          >
            ⚡ Most Popular
          </div>
        )}

        {/* Yearly savings badge */}
        {yearly && savingsPercent > 0 && (
          <div
            style={{
              position: 'absolute', top: plan.popular ? '16px' : '12px', right: '16px',
              padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
              background: 'rgba(16,185,129,0.12)', color: '#059669',
              border: '1px solid rgba(16,185,129,0.3)',
            }}
          >
            Save {savingsPercent}%
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: 40, height: 40, borderRadius: '12px',
                background: plan.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              }}
            >
              <Icon style={{ width: 20, height: 20, color: 'white' }} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {plan.name}
            </h3>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            <span
              style={{
                fontSize: plan.monthlyINR === 0 ? '2.8rem' : '2.4rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                background: plan.popular ? plan.gradient : undefined,
                WebkitBackgroundClip: plan.popular ? 'text' : undefined,
                WebkitTextFillColor: plan.popular ? 'transparent' : undefined,
                backgroundClip: plan.popular ? 'text' : undefined,
              }}
            >
              {plan.monthlyINR === 0
                ? `${currency.symbol}0`
                : formatPrice(yearly ? monthlyEquivINR : priceINR, currency, false)
              }
            </span>
            {plan.monthlyINR > 0 && (
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '6px', paddingLeft: '2px' }}>
                {yearly ? '/mo, billed yearly' : '/month'}
              </span>
            )}
          </div>

          {/* Yearly total */}
          {yearly && plan.yearlyINR > 0 && (
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {formatPrice(priceINR, currency, true)} billed annually
            </p>
          )}

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {plan.description}
          </p>
        </div>

        {/* Features */}
        <ul style={{ flex: 1, marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {plan.features.map((f: { name: string; included: boolean }) => (
            <li key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
              {f.included ? (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check style={{ width: 11, height: 11, color: '#10b981' }} />
                </div>
              ) : (
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X style={{ width: 11, height: 11, color: '#94a3b8' }} />
                </div>
              )}
              <span style={{ color: f.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {f.name}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        {plan.name === 'Free' ? (
          <Link
            href={user ? '/dashboard' : '/register'}
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: 'transparent',
              color: '#6366f1',
              border: '2px solid #6366f1',
            }}
          >
            {user ? 'Go to Dashboard' : plan.cta}
          </Link>
        ) : (
          <button
            onClick={() => onUpgrade?.(plan.name === 'Business' ? 'TEAM' : 'PRO')}
            disabled={!!isUpgrading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              background: plan.popular ? plan.gradient : 'transparent',
              color: plan.popular ? 'white' : '#6366f1',
              border: plan.popular ? 'none' : '2px solid #6366f1',
              cursor: isUpgrading ? 'not-allowed' : 'pointer',
              opacity: isUpgrading ? 0.7 : 1,
              boxShadow: plan.popular ? '0 4px 15px rgba(99,102,241,0.35)' : 'none',
            }}
          >
            {isUpgrading === (plan.name === 'Business' ? 'TEAM' : 'PRO') ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            {isUpgrading === (plan.name === 'Business' ? 'TEAM' : 'PRO')
              ? 'Processing...'
              : user
                ? plan.cta
                : 'Sign in to Upgrade'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Pricing Page ─────────────────────────────────────────────────────────
export default function PricingPage() {
  const { user } = useAuth();
  const [yearly, setYearly] = useState(false);
  const [countryCode, setCountryCode] = useState<string>('IN');
  const [detecting, setDetecting] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES['IN']);
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }

    setIsUpgrading(tier);
    try {
      const { data } = await api.post('/billing/checkout', { tier });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.response?.data?.message || 'Failed to start checkout. Please try again.');
    } finally {
      setIsUpgrading(null);
    }
  };

  // Detect user country from IP
  useEffect(() => {
    async function detectCountry() {
      try {
        // ipapi.co is free — no API key needed for 1000 req/day
        const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = await res.json() as { country_code?: string };
          const code = data.country_code || 'IN';
          setCountryCode(code);
          setCurrency(getCurrencyForCountry(code));
        }
      } catch {
        // Fallback to INR on error/timeout
        setCountryCode('IN');
        setCurrency(CURRENCIES['IN']);
      } finally {
        setDetecting(false);
      }
    }
    detectCountry();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-0)' }} className="mesh-bg">
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

        {/* ── Header ── */}
        <div className="animate-fade-in-up text-center" style={{ marginBottom: '3rem' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: '1rem',
            }}
          >
            Simple, transparent
            {' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              pricing
            </span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Start free. Upgrade when you need more power.
          </p>

          {/* Location badge */}
          <div
            className="animate-fade-in"
            style={{
              animationDelay: '200ms', display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '999px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              fontSize: '0.83rem', color: 'var(--text-secondary)',
            }}
          >
            {detecting ? (
              <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Detecting your location...</>
            ) : (
              <>
                <Globe style={{ width: 14, height: 14, color: '#6366f1' }} />
                {flagEmoji(countryCode)} Showing prices in {currency.name} ({currency.code})
              </>
            )}
          </div>
        </div>

        {/* ── Toggle monthly / yearly ── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '150ms', display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '6px', borderRadius: '999px',
              background: 'var(--surface-1)', border: '1px solid var(--border)',
            }}
          >
            <button
              onClick={() => setYearly(false)}
              style={{
                padding: '8px 24px', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                background: !yearly ? 'white' : 'transparent',
                color: !yearly ? '#6366f1' : 'var(--text-muted)',
                boxShadow: !yearly ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              style={{
                padding: '8px 24px', borderRadius: '999px', fontWeight: 600, fontSize: '0.875rem',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '8px',
                background: yearly ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: yearly ? 'white' : 'var(--text-muted)',
                boxShadow: yearly ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
              }}
            >
              Yearly
              <span
                style={{
                  padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                  background: yearly ? 'rgba(255,255,255,0.25)' : 'rgba(16,185,129,0.12)',
                  color: yearly ? 'white' : '#059669',
                }}
              >
                Save 33%
              </span>
            </button>
          </div>
        </div>

        {/* ── Plan cards ── */}
        {detecting ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: '520px', borderRadius: '20px', animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
            {PLANS_INR.map((plan, i) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                currency={currency}
                yearly={yearly}
                index={i}
                onUpgrade={handleUpgrade}
                isUpgrading={isUpgrading}
              />
            ))}
          </div>
        )}

        {/* ── Footer notes ── */}
        <div className="animate-fade-in-up" style={{ animationDelay: '500ms', marginTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            ✅ 14-day money-back guarantee &nbsp;·&nbsp; 🔒 No credit card for Free plan &nbsp;·&nbsp; 🌍 Prices shown are approximate conversions from INR
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            All prices exclude applicable taxes. Exchange rates are approximate and may vary.
            Base prices in Indian Rupees (₹).
          </p>
        </div>
      </div>
    </div>
  );
}
