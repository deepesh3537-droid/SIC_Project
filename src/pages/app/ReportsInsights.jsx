import React, { useState, useEffect } from 'react';
import { 
  FileBarChart, 
  Download, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Flame, 
  Wind, 
  Bot, 
  RefreshCw,
  SlidersHorizontal,
  Table,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/utils.js';

export default function ReportsInsights() {
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchReports = async (tf = timeframe) => {
    try {
      setError(null);
      const res = await api.get(`/reports?timeframe=${tf}`);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load report data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch reporting data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports(timeframe);
  }, [timeframe]);

  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
    setLoading(true);
  };

  const handleExport = async (format) => {
    try {
      setExporting(true);
      const res = await api.get(`/reports/export?format=${format}&type=${timeframe}`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wattwise_${timeframe}_report.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to download report export');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports & Insights" subtitle="Compiling deterministic energy ledgers and appliance audits..." />
        <LoadingState message="Aggregating periodic ledgers and export tables..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Reports & Insights" subtitle="Reporting Engine Status" />
        <ErrorState title="Report Generation Error" message={error} onRetry={() => fetchReports(timeframe)} />
      </div>
    );
  }

  const {
    summary = {},
    timeSeries = [],
    applianceBreakdown = [],
    recommendationHistory = []
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Reports & Insights"
        subtitle="Periodic energy accounts, device submeter breakdown, recommendation audit history, and export center"
        badge={<Badge variant="Measured" label="Verified Accounting" />}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border text-xs">
              <button
                onClick={() => handleTimeframeChange('monthly')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeframe === 'monthly' ? 'bg-primary text-black font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleTimeframeChange('weekly')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeframe === 'weekly' ? 'bg-primary text-black font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleTimeframeChange('daily')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeframe === 'daily' ? 'bg-primary text-black font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                Daily (Last 60d)
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
            >
              <FileCode className="w-3.5 h-3.5 text-sky-400" />
              Export JSON
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`Total Energy (${timeframe})`}
          value={formatKwh(summary.totalEnergyKwh)}
          subvalue={`${summary.recordsCount || 0} ${timeframe} ledger rows`}
          icon={Zap}
          badge={<Badge variant="Measured" label="Verified" />}
        />
        <StatCard
          title={`Total Cost (${timeframe})`}
          value={formatCurrency(summary.totalCostUsd)}
          subvalue="TOU-weighted billing ledger"
          icon={TrendingUp}
          badge={<Badge variant="Measured" label="Utility Ledger" />}
        />
        <StatCard
          title="Peak Tariff Volume"
          value={formatKwh(summary.peakKwh)}
          subvalue={`${summary.peakPercentage}% billed at $0.22/kWh`}
          icon={Clock}
          badge={<Badge variant="Measured" label="Peak Tariff" />}
        />
        <StatCard
          title="Off-Peak Volume"
          value={formatKwh(summary.offPeakKwh)}
          subvalue="Billed at $0.10/kWh off-peak"
          icon={Calendar}
          badge={<Badge variant="Measured" label="Off-Peak" />}
        />
      </div>

      {/* Periodic Energy & Cost Bar Chart */}
      <ChartCard
        title={`${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Consumption & Cost Trajectory`}
        subtitle="Energy volume (kWh) and associated cost ($) across the reporting period"
        badge={<Badge variant="Measured" label="Deterministic Ledger" />}
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeSeries} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22272e" />
              <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
              <YAxis yAxisId="left" stroke="#6b7280" fontSize={11} unit=" kWh" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={11} unit=" $" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg text-xs space-y-1">
                        <div className="font-semibold text-text">{d.label}</div>
                        <div className="text-muted">Total Energy: <span className="font-mono font-bold text-primary">{formatKwh(d.totalKwh)}</span></div>
                        <div className="text-muted">Cost: <span className="font-mono font-bold text-emerald-400">{formatCurrency(d.totalCostUsd)}</span></div>
                        <div className="text-muted">Peak: <span className="font-mono text-text">{formatKwh(d.peakKwh)}</span></div>
                        <div className="text-muted">Off-Peak: <span className="font-mono text-text">{formatKwh(d.offPeakKwh)}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar yAxisId="left" dataKey="totalKwh" name="Energy (kWh)" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="totalCostUsd" name="Cost ($)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Grid: Periodic Ledger Table & Appliance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Periodic Ledger Table */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Detailed Periodic Ledger</h3>
              <p className="text-xs text-muted">Numerical energy accounting and tariff period split</p>
            </div>
            <Badge variant="Measured" label={`${timeSeries.length} Records`} />
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-muted border-b border-border sticky top-0">
                <tr>
                  <th className="py-2.5 px-3 font-medium">Period</th>
                  <th className="py-2.5 px-3 font-medium">Total (kWh)</th>
                  <th className="py-2.5 px-3 font-medium">Peak (kWh)</th>
                  <th className="py-2.5 px-3 font-medium">Off-Peak (kWh)</th>
                  <th className="py-2.5 px-3 font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {timeSeries.map((row) => (
                  <tr key={row.period} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-text">{row.label}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-primary">{formatKwh(row.totalKwh)}</td>
                    <td className="py-2.5 px-3 font-mono text-muted">{formatKwh(row.peakKwh)}</td>
                    <td className="py-2.5 px-3 font-mono text-muted">{formatKwh(row.offPeakKwh)}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">{formatCurrency(row.totalCostUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appliance Share Matrix */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Appliance Submeter Split</h3>
              <p className="text-xs text-muted">Cumulative share of household load</p>
            </div>
            <Badge variant="Measured" label="Submetered" />
          </div>

          <div className="space-y-3 pt-1">
            {applianceBreakdown.map((app) => (
              <div key={app.appliance} className="bg-surface-2 p-3.5 rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-text">{app.appliance}</span>
                  <span className="font-mono font-bold text-primary text-xs">{app.sharePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.min(app.sharePercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Consumption:</span>
                  <span className="font-mono text-text">{formatKwh(app.totalKwh)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation & Automation Audit Trail Table */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm">Recommendation & Automation Audit Trail</h3>
            <p className="text-xs text-muted">Governance lifecycle of AI-suggested rules, approvals, and activations</p>
          </div>
          <Badge variant="Audited" label="Human-in-the-Loop" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted border-b border-border">
              <tr>
                <th className="py-2.5 px-3 font-medium">Rule ID</th>
                <th className="py-2.5 px-3 font-medium">Name</th>
                <th className="py-2.5 px-3 font-medium">Trigger Condition</th>
                <th className="py-2.5 px-3 font-medium">Action Taken</th>
                <th className="py-2.5 px-3 font-medium">Governance Status</th>
                <th className="py-2.5 px-3 font-medium">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recommendationHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-primary">{rec.ruleId}</td>
                  <td className="py-3 px-3 font-medium text-text">{rec.ruleName}</td>
                  <td className="py-3 px-3 font-mono text-muted max-w-xs truncate">{rec.triggerCondition}</td>
                  <td className="py-3 px-3 text-muted max-w-xs truncate">{rec.action}</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                      rec.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : rec.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : rec.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-muted/10 text-muted border-border'
                    }`}>
                      {rec.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                      {rec.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {rec.status === 'pending' && <Clock className="w-3 h-3" />}
                      {rec.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted font-mono">{new Date(rec.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

