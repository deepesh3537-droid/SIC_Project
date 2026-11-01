import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the analytics service.',
  onRetry,
  className
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-6 border border-danger/30 rounded-card bg-danger/5",
        className
      )}
    >
      <div className="p-2.5 bg-danger/10 text-danger rounded-xl mb-3 border border-danger/20">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-text mb-1">{title}</h4>
      <p className="text-xs text-muted max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-2 hover:bg-border text-text border border-border transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}

