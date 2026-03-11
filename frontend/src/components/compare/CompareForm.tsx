'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductSearchInput } from './ProductSearchInput';
import { PreferencesPanel } from './PreferencesPanel';
import { CompareButton } from './CompareButton';
import { useCompareStore } from '@/store/compareStore';
import { useCreateComparison } from '@/hooks/useComparison';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { CompareLoading } from './CompareLoading';
import { Button } from '../ui/button';

export function CompareForm() {
  const router = useRouter();
  const {
    products,
    preferences,
    setProduct,
    addProduct,
    removeProduct,
    setPreferences,
  } = useCompareStore();

  const [productNames, setProductNames] = useState<string[]>(
    products.map((p) => p?.name || '')
  );
  const [error, setError] = useState<string | null>(null);

  const createComparison = useCreateComparison();

  const handleCompare = async () => {
    const trimmedNames = productNames.map(n => n.trim()).filter(Boolean);

    if (trimmedNames.length < 2) {
      setError('Please enter at least two products to compare.');
      return;
    }

    const uniqueNames = new Set(trimmedNames.map(n => n.toLowerCase()));
    if (uniqueNames.size !== trimmedNames.length) {
      setError('Please enter unique products.');
      return;
    }

    setError(null);

    try {
      const { id } = await createComparison.mutateAsync({
        productNames: trimmedNames,
        preferences: Object.keys(preferences).length > 0 ? preferences : undefined,
      });
      router.push(`/compare/${id}`);
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

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...productNames];
    newNames[index] = name;
    setProductNames(newNames);
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

      <div className="space-y-4">
        {productNames.map((name, index) => (
          <div key={index} className="relative flex items-end gap-2">
            <div className="flex-1">
              <ProductSearchInput
                label={`Product ${String.fromCharCode(65 + index)}`}
                value={name}
                onChange={(val) => handleNameChange(index, val)}
                onSelect={(p) => setProduct(index, p)}
                onClear={() => setProduct(index, null)}
                accentColor={index === 0 ? 'indigo' : index === 1 ? 'violet' : index === 2 ? 'purple' : 'fuchsia'}
              />
            </div>
            {productNames.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  removeProduct(index);
                  const newNames = [...productNames];
                  newNames.splice(index, 1);
                  setProductNames(newNames);
                }}
                className="mb-0.5 text-muted-foreground hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}

        {productNames.length < 4 && (
          <div className="flex justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                addProduct();
                setProductNames([...productNames, '']);
              }}
              className="gap-2 text-xs h-8 px-3 rounded-full border-dashed"
            >
              <Plus className="h-3 w-3" />
              Add Product
            </Button>
          </div>
        )}
      </div>

      <PreferencesPanel
        productNames={productNames}
        preferences={preferences}
        onChange={setPreferences}
      />

      <div className="pt-4 flex justify-center">
        <CompareButton
          onClick={handleCompare}
          isLoading={false}
          disabled={productNames.filter(n => n.trim()).length < 2}
        />
      </div>
    </div>
  );
}
