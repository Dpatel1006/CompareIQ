'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export function QuickCompareWidget() {
  const router = useRouter();
  const [productA, setProductA] = useState('');
  const [productB, setProductB] = useState('');

  const handleQuickCompare = () => {
    if (productA.trim() && productB.trim()) {
      router.push(`/compare?a=${encodeURIComponent(productA.trim())}&b=${encodeURIComponent(productB.trim())}`);
    }
  };

  return (
    <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          Quick Compare
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={productA}
            onChange={(e) => setProductA(e.target.value)}
            placeholder="Product A"
            className="bg-white dark:bg-gray-900"
          />
          <span className="flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
            VS
          </span>
          <Input
            value={productB}
            onChange={(e) => setProductB(e.target.value)}
            placeholder="Product B"
            className="bg-white dark:bg-gray-900"
          />
          <Button
            onClick={handleQuickCompare}
            disabled={!productA.trim() || !productB.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
          >
            Compare
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
