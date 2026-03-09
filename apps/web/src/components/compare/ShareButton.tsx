'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Link, Check } from 'lucide-react';
import api from '@/lib/api';

interface ShareButtonProps {
  comparisonId: string;
  isPublic: boolean;
  shareToken: string | null;
}

export function ShareButton({ comparisonId, isPublic: initialIsPublic, shareToken: initialShareToken }: ShareButtonProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [shareToken, setShareToken] = useState(initialShareToken);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async () => {
    if (isPublic && shareToken) {
      const url = `${window.location.origin}/share/${shareToken}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.patch(`/comparisons/${comparisonId}/share`);
      setIsPublic(true);
      setShareToken(data.shareToken);
      const url = `${window.location.origin}/share/${data.shareToken}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Error silently handled
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      disabled={isLoading}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          Copied!
        </>
      ) : isPublic ? (
        <>
          <Link className="h-4 w-4" />
          Copy Link
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
