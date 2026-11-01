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
      const rawAlerts = res.data?.alerts || (Array.isArray(res.data) ? res.data : []);
      setAlerts(Array.isArray(rawAlerts) ? rawAlerts : []);
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
      setAlerts(prev => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map(a => a.id === alertId ? { ...a, is_read: true } : a);
      });
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const alertList = Array.isArray(alerts) ? alerts : [];
      const unreadAlerts = alertList.filter(a => !a.is_read);
      await Promise.all(unreadAlerts.map(a => api.patch(`/alerts/${a.id}/read`)));
      setAlerts(prev => {
        const list = Array.isArray(prev) ? prev : [];
        return list.map(a => ({ ...a, is_read: true }));
      });
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

  const alertList = Array.isArray(alerts) ? alerts : [];

  // Filter logic
  const filteredAlerts = alertList.filter(alert => {
    if (filterRule !== 'ALL' && alert.rule_id !== filterRule) return false;
    if (filterStatus === 'UNREAD' && alert.is_read) return false;
    if (filterStatus === 'READ' && !alert.is_read) return false;
    return true;
  });

  const latestAlert = filteredAlerts[0];
  const archiveAlerts = filteredAlerts.slice(1);
  const unreadCount = alertList.filter(a => !a.is_read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Energy Alerts & Notification Stream"
        subtitle="Rule-detected notifications and deterministic actionable tips triggered by IoT events"
        badge={<Badge variant="Measured" label={`${alertList.length} Total Alerts`} />}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5 text-primary" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-primary' : 'text-primary'}`} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-surface border border-border rounded-card p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-muted uppercase">Rule Filter:</span>
          {['ALL', 'R1', 'R2', 'R3'].map(rule => (
            <button
              key={rule}
              onClick={() => setFilterRule(rule)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterRule === rule
                  ? 'bg-primary text-black shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                  : 'bg-surface-2 text-muted hover:text-text border border-border'
              }`}
            >
              {rule}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-muted uppercase">Status:</span>
          {['ALL', 'UNREAD', 'READ'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-primary text-black shadow-[0_0_8px_rgba(34,211,238,0.25)]'
                  : 'bg-surface-2 text-muted hover:text-text border border-border'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alert Feed */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No Alerts Match Your Filters"
          description="Adjust the rule or status filter above to view historical notifications."
        />
      ) : (
        <div className="space-y-6">
          {/* Latest / Most Recent Alert Featured Card */}
          {latestAlert && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                  Latest Active Alert
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Triggered at {latestAlert.reading_timestamp}
                </span>
              </div>
              <AlertCard alert={latestAlert} onMarkRead={handleMarkRead} />
            </div>
          )}

          {/* Collapsible Alert Archive */}
          {archiveAlerts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <button
                  onClick={() => setArchiveOpen(prev => !prev)}
                  className="flex items-center gap-2 text-xs font-semibold text-text hover:text-primary transition-colors font-mono"
                >
                  {archiveOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                  <span>Alert Archive ({archiveAlerts.length})</span>
                </button>
                <span className="text-xs font-mono text-muted">Historical event audit trail</span>
              </div>

              {archiveOpen && (
                <div className="space-y-3">
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
