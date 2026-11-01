import React from 'react';
import Badge from '../ui/Badge.jsx';
import { Play, Pause, Check, X, ShieldAlert, Cpu } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function AutomationCard({ automation, onApprove, onReject, onEnable, onDisable }) {
  const {
    id,
    rule_id,
    name,
    description,
    trigger_condition,
    action,
    status
  } = automation;

  const statusVariants = {
    pending: 'Pending',
    active: 'Active',
    disabled: 'Disabled',
    rejected: 'Rejected'
  };

  return (
    <div className="bg-surface border border-border rounded-card p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-xs font-mono font-bold text-text">
              {rule_id}
            </span>
            <h4 className="text-sm font-semibold text-text">{name}</h4>
          </div>
          <Badge variant={statusVariants[status] || 'Measured'} />
        </div>

        {description && (
          <p className="text-xs text-muted mb-3">{description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="p-2.5 rounded-lg bg-surface-2 border border-border/80 text-xs font-mono">
            <span className="text-warning font-semibold">IF: </span>
            <span className="text-text">{trigger_condition}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-surface-2 border border-border/80 text-xs font-mono">
            <span className="text-primary font-semibold">THEN: </span>
            <span className="text-text">{action}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons adhering to User Approval Gate */}
      <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
        {status === 'pending' && (
          <>
            {onReject && (
              <button
                onClick={() => onReject(id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 border border-danger/30 transition-colors flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
            )}
            {onApprove && (
              <button
                onClick={() => onApprove(id)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-dark text-bg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Approve & Enable
              </button>
            )}
          </>
        )}

        {status === 'active' && onDisable && (
          <button
            onClick={() => onDisable(id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-text bg-surface-2 hover:bg-border border border-border transition-colors flex items-center gap-1.5"
          >
            <Pause className="w-3.5 h-3.5" /> Disable
          </button>
        )}

        {status === 'disabled' && onEnable && (
          <button
            onClick={() => onEnable(id)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary-dark text-bg transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" /> Enable
          </button>
        )}
      </div>
    </div>
  );
}

