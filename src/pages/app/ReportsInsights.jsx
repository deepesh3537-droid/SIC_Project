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
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Reports & Insights"
        subtitle="Periodic energy accounts, device submeter breakdown, recommendation audit history, and export center"
        badge={<Badge variant="Measured" label="Verified Accounting" />}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-[#091019] p-1 rounded-xl border border-[#1F334D] text-xs">
              <button
                onClick={() => handleTimeframeChange('monthly')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleTimeframeChange('weekly')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeframe === 'weekly'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => handleTimeframeChange('daily')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeframe === 'daily'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Daily (60d)
              </button>
            </div>

            {/* Export Buttons */}
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D1520] border border-[#1F334D] text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-500/40 hover:bg-[#142338] transition-all shadow-sm disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              disabled={exporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0D1520] border border-[#1F334D] text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/40 hover:bg-[#142338] transition-all shadow-sm disabled:opacity-50"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" opacity={0.6} />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#64748B" fontSize={11} unit=" kWh" tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={11} unit=" $" tickLine={false} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0B131E]/95 border border-[#1F334D] p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                        <div className="font-semibold text-slate-100">{d.label}</div>
                        <div className="text-slate-400">Total Energy: <span className="font-mono font-bold text-cyan-400">{formatKwh(d.totalKwh)}</span></div>
                        <div className="text-slate-400">Cost: <span className="font-mono font-bold text-emerald-400">{formatCurrency(d.totalCostUsd)}</span></div>
                        <div className="text-slate-400">Peak: <span className="font-mono text-slate-200">{formatKwh(d.peakKwh)}</span></div>
                        <div className="text-slate-400">Off-Peak: <span className="font-mono text-slate-200">{formatKwh(d.offPeakKwh)}</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <Bar yAxisId="left" dataKey="totalKwh" name="Energy (kWh)" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="totalCostUsd" name="Cost ($)" fill="#22D3EE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Grid: Periodic Ledger Table & Appliance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Periodic Ledger Table */}
        <div className="lg:col-span-2 bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Detailed Periodic Ledger</h3>
              <p className="text-xs text-slate-400 mt-0.5">Numerical energy accounting and tariff period split</p>
            </div>
            <Badge variant="Measured" label={`${timeSeries.length} Records`} />
          </div>

          <div className="overflow-x-auto max-h-96 rounded-xl border border-[#1F334D]/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#091019] text-slate-400 border-b border-[#1F334D] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3.5 font-semibold">Period</th>
                  <th className="py-2.5 px-3.5 font-semibold">Total (kWh)</th>
                  <th className="py-2.5 px-3.5 font-semibold">Peak (kWh)</th>
                  <th className="py-2.5 px-3.5 font-semibold">Off-Peak (kWh)</th>
                  <th className="py-2.5 px-3.5 font-semibold">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F334D]/50 bg-[#0B131E]/40">
                {timeSeries.map((row) => (
                  <tr key={row.period} className="hover:bg-[#142338]/60 transition-colors">
                    <td className="py-2.5 px-3.5 font-medium text-slate-200">{row.label}</td>
                    <td className="py-2.5 px-3.5 font-mono font-bold text-cyan-400">{formatKwh(row.totalKwh)}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-400">{formatKwh(row.peakKwh)}</td>
                    <td className="py-2.5 px-3.5 font-mono text-slate-400">{formatKwh(row.offPeakKwh)}</td>
                    <td className="py-2.5 px-3.5 font-mono font-bold text-emerald-400">{formatCurrency(row.totalCostUsd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Appliance Share Matrix */}
        <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Appliance Submeter Split</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cumulative share of household load</p>
            </div>
            <Badge variant="Measured" label="Submetered" />
          </div>

          <div className="space-y-3 pt-1">
            {applianceBreakdown.map((app) => (
              <div key={app.appliance} className="bg-[#091019]/80 p-3.5 rounded-xl border border-[#1F334D] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">{app.appliance}</span>
                  <span className="font-mono font-bold text-cyan-400 text-xs">{app.sharePercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#152336] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(app.sharePercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Consumption:</span>
                  <span className="font-mono text-slate-200 font-medium">{formatKwh(app.totalKwh)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation & Automation Audit Trail Table */}
      <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Recommendation & Automation Audit Trail</h3>
            <p className="text-xs text-slate-400 mt-0.5">Governance lifecycle of AI-suggested rules, approvals, and activations</p>
          </div>
          <Badge variant="Audited" label="Human-in-the-Loop" />
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#1F334D]/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#091019] text-slate-400 border-b border-[#1F334D]">
              <tr>
                <th className="py-2.5 px-3.5 font-semibold">Rule ID</th>
                <th className="py-2.5 px-3.5 font-semibold">Name</th>
                <th className="py-2.5 px-3.5 font-semibold">Trigger Condition</th>
                <th className="py-2.5 px-3.5 font-semibold">Action Taken</th>
                <th className="py-2.5 px-3.5 font-semibold">Governance Status</th>
                <th className="py-2.5 px-3.5 font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F334D]/50 bg-[#0B131E]/40">
              {recommendationHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#142338]/60 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-semibold text-cyan-400">{rec.ruleId}</td>
                  <td className="py-3 px-3.5 font-medium text-slate-200">{rec.ruleName}</td>
                  <td className="py-3 px-3.5 font-mono text-slate-400 max-w-xs truncate">{rec.triggerCondition}</td>
                  <td className="py-3 px-3.5 text-slate-400 max-w-xs truncate">{rec.action}</td>
                  <td className="py-3 px-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${
                      rec.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : rec.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : rec.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-[#1F334D]'
                    }`}>
                      {rec.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                      {rec.status === 'rejected' && <XCircle className="w-3 h-3" />}
                      {rec.status === 'pending' && <Clock className="w-3 h-3" />}
                      {rec.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3.5 text-slate-400 font-mono">{new Date(rec.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
