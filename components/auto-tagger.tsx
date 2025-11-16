'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { autoTagQuery, detectPriority } from '@/lib/query-utils';
import { AudienceQuery, QueryTag, Priority } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface AutoTaggerProps {
  content: string;
  onTagsDetected: (tags: QueryTag[], priority: Priority) => void;
}

export function AutoTagger({ content, onTagsDetected }: AutoTaggerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAutoTag = async () => {
    if (!content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const tags = autoTagQuery(content);
      const priority = detectPriority(content, tags);
      
      onTagsDetected(tags, priority);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Button
      onClick={handleAutoTag}
      disabled={!content.trim() || isAnalyzing}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isAnalyzing ? 'Analyzing...' : 'Auto-Tag'}
    </Button>
  );
}
