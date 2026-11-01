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
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Sustainability & Carbon Intelligence"
        subtitle="Transparent carbon accounting, household ecological goals, emissions trends, and green badges"
        badge={<Badge variant="Assumption" label="Factor: 0.385 kg/kWh" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0D1520] border border-[#1F334D] text-xs font-semibold text-slate-200 hover:text-white hover:border-cyan-500/40 hover:bg-[#142338] transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Footprint
          </button>
        }
      />

      {/* ADR-012 Factor Disclosure Banner */}
      <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-4.5 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-100 flex items-center gap-2">
              Carbon Factor Transparency (ADR-012)
              <Badge variant="Assumption" label="Disclosed Assumption" />
            </div>
            <p className="text-slate-400 mt-1 leading-relaxed">
              Carbon emissions are not measured directly in raw IoT meters. Calculated via configured factor of <strong className="text-emerald-400 font-mono font-semibold">{factorConfig.carbonFactorKgPerKwh} kg CO₂e / kWh</strong> ({factorConfig.carbonSource}).
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
              <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" opacity={0.6} />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} unit=" kg" tickLine={false} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0B131E]/95 border border-[#1F334D] p-3 rounded-xl shadow-xl text-xs space-y-1.5 backdrop-blur-md">
                        <div className="font-semibold text-slate-100">{d.label}</div>
                        <div className="text-slate-400">Carbon: <span className="font-mono font-bold text-emerald-400">{d.carbonKg} kg CO₂e</span></div>
                        <div className="text-slate-400">Energy: <span className="font-mono text-slate-200">{d.totalKwh} kWh</span></div>
                        <div className="text-slate-400">Tree Offset: <span className="font-mono text-slate-200">~{d.treesEquivalent} trees</span></div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <ReferenceLine y={200} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target Ceiling: 200 kg', fill: '#EF4444', fontSize: 10, position: 'top' }} />
              <Area type="monotone" dataKey="carbonKg" name="Emissions (kg CO₂e)" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCarbon)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Eco-Achievements & Milestones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Sustainability Milestones & Badges</h3>
            <p className="text-xs text-slate-400 mt-0.5">Earned achievements for verified low-carbon operation and conservation</p>
          </div>
          <Badge variant="Audited" label="Automated Verification" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={`border rounded-2xl p-4.5 flex flex-col justify-between space-y-3 transition-all duration-200 backdrop-blur-md ${
                ach.unlocked 
                  ? 'bg-gradient-to-b from-[#0D1F1A]/80 to-[#0A1617]/80 border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-950/20' 
                  : 'bg-[#0D1520]/80 border-[#1F334D] hover:border-[#2A4566]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  ach.unlocked 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10' 
                    : 'bg-[#152336] text-slate-500 border border-[#1F334D]'
                }`}>
                  <Award className="w-4 h-4" />
                </div>
                <Badge variant={ach.unlocked ? 'Measured' : 'Estimated'} label={ach.badge} />
              </div>

              <div>
                <h4 className="font-semibold text-xs text-slate-100">{ach.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
              </div>

              <div className="pt-2 border-t border-[#1F334D]/80 flex items-center justify-between text-[11px]">
                {ach.unlocked ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked: {ach.unlockedDate}
                  </span>
                ) : (
                  <div className="w-full space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono text-cyan-400 font-bold">{ach.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-[#152336] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-300" 
                        style={{ width: `${ach.progressPercent}%` }} 
                      />
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
