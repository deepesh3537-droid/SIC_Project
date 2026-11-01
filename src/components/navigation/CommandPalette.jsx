import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext.jsx';
import {
  Search,
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
  Grid,
  PanelLeftClose,
  CornerDownLeft,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const COMMAND_ITEMS = [
  // Navigation Destinations
  { id: 'dashboard', name: 'Dashboard (Command Center)', path: '/app', category: 'Command Center', icon: LayoutDashboard, keywords: ['home', 'overview', 'kwh', 'cost', 'metrics'] },
  { id: 'explore', name: 'Explore Modules Directory', path: '/app/explore', category: 'Command Center', icon: Grid, keywords: ['catalog', 'directory', 'all modules', 'features'] },
  { id: 'lifestyle', name: 'Lifestyle Insights', path: '/app/lifestyle', category: 'Energy Intelligence', icon: Compass, keywords: ['patterns', 'habits', 'hourly', 'weekend', 'diurnal'] },
  { id: 'devices', name: 'Smart Devices Inventory', path: '/app/devices', category: 'Smart Home', icon: Cpu, keywords: ['appliances', 'hvac', 'dishwasher', 'laundry', 'circuits'] },
  { id: 'health', name: 'Appliance Health & Baselines', path: '/app/health', category: 'Smart Home', icon: HeartPulse, keywords: ['maintenance', 'baselines', 'efficiency', 'sigma'] },
  { id: 'automations', name: 'Automation Center', path: '/app/automations', category: 'Automation', icon: PlayCircle, keywords: ['rules', 'r1', 'r2', 'r3', 'approval', 'triggers'] },
  { id: 'rule-builder', name: 'Rule Builder (Custom IF-THEN)', path: '/app/rule-builder', category: 'Automation', icon: Wrench, keywords: ['custom rule', 'create', 'conditions', 'validator'] },
  { id: 'scheduling', name: 'Smart Scheduling', path: '/app/scheduling', category: 'Automation', icon: Calendar, keywords: ['tariff', 'off-peak', 'shift', 'hours', 'savings'] },
  { id: 'automation-history', name: 'Automation History & AI Suggestions', path: '/app/automation-history', category: 'Automation', icon: History, keywords: ['audit log', 'opportunities', 'past runs'] },
  { id: 'alerts', name: 'Energy Alerts Spotlight', path: '/app/alerts', category: 'Monitoring', icon: Bell, keywords: ['notifications', 'warnings', 'recent', 'unread'] },
  { id: 'anomalies', name: 'Energy Anomalies & 3σ Spikes', path: '/app/anomalies', category: 'Monitoring', icon: AlertTriangle, keywords: ['deviations', 'statistical', 'unusual', 'sigma'] },
  { id: 'coach', name: 'AI Energy Coach Chat', path: '/app/coach', category: 'AI Intelligence', icon: Bot, keywords: ['ask', 'chat', 'ollama', 'assistant', 'explain'] },
  { id: 'simulator', name: 'What-If Scenario Modeler', path: '/app/simulator', category: 'Optimization', icon: SlidersHorizontal, keywords: ['sliders', 'temperature', 'setback', 'simulate', 'replay'] },
  { id: 'budget', name: 'Budget Planner', path: '/app/budget', category: 'Optimization', icon: Wallet, keywords: ['spend', 'limit', 'monthly', 'threshold', 'forecast'] },
  { id: 'load', name: 'Load Management & Peak Shaving', path: '/app/load', category: 'Optimization', icon: Gauge, keywords: ['concurrency', 'kw', 'peak demand', 'coincidence'] },
  { id: 'sustainability', name: 'Sustainability & Carbon Center', path: '/app/sustainability', category: 'Sustainability', icon: Leaf, keywords: ['co2', 'emissions', 'epa', 'trees', 'green'] },
  { id: 'reports', name: 'Reports & Export', path: '/app/reports', category: 'Analytics & Reports', icon: FileBarChart, keywords: ['monthly ledger', 'csv export', 'json', 'data'] },
  { id: 'settings', name: 'Household Settings', path: '/app/settings', category: 'Account', icon: Settings, keywords: ['configuration', 'carbon factor', 'notifications'] },
  { id: 'profile', name: 'Resident Profile', path: '/app/profile', category: 'Account', icon: User, keywords: ['user', 'james', 'email', 'security', 'password'] },

  // System Actions
  { id: 'toggle-sidebar', name: 'Toggle Sidebar Rail (Expanded / Compact)', action: 'toggle-sidebar', category: 'System Action', icon: PanelLeftClose, keywords: ['sidebar', 'collapse', 'rail', 'expand'] },
  { id: 'sign-out', name: 'Sign Out Session', action: 'logout', category: 'System Action', icon: LogOut, keywords: ['logout', 'exit', 'disconnect'] }
];

export default function CommandPalette({ isOpen, onClose, onToggleCollapse }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Filter items based on query
  const filteredItems = COMMAND_ITEMS.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const matchName = item.name.toLowerCase().includes(q);
    const matchCategory = item.category.toLowerCase().includes(q);
    const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
    return matchName || matchCategory || matchKeywords;
  });

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Execute an item action or navigation
  const executeItem = async (item) => {
    if (!item) return;
    onClose();

    if (item.action === 'logout') {
      await logout();
      navigate('/login');
    } else if (item.action === 'toggle-sidebar') {
      onToggleCollapse?.();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div 
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150 border-primary/30"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-border bg-surface-2/60 gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all modules, routes, or commands (e.g., 'Coach', 'Budget', 'Replay')..."
            className="flex-1 bg-transparent text-sm text-text placeholder-muted focus:outline-none"
            aria-label="Search modules and actions"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 rounded-md text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted">
              No matching modules or actions found for <span className="text-primary font-mono">"{query}"</span>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs cursor-pointer transition-all",
                    isSelected
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(34,211,238,0.1)]"
                      : "text-text hover:bg-surface-2 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                      isSelected 
                        ? "bg-primary/20 border-primary/40 text-primary" 
                        : "bg-surface-2 border-border text-muted"
                    )}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("font-medium truncate", isSelected ? "text-primary" : "text-text")}>
                        {item.name}
                      </p>
                      <p className="text-[10px] text-muted font-mono">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-muted">
                    {item.path && (
                      <span className="font-mono text-[10px] bg-surface-2 px-1.5 py-0.5 rounded border border-border hidden sm:inline">
                        {item.path}
                      </span>
                    )}
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-primary shrink-0" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 border-t border-border bg-surface-2/40 flex items-center justify-between text-[11px] text-muted font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-surface px-1.5 py-0.5 rounded border border-border text-text">↑</kbd> <kbd className="bg-surface px-1.5 py-0.5 rounded border border-border text-text">↓</kbd> to navigate</span>
            <span><kbd className="bg-surface px-1.5 py-0.5 rounded border border-border text-text">↵</kbd> to select</span>
            <span><kbd className="bg-surface px-1.5 py-0.5 rounded border border-border text-text">esc</kbd> to close</span>
          </div>
          <div>
            <span className="text-primary font-bold">{filteredItems.length}</span> results
          </div>
        </div>
      </div>
    </div>
  );
}

