import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Award, 
  TrendingDown, 
  Target, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  RefreshCw,
  Sun,
  Moon,
  Info,
  Trees,
  Flame,
  Wind,
  Zap,
  Bot
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
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
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatNumber } from '../../lib/utils.js';

export default function SustainabilityCenter() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSustainabilityData = async () => {
    try {
      setError(null);
      const res = await api.get('/sustainability');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load sustainability metrics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch carbon intelligence');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSustainabilityData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSustainabilityData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sustainability Center" subtitle="Calculating carbon ledger and ecological impact..." />
        <LoadingState message="Deriving emissions ledger using configured EPA factor..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sustainability Center" subtitle="Carbon Accounting Status" />
        <ErrorState title="Telemetry Error" message={error} onRetry={fetchSustainabilityData} />
      </div>
    );
  }

  const { factorConfig = {}, summary = {}, monthlyTrend = [], achievements = [] } = data || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Sustainability & Carbon Intelligence"
        subtitle="Transparent carbon accounting, household ecological goals, emissions trends, and green badges"
        badge={<Badge variant="Assumption" label="Factor: 0.385 kg/kWh" />}
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Footprint
          </button>
        }
      />

      {/* ADR-012 Factor Disclosure Banner */}
      <div className="bg-surface-2 border border-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-text flex items-center gap-2">
              Carbon Factor Transparency (ADR-012)
              <Badge variant="Assumption" label="Disclosed Assumption" />
            </div>
            <p className="text-muted mt-0.5">
              Carbon emissions are not measured directly in raw IoT meters. Calculated via configured factor of <strong className="text-text font-mono">{factorConfig.carbonFactorKgPerKwh} kg CO₂e / kWh</strong> ({factorConfig.carbonSource}).
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Carbon Footprint"
          value={`${formatNumber(summary.totalCarbonEmittedKg, 1)} kg`}
          subvalue={`${summary.totalCarbonEmittedTons} metric tons (8 mos)`}
          icon={Leaf}
          badge={<Badge variant="Estimated" label="Total CO₂e" />}
        />
        <StatCard
          title="Average Monthly Emissions"
          value={`${formatNumber(summary.averageMonthlyCarbonKg, 1)} kg`}
          subvalue="Across 8 months of observation"
          icon={TrendingDown}
          badge={<Badge variant="Estimated" label="Monthly Avg" />}
        />
        <StatCard
          title="Tree Sequestration Equiv."
          value={`~${summary.totalTreesEquivalent} trees`}
          subvalue="Annual tree absorption capacity"
          icon={Trees}
          badge={<Badge variant="Estimated" label="Offset" />}
        />
        <StatCard
          title="Monthly Carbon Ceiling Goal"
          value={`${summary.monthlyGoalCeilingKg} kg`}
          subvalue={`${summary.currentGoalProgressPercent}% of target limit`}
          icon={Target}
          badge={<Badge variant="Estimated" label="Eco Goal" />}
        />
      </div>

      {/* Monthly Carbon Trend Chart */}
      <ChartCard
        title="Monthly Carbon Emissions Trajectory"
        subtitle="Emissions trajectory in kg CO₂e compared against the 200 kg household monthly ceiling goal"
        badge={<Badge variant="Estimated" label="eGRID Derived" />}
      >
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#22272e" />
              <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} unit=" kg" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-surface border border-border p-3 rounded-lg shadow-lg text-xs space-y-1">
                        <div className="font-semibold text-text">{d.label}</div>
                        <div className="text-muted">Carbon: <span className="font-mono font-bold text-emerald-400">{d.carbonKg} kg CO₂e</span></div>
                        <div className="text-muted">Energy: <span className="font-mono text-text">{d.totalKwh} kWh</span></div>
                        <div className="text-muted">Tree Offset: <span className="font-mono text-text">~{d.treesEquivalent} trees</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <ReferenceLine y={200} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target Ceiling: 200 kg', fill: '#EF4444', fontSize: 10, position: 'top' }} />
              <Area type="monotone" dataKey="carbonKg" name="Emissions (kg CO₂e)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorCarbon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Eco-Achievements & Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text text-sm">Sustainability Milestones & Badges</h3>
          <span className="text-xs text-muted">Earned achievements for verified low-carbon operation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div key={ach.id} className="bg-surface border border-border rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  ach.unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-surface-2 text-muted border border-border'
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <Badge variant={ach.unlocked ? 'Measured' : 'Estimated'} label={ach.badge} />
              </div>

              <div>
                <h4 className="font-semibold text-xs text-text">{ach.title}</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">{ach.description}</p>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                {ach.unlocked ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {ach.unlockedDate}
                  </span>
                ) : (
                  <div className="w-full space-y-1">
                    <div className="flex justify-between text-muted">
                      <span>Progress</span>
                      <span className="font-mono text-text font-bold">{ach.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-surface-2 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${ach.progressPercent}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

