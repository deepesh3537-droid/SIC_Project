import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Home, 
  KeyRound, 
  Cpu, 
  LogOut, 
  CheckCircle2, 
  Save, 
  Flame, 
  Wind, 
  Zap, 
  Bot,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../app/AuthContext.jsx';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function ProfileView() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Security placeholder state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  const fetchProfile = async () => {
    try {
      setError(null);
      const res = await api.get('/auth/me');
      const u = res.data?.user || authUser || {};
      setProfile(u);
      setName(u.name || 'James Miller');
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await api.patch('/auth/profile', { name });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      await fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile name');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      alert('New passwords do not match');
      return;
    }
    setPwSuccess(true);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setTimeout(() => setPwSuccess(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Profile" subtitle="Loading resident identity and credentials..." />
        <LoadingState message="Fetching profile details and active sessions..." rows={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="User Profile" subtitle="Profile Status" />
        <ErrorState title="Profile Error" message={error} onRetry={fetchProfile} />
      </div>
    );
  }

  const initials = (profile?.name || 'James Miller')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Account Profile & Resident Identity"
        subtitle="User credentials, linked household association, and access management"
        badge={<Badge variant="Measured" label="Verified Resident" />}
      />

      {/* Profile Overview Card */}
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text">{profile?.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 uppercase">
                {profile?.role || 'Owner'}
              </span>
            </div>
            <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted" />
              {profile?.email}
            </p>
            <p className="text-xs text-muted mt-0.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-muted" />
              {profile?.householdName} ({profile?.householdId})
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out of Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-text text-sm">Personal Information</h3>
            </div>
            <Badge variant="Measured" label="Profile" />
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted">Email Address (Read-Only)</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full bg-surface-2/50 border border-border rounded-lg px-3 py-2 text-xs text-muted font-mono cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted">Assigned Household ID</label>
              <input
                type="text"
                value={profile?.householdId || ''}
                disabled
                className="w-full bg-surface-2/50 border border-border rounded-lg px-3 py-2 text-xs text-muted font-mono cursor-not-allowed"
              />
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Profile name updated successfully!
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {savingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Active Session */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-text text-sm">Security & Password</h3>
              </div>
              <Badge variant="Measured" label="Active Token" />
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-muted">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-muted">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {pwSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Password updated successfully!
                </div>
              )}

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={!newPw || !confirmPw}
                  className="px-3.5 py-1.5 rounded-lg bg-surface-2 border border-border text-xs text-text font-medium hover:bg-surface transition-colors disabled:opacity-40"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Connected Monitored Circuits Overview */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-text text-sm">Monitored Fleet Circuits</h3>
              </div>
              <Badge variant="Measured" label="4 IoT Feeds" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-surface-2 p-2 rounded-lg border border-border flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-text truncate">Central Heat Pump</div>
                  <div className="text-[10px] text-muted font-mono">DEV-HVAC-001</div>
                </div>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg border border-border flex items-center gap-2">
                <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-text truncate">EcoSilence Dishwasher</div>
                  <div className="text-[10px] text-muted font-mono">DEV-DW-001</div>
                </div>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg border border-border flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-text truncate">Smart Washer/Dryer</div>
                  <div className="text-[10px] text-muted font-mono">DEV-WD-001</div>
                </div>
              </div>
              <div className="bg-surface-2 p-2 rounded-lg border border-border flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div className="truncate">
                  <div className="font-medium text-text truncate">RoboClean Vacuum</div>
                  <div className="text-[10px] text-muted font-mono">DEV-VAC-001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

