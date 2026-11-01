import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Zap, 
  Flame, 
  Wind, 
  Bot, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  RefreshCw,
  Layers,
  Activity
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

export default function LoadManagement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLoadData = async () => {
    try {
      setError(null);
      const res = await api.get('/budget/load');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load load management data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch load telemetry');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLoadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLoadData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Load Management" subtitle="Analyzing electrical capacity, demand peaks, and concurrent appliance draws..." />
        <LoadingState message="Measuring simultaneous circuit telemetry..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Load Management" subtitle="Load Telemetry Status" />
        <ErrorState title="Load Monitor Error" message={error} onRetry={fetchLoadData} />
      </div>
    );
  }

  const {
    peakDemand = {},
    simultaneousUsage = [],
    connectedAppliances = [],
    loadDistribution = {},
    loadSheddingAdvice = []
  } = data || {};

  const capacityColors = ['#10B981', '#A78BFA', '#38BDF8', '#F59E0B'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Load Management & Peak Demand"
        subtitle="Electrical circuit capacity, concurrent appliance spikes, and peak shaving intelligence"
        badge={<Badge variant="Measured" label="Deterministic Telemetry" />}
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Telemetry
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recorded Peak Demand"
          value={`${formatNumber(peakDemand.maxDemandKw, 3)} kW`}
          subvalue={peakDemand.maxDemandTimestamp || '2025-02-05 17:00'}
          icon={Gauge}
          badge={<Badge variant="Measured" label="Historical Peak" />}
        />
        <StatCard
          title="Connected Circuit Load"
          value={`${formatNumber(peakDemand.totalConnectedKw, 3)} kW`}
          subvalue="7,555W across 4 monitored devices"
          icon={Zap}
          badge={<Badge variant="Measured" label="Total Capacity" />}
        />
        <StatCard
          title="Coincidence Factor"
          value={formatNumber(peakDemand.coincidenceFactor, 3)}
          subvalue="81.5% max simultaneous utilization"
          icon={Activity}
          badge={<Badge variant="Measured" label="Coincidence" />}
        />
        <StatCard
          title="Critical Concurrency Hours"
          value="6 hrs"
          subvalue="HVAC + Dishwasher + Laundry combined"
          icon={AlertTriangle}
          badge={<Badge variant="Measured" label="Triple-load spike" />}
        />
      </div>

      {/* Grid: Connected Capacity Breakdown & Tariff Period Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Capacity Breakdown */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Monitored Circuit Power Ratings</h3>
              <p className="text-xs text-muted">Connected electrical draw by appliance category</p>
            </div>
            <Badge variant="Measured" label="7,555 W Total" />
          </div>

          <div className="space-y-3 pt-2">
            {connectedAppliances.map((app, idx) => (
              <div key={app.name} className="space-y-1.5 bg-surface-2/40 p-3 rounded-lg border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {app.type === 'hvac' && <Flame className="w-4 h-4 text-emerald-400" />}
                    {app.type === 'washer_dryer' && <Zap className="w-4 h-4 text-purple-400" />}
                    {app.type === 'dishwasher' && <Wind className="w-4 h-4 text-sky-400" />}
                    {app.type === 'robot_vacuum' && <Bot className="w-4 h-4 text-amber-400" />}
                    <span className="font-medium text-text">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted">{app.powerRatingWatts} W</span>
                    <span className="font-mono font-bold text-primary">{app.shareOfConnectedCapacity}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${app.shareOfConnectedCapacity}%`,
                      backgroundColor: capacityColors[idx % capacityColors.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tariff Load Distribution */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Tariff Period Load Distribution</h3>
              <p className="text-xs text-muted">Energy consumption and billing impact across tariff tiers</p>
            </div>
            <Badge variant="Measured" label="Tariff Tiers" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">Peak Tariff</span>
                <span className="text-xs font-mono font-bold text-rose-400">$0.22/kWh</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text">
                {formatKwh(loadDistribution.peakPeriodKwh)}
              </div>
              <div className="text-xs text-muted flex justify-between">
                <span>Cost: <strong className="text-text font-mono">{formatCurrency(loadDistribution.peakPeriodCostUsd)}</strong></span>
                <span className="font-mono font-semibold text-rose-400">{loadDistribution.peakPeriodPercent}%</span>
              </div>
            </div>

            <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">Off-Peak Tariff</span>
                <span className="text-xs font-mono font-bold text-emerald-400">$0.10/kWh</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text">
                {formatKwh(loadDistribution.offPeakPeriodKwh)}
              </div>
              <div className="text-xs text-muted flex justify-between">
                <span>Cost: <strong className="text-text font-mono">{formatCurrency(loadDistribution.offPeakPeriodCostUsd)}</strong></span>
                <span className="font-mono font-semibold text-emerald-400">{loadDistribution.offPeakPeriodPercent}%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-2/60 rounded-lg border border-border text-xs text-muted space-y-1">
            <div className="font-medium text-text">Peak Shaving Opportunity</div>
            <p>
              Although Peak hours account for only <strong className="text-text font-mono">40.56%</strong> of total volume, they generate <strong className="text-text font-mono">60.0%</strong> of the total energy expense due to the 2.2x tariff rate penalty.
            </p>
          </div>
        </div>
      </div>

      {/* Simultaneous Usage Matrix Table */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm">Concurrent Appliance Operation Events</h3>
            <p className="text-xs text-muted">Instances where high-draw appliances operated in the same 1-hour interval</p>
          </div>
          <Badge variant="Measured" label="Historical Concurrency" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted border-b border-border">
              <tr>
                <th className="py-2.5 px-3 font-medium">Concurrent Loads</th>
                <th className="py-2.5 px-3 font-medium">Combined Draw</th>
                <th className="py-2.5 px-3 font-medium">Recorded Hours</th>
                <th className="py-2.5 px-3 font-medium">Demand Risk</th>
                <th className="py-2.5 px-3 font-medium">Load Shedding Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {simultaneousUsage.map((item) => (
                <tr key={item.appliances} className="hover:bg-surface-2/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-text flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    {item.appliances}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-text">{item.combinedWatts} W</td>
                  <td className="py-3 px-3 font-mono text-muted">{item.concurrentHours} hrs</td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                      item.riskLevel.includes('Critical')
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : item.riskLevel === 'Elevated'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted">
                    {item.riskLevel.includes('Critical')
                      ? 'Prevent triple concurrency by staggering laundry start times via automation.'
                      : item.riskLevel === 'Elevated'
                      ? 'Schedule laundry cycles outside of 17:00–22:00 evening HVAC recovery hours.'
                      : 'Acceptable concurrent draw during off-peak morning hours.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Load Shedding & Shifting Recommendations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text text-sm">Actionable Load Shedding Advice</h3>
          <span className="text-xs text-muted">Peak shaving strategies to protect circuits and lower bills</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loadSheddingAdvice.map((advice, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-xl p-4 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-text flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {advice.title}
                  </span>
                  <Badge variant={advice.badge} label={advice.badge} />
                </div>
                <p className="text-xs text-muted leading-relaxed">{advice.action}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-border flex items-start gap-2 bg-primary/5 p-2 rounded-lg">
                <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-primary font-medium">{advice.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

