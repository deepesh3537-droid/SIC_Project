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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Automation History & AI Opportunities"
        subtitle="Chronological audit trail of rule triggers, recorded savings, and AI-suggested automations derived from data patterns"
        badge={<Badge variant="Audited" label="PostgreSQL Audit Ledger" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Logs'}</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recorded Triggers"
          value={history.length}
          subtitle="Logged event triggers"
          icon={History}
          badge="Measured"
          accent="primary"
        />
        <StatCard
          title="Cumulative Realized Savings"
          value={formatCurrency(totalLoggedSavings)}
          subtitle="Logged action impacts"
          icon={DollarSign}
          badge="Measured"
          accent="info"
        />
        <StatCard
          title="Discovered Opportunities"
          value={suggestions.length}
          subtitle="High-confidence candidates"
          icon={Sparkles}
          badge="Estimated"
          accent="warning"
        />
        <StatCard
          title="Potential Extra Savings"
          value={`$${suggestions.reduce((sum, s) => sum + s.estimatedMonthlySavingsUsd, 0).toFixed(2)}/mo`}
          subtitle="From suggested rules"
          icon={TrendingUp}
          badge="Estimated"
          accent="primary"
        />
      </div>

      {/* Section 1: AI-Suggested Rules from Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>AI-Suggested Automations from Telemetry Opportunities</span>
            </h3>
            <p className="text-xs text-muted font-mono">Discovered habits with high mathematical savings potential</p>
          </div>
          <Badge variant="Estimated" label="Data-Backed Suggestions" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suggestions.map((sugg) => {
            const isSubmitted = submittedIds[sugg.id];
            const isSubmitting = submittingId === sugg.id;

            return (
              <div 
                key={sugg.id} 
                className="bg-surface border border-border rounded-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
              >
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
                    <div className="truncate text-primary">{sugg.triggerCondition}</div>
                  </div>

                  <div className="mt-2 text-[11px] text-muted flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{sugg.origin}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <Badge variant={sugg.badge || 'Estimated'} label={sugg.badge} />
                  <button
                    onClick={() => handleAdoptSuggestion(sugg)}
                    disabled={isSubmitted || isSubmitting}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSubmitted
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'bg-primary text-black hover:bg-primary-hover shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                    }`}
                  >
                    {isSubmitted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Execution Audit Trail Table with Filter */}
      <div className="bg-surface border border-border rounded-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              <span>Immutable Execution Audit Trail</span>
            </h3>
            <Badge variant="Audited" label={`${filteredHistory.length} Events`} />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs font-mono">
            {['ALL', 'R1', 'R2', 'R3'].map(rf => (
              <button
                key={rf}
                onClick={() => setRuleFilter(rf)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  ruleFilter === rf
                    ? 'bg-primary text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                    : 'text-muted hover:text-text'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <EmptyState
            title="No Matching Audit Events"
            description="No automation actuations recorded for the selected filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted uppercase text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Rule ID</th>
                  <th className="py-2.5 px-3">Action Executed</th>
                  <th className="py-2.5 px-3">Triggered Reading</th>
                  <th className="py-2.5 px-3">Recorded Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text">
                {filteredHistory.map(item => (
                  <tr key={item.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap text-muted">{item.created_at}</td>
                    <td className="py-2.5 px-3 font-bold text-primary">{item.rule_id || 'R1'}</td>
                    <td className="py-2.5 px-3 capitalize">{item.action_taken}</td>
                    <td className="py-2.5 px-3 text-muted">{item.reading_timestamp || 'N/A'}</td>
                    <td className="py-2.5 px-3 text-primary">
                      {item.energy_saved_kwh ? `${item.energy_saved_kwh} kWh` : '$0.00 saved'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
