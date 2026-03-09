'use client';

import { WinnerBadge } from './WinnerBadge';
import { ProductCard } from './ProductCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { ReasoningSection } from './ReasoningSection';
import { ShareButton } from './ShareButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ComparisonResultProps {
  comparison: {
    id: string;
    isPublic: boolean;
    shareToken: string | null;
    result: {
      winner: string;
      verdict: string;
      reasoning: string;
      productA: {
        name: string;
        brand?: string;
        overallScore: number;
        pros: string[];
        cons: string[];
      };
      productB: {
        name: string;
        brand?: string;
        overallScore: number;
        pros: string[];
        cons: string[];
      };
      categories: Array<{
        category: string;
        scoreA: number;
        scoreB: number;
        explanation: string;
      }>;
    };
  };
  showShare?: boolean;
}

export function ComparisonResult({ comparison, showShare = true }: ComparisonResultProps) {
  const router = useRouter();
  const { result } = comparison;

  const isAWinner = result.winner === result.productA.name;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/compare')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          New Comparison
        </Button>

        <div className="flex items-center gap-2">
          {showShare && (
            <ShareButton
              comparisonId={comparison.id}
              isPublic={comparison.isPublic}
              shareToken={comparison.shareToken}
            />
          )}
          <Button
            variant="outline"
            onClick={() => router.push('/compare')}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Compare Again
          </Button>
        </div>
      </div>

      <div className="text-center">
        <WinnerBadge winner={result.winner} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductCard
          name={result.productA.name}
          brand={result.productA.brand}
          score={result.productA.overallScore}
          pros={result.productA.pros}
          cons={result.productA.cons}
          isWinner={isAWinner}
          accentColor="indigo"
        />
        <ProductCard
          name={result.productB.name}
          brand={result.productB.brand}
          score={result.productB.overallScore}
          pros={result.productB.pros}
          cons={result.productB.cons}
          isWinner={!isAWinner}
          accentColor="violet"
        />
      </div>

      <CategoryBreakdown
        categories={result.categories}
        productAName={result.productA.name}
        productBName={result.productB.name}
      />

      <ReasoningSection reasoning={result.reasoning} verdict={result.verdict} />
    </div>
  );
}
