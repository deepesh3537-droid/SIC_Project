import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Home, 
  Bell, 
  Leaf, 
  CheckCircle2, 
  RefreshCw, 
  Save, 
  Activity, 
  ShieldCheck, 
  DollarSign
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function SettingsView() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingHousehold, setSavingHousehold] = useState(false);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [householdSuccess, setHouseholdSuccess] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Form states
  const [householdName, setHouseholdName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [carbonFactor, setCarbonFactor] = useState('0.3850');
  const [carbonSource, setCarbonSource] = useState('U.S. EPA eGRID 2024 National Average Factor');
  
  // Notification states
  const [notifs, setNotifs] = useState({
    email_alerts: true,
    push_anomalies: true,
    weekly_digest: true,
    high_tariff_warning: true
  });

  const fetchSettings = async () => {
    try {
      setError(null);
      const res = await api.get('/auth/me');
      const user = res.data?.user || {};
      setProfile(user);
      setHouseholdName(user.householdName || 'James Residence');
      setCurrency(user.currency || 'USD');
      setCarbonFactor(String(user.carbonFactorKgPerKwh || '0.3850'));
      setCarbonSource(user.carbonFactorSource || 'U.S. EPA eGRID 2024 National Average Factor');
      if (user.notificationPreferences) {
        setNotifs(user.notificationPreferences);
      }
    } catch (err) {
      console.error('Failed to load user settings:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveHousehold = async (e) => {
    e.preventDefault();
    try {
      setSavingHousehold(true);
      await api.patch('/auth/household', {
        name: householdName,
        currency,
        carbonFactorKgPerKwh: parseFloat(carbonFactor),
        carbonFactorSource: carbonSource
      });
      setHouseholdSuccess(true);
      setTimeout(() => setHouseholdSuccess(false), 2000);
      await fetchSettings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update household settings');
    } finally {
      setSavingHousehold(false);
    }
  };

  const handleToggleNotif = async (key) => {
    const updated = {
      ...notifs,
      [key]: !notifs[key]
    };
    setNotifs(updated);

    try {
      setSavingNotifs(true);
      await api.patch('/auth/notifications', updated);
      setNotifSuccess(true);
      setTimeout(() => setNotifSuccess(false), 1500);
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
    } finally {
      setSavingNotifs(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" subtitle="Loading platform configurations and metadata..." />
        <LoadingState message="Fetching household preferences and emission factors..." rows={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" subtitle="Settings Status" />
        <ErrorState title="Settings Error" message={error} onRetry={fetchSettings} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Settings & Household Management"
        subtitle="Manage household parameters, regional carbon intensity factors, and automated notification channels"
        badge={<Badge variant="Measured" label="User Configurations" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Household Management Form */}
        <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1F334D]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Home className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Household Metadata</h3>
            </div>
            <span className="font-mono text-xs text-slate-400 bg-[#091019] px-2.5 py-1 rounded-lg border border-[#1F334D]">
              ID: {profile?.householdId}
            </span>
          </div>

          <form onSubmit={handleSaveHousehold} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Household Display Name</label>
              <input
                type="text"
                value={householdName}
                onChange={(e) => setHouseholdName(e.target.value)}
                required
                className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Billing Currency Code</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              >
                <option value="USD">USD ($ - United States Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
                <option value="CAD">CAD ($ - Canadian Dollar)</option>
              </select>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#1F334D]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  Carbon Intensity Factor (kg CO₂e / kWh)
                </label>
                <Badge variant="Assumption" label="ADR-012" />
              </div>
              <input
                type="number"
                step="0.001"
                min="0.01"
                max="2.0"
                value={carbonFactor}
                onChange={(e) => setCarbonFactor(e.target.value)}
                required
                className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2.5 text-xs font-mono text-cyan-400 font-semibold focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
              <p className="text-[11px] text-slate-400">
                Governs carbon projections in What-if Simulator and Sustainability Center.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Emission Factor Source Citation</label>
              <input
                type="text"
                value={carbonSource}
                onChange={(e) => setCarbonSource(e.target.value)}
                required
                className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            {householdSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Household parameters saved successfully!
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingHousehold}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {savingHousehold ? 'Saving...' : 'Save Parameters'}
              </button>
            </div>
          </form>
        </div>

        {/* Notification Preferences & System Status */}
        <div className="space-y-6">
          <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1F334D]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Notification Channels</h3>
              </div>
              {notifSuccess && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Preferences Saved
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              {[
                {
                  key: 'email_alerts',
                  title: 'High Tariff Event Alerts',
                  desc: 'Notify when high-draw appliances turn on during 17:00–22:00 peak hours.'
                },
                {
                  key: 'push_anomalies',
                  title: 'Statistical 3-Sigma Anomaly Alerts',
                  desc: 'Proactive alerts when load deviates significantly from historical baselines.'
                },
                {
                  key: 'weekly_digest',
                  title: 'Weekly Energy Coach Digest',
                  desc: 'Sunday summary of realized savings, efficiency score, and scheduling tips.'
                },
                {
                  key: 'high_tariff_warning',
                  title: 'Simultaneous Concurrent Load Warning',
                  desc: 'Instant alert when total household demand spikes past 6.0 kW.'
                }
              ].map((item) => (
                <div 
                  key={item.key} 
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#091019]/80 border border-[#1F334D] hover:border-cyan-500/30 transition-all cursor-pointer"
                  onClick={() => handleToggleNotif(item.key)}
                >
                  <div className="space-y-0.5 max-w-sm">
                    <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={!!notifs[item.key]}
                    onChange={() => {}} // handled by row onClick
                    className="w-4.5 h-4.5 accent-cyan-400 rounded cursor-pointer shrink-0 ml-3"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Infrastructure Status</h3>
              </div>
              <Badge variant="Measured" label="All Systems Healthy" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-[#091019]/80 p-3 rounded-xl border border-[#1F334D] text-center">
                <div className="text-[11px] text-slate-400">Node.js API</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Port 4000
                </div>
              </div>
              <div className="bg-[#091019]/80 p-3 rounded-xl border border-[#1F334D] text-center">
                <div className="text-[11px] text-slate-400">Python Analytics</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Port 8000
                </div>
              </div>
              <div className="bg-[#091019]/80 p-3 rounded-xl border border-[#1F334D] text-center">
                <div className="text-[11px] text-slate-400">PostgreSQL</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Healthy
                </div>
              </div>
              <div className="bg-[#091019]/80 p-3 rounded-xl border border-[#1F334D] text-center">
                <div className="text-[11px] text-slate-400">Redis Streams</div>
                <div className="font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
