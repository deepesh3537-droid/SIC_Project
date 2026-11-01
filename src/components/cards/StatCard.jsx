import React from 'react';
import Badge from '../ui/Badge.jsx';
import { cn } from '../../lib/utils.js';

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  badge = 'Measured',
  badgeTooltip,
  accent = 'primary',
  className
}) {
  const accentBorders = {
    primary: 'hover:border-primary/40',
    warning: 'hover:border-warning/40',
    info: 'hover:border-info/40',
    danger: 'hover:border-danger/40'
  };

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-card p-5 transition-all duration-200 relative overflow-hidden group shadow-sm",
        accentBorders[accent] || accentBorders.primary,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-2">
          {badge && <Badge variant={badge} tooltip={badgeTooltip} />}
          {Icon && (
            <div className="p-1.5 rounded-lg bg-surface-2 border border-border text-primary group-hover:text-primary-soft transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 mt-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-text">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-muted">{unit}</span>}
      </div>

      {subtitle && (
        <p className="text-xs text-muted mt-2 border-t border-border/50 pt-2">{subtitle}</p>
      )}
    </div>
  );
}

