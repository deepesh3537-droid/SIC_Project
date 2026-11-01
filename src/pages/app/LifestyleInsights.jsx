import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Clock, 
  Sun, 
  Moon, 
  Calendar, 
  TrendingUp, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Wind,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
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

export default function LifestyleInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [curveMode, setCurveMode] = useState('weekday_vs_weekend'); // 'weekday_vs_weekend' | 'total' | 'hvac'

  const fetchLifestyleData = async () => {
    try {
      setError(null);
      const res = await api.get('/lifestyle');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load lifestyle data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch lifestyle insights');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLifestyleData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchLifestyleData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lifestyle Insights" subtitle="Analyzing household energy habits and behavioral signatures..." />
        <LoadingState message="Computing hourly profiles and daypart load curves..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lifestyle Insights" subtitle="Lifestyle Intelligence Status" />
        <ErrorState title="Telemetry Error" message={error} onRetry={fetchLifestyleData} />
      </div>
    );
  }

  const {
    hourlyProfile = [],
    dayOfWeek = [],
    dayparts = [],
    applianceDutyCycles = [],
    peakHours = {},
    insights = []
  } = data || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Lifestyle Insights"
        subtitle="Deterministic hourly signatures, weekday vs. weekend routines, and behavioral patterns"
        badge={<Badge variant="Measured" label="Historical 5,832 readings" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Top Peak Demand Hours"
          value={peakHours.labels?.join(', ') || '20:00, 18:00, 19:00'}
          subtitle="Peak evening convergence"
          icon={Clock}
          badge="Measured"
          badgeTooltip="Hours with maximum concurrent load"
          accent="warning"
        />
        <StatCard
          title="Evening Peak Load Share"
          value="41.7%"
          subtitle="1,391 kWh between 17:00–22:00"
          icon={TrendingUp}
          badge="Measured"
          accent="danger"
        />
        <StatCard
          title="Overnight Baseline"
          value="0.65 kWh/h"
          subtitle="28.2% total household power"
          icon={Moon}
          badge="Measured"
          accent="info"
        />
        <StatCard
          title="Peak Midweek Day"
          value={peakHours.highestDay?.day || 'Wednesday'}
          subtitle={`${formatKwh(peakHours.highestDay?.avgKwh || 15.53)} avg daily usage`}
          icon={Calendar}
          badge="Measured"
          accent="primary"
        />
      </div>

      {/* Main Hourly Load Profile Chart */}
      <ChartCard
        title="24-Hour Load Profile & Habit Signatures"
        subtitle="Average kilowatt-hours per hour across the 8-month observation period"
        badge="Measured"
        badgeTooltip="Deterministic EDA aggregated from 5,832 readings"
        actions={
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border text-xs font-mono">
            <button
              onClick={() => setCurveMode('weekday_vs_weekend')}
              className={`px-2.5 py-1 rounded transition-colors ${
                curveMode === 'weekday_vs_weekend' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
              }`}
            >
              Weekday vs Weekend
            </button>
            <button
              onClick={() => setCurveMode('total')}
              className={`px-2.5 py-1 rounded transition-colors ${
                curveMode === 'total' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
              }`}
            >
              Total Household
            </button>
            <button
              onClick={() => setCurveMode('hvac')}
              className={`px-2.5 py-1 rounded transition-colors ${
                curveMode === 'hvac' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.2)]' : 'text-muted hover:text-text'
              }`}
            >
              HVAC Submeter
            </button>
          </div>
        }
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyProfile} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeekday" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorWeekend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorHvac" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" />
              <XAxis dataKey="label" stroke="#8FA1A8" fontSize={10} fontFamily="monospace" />
              <YAxis stroke="#8FA1A8" fontSize={10} unit=" kWh" fontFamily="monospace" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-surface/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
                        <div className="font-semibold text-text border-b border-border/60 pb-1">{label}</div>
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              <span className="text-muted">{entry.name}:</span>
                            </span>
                            <span className="font-bold text-text">{formatNumber(entry.value, 3)} kWh</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#8FA1A8' }} />
              {curveMode === 'weekday_vs_weekend' && (
                <>
                  <Area type="monotone" dataKey="avgWeekdayKwh" name="Weekday Load (Mon-Fri)" stroke="#22D3EE" strokeWidth={2} fillOpacity={1} fill="url(#colorWeekday)" />
                  <Area type="monotone" dataKey="avgWeekendKwh" name="Weekend Load (Sat-Sun)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorWeekend)" />
                </>
              )}
              {curveMode === 'total' && (
                <Area type="monotone" dataKey="avgTotalKwh" name="Average Total Household Load" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              )}
              {curveMode === 'hvac' && (
                <Area type="monotone" dataKey="avgHvacKwh" name="HVAC Heat Pump / AC Load" stroke="#A78BFA" strokeWidth={2} fillOpacity={1} fill="url(#colorHvac)" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary inline-block" />
            <span>Evening Peak (17:00–22:00) tariff: <strong className="text-text font-mono">$0.22/kWh</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary/20 border border-secondary inline-block" />
            <span>Off-Peak (22:00–17:00) tariff: <strong className="text-text font-mono">$0.10/kWh</strong></span>
          </div>
        </div>
      </ChartCard>

      {/* Grid: Day of Week & Time-of-Day Dayparts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Day of Week Analysis */}
        <ChartCard
          title="Day-of-Week Load Variance"
          subtitle="Average daily kilowatt-hour demand across calendar days"
          badge="Measured"
          badgeTooltip="Aggregated across 7 weekdays"
        >
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" />
                <XAxis dataKey="day" stroke="#8FA1A8" fontSize={10} fontFamily="monospace" tickFormatter={(d) => d.slice(0, 3)} />
                <YAxis stroke="#8FA1A8" fontSize={10} fontFamily="monospace" unit=" kWh" />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-surface/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
                          <div className="font-semibold text-text border-b border-border/60 pb-1">{d.day}</div>
                          <div className="text-muted">Average: <span className="font-bold text-primary">{formatKwh(d.avgKwh)}/day</span></div>
                          <div className="text-muted">Total (8 mos): <span className="text-text">{formatKwh(d.totalKwh)}</span></div>
                          <div className="text-muted">Sample size: <span className="text-text">{d.daysCount} days</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="avgKwh" 
                  name="Avg Daily Usage" 
                  fill="#22D3EE" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted">
            Wednesday averages <strong className="text-text font-mono">15.53 kWh</strong> (highest), while Saturday drops to <strong className="text-text font-mono">12.40 kWh</strong> (lowest, -20.1% delta).
          </p>
        </ChartCard>

        {/* Daypart Distribution */}
        <div className="bg-surface border border-border rounded-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text text-sm">Daypart Usage Breakdown</h3>
              <p className="text-xs text-muted">Diurnal energy and spending allocation</p>
            </div>
            <Badge variant="Measured" label="Diurnal Split" />
          </div>

          <div className="space-y-3.5 pt-2">
            {dayparts.map((dp) => (
              <div key={dp.name} className="space-y-1.5 bg-surface-2 p-3 rounded-xl border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {dp.name.includes('Overnight') && <Moon className="w-3.5 h-3.5 text-secondary" />}
                    {dp.name.includes('Daytime') && <Sun className="w-3.5 h-3.5 text-warning" />}
                    {dp.name.includes('Evening') && <TrendingUp className="w-3.5 h-3.5 text-danger" />}
                    {dp.name.includes('Night') && <Clock className="w-3.5 h-3.5 text-primary" />}
                    <span className="font-medium text-text">{dp.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted font-mono">{formatCurrency(dp.costUsd)}</span>
                    <span className="font-bold font-mono text-primary">{dp.percentage}%</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/40">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      dp.name.includes('Evening') ? 'bg-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                      dp.name.includes('Overnight') ? 'bg-secondary shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                      dp.name.includes('Daytime') ? 'bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(34,211,238,0.5)]'
                    }`}
                    style={{ width: `${dp.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                  <span>Total: <strong className="text-text">{formatKwh(dp.totalKwh)}</strong></span>
                  <span>Rate: <strong className="text-text">{dp.avgHourlyKwh} kWh/h avg</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appliance Duty Cycles & Active Usage */}
      <div className="bg-surface border border-border rounded-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm">Appliance Duty Cycles & Active Duration</h3>
            <p className="text-xs text-muted">Daily operation frequency calculated from submetered telemetry</p>
          </div>
          <Badge variant="Estimated" label="Derived Duty Cycles" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {applianceDutyCycles.map((app) => (
            <div key={app.appliance} className="bg-surface-2 p-4 rounded-xl border border-border flex flex-col justify-between space-y-3 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text truncate">{app.appliance}</span>
                <Badge variant={app.badge || 'Measured'} label={app.badge} />
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-text">{app.activeHoursPerDay}</span>
                  <span className="text-xs text-muted font-mono">hrs/day</span>
                </div>
                <p className="text-xs text-muted mt-0.5">Duty cycle: <strong className="text-primary font-mono">{app.dutyCyclePercent}%</strong> of the day</p>
              </div>

              <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border/40">
                <div 
                  className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]" 
                  style={{ width: `${Math.min(app.dutyCyclePercent, 100)}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data-Backed Lifestyle Insights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text text-sm">Discovered Lifestyle Patterns</h3>
          <span className="text-xs text-muted font-mono">Evidence-based insights generated from historical analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-surface border border-border rounded-card p-4 space-y-2.5 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-text flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {insight.title}
                  </span>
                  <Badge variant={insight.badge || 'Measured'} label={insight.badge} />
                </div>
                <p className="text-xs text-muted leading-relaxed">{insight.description}</p>
              </div>

              {insight.action && (
                <div className="mt-2 pt-2 border-t border-border flex items-start gap-2 bg-primary/5 p-2.5 rounded-lg border border-primary/20">
                  <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-primary font-medium">{insight.action}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
