import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Settings2, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign,
  Sparkles,
  RefreshCw,
  Sliders,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/utils.js';

export default function BudgetPlanner() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Budget settings modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');
  const [thresholdInput, setThresholdInput] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchBudgetData = async () => {
    try {
      setError(null);
      const res = await api.get('/budget');
      setData(res.data);
      if (res.data?.config) {
        setBudgetInput(String(res.data.config.monthlyBudgetUsd || 150));
        setThresholdInput(String(res.data.config.alertThresholdPercent || 85));
      }
    } catch (err) {
      console.error('Failed to load budget data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch budget configuration');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBudgetData();
  };

  const handleSaveBudget = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await api.patch('/budget', {
        monthlyBudgetUsd: parseFloat(budgetInput),
        alertThresholdPercent: parseFloat(thresholdInput)
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsModalOpen(false);
      }, 800);
      await fetchBudgetData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update budget settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Budget Planner" subtitle="Analyzing monthly energy spending and forecast models..." />
        <LoadingState message="Fetching budget configuration and monthly ledger..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Budget Planner" subtitle="Budget Management Status" />
        <ErrorState title="Budget Load Error" message={error} onRetry={fetchBudgetData} />
      </div>
    );
  }

  const { config = {}, currentStatus = {}, monthlyHistory = [], recommendations = [] } = data || {};
  const monthlyBudget = config.monthlyBudgetUsd || 150;
  const currentSpend = currentStatus.currentSpendUsd || 69.96;
  const projectedPercent = currentStatus.projectedPercent || 46.6;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Household Budget Planner"
        subtitle="User-configured monthly limits, spend projection, alert thresholds, and ledger history"
        badge={<Badge variant="Measured" label="PostgreSQL & Analytics" />}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors shadow-[0_0_12px_rgba(34,211,238,0.2)]"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Adjust Budget Limit</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-text hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Budget Limit"
          value={formatCurrency(monthlyBudget)}
          subtitle={`Alerts at ${config.alertThresholdPercent}% (${formatCurrency(config.alertThresholdUsd)})`}
          icon={Wallet}
          badge="Measured"
          accent="primary"
        />
        <StatCard
          title="Current Month Spend"
          value={formatCurrency(currentSpend)}
          subtitle={`${currentStatus.latestMonthLabel || 'Aug 2025'}: ${projectedPercent}% of budget`}
          icon={DollarSign}
          badge="Measured"
          accent="info"
        />
        <StatCard
          title="Average Monthly Spend"
          value={formatCurrency(currentStatus.averageMonthlySpendUsd || 56.60)}
          subtitle="Across 8 months of observation"
          icon={Calendar}
          badge="Measured"
          accent="primary"
        />
        <StatCard
          title="Budget Health"
          value={currentStatus.warningStatus === 'on_track' ? 'On Track' : 'Warning'}
          subtitle={currentStatus.warningStatus === 'on_track' ? 'Within monthly limit' : 'Threshold exceeded'}
          icon={currentStatus.warningStatus === 'on_track' ? ShieldCheck : AlertTriangle}
          badge="Estimated"
          accent={currentStatus.warningStatus === 'on_track' ? 'primary' : 'warning'}
        />
      </div>

      {/* Budget Utilization Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        currentStatus.warningStatus === 'exceeded' 
          ? 'bg-danger/10 border-danger/30 text-danger' 
          : currentStatus.warningStatus === 'warning'
          ? 'bg-warning/10 border-warning/30 text-warning'
          : 'bg-surface border-border text-text'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-surface-2 border border-border shrink-0">
            {currentStatus.warningStatus === 'on_track' ? (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-warning" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-text">Budget Health: {currentStatus.warningMessage}</h4>
            <p className="text-xs text-muted mt-0.5">
              Configured threshold: <strong className="text-text font-mono">{config.alertThresholdPercent}%</strong> ({formatCurrency(config.alertThresholdUsd)}).
            </p>
          </div>
        </div>

        <div className="w-full md:w-56 space-y-1.5 shrink-0">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Utilization</span>
            <span className="font-bold text-text">{projectedPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden border border-border">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                projectedPercent > 100 ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                projectedPercent >= config.alertThresholdPercent ? 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.5)]'
              }`}
              style={{ width: `${Math.min(projectedPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actual Spend vs Budget Reference Chart */}
      <ChartCard
        title="Historical Monthly Spend vs Budget"
        subtitle={`Actual energy bill cost per month compared to the ${formatCurrency(monthlyBudget)} user budget limit`}
        badge="Measured"
        badgeTooltip="Verified ledger across observation window"
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" />
              <XAxis dataKey="label" stroke="#8FA1A8" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#8FA1A8" fontSize={10} fontFamily="monospace" unit=" $" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl text-xs font-mono space-y-1.5">
                        <div className="font-semibold text-text border-b border-border/60 pb-1">{d.label}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Actual Cost:</span>
                          <span className="font-bold text-primary">{formatCurrency(d.actualCostUsd)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Energy:</span>
                          <span className="text-text">{formatKwh(d.actualKwh)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Budget Limit:</span>
                          <span className="text-text">{formatCurrency(d.budgetUsd)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={monthlyBudget} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Budget Limit', fill: '#EF4444', fontSize: 10 }} />
              <Bar dataKey="actualCostUsd" name="Actual Spend" fill="#22D3EE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Adjust Budget Settings Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Monthly Energy Budget"
        description="Set your target household utility ceiling and alert sensitivity"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text">Monthly Budget Target ($)</label>
            <input
              type="number"
              min="20"
              max="1000"
              step="5"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              required
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text">Alert Threshold Sensitivity (%)</label>
            <input
              type="number"
              min="50"
              max="100"
              step="5"
              value={thresholdInput}
              onChange={(e) => setThresholdInput(e.target.value)}
              required
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2 text-xs text-text focus:outline-none focus:border-primary font-mono"
            />
            <p className="text-[11px] text-muted">Triggers a proactive warning alert when spend reaches this percentage of your ceiling.</p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Budget settings saved successfully!</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-text hover:bg-surface text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2 rounded-lg bg-primary text-black font-semibold text-xs hover:bg-primary-hover shadow-sm disabled:opacity-50"
            >
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
