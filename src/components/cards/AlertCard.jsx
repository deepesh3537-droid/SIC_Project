import React from 'react';
import Badge from '../ui/Badge.jsx';
import { AlertCircle, Lightbulb, CheckCircle2, Bot } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function AlertCard({ alert, onMarkRead }) {
  const {
    id,
    rule_id,
    rule_name,
    alert_message,
    tailored_tip,
    reading_context,
    reading_timestamp,
    is_read,
    is_simulated
  } = alert;

  const ruleAccents = {
    R1: {
      border: 'border-l-4 border-l-rule-r1',
      badge: 'text-rule-r1 bg-rule-r1/10 border-rule-r1/30',
      dot: 'bg-rule-r1'
    },
    R2: {
      border: 'border-l-4 border-l-rule-r2',
      badge: 'text-rule-r2 bg-rule-r2/10 border-rule-r2/30',
      dot: 'bg-rule-r2'
    },
    R3: {
      border: 'border-l-4 border-l-rule-r3',
      badge: 'text-rule-r3 bg-rule-r3/10 border-rule-r3/30',
      dot: 'bg-rule-r3'
    }
  };

  const accent = ruleAccents[rule_id] || ruleAccents.R1;

  // Context parser
  const parsedContext = typeof reading_context === 'string' 
    ? JSON.parse(reading_context) 
    : (reading_context || {});

  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-card p-5 shadow-sm transition-all duration-150",
        accent.border,
        is_read && "opacity-75"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-bold border", accent.badge)}>
            {rule_id}
          </span>
          <h4 className="text-sm font-semibold text-text">{rule_name}</h4>
          <Badge variant={is_simulated ? 'Simulated' : 'Measured'} />
          {is_read && (
            <span className="text-[11px] text-muted font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-primary" /> Read
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-muted whitespace-nowrap">
          {reading_timestamp}
        </span>
      </div>

      {/* Section 1: Rule-detected condition */}
      <div className="mb-3 p-3 rounded-lg bg-surface-2 border border-border/80 text-xs">
        <div className="flex items-center gap-1.5 text-muted font-semibold uppercase text-[10px] tracking-wider mb-1">
          <AlertCircle className="w-3.5 h-3.5 text-warning" />
          <span>Rule-Detected Condition</span>
        </div>
        <p className="text-text leading-relaxed">{alert_message}</p>

        {/* Snapshot metrics */}
        {Object.keys(parsedContext).length > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-3 font-mono text-[11px] text-muted">
            {Object.entries(parsedContext).map(([k, v]) => (
              <span key={k}>
                <span className="text-muted/80">{k.replace(/_/g, ' ')}:</span>{' '}
                <span className="text-text font-medium">{String(v)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: AI / Deterministic advice */}
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-primary tracking-wider mb-0.5">
            <span>Tailored Energy Coach Tip</span>
            <span className="text-muted font-mono font-normal">(Deterministic Fallback)</span>
          </div>
          <p className="text-text leading-relaxed">{tailored_tip}</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
        <a
          href={`/app/coach?alertId=${id}`}
          className="text-xs text-primary hover:text-primary-soft hover:underline font-medium flex items-center gap-1.5"
        >
          <Bot className="w-3.5 h-3.5 text-primary" />
          <span>Ask Coach to explain</span>
        </a>

        {!is_read && onMarkRead && (
          <button
            onClick={() => onMarkRead(id)}
            className="text-xs text-muted hover:text-text hover:underline font-medium flex items-center gap-1"
          >
            Mark as resolved
          </button>
        )}
      </div>
    </div>
  );
}

