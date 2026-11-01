import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Filter, 
  RefreshCw, 
  CheckCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Flame,
  Moon,
  Wind
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import AlertCard from '../../components/cards/AlertCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filterRule, setFilterRule] = useState('ALL'); // 'ALL' | 'R1' | 'R2' | 'R3'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [archiveOpen, setArchiveOpen] = useState(true);

  const fetchAlerts = async () => {
    try {
      setError(null);
      const res = await api.get('/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAlerts();
  };

  const handleMarkRead = async (alertId) => {
    try {
      await api.patch(`/alerts/${alertId}/read`);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unreadAlerts = alerts.filter(a => !a.is_read);
      await Promise.all(unreadAlerts.map(a => api.patch(`/alerts/${a.id}/read`)));
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Alerts" subtitle="Loading alert registry..." />
        <LoadingState message="Fetching rule-triggered notifications and advice..." rows={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Energy Alerts" subtitle="Notification Stream" />
        <ErrorState title="Alert Feed Error" message={error} onRetry={fetchAlerts} />
      </div>
    );
  }

  // Filter logic
  const filteredAlerts = alerts.filter(alert => {
    if (filterRule !== 'ALL' && alert.rule_id !== filterRule) return false;
    if (filterStatus === 'UNREAD' && alert.is_read) return false;
    if (filterStatus === 'READ' && !alert.is_read) return false;
    return true;
  });

  const latestAlert = filteredAlerts[0];
  const archiveAlerts = filteredAlerts.slice(1);
  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Energy Alerts & Advisory"
        subtitle="Rule-detected inefficiencies paired with deterministic energy coaching advice"
        badge={<Badge variant="Measured" label={`${alerts.length} Total Events`} />}
        actions={
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-border text-xs font-mono font-medium text-text border border-border transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-primary" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-border text-xs font-mono font-medium text-text border border-border transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : ''}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        }
      />

      {/* Filter and Rule Chips */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface border border-border rounded-card p-4">
        {/* Rule Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Rule:
          </span>
          <button
            onClick={() => setFilterRule('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filterRule === 'ALL'
                ? 'bg-primary text-bg font-bold'
                : 'bg-surface-2 text-muted hover:text-text border border-border'
            }`}
          >
            All Rules ({alerts.length})
          </button>
          <button
            onClick={() => setFilterRule('R1')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              filterRule === 'R1'
                ? 'bg-rule-r1 text-bg font-bold'
                : 'bg-surface-2 text-rule-r1 hover:bg-surface-2/80 border border-rule-r1/30'
            }`}
          >
            <Flame className="w-3 h-3" />
            R1: Peak Shift
          </button>
          <button
            onClick={() => setFilterRule('R2')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              filterRule === 'R2'
                ? 'bg-rule-r2 text-bg font-bold'
                : 'bg-surface-2 text-rule-r2 hover:bg-surface-2/80 border border-rule-r2/30'
            }`}
          >
            <Moon className="w-3 h-3" />
            R2: Night Heating
          </button>
          <button
            onClick={() => setFilterRule('R3')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
              filterRule === 'R3'
                ? 'bg-rule-r3 text-bg font-bold'
                : 'bg-surface-2 text-rule-r3 hover:bg-surface-2/80 border border-rule-r3/30'
            }`}
          >
            <Wind className="w-3 h-3" />
            R3: Free Cooling
          </button>
        </div>

        {/* Read / Unread Filter */}
        <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs font-mono">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded ${filterStatus === 'ALL' ? 'bg-border text-text font-bold' : 'text-muted hover:text-text'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('UNREAD')}
            className={`px-2.5 py-1 rounded flex items-center gap-1 ${filterStatus === 'UNREAD' ? 'bg-border text-warning font-bold' : 'text-muted hover:text-text'}`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-warning" />
            )}
          </button>
          <button
            onClick={() => setFilterStatus('READ')}
            className={`px-2.5 py-1 rounded ${filterStatus === 'READ' ? 'bg-border text-text font-bold' : 'text-muted hover:text-text'}`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Main Alerts Content */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Alerts Found"
          description="There are no alert events matching the selected filter criteria."
        />
      ) : (
        <div className="space-y-6">
          {/* Latest Alert Spotlight */}
          {latestAlert && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="w-4 h-4" />
                <span>Most Recent Alert</span>
              </div>
              <AlertCard alert={latestAlert} onMarkRead={handleMarkRead} />
            </div>
          )}

          {/* Collapsible Historical Archive */}
          {archiveAlerts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                onClick={() => setArchiveOpen(!archiveOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-2 border border-border text-xs font-semibold text-text transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>Prior Alerts Archive</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-2 text-muted text-[11px] font-mono border border-border">
                    {archiveAlerts.length}
                  </span>
                </div>
                {archiveOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
              </button>

              {archiveOpen && (
                <div className="space-y-4 pt-2">
                  {archiveAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} onMarkRead={handleMarkRead} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

