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
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Account Profile & Resident Identity"
        subtitle="User credentials, linked household association, and access management"
        badge={<Badge variant="Measured" label="Verified Resident" />}
      />

      {/* Profile Overview Card */}
      <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-6 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-extrabold text-2xl shrink-0 shadow-sm shadow-cyan-500/10">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-100 font-display">{profile?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wide">
                {profile?.role || 'Owner'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {profile?.email}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              {profile?.householdName} <span className="font-mono text-slate-500">({profile?.householdId})</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 hover:text-rose-300 transition-all shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out of Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#1F334D]">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <User className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Personal Information</h3>
            </div>
            <Badge variant="Measured" label="Resident Profile" />
          </div>

          <form onSubmit={handleUpdateName} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-200">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Email Address (Read-Only)</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full bg-[#091019]/50 border border-[#1F334D]/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Assigned Household ID</label>
              <input
                type="text"
                value={profile?.householdId || ''}
                disabled
                className="w-full bg-[#091019]/50 border border-[#1F334D]/60 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
              />
            </div>

            {saveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Profile name updated successfully!
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {savingProfile ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Security & Active Session */}
        <div className="space-y-6">
          <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#1F334D]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Security & Password</h3>
              </div>
              <Badge variant="Measured" label="Active Token" />
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    className="w-full bg-[#091019] border border-[#1F334D] rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              {pwSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Password updated successfully!
                </div>
              )}

              <div className="pt-1 flex justify-end">
                <button
                  type="submit"
                  disabled={!newPw || !confirmPw}
                  className="px-4 py-2 rounded-xl bg-[#142338] border border-[#1F334D] text-xs text-slate-200 font-semibold hover:bg-[#1D314E] hover:text-white transition-all disabled:opacity-40"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>

          {/* Connected Monitored Circuits Overview */}
          <div className="bg-[#0D1520]/80 border border-[#1F334D] rounded-2xl p-5 space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Monitored Fleet Circuits</h3>
              </div>
              <Badge variant="Measured" label="4 IoT Feeds" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#091019]/80 p-2.5 rounded-xl border border-[#1F334D] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">Central Heat Pump</div>
                  <div className="text-[10px] text-slate-400 font-mono">DEV-HVAC-001</div>
                </div>
              </div>
              <div className="bg-[#091019]/80 p-2.5 rounded-xl border border-[#1F334D] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                  <Wind className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">EcoSilence Dishwasher</div>
                  <div className="text-[10px] text-slate-400 font-mono">DEV-DW-001</div>
                </div>
              </div>
              <div className="bg-[#091019]/80 p-2.5 rounded-xl border border-[#1F334D] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">Smart Washer/Dryer</div>
                  <div className="text-[10px] text-slate-400 font-mono">DEV-WD-001</div>
                </div>
              </div>
              <div className="bg-[#091019]/80 p-2.5 rounded-xl border border-[#1F334D] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-200 truncate">RoboClean Vacuum</div>
                  <div className="text-[10px] text-slate-400 font-mono">DEV-VAC-001</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
