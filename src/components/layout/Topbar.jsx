import React from 'react';
import { useAuth } from '../../app/AuthContext.jsx';
import { Menu, Home, Radio, Bell } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-muted hover:text-text rounded-lg bg-surface-2 border border-border lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Household context pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border text-xs">
          <Home className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium text-text">{user?.householdName || 'My Residence'}</span>
          <span className="text-muted font-mono hidden sm:inline">({user?.householdId || 'HOME-001'})</span>
        </div>

        {/* Live feed badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info/10 border border-info/20 text-info text-xs font-mono">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>Simulated Feed</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Alerts Bell Shortcut */}
        <a
          href="/app/alerts"
          aria-label="View Energy Alerts"
          className="p-2 text-muted hover:text-text rounded-lg bg-surface-2 hover:bg-border border border-border transition-colors relative"
        >
          <Bell className="w-4 h-4 text-warning" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning animate-pulse" />
        </a>

        {/* User profile preview */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-medium text-text leading-tight">{user?.name || 'James Miller'}</p>
            <p className="text-[10px] text-muted font-mono leading-tight">{user?.email || 'james@wattwise.ai'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
