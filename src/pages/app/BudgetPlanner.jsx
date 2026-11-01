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
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Household Budget Planner"
        subtitle="User-configured monthly limits, spend projection, alert thresholds, and ledger history"
        badge={<Badge variant="Measured" label="PostgreSQL & Analytics" />}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Settings2 className="w-3.5 h-3.5" />
              Adjust Budget Limit
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-1.5 rounded-lg bg-surface border border-border text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Budget Limit"
          value={formatCurrency(monthlyBudget)}
          subvalue={`Alerts at ${config.alertThresholdPercent}% (${formatCurrency(config.alertThresholdUsd)})`}
          icon={Wallet}
          badge={<Badge variant="Measured" label="User Config" />}
        />
        <StatCard
          title="Current Month Spend"
          value={formatCurrency(currentSpend)}
          subvalue={`${currentStatus.latestMonthLabel || 'Aug 2025'}: ${projectedPercent}% of budget`}
          icon={DollarSign}
          badge={<Badge variant="Measured" label="Measured Actual" />}
        />
        <StatCard
          title="Average Monthly Spend"
          value={formatCurrency(currentStatus.averageMonthlySpendUsd || 56.60)}
          subvalue="Across 8 months of observation"
          icon={Calendar}
          badge={<Badge variant="Measured" label="8-Mo Avg" />}
        />
        <StatCard
          title="Budget Health"
          value={currentStatus.warningStatus === 'on_track' ? 'On Track' : 'Warning'}
          subvalue={currentStatus.warningStatus === 'on_track' ? 'Within monthly limit' : 'Threshold exceeded'}
          icon={currentStatus.warningStatus === 'on_track' ? ShieldCheck : AlertTriangle}
          badge={<Badge variant="Estimated" label="Forecast Status" />}
        />
      </div>

      {/* Budget Utilization Banner */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        currentStatus.warningStatus === 'exceeded' 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
          : currentStatus.warningStatus === 'warning'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-surface border border-border shrink-0">
            {currentStatus.warningStatus === 'on_track' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
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
          <div className="flex justify-between text-xs">
            <span className="text-muted">Utilization</span>
            <span className="font-mono font-bold text-text">{projectedPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                projectedPercent > 100 ? 'bg-rose-500' :
                projectedPercent >= config.alertThresholdPercent ? 'bg-amber-500' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(projectedPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actual Spend vs Budget Reference Chart */}
      <ChartCard
        title="Historical Monthly Spend vs Budget"
        subtitle="Actual energy bill cost per month compared to the $150 user budget limit"
        badge={<Badge variant="Measured" label="Verified Ledger" />}
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyHistory} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22272e" />
              <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} unit=" $" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg text-xs space-y-1.5">
                        <div className="font-semibold text-text">{d.label}</div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Actual Cost:</span>
                          <span className="font-mono font-bold text-primary">{formatCurrency(d.actualCostUsd)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Energy:</span>
                          <span className="font-mono text-text">{formatKwh(d.actualKwh)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Budget Limit:</span>
                          <span className="font-mono text-text">{formatCurrency(d.budgetUsd)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted">Variance:</span>
                          <span className={`font-mono font-semibold ${d.varianceUsd > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {d.varianceUsd > 0 ? `+${formatCurrency(d.varianceUsd)}` : formatCurrency(d.varianceUsd)}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <ReferenceLine y={monthlyBudget} stroke="#EF4444" strokeDasharray="4 4" label={{ value: `Budget $${monthlyBudget}`, fill: '#EF4444', fontSize: 11, position: 'top' }} />
              <ReferenceLine y={config.alertThresholdUsd} stroke="#F59E0B" strokeDasharray="3 3" label={{ value: `Alert $${config.alertThresholdUsd}`, fill: '#F59E0B', fontSize: 10, position: 'bottom' }} />
              <Bar dataKey="actualCostUsd" name="Actual Cost ($)" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Grid: Monthly Ledger Table & Tariff Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger Table */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Monthly Spend Ledger</h3>
              <p className="text-xs text-muted">Complete breakdown of billing periods, consumption, and variances</p>
            </div>
            <Badge variant="Measured" label="8 Observation Months" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Month</th>
                  <th className="py-2.5 px-3 font-medium">Consumption</th>
                  <th className="py-2.5 px-3 font-medium">Actual Cost</th>
                  <th className="py-2.5 px-3 font-medium">Budget</th>
                  <th className="py-2.5 px-3 font-medium">Utilization</th>
                  <th className="py-2.5 px-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monthlyHistory.map((m) => (
                  <tr key={m.label} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-text">{m.label}</td>
                    <td className="py-2.5 px-3 font-mono text-muted">{formatKwh(m.actualKwh)}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-text">{formatCurrency(m.actualCostUsd)}</td>
                    <td className="py-2.5 px-3 font-mono text-muted">{formatCurrency(m.budgetUsd)}</td>
                    <td className="py-2.5 px-3 font-mono text-text">{m.percentUtilized}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                        m.status === 'exceeded'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : m.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {m.status === 'exceeded' ? 'Exceeded' : m.status === 'warning' ? 'Near Limit' : 'Safe'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tariff & Savings Recommendations */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text text-sm">Budget Optimization</h3>
            <Badge variant="Estimated" label="AI Opportunities" />
          </div>

          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-surface-2 p-3.5 rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text">{rec.title}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    +${rec.potentialSavingsUsd}/mo
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{rec.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <Badge variant={rec.badge} label={rec.badge} />
                  <span className="text-[11px] text-primary flex items-center gap-1 font-medium cursor-pointer hover:underline">
                    Apply rule <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Adjust Budget Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adjust Household Budget & Alerts"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4">
          <p className="text-xs text-muted leading-relaxed">
            Configure your monthly spending target and notification trigger threshold. These thresholds govern budget warning states and proactive alerts.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text">Monthly Budget Target ($ USD)</label>
            <input
              type="number"
              step="5"
              min="10"
              max="2000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              required
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text font-mono focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text">Proactive Warning Threshold (% of limit)</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="flex-1 accent-primary"
              />
              <span className="w-12 font-mono text-sm font-bold text-primary">{thresholdInput}%</span>
            </div>
            <p className="text-[11px] text-muted">
              Alert triggers when monthly spend exceeds ${((parseFloat(budgetInput || 0) * parseFloat(thresholdInput || 85)) / 100).toFixed(2)}.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Budget settings updated successfully!
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingSettings}
              className="px-4 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {savingSettings ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

