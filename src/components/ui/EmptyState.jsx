import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data available',
  description = 'There are currently no records to display.',
  action,
  className
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-card bg-surface/50",
        className
      )}
    >
      <div className="p-3 bg-surface-2 border border-border rounded-xl text-muted mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-text mb-1">{title}</h4>
      <p className="text-xs text-muted max-w-sm mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

