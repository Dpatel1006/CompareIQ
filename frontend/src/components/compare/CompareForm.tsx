'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductSearchInput } from './ProductSearchInput';
import { PreferencesPanel } from './PreferencesPanel';
import { CompareButton } from './CompareButton';
import { useCompareStore } from '@/store/compareStore';
import { useCreateComparison } from '@/hooks/useComparison';
import { AlertCircle } from 'lucide-react';
import { CompareLoading } from './CompareLoading';

export function CompareForm() {
  const router = useRouter();
  const {
    productA,
    productB,
    preferences,
    setProductA,
    setProductB,
    setPreferences,
  } = useCompareStore();

  const [productAName, setProductAName] = useState(productA?.name || '');
  const [productBName, setProductBName] = useState(productB?.name || '');
  const [error, setError] = useState<string | null>(null);

  const createComparison = useCreateComparison();

  const handleCompare = async () => {
    const nameA = productAName.trim();
    const nameB = productBName.trim();

    if (!nameA || !nameB) {
      setError('Please enter both products to compare.');
      return;
    }

    if (nameA.toLowerCase() === nameB.toLowerCase()) {
      setError('Please enter two different products.');
      return;
    }

    setError(null);

    try {
      const result = await createComparison.mutateAsync({
        productAName: nameA,
        productBName: nameB,
        preferences: Object.keys(preferences).length > 0 ? preferences : undefined,
      });
      router.push(`/compare/${result.id}`);
    } catch (err: unknown) {
      const rawMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

      if (rawMessage?.toLowerCase().includes('quota') || rawMessage?.toLowerCase().includes('free-tier')) {
        setError(
          '⚠️ Daily AI quota reached. Please try again later.'
        );
      } else {
        setError(rawMessage || 'Failed to create comparison. Please try again.');
      }
    }
  };

  if (createComparison.isPending) {
    return <CompareLoading />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
        <ProductSearchInput
          label="Product A"
          value={productAName}
          onChange={setProductAName}
          onSelect={(p) => setProductA(p)}
          onClear={() => setProductA(null)}
          accentColor="indigo"
        />

        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 font-bold text-sm mx-auto mb-0.5 shrink-0 border border-indigo-200 dark:border-indigo-800">
          VS
        </div>

        <ProductSearchInput
          label="Product B"
          value={productBName}
          onChange={setProductBName}
          onSelect={(p) => setProductB(p)}
          onClear={() => setProductB(null)}
          accentColor="violet"
        />
      </div>

      <PreferencesPanel
        productAName={productAName}
        productBName={productBName}
        preferences={preferences}
        onChange={setPreferences}
      />

      <div className="pt-4 flex justify-center">
        <CompareButton
          onClick={handleCompare}
          isLoading={false}
          disabled={!productAName.trim() || !productBName.trim()}
        />
      </div>
    </div>
  );
}
