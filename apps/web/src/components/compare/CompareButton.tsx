'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

interface CompareButtonProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick: () => void;
}

export function CompareButton({ disabled, isLoading, onClick }: CompareButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          AI is analyzing...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-5 w-5" />
          Analyze with AI
        </>
      )}
    </Button>
  );
}
