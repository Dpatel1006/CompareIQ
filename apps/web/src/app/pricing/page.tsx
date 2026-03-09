import Link from 'next/link';
import { Check, X, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Pricing | CompareIQ',
  description: 'Choose the perfect plan for your comparison needs.',
};

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for trying out CompareIQ.',
    icon: Sparkles,
    color: 'gray',
    features: [
      { name: '5 comparisons/month', included: true },
      { name: 'Basic AI analysis', included: true },
      { name: 'Share comparisons', included: true },
      { name: 'Comparison history', included: true },
      { name: 'Priority support', included: false },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For individuals who compare frequently.',
    icon: Zap,
    color: 'indigo',
    features: [
      { name: '50 comparisons/month', included: true },
      { name: 'Advanced AI analysis', included: true },
      { name: 'Share comparisons', included: true },
      { name: 'Comparison history', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: false },
      { name: 'Custom branding', included: false },
    ],
    cta: 'Upgrade to Pro',
    href: '/register',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    description: 'For teams and businesses.',
    icon: Building2,
    color: 'violet',
    features: [
      { name: 'Unlimited comparisons', included: true },
      { name: 'Premium AI analysis', included: true },
      { name: 'Share comparisons', included: true },
      { name: 'Comparison history', included: true },
      { name: 'Priority support', included: true },
      { name: 'API access', included: true },
      { name: 'Custom branding', included: true },
    ],
    cta: 'Contact Sales',
    href: '/register',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free and upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-2xl border bg-white dark:bg-gray-900 p-8 flex flex-col',
                  plan.popular && 'border-indigo-600 shadow-lg scale-105 z-10',
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        plan.color === 'indigo'
                          ? 'text-indigo-600'
                          : plan.color === 'violet'
                            ? 'text-violet-600'
                            : 'text-gray-600',
                      )}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0" />
                      )}
                      <span
                        className={cn(
                          feature.included
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-600',
                        )}
                      >
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={cn(
                    'w-full',
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : '',
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            All plans include a 14-day money-back guarantee. No credit card required for the free plan.
          </p>
        </div>
      </div>
    </div>
  );
}
