import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  TrendingDown, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Flame, 
  Wind, 
  Bot, 
  RefreshCw,
  Sun,
  Moon,
  Sliders,
  DollarSign,
  Layers
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/utils.js';

export default function SmartScheduling() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedSchedules, setAppliedSchedules] = useState({});

  const fetchSchedules = async () => {
    try {
      setError(null);
      const res = await api.get('/scheduling');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load scheduling data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch schedule recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
  };

  const handleApplySchedule = (scheduleId) => {
    setAppliedSchedules(prev => ({
      ...prev,
      [scheduleId]: true
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Smart Scheduling" subtitle="Evaluating tariff arbitrage and appliance optimization schedules..." />
        <LoadingState message="Calculating off-peak run times and cost savings..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Smart Scheduling" subtitle="Scheduling Engine Status" />
        <ErrorState title="Optimization Error" message={error} onRetry={fetchSchedules} />
      </div>
    );
  }

  const { schedules = [], summary = {}, tariffWindows = [] } = data || {};

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'hvac': return Wind;
      case 'dishwasher': return Zap;
      case 'washer_dryer': return Layers;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Smart Appliance Scheduling"
        subtitle="Tariff-aware run time recommendations, hypothetical schedule comparisons, and explainable optimization"
        badge={<Badge variant="Estimated" label="Tariff Arbitrage Model" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Recalculating...' : 'Recalculate'}</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Potential Annual Savings"
          value={formatCurrency(summary.totalPotentialAnnualSavingsUsd || 214.19)}
          subtitle={`${formatCurrency(summary.totalPotentialMonthlySavingsUsd || 17.85)} / month`}
          icon={TrendingDown}
          badge="Estimated"
          accent="primary"
        />
        <StatCard
          title="Off-Peak Tariff Arbitrage"
          value="54.5% cheaper"
          subtitle="$0.10/kWh vs $0.22/kWh peak"
          icon={DollarSign}
          badge="Measured"
          accent="info"
        />
        <StatCard
          title="Peak Demand Window"
          value="17:00 - 22:00"
          subtitle="5 hours daily penalty rate"
          icon={Clock}
          badge="Measured"
          accent="warning"
        />
        <StatCard
          title="Optimizable Loads"
          value="3 Appliances"
          subtitle="HVAC, Dishwasher, Washer/Dryer"
          icon={Sparkles}
          badge="Estimated"
          accent="primary"
        />
      </div>

      {/* 24-Hour Tariff Window Visualizer */}
      <div className="bg-surface border border-border rounded-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text text-sm">24-Hour Diurnal Tariff Schedule</h3>
            <p className="text-xs text-muted">Optimal load placement across time-of-use pricing windows</p>
          </div>
          <Badge variant="Measured" label="Time of Use (TOU)" />
        </div>

        {/* Visual timeline bar */}
        <div className="w-full h-9 rounded-xl overflow-hidden flex border border-border text-[11px] font-mono shadow-inner">
          <div className="w-[70.8%] bg-primary/15 border-r border-border text-primary flex items-center justify-center font-semibold">
            <Sun className="w-3.5 h-3.5 mr-1 text-primary" />
            <span>Off-Peak (00:00–17:00) $0.10/kWh</span>
          </div>
          <div className="w-[20.8%] bg-danger/20 border-r border-border text-danger flex items-center justify-center font-semibold">
            <Clock className="w-3.5 h-3.5 mr-1 text-danger" />
            <span>Peak (17:00–22:00) $0.22/kWh</span>
          </div>
          <div className="w-[8.4%] bg-primary/15 text-primary flex items-center justify-center font-semibold">
            <Moon className="w-3.5 h-3.5 mr-1 text-primary" />
            <span>$0.10</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-xs text-muted font-mono pt-1">
          <span>00:00 Overnight</span>
          <span>06:00 Morning</span>
          <span>12:00 Midday</span>
          <span className="text-danger font-semibold">17:00 Peak Starts</span>
          <span className="text-primary font-semibold">22:00 Off-Peak Returns</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Recommended Schedules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text text-sm">Hypothetical Schedule Comparison Matrix</h3>
          <span className="text-xs text-muted font-mono">Current routine vs. Recommended off-peak window</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schedules.map((item) => {
            const Icon = getDeviceIcon(item.deviceType);
            const isApplied = appliedSchedules[item.id];
            const isOptimal = item.status === 'optimal';

            return (
              <div 
                key={item.id} 
                className="bg-surface border border-border rounded-card p-5 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text">{item.appliance}</h4>
                        <span className="text-xs text-muted font-mono">{item.powerRatingWatts}W rating • {item.energyPerCycleKwh} kWh/run</span>
                      </div>
                    </div>
                    {item.annualSavingsUsd > 0 ? (
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-primary">
                          +${item.annualSavingsUsd.toFixed(2)}/yr
                        </span>
                        <div className="text-[11px] text-muted">Save {item.savingsPercent}%</div>
                      </div>
                    ) : (
                      <Badge variant="Measured" label="Already Optimal" />
                    )}
                  </div>

                  {/* Schedule Comparison Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3">
                    {/* Current Schedule */}
                    <div className={`p-3 rounded-xl border ${
                      item.currentSchedule.isPeak ? 'bg-danger/10 border-danger/30' : 'bg-surface-2 border-border'
                    }`}>
                      <div className="text-[10px] text-muted uppercase tracking-wider font-semibold font-mono">Current Routine</div>
                      <div className="text-sm font-bold font-mono text-text mt-1">{item.currentSchedule.time}</div>
                      <div className="text-xs text-muted mt-0.5">{item.currentSchedule.window}</div>
                      <div className="text-xs font-mono font-medium text-danger mt-2">
                        {formatCurrency(item.currentSchedule.costPerCycleUsd)} / run
                      </div>
                    </div>

                    {/* Recommended Schedule */}
                    <div className="p-3 rounded-xl border bg-primary/10 border-primary/30">
                      <div className="text-[10px] text-primary uppercase tracking-wider font-semibold font-mono flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span>Recommended</span>
                      </div>
                      <div className="text-sm font-bold font-mono text-text mt-1">{item.recommendedSchedule.time}</div>
                      <div className="text-xs text-muted mt-0.5">{item.recommendedSchedule.window}</div>
                      <div className="text-xs font-mono font-medium text-primary mt-2">
                        {formatCurrency(item.recommendedSchedule.costPerCycleUsd)} / run
                      </div>
                    </div>
                  </div>

                  {/* Explainable Reasoning */}
                  <div className="bg-surface-2 p-3.5 rounded-xl border border-border/60 text-xs text-muted leading-relaxed">
                    <strong className="text-text block mb-1">Reasoning & Evidence:</strong>
                    {item.reasoning}
                  </div>
                </div>

                {/* Action button */}
                {!isOptimal && (
                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <Badge variant={item.badge || 'Estimated'} label={item.badge} />
                    <button
                      onClick={() => handleApplySchedule(item.id)}
                      disabled={isApplied}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isApplied 
                          ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]' 
                          : 'bg-primary text-black hover:bg-primary-hover shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Schedule Activated</span>
                        </>
                      ) : (
                        <>
                          <span>Apply Smart Schedule</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
