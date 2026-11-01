import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Flame, 
  Wind, 
  Zap, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { formatNumber } from '../../lib/utils.js';

export default function ApplianceHealth() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHealthData = async () => {
    try {
      setError(null);
      const res = await api.get('/anomalies/health');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load appliance health:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch appliance health metrics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchHealthData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Appliance Health" subtitle="Evaluating submetered circuit baselines and efficiency index..." />
        <LoadingState message="Computing statistical baselines and operating health scores..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Appliance Health" subtitle="Health Monitor Status" />
        <ErrorState title="Telemetry Error" message={error} onRetry={fetchHealthData} />
      </div>
    );
  }

  const { overallSystemHealth = 95, statusText = '', appliances = [] } = data || {};

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
        title="Appliance Health & Baselines"
        subtitle="Statistical consumption baselines, efficiency index, and preventive maintenance guides (labeled unusual, never fault)"
        badge={<Badge variant="Estimated" label="Statistical Baseline Index" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Baselines'}</span>
          </button>
        }
      />

      {/* System Health Overview Banner */}
      <div className="bg-surface border border-border rounded-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_20px_rgba(34,211,238,0.04)]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-text">Household Fleet Health Index: {overallSystemHealth}/100</h3>
              <Badge variant="Estimated" label="Optimal Baseline" />
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed max-w-2xl">{statusText}</p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-1.5 shrink-0 bg-surface-2 p-3.5 rounded-xl border border-border">
          <div className="flex justify-between text-xs">
            <span className="text-muted">Fleet Efficiency Score</span>
            <span className="font-mono font-bold text-primary">{overallSystemHealth}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden border border-border/40">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
              style={{ width: `${overallSystemHealth}%` }} 
            />
          </div>
        </div>
      </div>

      {/* Per-Appliance Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {appliances.map((app) => {
          const Icon = getDeviceIcon(app.type);
          const { baseline = {} } = app;

          return (
            <div 
              key={app.id} 
              className="bg-surface border border-border rounded-card p-5 space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-text">{app.name}</h4>
                      <span className="text-xs text-muted font-mono">{app.powerRatingWatts}W rated capacity</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold font-mono text-primary">{app.healthScore}%</span>
                    <div className="text-[11px] text-muted">{app.healthStatus}</div>
                  </div>
                </div>

                {/* Baseline Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3">
                  <div className="bg-surface-2 p-2.5 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-mono uppercase">Hourly Mean</div>
                    <div className="font-mono font-bold text-text text-xs mt-0.5">{baseline.meanHourlyKwh} kWh</div>
                  </div>
                  <div className="bg-surface-2 p-2.5 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-mono uppercase">Active Mean</div>
                    <div className="font-mono font-bold text-text text-xs mt-0.5">{baseline.activeMeanKwh} kWh</div>
                  </div>
                  <div className="bg-surface-2 p-2.5 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-mono uppercase">Std Dev (σ)</div>
                    <div className="font-mono font-bold text-text text-xs mt-0.5">{baseline.stdKwh} kWh</div>
                  </div>
                  <div className="bg-surface-2 p-2.5 rounded-lg border border-border/60">
                    <div className="text-[10px] text-muted font-mono uppercase">Unusual (3σ)</div>
                    <div className="font-mono font-bold text-warning text-xs mt-0.5">&gt;{baseline.unusualThresholdKwh}</div>
                  </div>
                </div>

                {/* Observation Summary */}
                <p className="text-xs text-muted leading-relaxed mt-1">
                  {app.observationSummary}
                </p>
              </div>

              {/* Preventive Maintenance Suggestions */}
              <div className="mt-4 pt-3 border-t border-border space-y-2 bg-surface-2 p-3.5 rounded-xl border border-border/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text">
                  <Wrench className="w-3.5 h-3.5 text-primary" />
                  <span>Preventive Maintenance Checklist</span>
                </div>
                <div className="space-y-1.5">
                  {(app.maintenanceSuggestions || []).map((sug, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{sug}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
