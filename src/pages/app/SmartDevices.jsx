import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Flame, 
  Wind, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  Lightbulb, 
  Clock, 
  Zap, 
  Gauge,
  Bot,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/utils.js';

export default function SmartDevices() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDevices = async () => {
    try {
      setError(null);
      const res = await api.get('/devices');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load devices data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDevices();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Smart Devices" subtitle="Loading connected device telemetry..." />
        <LoadingState message="Fetching device inventory and historical profiles..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Smart Devices" subtitle="Device Registry Status" />
        <ErrorState title="Device Connection Error" message={error} onRetry={fetchDevices} />
      </div>
    );
  }

  const { devices = [], totalDevices = 4 } = data || {};
  const totalConnectedWatts = devices.reduce((sum, d) => sum + (d.powerRatingWatts || 0), 0);

  const deviceIcons = {
    hvac: Wind,
    dishwasher: Cpu,
    washer_dryer: Layers,
    robot_vacuum: Bot
  };

  const deviceColors = {
    hvac: '#22D3EE',
    dishwasher: '#3B82F6',
    washer_dryer: '#A78BFA',
    robot_vacuum: '#F59E0B'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Smart Devices & Inventory"
        subtitle="Connected appliance telemetry, historical consumption, and per-device savings recommendations"
        badge={<Badge variant="Measured" label={`${totalDevices} Devices Tracked`} />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface text-xs font-mono font-medium text-text border border-border hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Devices'}</span>
          </button>
        }
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Devices"
          value={String(totalDevices)}
          unit="Active"
          subtitle="4 major submetered domestic circuits"
          icon={Cpu}
          badge="Measured"
          accent="primary"
        />

        <StatCard
          title="Total Connected Load"
          value={totalConnectedWatts.toLocaleString()}
          unit="Watts"
          subtitle="Combined nameplate appliance capacity"
          icon={Gauge}
          badge="Measured"
          accent="info"
        />

        <StatCard
          title="Highest Consumer"
          value="HVAC System"
          unit="91.8%"
          subtitle="3,064.60 kWh ($415.82 billed spend)"
          icon={Wind}
          badge="Measured"
          accent="primary"
        />

        <StatCard
          title="Standby Baseline"
          value="~25"
          unit="Watts"
          subtitle="Electronics idle baseline power"
          icon={Clock}
          badge="Estimated"
          badgeTooltip="Calculated during unoccupied, non-cycling overnight intervals."
          accent="warning"
        />
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map(dev => {
          const Icon = deviceIcons[dev.type] || Cpu;
          const color = deviceColors[dev.type] || '#22D3EE';
          const isRunning = dev.status === 'running';

          return (
            <div
              key={dev.id}
              className="bg-surface border border-border rounded-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl border flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, borderColor: `${color}40`, color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text">{dev.name}</h3>
                    <p className="text-[11px] font-mono text-muted">
                      {dev.id} • {dev.powerRatingWatts}W rating
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                      isRunning
                        ? 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_8px_rgba(34,211,238,0.2)]'
                        : 'bg-surface-2 text-muted border-border'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-primary animate-pulse' : 'bg-muted/60'}`} />
                    <span className="capitalize">{dev.status}</span>
                  </span>
                  <Badge variant={dev.badge || 'Measured'} />
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-surface-2 border border-border/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-muted uppercase">Total Usage</span>
                  <p className="font-bold text-text text-sm mt-0.5">{dev.totalKwh.toFixed(1)} kWh</p>
                  <p className="text-[10px] text-muted">({dev.sharePercent}%)</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase">Billed Cost</span>
                  <p className="font-bold text-primary text-sm mt-0.5">${dev.totalCostUsd.toFixed(2)}</p>
                  <p className="text-[10px] text-muted">TOU actual</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase">Peak / Off-Peak</span>
                  <p className="font-bold text-warning text-sm mt-0.5">{dev.peakKwh.toFixed(0)} / {dev.offPeakKwh.toFixed(0)}</p>
                  <p className="text-[10px] text-muted">kWh split</p>
                </div>
              </div>

              {/* Share Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted mb-1 font-mono">
                  <span>Domestic Load Proportion</span>
                  <span className="font-semibold text-text">{dev.sharePercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden border border-border/50">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, dev.sharePercent))}%`, backgroundColor: color }}
                  />
                </div>
              </div>

              {/* Monthly History Mini Chart */}
              {dev.monthlyHistory && dev.monthlyHistory.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-semibold block mb-2">
                    Monthly Consumption Trend (kWh)
                  </span>
                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dev.monthlyHistory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#1F334D" vertical={false} />
                        <XAxis dataKey="month" stroke="#8FA1A8" fontSize={9} tickLine={false} fontFamily="monospace" />
                        <YAxis stroke="#8FA1A8" fontSize={9} tickLine={false} fontFamily="monospace" />
                        <Bar dataKey="kwh" fill={color} radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Device Insight Callout */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="text-[11px] text-muted leading-relaxed">
                  <span className="font-semibold text-primary block text-[10px] uppercase font-mono mb-0.5">
                    Efficiency Recommendation
                  </span>
                  {dev.insight}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Appliance Comparison Matrix */}
      <div className="bg-surface border border-border rounded-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Appliance Comparison & Schedule Guidance</span>
          </h3>
          <Badge variant="Measured" label="Verified Facts" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[11px]">
                <th className="py-2.5 px-3">Device Name</th>
                <th className="py-2.5 px-3">Power Rating</th>
                <th className="py-2.5 px-3">8-Mo Total</th>
                <th className="py-2.5 px-3">Share</th>
                <th className="py-2.5 px-3">Total Spend</th>
                <th className="py-2.5 px-3">Peak Ratio</th>
                <th className="py-2.5 px-3">Recommended Schedule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-text">
              {devices.map(dev => {
                const peakRatio = dev.totalKwh > 0 ? ((dev.peakKwh / dev.totalKwh) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={dev.id} className="hover:bg-surface-2/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text">{dev.name}</td>
                    <td className="py-3 px-3 text-muted">{dev.powerRatingWatts} W</td>
                    <td className="py-3 px-3">{dev.totalKwh.toFixed(1)} kWh</td>
                    <td className="py-3 px-3 font-bold text-primary">{dev.sharePercent}%</td>
                    <td className="py-3 px-3">${dev.totalCostUsd.toFixed(2)}</td>
                    <td className="py-3 px-3 text-warning">{peakRatio}% Peak</td>
                    <td className="py-3 px-3 text-muted font-sans text-[11px]">
                      {dev.type === 'dishwasher' && 'Shift to 21:00–06:00 (Off-Peak)'}
                      {dev.type === 'hvac' && 'Night setback 23:00–06:00; Natural cooling'}
                      {dev.type === 'washer_dryer' && 'Maintain off-peak washing; cold water'}
                      {dev.type === 'robot_vacuum' && 'Daily midday dock run 10:00–14:00'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
