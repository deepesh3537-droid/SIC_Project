import React from 'react';
import Badge from '../ui/Badge.jsx';
import { cn } from '../../lib/utils.js';

export default function ChartCard({
  title,
  subtitle,
  badge = 'Measured',
  badgeTooltip,
  actions,
  summaryText,
  children,
  className
}) {
  return (
    <div className={cn("bg-surface border border-border rounded-card p-5 shadow-sm flex flex-col", className)}>
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text">{title}</h3>
            {badge && <Badge variant={badge} tooltip={badgeTooltip} />}
          </div>
          {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        {children}
      </div>

      {summaryText && (
        <div className="mt-4 pt-3 border-t border-border/60 text-xs text-muted flex items-start gap-2">
          <span className="font-semibold text-text">Insight:</span>
          <span>{summaryText}</span>
        </div>
      )}
    </div>
  );
}

