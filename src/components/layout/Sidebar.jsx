import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import {
  LayoutDashboard,
  Compass,
  Cpu,
  HeartPulse,
  PlayCircle,
  Wrench,
  Calendar,
  History,
  Bell,
  AlertTriangle,
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
  X,
  Grid,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const NAVIGATION_GROUPS = [
  {
    title: 'Command Center',
    items: [
      { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
      { name: 'Explore Modules', path: '/app/explore', icon: Grid }
    ]
  },
  {
    title: 'Energy Intelligence',
    items: [
      { name: 'Lifestyle Insights', path: '/app/lifestyle', icon: Compass }
    ]
  },
  {
    title: 'Smart Home',
    items: [
      { name: 'Smart Devices', path: '/app/devices', icon: Cpu },
      { name: 'Appliance Health', path: '/app/health', icon: HeartPulse }
    ]
  },
  {
    title: 'Automation',
    items: [
      { name: 'Automation Center', path: '/app/automations', icon: PlayCircle },
      { name: 'Rule Builder', path: '/app/rule-builder', icon: Wrench },
      { name: 'Smart Scheduling', path: '/app/scheduling', icon: Calendar },
      { name: 'Automation History', path: '/app/automation-history', icon: History }
    ]
  },
  {
    title: 'Monitoring',
    items: [
      { name: 'Alerts', path: '/app/alerts', icon: Bell },
      { name: 'Energy Anomalies', path: '/app/anomalies', icon: AlertTriangle }
    ]
  },
  {
    title: 'AI Intelligence',
    items: [
      { name: 'Energy Coach', path: '/app/coach', icon: Bot }
    ]
  },
  {
    title: 'Optimization',
    items: [
      { name: 'What-if Simulator', path: '/app/simulator', icon: SlidersHorizontal },
      { name: 'Budget Planner', path: '/app/budget', icon: Wallet },
      { name: 'Load Management', path: '/app/load', icon: Gauge }
    ]
  },
  {
    title: 'Sustainability',
    items: [
      { name: 'Sustainability', path: '/app/sustainability', icon: Leaf }
    ]
  },
  {
    title: 'Analytics & Reports',
    items: [
      { name: 'Reports & Insights', path: '/app/reports', icon: FileBarChart }
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Settings', path: '/app/settings', icon: Settings },
      { name: 'Profile', path: '/app/profile', icon: User }
    ]
  }
];

export default function Sidebar({ mobileOpen, onCloseMobile, isCollapsed, onToggleCollapse }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          aria-label="Close navigation overlay"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Main Navigation"
        className={cn(
          "fixed top-0 bottom-0 left-0 bg-surface/95 backdrop-blur-md border-r border-border flex flex-col z-50 transition-all duration-300",
          // Desktop collapsed vs expanded
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile open vs closed
          mobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header / Brand */}
        <div className={cn(
          "h-16 px-4 border-b border-border flex items-center shrink-0",
          isCollapsed ? "lg:justify-center justify-between" : "justify-between"
        )}>
          {/* Logo */}
          <NavLink 
            to="/app" 
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
            title="WattWise AI - Home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)] shrink-0">
              <Zap className="w-4 h-4 text-primary fill-primary/20" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex items-center">
                <span className="font-bold text-base tracking-tight text-text">WattWise</span>
                <span className="text-primary font-bold text-[10px] ml-1.5 px-1.5 py-0.2 rounded bg-primary/10 border border-primary/30 font-mono tracking-wider">
                  AI
                </span>
              </div>
            )}
          </NavLink>

          {/* Mobile Close Button */}
          <button 
            onClick={onCloseMobile} 
            aria-label="Close navigation sidebar"
            className="p-2 text-muted hover:text-text rounded-lg hover:bg-surface-2 transition-colors lg:hidden min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Rail Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand navigation sidebar" : "Collapse navigation to icon rail"}
            title={isCollapsed ? "Expand sidebar (Ctrl + B)" : "Collapse sidebar"}
            className="hidden lg:flex p-1.5 text-muted hover:text-primary rounded-lg hover:bg-surface-2 border border-transparent hover:border-border transition-colors items-center justify-center"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Groups List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {/* Group Title (hidden when collapsed on desktop) */}
              {(!isCollapsed || mobileOpen) ? (
                <div className="px-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted/70 font-semibold select-none">
                  {group.title}
                </div>
              ) : (
                <div className="border-t border-border/40 mx-2 my-2" title={group.title} />
              )}

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/app'}
                      onClick={() => onCloseMobile?.()}
                      title={isCollapsed && !mobileOpen ? item.name : undefined}
                      aria-label={item.name}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-lg text-xs font-medium transition-all group relative",
                          isCollapsed && !mobileOpen 
                            ? "justify-center p-2.5" 
                            : "gap-3 px-3 py-2",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_15px_rgba(34,211,238,0.1)] font-semibold"
                            : "text-muted hover:text-text hover:bg-surface-2/80"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={cn(
                            "w-4 h-4 shrink-0 transition-colors",
                            isActive ? "text-primary" : "text-muted group-hover:text-text"
                          )} />
                          {(!isCollapsed || mobileOpen) && (
                            <span className="truncate">{item.name}</span>
                          )}
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer: User & Sign Out */}
        <div className="p-3 border-t border-border shrink-0 bg-surface/50">
          <button
            onClick={handleLogout}
            title={isCollapsed && !mobileOpen ? "Sign Out" : undefined}
            aria-label="Sign Out"
            className={cn(
              "w-full flex items-center rounded-lg text-xs font-medium text-danger hover:bg-danger/10 transition-colors",
              isCollapsed && !mobileOpen ? "justify-center p-2.5" : "gap-3 px-3 py-2"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
