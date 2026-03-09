'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatRelativeTime } from '@/lib/utils';
import { Trophy, Trash2, Eye, Share2 } from 'lucide-react';

interface HistoryItem {
  id: string;
  productAName: string;
  productBName: string;
  winner: string;
  createdAt: string;
  isPublic: boolean;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onDelete: (id: string) => void;
}

export function HistoryTable({ items, onDelete }: HistoryTableProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 dark:bg-gray-800">
            <th className="text-left font-medium text-gray-500 px-4 py-3">Products</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Winner</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Date</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
            <th className="text-right font-medium text-gray-500 px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3">
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.productAName}
                </span>
                <span className="text-gray-400 mx-2">vs</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.productBName}
                </span>
              </td>
              <td className="px-4 py-3">
                <Badge variant="outline" className="gap-1">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  {item.winner}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {formatRelativeTime(item.createdAt)}
              </td>
              <td className="px-4 py-3">
                {item.isPublic ? (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Public
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Private
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/compare/${item.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
