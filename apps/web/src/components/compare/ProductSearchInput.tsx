'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ProductSuggestion {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  price: number | null;
  imageUrl: string | null;
}

interface ProductSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (product: { name: string; id?: string; brand?: string; category?: string; price?: number; imageUrl?: string }) => void;
  onClear: () => void;
  placeholder?: string;
}

export function ProductSearchInput({
  label,
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = 'Search for a product...',
}: ProductSearchInputProps) {
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      setSuggestions(data);
      setIsOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchProducts(val), 300);
  };

  const handleSelect = (product: ProductSuggestion) => {
    onChange(product.name);
    onSelect({
      name: product.name,
      id: product.id,
      brand: product.brand || undefined,
      category: product.category,
      price: product.price || undefined,
      imageUrl: product.imageUrl || undefined,
    });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {value && (
          <button
            onClick={() => {
              onChange('');
              onClear();
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-white dark:bg-gray-900 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {product.name}
                </p>
                <p className="text-xs text-gray-500">
                  {[product.brand, product.category, product.price && `$${product.price}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && isLoading && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-white dark:bg-gray-900 shadow-lg p-4 text-center text-sm text-gray-500">
          Searching...
        </div>
      )}
    </div>
  );
}
