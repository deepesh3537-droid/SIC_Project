import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  RefreshCw, 
  ArrowUpRight, 
  AlertTriangle,
  Layers,
  Clock,
  Radio,
  Calendar,
  Info,
  TrendingDown,
  CheckCircle2,
  Cpu,
  Bot,
  Wind
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import AlertCard from '../../components/cards/AlertCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Modal from '../../components/ui/Modal.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatCurrency, formatKwh, formatNumber, formatPercent } from '../../lib/utils.js';

// Custom dark tooltip for Recharts with cyan branding
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface/95 backdrop-blur-md border border-border rounded-lg p-3 shadow-xl text-xs font-mono">
        <p className="font-semibold text-text mb-1.5 border-b border-border/60 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="flex items-center justify-between gap-3 py-0.5">
            <span className="flex items-center gap-1.5" style={{ color: entry.color || '#22D3EE' }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || '#22D3EE' }} />
              <span>{entry.name}:</span>
            </span>
            <span className="font-bold text-text">
              {entry.value != null ? entry.value : 'N/A'}{entry.unit || ''}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Timeframe toggle state for trends (daily / weekly / monthly)
  const [timeframe, setTimeframe] = useState('monthly');
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);

  // Efficiency score explanation modal
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const res = await api.get('/dashboard/overview');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchTrends = async (selectedTimeframe) => {
    setTrendLoading(true);
    try {
      const res = await api.get(`/dashboard/trends?timeframe=${selectedTimeframe}`);
      setTrendData(res.data);
    } catch (err) {
      console.error('Failed to fetch trend data:', err);
    } finally {
      setTrendLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTrends(timeframe);
  }, [timeframe]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
    fetchTrends(timeframe);
  };

  const handleMarkRead = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/read`);
      setData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          recentAlerts: (prev.recentAlerts || []).map(a => 
            a.id === alertId ? { ...a, is_read: true } : a
          )
        };
      });
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Command Center" subtitle="Loading telemetry facts..." />
        <LoadingState message="Fetching deterministic telemetry and analytics..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Command Center" subtitle="Telemetry Status" />
        <ErrorState 
          title="Telemetry Connection Error" 
          message={error} 
          onRetry={fetchDashboardData} 
        />
      </div>
    );
  }

  const { metrics, devices, automations, recentAlerts, household } = data || {};

  // 1. Format chart data based on active timeframe
  const activeChartData = (trendData.length > 0 ? trendData : (metrics?.monthlyUsage || [])).map(item => {
    const kwhNum = typeof item.total_kwh === 'number' && !Number.isNaN(item.total_kwh) ? item.total_kwh : null;
    const costNum = typeof item.total_cost_usd === 'number' && !Number.isNaN(item.total_cost_usd) ? item.total_cost_usd : null;
    
    let label = 'N/A';
    if (timeframe === 'monthly') {
      label = item.month_name ? item.month_name.slice(0, 3) : (item.month != null ? `M${item.month}` : 'N/A');
    } else if (timeframe === 'weekly') {
      label = item.week ? item.week.replace('2025-', '') : 'N/A';
    } else if (timeframe === 'daily') {
      label = item.date ? item.date.slice(5) : 'N/A';
    }

    return {
      label,
      kwh: kwhNum !== null ? parseFloat(kwhNum.toFixed(1)) : 0,
      cost: costNum !== null ? parseFloat(costNum.toFixed(2)) : 0,
      kwhDisplay: formatKwh(kwhNum, 1),
      costDisplay: formatCurrency(costNum)
    };
  });

  // 2. Cyber-themed Appliance colors matching tokens.css & DESIGN.md
  const applianceColors = {
    'HVAC': '#22D3EE',
    'HVAC System': '#22D3EE',
    'Dishwasher': '#3B82F6',
    'Washer/Dryer': '#A78BFA',
    'Washer / Dryer': '#A78BFA',
    'Robot Vacuum': '#F59E0B',
    'Unmonitored / Base': '#64748B'
  };

  // 3. Format appliance distribution safely
  const appliancePieData = (metrics?.applianceShares || [])
    .filter(a => {
      const name = a.name || a.appliance || '';
      return name !== 'Unmonitored / Base';
    })
    .map(a => {
      const name = a.name || a.appliance || 'Unknown Appliance';
      const rawPct = typeof a.percentage === 'number' 
        ? a.percentage 
        : (typeof a.share_percent === 'number' ? a.share_percent : null);
      const rawKwh = typeof a.total_kwh === 'number' 
        ? a.total_kwh 
        : (typeof a.kwh === 'number' ? a.kwh : null);

      const isValidPct = rawPct !== null && !Number.isNaN(rawPct);
      const isValidKwh = rawKwh !== null && !Number.isNaN(rawKwh);

      return {
        name,
        value: isValidPct ? parseFloat(rawPct.toFixed(2)) : 0,
        pctDisplay: isValidPct ? `${rawPct.toFixed(2)}%` : 'N/A',
        kwh: isValidKwh ? rawKwh : null,
        kwhDisplay: isValidKwh ? `${rawKwh.toFixed(1)} kWh` : 'N/A',
        color: applianceColors[name] || '#22D3EE'
      };
    });

  // 4. Tariff calculations
  const peakTariff = metrics?.tariffSummary?.find(t => t.period === 'Peak');
  const offPeakTariff = metrics?.tariffSummary?.find(t => t.period === 'Off-Peak');

  const peakKwhNum = typeof peakTariff?.total_kwh === 'number' && !Number.isNaN(peakTariff.total_kwh)
    ? peakTariff.total_kwh
    : null;
  const offPeakKwhNum = typeof offPeakTariff?.total_kwh === 'number' && !Number.isNaN(offPeakTariff.total_kwh)
    ? offPeakTariff.total_kwh
    : null;
  const totalKwhNum = typeof metrics?.totalEnergyKwh === 'number' && !Number.isNaN(metrics.totalEnergyKwh)
    ? metrics.totalEnergyKwh
    : null;

  const peakCostDisplay = typeof peakTariff?.total_cost_usd === 'number'
    ? formatCurrency(peakTariff.total_cost_usd)
    : 'N/A';
  const offPeakCostDisplay = typeof offPeakTariff?.total_cost_usd === 'number'
    ? formatCurrency(offPeakTariff.total_cost_usd)
    : 'N/A';

  const peakDemandPct = (peakKwhNum !== null && totalKwhNum !== null && totalKwhNum > 0)
    ? `${((peakKwhNum / totalKwhNum) * 100).toFixed(1)}%`
    : 'N/A';

  const peakDemandUnit = peakKwhNum !== null 
    ? `(${peakKwhNum.toFixed(1)} kWh)` 
    : '(N/A)';

  const totalEnergyDisplay = totalKwhNum !== null
    ? totalKwhNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : 'N/A';

  const totalCostDisplay = typeof metrics?.totalCostUsd === 'number' && !Number.isNaN(metrics.totalCostUsd)
    ? `$${metrics.totalCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : 'N/A';

  const peakPeriodKwhDisplay = peakKwhNum !== null ? `${peakKwhNum.toFixed(1)} kWh` : 'N/A';
  const peakPeriodCostDisplay = typeof peakTariff?.total_cost_usd === 'number' && !Number.isNaN(peakTariff.total_cost_usd)
    ? `$${peakTariff.total_cost_usd.toFixed(2)}`
    : 'N/A';
  const peakPeriodShareDisplay = (peakKwhNum !== null && totalKwhNum !== null && totalKwhNum > 0)
    ? `(${((peakKwhNum / totalKwhNum) * 100).toFixed(1)}%)`
    : '';

  const offPeakPeriodKwhDisplay = offPeakKwhNum !== null ? `${offPeakKwhNum.toFixed(1)} kWh` : 'N/A';
  const offPeakPeriodCostDisplay = typeof offPeakTariff?.total_cost_usd === 'number' && !Number.isNaN(offPeakTariff.total_cost_usd)
    ? `$${offPeakTariff.total_cost_usd.toFixed(2)}`
    : 'N/A';
  const offPeakPeriodShareDisplay = (offPeakKwhNum !== null && totalKwhNum !== null && totalKwhNum > 0)
    ? `(${((offPeakKwhNum / totalKwhNum) * 100).toFixed(1)}%)`
    : '';

  // Helper for device icons
  const getDeviceIcon = (type) => {
    switch (type) {
      case 'hvac': return Wind;
      case 'robot_vacuum': return Bot;
      case 'dishwasher': return Cpu;
      case 'washer_dryer': return Layers;
      default: return Cpu;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <PageHeader
        title="Energy Command Center"
        subtitle={`Deterministic consumption intelligence & live telemetry for household ${household?.id || 'HOME-JAMES-001'}`}
        badge={<Badge variant="Measured" tooltip="Aggregated from 5,832 verified IoT sensor readings" />}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text transition-all hover:border-primary/40 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        }
      />

      {/* 2. Simulated Live Feed Pulse Banner */}
      <div className="bg-surface border border-primary/25 rounded-card p-3.5 px-4 flex items-center justify-between flex-wrap gap-3 shadow-[0_0_20px_rgba(34,211,238,0.04)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text">Simulated IoT Stream Active</span>
              <Badge variant="Simulated" label="Live Stream" />
            </div>
            <p className="text-muted text-[11px] mt-0.5">
              Listening to Redis Stream <code className="text-primary bg-surface-2 px-1 py-0.5 rounded font-mono text-[10px]">iot.reading.received</code>. Telemetry replayed at 1-hour interval frequency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/app/simulator"
            className="px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono text-primary font-medium flex items-center gap-1.5 transition-colors hover:border-primary/40"
          >
            <span>Open Simulator Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Consumption"
          value={totalEnergyDisplay}
          unit={totalKwhNum !== null ? "kWh" : ""}
          subtitle="5,832 hourly intervals recorded"
          icon={Zap}
          badge="Measured"
          accent="primary"
        />

        <StatCard
          title="Total Billed Cost"
          value={totalCostDisplay}
          subtitle={`Peak: ${peakCostDisplay} | Off-Peak: ${offPeakCostDisplay}`}
          icon={DollarSign}
          badge="Measured"
          accent="info"
        />

        <StatCard
          title="Peak Tariff Demand"
          value={peakDemandPct}
          unit={peakDemandUnit}
          subtitle="Hours: 06:00-09:00 & 17:00-21:00"
          icon={Flame}
          badge="Measured"
          accent="warning"
        />

        {/* Clickable Efficiency Score Card */}
        <div 
          onClick={() => setScoreModalOpen(true)}
          className="cursor-pointer group"
          title="Click to view transparent formula and calculation breakdown"
        >
          <StatCard
            title="Efficiency Score"
            value={metrics?.efficiencyScore?.score != null ? `${metrics.efficiencyScore.score} / 100` : 'N/A'}
            unit={metrics?.efficiencyScore?.grade || ''}
            subtitle="Click to view transparent formula breakdown"
            badge="Estimated"
            badgeTooltip="Formula: 100 - (Peak_Tariff_Energy_Pct * 0.4). Click to inspect."
            icon={ShieldCheck}
            accent="primary"
            className="border-primary/30 group-hover:border-primary/70 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
          />
        </div>
      </div>

      {/* 4. Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Energy Trends Chart with Daily/Weekly/Monthly Timeframe Switcher */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Consumption & Cost Trends"
            subtitle={
              timeframe === 'monthly'
                ? 'Historical monthly totals across 8 observation months'
                : timeframe === 'weekly'
                ? 'Weekly aggregated energy consumption across 36 weeks'
                : 'Daily energy trends (last 60 recorded days)'
            }
            badge="Measured"
            actions={
              <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border text-xs font-mono">
                <button
                  onClick={() => setTimeframe('daily')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeframe === 'daily' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeframe('weekly')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeframe === 'weekly' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeframe('monthly')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    timeframe === 'monthly' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
                  }`}
                >
                  Monthly
                </button>
              </div>
            }
            summaryText={
              timeframe === 'monthly'
                ? 'Monthly consumption peaked in October 2024 at 473.19 kWh ($64.29) and reached minimum in May 2025 at 317.77 kWh ($43.14).'
                : timeframe === 'weekly'
                ? 'Weekly load ranges between ~5 kWh during mild transition weeks to ~248 kWh during intense winter heating.'
                : 'Daily consumption correlates strongly with ambient temperature; cold winter days draw up to 34 kWh/day.'
            }
          >
            <div className="h-64 w-full pt-4">
              {trendLoading ? (
                <LoadingState message="Loading trend series..." type="spinner" />
              ) : activeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" vertical={false} />
                    <XAxis 
                      dataKey="label" 
                      stroke="#8FA1A8" 
                      fontSize={10} 
                      tickLine={false}
                      fontFamily="monospace"
                    />
                    <YAxis 
                      stroke="#8FA1A8" 
                      fontSize={10} 
                      tickLine={false}
                      fontFamily="monospace"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="kwh" name="Energy" unit=" kWh" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No Trend Telemetry" description="Trend series are currently unavailable." />
              )}
            </div>
          </ChartCard>
        </div>

        {/* Appliance Share Chart */}
        <div className="lg:col-span-4">
          <ChartCard
            title="Appliance Share Breakdown"
            subtitle="Measured proportion of metered appliances"
            badge="Measured"
            summaryText="HVAC dominates domestic electricity usage at 91.83% (3,064.67 kWh), followed by Dishwasher at 5.69% (189.87 kWh)."
          >
            <div className="h-44 w-full flex items-center justify-center">
              {appliancePieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={appliancePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {appliancePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No Appliance Telemetry" description="Appliance breakdown data is unavailable." />
              )}
            </div>

            {/* Custom Legend */}
            <div className="space-y-1.5 mt-2 border-t border-border/50 pt-3">
              {appliancePieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted">{item.name}</span>
                  </div>
                  <div className="font-mono flex items-center gap-2">
                    <span className="text-text font-semibold">{item.pctDisplay}</span>
                    <span className="text-muted/70 text-[10px]">({item.kwhDisplay})</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* 5. Telemetry Status & Recent Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sub-Panel: Monitored Smart Devices & Tariff Period Split */}
        <div className="lg:col-span-5 space-y-4">
          {/* Monitored Smart Devices */}
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Monitored Smart Devices</span>
                </h3>
                <Badge variant="Measured" label={`${devices?.total || 4} Devices`} />
              </div>
              <Link 
                to="/app/devices" 
                className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/40 text-xs">
              {(devices?.list || []).map(device => {
                const IconComponent = getDeviceIcon(device.type || device.device_type);
                const powerVal = device.power_rating_watts ? `${parseFloat(device.power_rating_watts)}W` : null;
                const isRunning = device.status === 'running';

                return (
                  <div key={device.id} className="py-2.5 flex items-center justify-between group">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-surface-2 border border-border text-primary group-hover:border-primary/40 transition-colors">
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="font-medium text-text">{device.name || device.device_name || 'Smart Device'}</p>
                        <p className="text-[11px] text-muted font-mono capitalize">
                          {(device.type || device.device_type || 'appliance').replace(/_/g, ' ')}
                          {powerVal && ` • ${powerVal}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-primary animate-pulse' : 'bg-muted/60'}`} />
                      <span className="font-mono text-muted capitalize text-[11px]">{device.status || 'Active'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tariff Period Split */}
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span>Tariff Period Economics</span>
              </h3>
              <Badge variant="Measured" label="2 Tariff Periods" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface-2 rounded-lg border border-border/60 space-y-1">
                <p className="text-muted text-[11px] font-medium uppercase tracking-wider">Peak Period</p>
                <p className="text-base font-bold font-mono text-text">{peakPeriodKwhDisplay}</p>
                <p className="text-xs font-mono text-warning">{peakPeriodCostDisplay} {peakPeriodShareDisplay}</p>
                <p className="text-[10px] text-muted font-mono pt-1 border-t border-border/40">$0.1878/kWh avg</p>
              </div>
              <div className="p-3 bg-surface-2 rounded-lg border border-border/60 space-y-1">
                <p className="text-muted text-[11px] font-medium uppercase tracking-wider">Off-Peak Period</p>
                <p className="text-base font-bold font-mono text-text">{offPeakPeriodKwhDisplay}</p>
                <p className="text-xs font-mono text-primary">{offPeakPeriodCostDisplay} {offPeakPeriodShareDisplay}</p>
                <p className="text-[10px] text-muted font-mono pt-1 border-t border-border/40">$0.1000/kWh flat (54.5% cheaper)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Panel: Live / Recent Event Alerts */}
        <div className="lg:col-span-7">
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <span>Recent Energy Alerts</span>
                  </h3>
                  <Badge variant="Measured" />
                </div>
                <Link
                  to="/app/alerts"
                  className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                >
                  <span>Alert Center</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentAlerts && recentAlerts.length > 0 ? (
                <div className="space-y-3">
                  {recentAlerts.slice(0, 2).map(alert => (
                    <AlertCard key={alert.id} alert={alert} onMarkRead={handleMarkRead} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No Active Alerts"
                  description="All metered appliances are currently operating within nominal energy envelopes."
                />
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted flex-wrap gap-2">
              <span>
                Automations: <strong className="text-text font-mono">{automations?.activeCount || 0} active</strong>, <strong className="text-warning font-mono">{automations?.pendingCount || 0} pending</strong>
              </span>
              <Link to="/app/automations" className="text-primary hover:underline flex items-center gap-1">
                <span>Manage Automations</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Transparent Efficiency Score Explanation Modal */}
      <Modal
        isOpen={scoreModalOpen}
        onClose={() => setScoreModalOpen(false)}
        title="Transparent Efficiency Score Formula"
        description="Every score is calculated deterministically from verified telemetry. No black-box estimations."
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-bold">Standard Mathematical Formula</span>
            <div className="text-base font-mono font-bold text-primary">
              Score = 100 - (Peak_Tariff_Energy_Pct × 0.4)
            </div>
            <p className="text-muted leading-relaxed">
              Deducts points proportionally based on the percentage of domestic electricity drawn during high-cost Peak Tariff windows (06:00-09:00 & 17:00-21:00).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-text">HOME-JAMES-001 Calculation Breakdown:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
                <span className="text-muted block text-[10px]">TOTAL CONSUMPTION</span>
                <span className="font-bold text-text">3,337.29 kWh</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
                <span className="text-muted block text-[10px]">PEAK CONSUMPTION</span>
                <span className="font-bold text-warning">1,355.39 kWh (40.61%)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-2 border border-border">
                <span className="text-muted block text-[10px]">PEAK PENALTY DEDUCTION</span>
                <span className="font-bold text-danger">-16.24 points</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-2 border border-primary/30">
                <span className="text-muted block text-[10px]">FINAL ESTIMATED SCORE</span>
                <span className="font-bold text-primary">84 / 100 (Good)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
            <h5 className="font-semibold text-primary flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>How to Reach a Score of 90+ (Excellent)</span>
            </h5>
            <p className="text-muted leading-relaxed">
              Shifting 10% of peak consumption (approx. 135 kWh) to off-peak hours (e.g. scheduling dishwasher and washing machine after 9:00 PM) lowers peak share to ~36.5%, lifting your efficiency rating to <strong>88 / 100</strong>.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setScoreModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-black font-semibold text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
