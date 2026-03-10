'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
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

const PLACEHOLDER_SUGGESTIONS = [
  "iPhone 15 Pro Max",
  "Samsung S24 Ultra",
  "Dior Sauvage",
  "Dot & Key Sunscreen",
  "MacBook Pro M3",
  "Sony WH-1000XM5",
  "Nike Air Jordan 1",
  "Tata Harrier EV",
  "Kindle Paperwhite",
  "Dyson V15 Detect"
];

interface ProductSearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (product: { name: string; id?: string; brand?: string; category?: string; price?: number; imageUrl?: string }) => void;
  onClear: () => void;
  accentColor: 'indigo' | 'violet';
}

export function ProductSearchInput({
  label,
  value,
  onChange,
  onSelect,
  onClear,
  accentColor,
}: ProductSearchInputProps) {
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Auto-typing Placeholder logic ──────────────────────────────────────────
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = PLACEHOLDER_SUGGESTIONS[placeholderIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder(prev => prev.slice(0, -1));
        if (placeholder === '') {
          setIsDeleting(false);
          setPlaceholderIndex(prev => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setPlaceholder(currentFullText.slice(0, placeholder.length + 1));
        if (placeholder === currentFullText) {
          setTimeout(() => setIsDeleting(true), 2500); // Wait before deleting
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, placeholderIndex]);

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

  const ringColors = accentColor === 'indigo' ? 'focus-within:ring-indigo-500/30' : 'focus-within:ring-violet-500/30';
  const borderColors = accentColor === 'indigo' ? 'focus-within:border-indigo-500' : 'focus-within:border-violet-500';
  const iconColors = accentColor === 'indigo' ? 'text-indigo-500' : 'text-violet-500';

  return (
    <div ref={containerRef} className="relative group">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
          {label}
        </label>
        {isLoading && (
          <div className="flex items-center gap-1.5 mr-1">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "relative rounded-2xl border bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ring-4 ring-transparent overflow-hidden",
        ringColors, borderColors
      )}>
        <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors", iconColors)} />

        <Input
          value={value}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={value ? "" : `e.g. ${placeholder}`}
          className="pl-12 pr-12 h-14 border-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:italic focus-visible:ring-0"
        />

        {value && (
          <button
            onClick={() => {
              onChange('');
              onClear();
              setSuggestions([]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 rounded-2xl border bg-white dark:bg-gray-900 shadow-2xl max-h-72 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2 border-b bg-gray-50/50 dark:bg-gray-950/50 flex items-center gap-2 px-4">
            <TrendingUp className="h-3 w-3 text-indigo-500" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-gray-500">Related Products</span>
          </div>
          <div className="overflow-y-auto max-h-60 scrollbar-thin">
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product)}
                className="w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border-b last:border-b-0 border-gray-100 dark:border-gray-800 group/item"
              >
                <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden shrink-0 group-hover/item:border-indigo-500/50 transition-colors">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-gray-300 group-hover/item:text-indigo-400 transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-medium truncate">
                    {[product.brand, product.category, product.price && `$${product.price}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Glow Effect on Hover */}
      <div className="absolute inset-x-4 -bottom-1 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
