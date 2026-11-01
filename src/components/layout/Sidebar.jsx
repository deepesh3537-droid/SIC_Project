import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import {
  LayoutDashboard,
  Compass,
  Cpu,
  HeartPulse,
  AlertTriangle,
  PlayCircle,
  Wrench,
  Calendar,
  History,
  Bot,
  SlidersHorizontal,
  Wallet,
  Gauge,
  Leaf,
  FileBarChart,
  Settings,
  User,
  LogOut,
  Zap,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const SIDEBAR_ITEMS = [
  { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
  { name: 'Lifestyle Insights', path: '/app/lifestyle', icon: Compass },
  { name: 'Smart Devices', path: '/app/devices', icon: Cpu },
  { name: 'Appliance Health', path: '/app/health', icon: HeartPulse },
  { name: 'Energy Anomalies', path: '/app/anomalies', icon: AlertTriangle },
  { name: 'Automation Center', path: '/app/automations', icon: PlayCircle },
  { name: 'Rule Builder', path: '/app/rule-builder', icon: Wrench },
  { name: 'Smart Scheduling', path: '/app/scheduling', icon: Calendar },
  { name: 'Automation History', path: '/app/automation-history', icon: History },
  { name: 'Energy Coach', path: '/app/coach', icon: Bot },
  { name: 'What-if Simulator', path: '/app/simulator', icon: SlidersHorizontal },
  { name: 'Budget Planner', path: '/app/budget', icon: Wallet },
  { name: 'Load Management', path: '/app/load', icon: Gauge },
  { name: 'Sustainability', path: '/app/sustainability', icon: Leaf },
  { name: 'Reports & Insights', path: '/app/reports', icon: FileBarChart },
  { name: 'Settings', path: '/app/settings', icon: Settings },
  { name: 'Profile', path: '/app/profile', icon: User },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 w-64 bg-surface border-r border-border flex flex-col z-50 transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand / Logo */}
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-text">WattWise</span>
              <span className="text-primary font-bold text-xs ml-1 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono">
                AI
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-muted hover:text-text lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-surface-2 text-primary border border-border shadow-sm font-semibold"
                      : "text-muted hover:text-text hover:bg-surface-2/60"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted group-hover:text-text")} />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer / Logout (18th item) */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

