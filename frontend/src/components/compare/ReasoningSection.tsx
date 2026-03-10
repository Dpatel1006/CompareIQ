'use client';

import { MessageSquare } from 'lucide-react';

interface ReasoningSectionProps {
  reasoning: string;
  verdict: string;
}

export function ReasoningSection({ reasoning, verdict }: ReasoningSectionProps) {
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-900 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Verdict
        </h3>
      </div>

      <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 italic">
          &ldquo;{verdict}&rdquo;
        </p>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Detailed Reasoning
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
          {reasoning}
        </p>
      </div>
    </div>
  );
}
