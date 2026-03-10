'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const SUGGESTIONS = ["iPhone 15", "Galaxy S24", "Dior Sauvage", "MacBook Air", "Sony WH-1000XM5"];

export function QuickCompareWidget() {
  const router = useRouter();
  const [productA, setProductA] = useState('');
  const [productB, setProductB] = useState('');
  const [placeholderA, setPlaceholderA] = useState('');
  const [placeholderB, setPlaceholderB] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setPlaceholderA(SUGGESTIONS[idx]);
    setPlaceholderB(SUGGESTIONS[(idx + 1) % SUGGESTIONS.length]);
  }, [idx]);

  const handleQuickCompare = () => {
    if (productA.trim() && productB.trim()) {
      router.push(`/compare?a=${encodeURIComponent(productA.trim())}&b=${encodeURIComponent(productB.trim())}`);
    }
  };

  return (
    <Card className="border-indigo-100 dark:border-indigo-900 shadow-sm bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Quick Compare
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-3">
          <Input
            value={productA}
            onChange={(e) => setProductA(e.target.value)}
            placeholder={`e.g. ${placeholderA}`}
            className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl h-11 text-sm"
          />
          <div className="flex items-center justify-center">
            <span className="text-[10px] font-black italic text-indigo-600/50">VS</span>
          </div>
          <Input
            value={productB}
            onChange={(e) => setProductB(e.target.value)}
            placeholder={`e.g. ${placeholderB}`}
            className="bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 rounded-xl h-11 text-sm"
          />
          <Button
            onClick={handleQuickCompare}
            disabled={!productA.trim() || !productB.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-md shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] mt-2"
          >
            Compare Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
