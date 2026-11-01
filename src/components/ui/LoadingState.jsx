import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function LoadingState({
  message = 'Loading energy data...',
  rows = 3,
  type = 'skeleton', // 'skeleton' | 'spinner'
  className
}) {
  if (type === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 gap-3", className)}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs font-mono text-muted">{message}</span>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4 p-4", className)}>
      <div className="flex items-center gap-2 mb-2">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="text-xs font-mono text-muted">{message}</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="w-full h-14 bg-surface-2/60 animate-pulse rounded-lg border border-border/40"
          />
        ))}
      </div>
    </div>
  );
}

