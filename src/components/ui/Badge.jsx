import React from 'react';
import { cn } from '../../lib/utils.js';

/**
 * Data-quality badge component adhering strictly to DESIGN.md.
 * Variants: Measured (neutral), Simulated (info dashed), Estimated (amber), Assumption (violet outline).
 */
export default function Badge({ variant = 'Measured', label, tooltip, className }) {
  const displayLabel = label || variant;

  const variantStyles = {
    Measured: 'bg-surface-2 text-text border border-border',
    Simulated: 'bg-info/10 text-info border border-dashed border-info/40',
    Estimated: 'bg-warning/10 text-warning border border-warning/30',
    Assumption: 'bg-rule-r3/10 text-rule-r3 border border-rule-r3/40',
    Active: 'bg-primary/10 text-primary border border-primary/30',
    Pending: 'bg-warning/10 text-warning border border-warning/30',
    Disabled: 'bg-surface-2 text-muted border border-border',
    Rejected: 'bg-danger/10 text-danger border border-danger/30'
  };

  const currentStyle = variantStyles[variant] || variantStyles.Measured;

  return (
    <span
      title={tooltip || `Data classification: ${variant}`}
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono tracking-tight font-medium cursor-help",
        currentStyle,
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

