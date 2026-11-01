import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import { Menu, Home, Radio, Bell, Search, Sparkles, User } from 'lucide-react';

export default function Topbar({ onMenuClick, onOpenCommandPalette }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-surface/85 backdrop-blur-md border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Burger & Household Scope */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          aria-label="Open navigation sidebar"
          className="p-2.5 text-muted hover:text-text rounded-lg bg-surface-2 border border-border lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Household selector / identifier pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2/90 border border-border text-xs shadow-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <Home className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-text">{user?.householdName || 'James Residence'}</span>
          <span className="text-muted font-mono hidden sm:inline text-[11px]">({user?.householdId || 'HOME-JAMES-001'})</span>
        </div>

        {/* Live feed badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-mono">
          <Radio className="w-3 h-3 animate-pulse" />
          <span className="font-semibold">Simulated IoT Stream</span>
        </div>
      </div>

      {/* Center / Search: Command Palette Trigger */}
      <div className="hidden md:flex items-center max-w-sm w-full mx-4">
        <button
          onClick={onOpenCommandPalette}
          type="button"
          aria-label="Search modules and commands"
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-surface-2/70 hover:bg-surface-2 border border-border hover:border-primary/40 text-muted hover:text-text transition-all text-xs group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-primary group-hover:scale-105 transition-transform" />
            <span>Search modules, devices & rules...</span>
          </div>
          <kbd className="font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-border text-primary font-semibold tracking-wider">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Alerts Bell Shortcut */}
        <NavLink
          to="/app/alerts"
          aria-label="View Energy Alerts"
          title="Energy Alerts & Anomalies"
          className="p-2 text-muted hover:text-text rounded-lg bg-surface-2 hover:bg-surface-elevated border border-border transition-colors relative"
        >
          <Bell className="w-4 h-4 text-warning" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning animate-pulse" />
        </NavLink>

        {/* User profile preview chip */}
        <NavLink
          to="/app/profile"
          aria-label="User Profile"
          title="Account Profile & Household Settings"
          className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-text leading-tight">{user?.name || 'James Miller'}</p>
            <p className="text-[10px] text-muted font-mono leading-tight">{user?.email || 'james@wattwise.ai'}</p>
          </div>
        </NavLink>
      </div>
    </header>
  );
}
