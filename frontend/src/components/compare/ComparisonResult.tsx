'use client';

import { WinnerBadge } from './WinnerBadge';
import { ProductCard } from './ProductCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { ReasoningSection } from './ReasoningSection';
import { ShareButton } from './ShareButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Flexible result shape — matches what the AI actually returns
interface AiProductResult {
  name: string;
  brand?: string;
  overallScore?: number;   // may be missing
  rating?: number | null;  // AI returns this (out of 5)
  pros: string[];
  cons: string[];
  price?: number | null;
  keySpecs?: Record<string, string>;
}

interface AiCategory {
  name?: string;           // new prompt field
  category?: string;       // old prompt fallback
  productAScore?: number;  // new
  productBScore?: number;  // new
  scoreA?: number;         // old fallback
  scoreB?: number;         // old fallback
  winner?: string;
  reasoning?: string;
  explanation?: string;
}

interface ComparisonResultProps {
  comparison: {
    id: string;
    isPublic: boolean;
    shareToken: string | null;
    result: {
      winner: string;
      winnerName?: string;
      summary?: string;
      verdict?: string;
      reasoning?: string;
      recommendation?: string;
      productA: AiProductResult;
      productB: AiProductResult;
      categories: AiCategory[];
      bestFor?: { productA: string; productB: string };
    };
  };
  showShare?: boolean;
}

/** Compute 0-10 overall score from category averages, fallback to rating*2 */
function deriveScore(product: AiProductResult, side: 'A' | 'B', categories: AiCategory[]): number {
  const catScores = categories
    .map((c) => side === 'A'
      ? (c.productAScore ?? c.scoreA)
      : (c.productBScore ?? c.scoreB)
    )
    .filter((s): s is number => typeof s === 'number' && !isNaN(s));

  if (catScores.length > 0) {
    return catScores.reduce((a, b) => a + b, 0) / catScores.length;
  }
  // Fallback: rating is out of 5 → multiply by 2
  if (typeof product.rating === 'number') return product.rating * 2;
  if (typeof product.overallScore === 'number') return product.overallScore;
  return 0;
}

export function ComparisonResult({ comparison, showShare = true }: ComparisonResultProps) {
  const router = useRouter();
  const { result } = comparison;

  const scoreA = deriveScore(result.productA, 'A', result.categories);
  const scoreB = deriveScore(result.productB, 'B', result.categories);

  // winner can be "productA"/"productB"/"tie" OR actual product name
  const isAWinner =
    result.winner === 'productA' ||
    result.winner === result.productA.name ||
    (result.winner === 'tie' ? scoreA >= scoreB : false);

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
          score={scoreA}
          pros={result.productA.pros || []}
          cons={result.productA.cons || []}
          isWinner={isAWinner}
          accentColor="indigo"
        />
        <ProductCard
          name={result.productB.name}
          brand={result.productB.brand}
          score={scoreB}
          pros={result.productB.pros || []}
          cons={result.productB.cons || []}
          isWinner={!isAWinner}
          accentColor="violet"
        />
      </div>

      <CategoryBreakdown
        categories={result.categories}
        productAName={result.productA.name}
        productBName={result.productB.name}
      />

      <ReasoningSection
        verdict={result.summary ?? result.verdict ?? ''}
        reasoning={result.recommendation ?? result.reasoning ?? ''}
      />
    </div>
  );
}
