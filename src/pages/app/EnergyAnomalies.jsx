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
  Info
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
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
      case 'hvac': return Flame;
      case 'dishwasher': return Wind;
      case 'washer_dryer': return Zap;
      default: return Bot;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Energy Anomalies & Pattern Deviations"
        subtitle="Identified statistical deviations beyond 3-sigma thresholds (labelled as unusual, not equipment faults)"
        badge={<Badge variant="Estimated" label="3-Sigma Bounds" />}
        action={
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Scan Anomalies
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Unusual Events"
          value={totalAnomaliesCount}
          subvalue="Exceeding 3σ baseline bounds"
          icon={AlertTriangle}
          badge={<Badge variant="Estimated" label="3σ Filtered" />}
        />
        <StatCard
          title="Elevated Deviations"
          value={severityBreakdown.high || 0}
          subvalue="High demand during peak tariff"
          icon={ShieldAlert}
          badge={<Badge variant="Estimated" label="High Deviation" />}
        />
        <StatCard
          title="Moderate Variances"
          value={severityBreakdown.medium || 0}
          subvalue="Extended cycle durations"
          icon={AlertTriangle}
          badge={<Badge variant="Measured" label="Medium" />}
        />
        <StatCard
          title="Minor Variances"
          value={severityBreakdown.low || 0}
          subvalue="Deep-clean cycle variations"
          icon={Info}
          badge={<Badge variant="Measured" label="Low" />}
        />
      </div>

      {/* Filter and Events Table */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-text text-sm">Detected Unusual Consumption Events</h3>
            <p className="text-xs text-muted">Telemetry rows exhibiting statistically significant load spikes</p>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs">
            {['all', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded font-medium transition-colors capitalize ${
                  severityFilter === sev ? 'bg-primary text-black font-semibold' : 'text-muted hover:text-text'
                }`}
              >
                {sev === 'all' ? 'All Deviations' : `${sev} Severity`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 text-muted border-b border-border">
              <tr>
                <th className="py-2.5 px-3 font-medium">Timestamp</th>
                <th className="py-2.5 px-3 font-medium">Appliance</th>
                <th className="py-2.5 px-3 font-medium">Observed Draw</th>
                <th className="py-2.5 px-3 font-medium">Expected Mean</th>
                <th className="py-2.5 px-3 font-medium">Deviation</th>
                <th className="py-2.5 px-3 font-medium">Severity</th>
                <th className="py-2.5 px-3 font-medium">Context & Mitigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAnomalies.map((anom) => {
                const Icon = getDeviceIcon(anom.deviceType);
                return (
                  <tr key={anom.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted whitespace-nowrap">{anom.timestamp}</td>
                    <td className="py-3 px-3 font-medium text-text flex items-center gap-2 whitespace-nowrap">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      {anom.appliance}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-rose-400">{anom.measuredKwh} kWh</td>
                    <td className="py-3 px-3 font-mono text-muted">{anom.baselineExpectedKwh} kWh</td>
                    <td className="py-3 px-3 font-mono font-semibold text-amber-400">+{anom.deviationPercent}%</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase ${
                        anom.severity === 'high'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : anom.severity === 'medium'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                      }`}>
                        {anom.severity}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-md">
                      <div className="font-semibold text-text text-xs">{anom.label}</div>
                      <p className="text-muted text-[11px] mt-0.5">{anom.possibleExplanation}</p>
                      <div className="text-primary text-[11px] mt-1 font-medium flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 shrink-0" />
                        {anom.suggestedAction}
                      </div>
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

