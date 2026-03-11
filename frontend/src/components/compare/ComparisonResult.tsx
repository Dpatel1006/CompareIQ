'use client';

import { WinnerBadge } from './WinnerBadge';
import { ProductCard } from './ProductCard';
import { CategoryBreakdown } from './CategoryBreakdown';
import { ReasoningSection } from './ReasoningSection';
import { ShareButton } from './ShareButton';
import { RelatedComparisons } from './RelatedComparisons';
import { ExportPdfButton } from './ExportPdfButton';
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
      products: Record<string, AiProductResult>;
      categories: any[];
    };
  };
  showShare?: boolean;
}

/** Compute 0-10 overall score from category averages, fallback to rating*2 */
function deriveScore(product: AiProductResult, productId: string, categories: any[]): number {
  const scoreKey = `${productId}Score`;
  const catScores = categories
    .map((c) => c[scoreKey])
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

  const productIds = Object.keys(result.products || {});
  const ACCENT_COLORS = ['indigo', 'violet', 'purple', 'fuchsia'] as const;

  return (
    <div id="comparison-result" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            <div data-share-button>
              <ShareButton
                comparisonId={comparison.id}
                isPublic={comparison.isPublic}
                shareToken={comparison.shareToken}
              />
            </div>
          )}
          <ExportPdfButton
            elementId="comparison-result"
            filename={`comparison-${comparison.id}`}
          />
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

      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(productIds.length, 4)} gap-4`}>
        {productIds.map((id, index) => {
          const product = result.products[id];
          const score = deriveScore(product, id, result.categories);
          const isWinner = result.winner === id || result.winner === product.name || result.winner === 'tie';

          return (
            <ProductCard
              key={id}
              name={product.name}
              brand={product.brand}
              score={score}
              pros={product.pros || []}
              cons={product.cons || []}
              isWinner={isWinner}
              accentColor={ACCENT_COLORS[index % ACCENT_COLORS.length]}
            />
          );
        })}
      </div>

      <CategoryBreakdown
        categories={result.categories}
        products={result.products}
      />

      <ReasoningSection
        verdict={result.summary ?? result.verdict ?? ''}
        reasoning={result.recommendation ?? result.reasoning ?? ''}
      />

      <RelatedComparisons comparisonId={comparison.id} />
    </div>
  );
}
