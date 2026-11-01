import React, { useState, useEffect } from 'react';
import { 
  History, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  RefreshCw,
  Send,
  Sliders,
  Filter
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatCurrency } from '../../lib/utils.js';

export default function AutomationHistory() {
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState(null);
  const [submittedIds, setSubmittedIds] = useState({});
  const [ruleFilter, setRuleFilter] = useState('ALL');

  const fetchData = async () => {
    try {
      setError(null);
      const [histRes, suggRes] = await Promise.all([
        api.get('/automations/history'),
        api.get('/automations/suggestions')
      ]);
      setHistory(histRes.data?.history || []);
      setSuggestions(suggRes.data?.suggestions || []);
    } catch (err) {
      console.error('Failed to load automation history:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch automation audit logs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleAdoptSuggestion = async (sugg) => {
    try {
      setSubmittingId(sugg.id);
      await api.post('/automations', {
        name: sugg.name,
        description: sugg.description,
        triggerCondition: sugg.triggerCondition,
        action: sugg.action,
        ruleId: 'SUGG-' + Date.now().toString().slice(-4)
      });
      setSubmittedIds(prev => ({ ...prev, [sugg.id]: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit suggested automation for approval');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Automation History" subtitle="Compiling execution audit trails and pattern suggestions..." />
        <LoadingState message="Fetching automation logs and opportunity models..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Automation History" subtitle="Automation Logs Status" />
        <ErrorState title="History Query Error" message={error} onRetry={fetchData} />
      </div>
    );
  }

  const filteredHistory = ruleFilter === 'ALL'
    ? history
    : history.filter(h => h.rule_id === ruleFilter);

  const totalLoggedSavings = history.reduce((sum, h) => sum + parseFloat(h.savings_usd || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Automation History & AI Opportunity Discovery"
        subtitle="Chronological audit trail of rule triggers, recorded savings, and AI-suggested automations derived from data patterns"
        badge={<Badge variant="Audited" label="PostgreSQL Audit Ledger" />}
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recorded Automation Triggers"
          value={history.length}
          subvalue="Logged event triggers"
          icon={History}
          badge={<Badge variant="Measured" label="Verified" />}
        />
        <StatCard
          title="Cumulative Realized Savings"
          value={formatCurrency(totalLoggedSavings)}
          subvalue="Logged action impacts"
          icon={DollarSign}
          badge={<Badge variant="Measured" label="Audit Savings" />}
        />
        <StatCard
          title="Discovered Opportunities"
          value={suggestions.length}
          subvalue="High-confidence candidates"
          icon={Sparkles}
          badge={<Badge variant="Estimated" label="AI Suggested" />}
        />
        <StatCard
          title="Potential Extra Savings"
          value={`$${suggestions.reduce((sum, s) => sum + s.estimatedMonthlySavingsUsd, 0).toFixed(2)}/mo`}
          subvalue="From suggested rules"
          icon={TrendingUp}
          badge={<Badge variant="Estimated" label="Opportunity" />}
        />
      </div>

      {/* Section 1: AI-Suggested Rules from Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Suggested Automations from Telemetry Opportunities
            </h3>
            <p className="text-xs text-muted">Discovered habits with high mathematical savings potential</p>
          </div>
          <Badge variant="Estimated" label="Data-Backed Suggestions" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((sugg) => {
            const isSubmitted = submittedIds[sugg.id];
            const isSubmitting = submittingId === sugg.id;

            return (
              <div key={sugg.id} className="bg-surface border border-border rounded-xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-mono font-bold text-primary">
                      {Math.round(sugg.confidenceScore * 100)}% Confidence
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +${sugg.estimatedMonthlySavingsUsd}/mo
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-text mt-3">{sugg.name}</h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{sugg.description}</p>

                  <div className="mt-3 p-2.5 rounded-lg bg-surface-2 border border-border font-mono text-[11px] text-text space-y-1">
                    <div className="text-muted text-[10px] uppercase">IF Condition:</div>
                    <div className="truncate">{sugg.triggerCondition}</div>
                  </div>

                  <div className="mt-2 text-[11px] text-muted flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{sugg.origin}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <Badge variant={sugg.badge} label={sugg.badge} />
                  <button
                    onClick={() => handleAdoptSuggestion(sugg)}
                    disabled={isSubmitted || isSubmitting}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isSubmitted 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-primary text-black hover:bg-primary-hover shadow-sm disabled:opacity-50'
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Queued for Approval
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        {isSubmitting ? 'Submitting...' : 'Queue for Approval'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Chronological Execution History Table */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-text text-sm">Execution History Ledger</h3>
            <p className="text-xs text-muted">Complete chronological record of all automated triggers and outcomes</p>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs">
            {['ALL', 'R1', 'R2', 'R3'].map((r) => (
              <button
                key={r}
                onClick={() => setRuleFilter(r)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  ruleFilter === r ? 'bg-primary text-black font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                {r === 'ALL' ? 'All Rules' : `Rule ${r}`}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Triggered At</th>
                  <th className="py-2.5 px-3 font-medium">Rule</th>
                  <th className="py-2.5 px-3 font-medium">Action Taken</th>
                  <th className="py-2.5 px-3 font-medium">Realized Savings</th>
                  <th className="py-2.5 px-3 font-medium">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted whitespace-nowrap">
                      {new Date(item.triggered_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {item.rule_id}
                    </td>
                    <td className="py-3 px-3 text-text max-w-md">
                      {item.action_taken}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                      {item.savings_usd ? `+$${parseFloat(item.savings_usd).toFixed(2)}` : 'Advisory'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Executed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-muted">
            No execution logs found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

