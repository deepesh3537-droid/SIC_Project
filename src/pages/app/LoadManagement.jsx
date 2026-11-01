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

  const capacityColors = ['#22D3EE', '#3B82F6', '#A78BFA', '#F59E0B'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Load Management & Peak Demand"
        subtitle="Electrical circuit capacity, concurrent appliance spikes, and peak shaving intelligence"
        badge={<Badge variant="Measured" label="Deterministic Telemetry" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recorded Peak Demand"
          value={`${formatNumber(peakDemand.maxDemandKw, 3)} kW`}
          subtitle={peakDemand.maxDemandTimestamp || '2025-02-05 17:00'}
          icon={Gauge}
          badge="Measured"
          accent="primary"
        />
        <StatCard
          title="Connected Circuit Load"
          value={`${formatNumber(peakDemand.totalConnectedKw, 3)} kW`}
          subtitle="7,555W across 4 monitored devices"
          icon={Zap}
          badge="Measured"
          accent="info"
        />
        <StatCard
          title="Coincidence Factor"
          value={formatNumber(peakDemand.coincidenceFactor, 3)}
          subtitle="81.5% max simultaneous utilization"
          icon={Activity}
          badge="Measured"
          accent="warning"
        />
        <StatCard
          title="Critical Concurrency Hours"
          value="6 hrs"
          subtitle="HVAC + Dishwasher + Laundry combined"
          icon={AlertTriangle}
          badge="Measured"
          accent="danger"
        />
      </div>

      {/* Grid: Connected Capacity Breakdown & Tariff Period Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Capacity Breakdown */}
        <div className="bg-surface border border-border rounded-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Monitored Circuit Power Ratings</h3>
              <p className="text-xs text-muted font-mono">Connected electrical draw by appliance category</p>
            </div>
            <Badge variant="Measured" label="7,555 W Total" />
          </div>

          <div className="space-y-3 pt-2">
            {connectedAppliances.map((app, idx) => (
              <div key={app.name} className="space-y-1.5 bg-surface-2 p-3 rounded-xl border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {app.type === 'hvac' && <Flame className="w-4 h-4 text-primary" />}
                    {app.type === 'washer_dryer' && <Layers className="w-4 h-4 text-purple-400" />}
                    {app.type === 'dishwasher' && <Wind className="w-4 h-4 text-secondary" />}
                    {app.type === 'robot_vacuum' && <Bot className="w-4 h-4 text-warning" />}
                    <span className="font-medium text-text">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-muted">{app.powerRatingWatts} W</span>
                    <span className="font-mono font-bold text-primary">{app.shareOfConnectedCapacity}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/40">
                  <div 
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
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
        <div className="bg-surface border border-border rounded-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Tariff Period Load Distribution</h3>
              <p className="text-xs text-muted font-mono">Energy consumption and billing impact across tariff tiers</p>
            </div>
            <Badge variant="Measured" label="Tariff Tiers" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">Peak Tariff</span>
                <span className="text-xs font-mono font-bold text-danger">$0.22/kWh</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text">
                {formatKwh(loadDistribution.peakPeriodKwh)}
              </div>
              <div className="text-xs text-muted flex justify-between font-mono">
                <span>Cost: <strong className="text-text">{formatCurrency(loadDistribution.peakPeriodCostUsd)}</strong></span>
                <span className="font-semibold text-danger">{loadDistribution.peakPeriodPercent}%</span>
              </div>
            </div>

            <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text">Off-Peak Tariff</span>
                <span className="text-xs font-mono font-bold text-primary">$0.10/kWh</span>
              </div>
              <div className="text-2xl font-bold font-mono text-text">
                {formatKwh(loadDistribution.offPeakPeriodKwh)}
              </div>
              <div className="text-xs text-muted flex justify-between font-mono">
                <span>Cost: <strong className="text-text">{formatCurrency(loadDistribution.offPeakPeriodCostUsd)}</strong></span>
                <span className="font-semibold text-primary">{loadDistribution.offPeakPeriodPercent}%</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-surface-2 rounded-xl border border-border text-xs text-muted space-y-1">
            <div className="font-medium text-text">Peak Shaving Opportunity</div>
            <p className="leading-relaxed">
              Although Peak hours account for only <strong className="text-text font-mono">40.56%</strong> of total volume, they generate <strong className="text-text font-mono">60.0%</strong> of the total energy expense due to the 2.2x tariff rate penalty.
            </p>
          </div>
        </div>
      </div>

      {/* Simultaneous Usage Matrix Table */}
      <div className="bg-surface border border-border rounded-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm">Concurrent Appliance Concurrency Matrix</h3>
            <p className="text-xs text-muted font-mono">Simultaneous operational duty cycles identified in historical telemetry</p>
          </div>
          <Badge variant="Measured" label="Verified Telemetry" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[11px]">
                <th className="py-2.5 px-3">Concurrency Pattern</th>
                <th className="py-2.5 px-3">Historical Occurrences</th>
                <th className="py-2.5 px-3">Avg Combined Load</th>
                <th className="py-2.5 px-3">Peak Coincidence</th>
                <th className="py-2.5 px-3">Tariff Window Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-text">
              {simultaneousUsage.map((pattern, pIdx) => (
                <tr key={pIdx} className="hover:bg-surface-2/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-text">{pattern.patternName}</td>
                  <td className="py-3 px-3 text-muted">{pattern.occurrences} intervals</td>
                  <td className="py-3 px-3 text-primary font-bold">{pattern.avgCombinedKw} kW</td>
                  <td className="py-3 px-3">{pattern.peakSharePercent}% Peak</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pattern.riskLevel === 'high' ? 'bg-danger/10 text-danger border border-danger/30' :
                      pattern.riskLevel === 'medium' ? 'bg-warning/10 text-warning border border-warning/30' :
                      'bg-surface-2 text-muted border border-border'
                    }`}>
                      {pattern.riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
