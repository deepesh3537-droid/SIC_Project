import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  Wind, 
  Zap, 
  Bot, 
  ShieldAlert, 
  ArrowRight, 
  Filter, 
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Activity
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { formatNumber } from '../../lib/utils.js';

export default function EnergyAnomalies() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all'); // 'all' | 'high' | 'medium' | 'low'

  const fetchAnomaliesData = async () => {
    try {
      setError(null);
      const res = await api.get('/anomalies');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load anomalies:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch anomaly records');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnomaliesData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnomaliesData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Anomalies" subtitle="Scanning historical readings for statistical deviations..." />
        <LoadingState message="Detecting unusual load variations against 3-sigma thresholds..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Anomalies" subtitle="Anomaly Detector Status" />
        <ErrorState title="Detection Error" message={error} onRetry={fetchAnomaliesData} />
      </div>
    );
  }

  const { totalAnomaliesCount = 0, severityBreakdown = {}, anomalies = [] } = data || {};

  const filteredAnomalies = severityFilter === 'all'
    ? anomalies
    : anomalies.filter(a => a.severity === severityFilter);

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
        title="Energy Anomalies & Pattern Deviations"
        subtitle="Identified statistical deviations beyond 3-sigma thresholds (labelled as unusual, not equipment faults)"
        badge={<Badge variant="Estimated" label="3-Sigma Bounds" />}
        actions={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
            <span>{refreshing ? 'Scanning...' : 'Scan Anomalies'}</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Detected Unusual Events"
          value={totalAnomaliesCount}
          subtitle="Beyond 3-sigma baseline envelope"
          icon={AlertTriangle}
          badge="Estimated"
          accent="warning"
        />
        <StatCard
          title="High Deviation Count"
          value={severityBreakdown.high || 0}
          subtitle="&gt; 4.0σ extreme spikes"
          icon={Flame}
          badge="Estimated"
          accent="danger"
        />
        <StatCard
          title="Moderate Deviations"
          value={severityBreakdown.medium || 0}
          subtitle="3.0σ – 4.0σ variance range"
          icon={Activity}
          badge="Estimated"
          accent="warning"
        />
        <StatCard
          title="Baseline Safety Margin"
          value="99.73%"
          subtitle="Gaussian distribution bound"
          icon={ShieldAlert}
          badge="Measured"
          accent="primary"
        />
      </div>

      {/* Severity Filter Pills */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-muted uppercase">Filter Severity:</span>
          {['all', 'high', 'medium', 'low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-primary text-black shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                  : 'bg-surface-2 text-muted hover:text-text border border-border'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <div className="text-xs font-mono text-muted">
          Showing {filteredAnomalies.length} of {totalAnomaliesCount} deviations
        </div>
      </div>

      {/* Anomalies List */}
      {filteredAnomalies.length === 0 ? (
        <EmptyState
          title="No Matching Unusual Events"
          description="All appliance circuits operated within normal Gaussian envelopes for this filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAnomalies.map((anom) => {
            const Icon = getDeviceIcon(anom.deviceType);
            const isHigh = anom.severity === 'high';
            const isMed = anom.severity === 'medium';

            return (
              <div
                key={anom.id}
                className="bg-surface border border-border rounded-card p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-text">{anom.applianceName}</h4>
                        <span className="text-xs font-mono text-muted">{anom.timestamp}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${
                      isHigh
                        ? 'bg-danger/10 text-danger border-danger/30'
                        : isMed
                        ? 'bg-warning/10 text-warning border-warning/30'
                        : 'bg-surface-2 text-muted border-border'
                    }`}>
                      {anom.severity}
                    </span>
                  </div>

                  {/* Metrics Box */}
                  <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-surface-2 border border-border/60 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-muted uppercase">Observed Draw</span>
                      <p className="font-bold text-text text-sm mt-0.5">{anom.observedKwh} kWh</p>
                      <p className="text-[10px] text-danger mt-0.5">+{anom.deviationPercent}% vs mean</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted uppercase">3σ Threshold</span>
                      <p className="font-bold text-warning text-sm mt-0.5">{anom.expectedThresholdKwh} kWh</p>
                      <p className="text-[10px] text-muted mt-0.5">Z-score: {anom.zScore}σ</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {anom.explanation}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono">
                  <span className="text-muted">Status:</span>
                  <span className="text-primary font-semibold">Flagged for Review</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
