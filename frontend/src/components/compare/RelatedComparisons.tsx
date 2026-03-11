'use client';

import { useRelatedComparisons } from '@/hooks/useComparison';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface RelatedComparison {
    id: string;
    products: { id: string; name: string }[];
    winner: string;
    category: string;
    createdAt: string;
}

export function RelatedComparisons({ comparisonId }: { comparisonId: string }) {
    const { data: related, isLoading } = useRelatedComparisons(comparisonId);

    if (isLoading) {
        return (
            <div className="space-y-4 pt-8">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    Related Comparisons
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!related || related.length === 0) {
        return null;
    }

    return (
        <div data-related-section className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Related Comparisons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((item: RelatedComparison) => (
                    <Link key={item.id} href={`/compare/${item.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-gray-100 dark:border-gray-800">
                            <CardContent className="p-4 flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                                            {item.category}
                                        </Badge>
                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                                        {(item.products || []).map(p => p.name).join(' vs ')}
                                    </h4>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="text-[11px] font-medium text-indigo-600 flex items-center gap-1">
                                        View Details
                                        <ArrowRight className="h-3 w-3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
