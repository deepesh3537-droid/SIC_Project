import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
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
  Search,
  ArrowRight,
  Sparkles,
  Grid
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export const MODULE_DIRECTORY = [
  {
    id: 'dashboard',
    name: 'Energy Command Center',
    path: '/app',
    category: 'Command Center',
    icon: LayoutDashboard,
    badge: 'Measured',
    description: 'Deterministic monthly consumption (3,337.29 kWh), cost totals ($452.83), daily/weekly/monthly trend switcher, and transparent Efficiency Score breakdown.',
    features: ['5,832 Verified Readings', 'Time-of-Use Analysis', 'Efficiency Score Formula']
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Insights',
    path: '/app/lifestyle',
    category: 'Energy Intelligence',
    icon: Compass,
    badge: 'Measured',
    description: '24-hour diurnal load curves, weekday vs. weekend variances, daypart distribution (overnight, daytime, evening peaks), and appliance duty cycles.',
    features: ['Diurnal Profile', 'Weekday vs. Weekend', 'Habit Pattern Mining']
  },
  {
    id: 'devices',
    name: 'Smart Devices Inventory',
    path: '/app/devices',
    category: 'Smart Home',
    icon: Cpu,
    badge: 'Measured',
    description: 'Connected telemetry inventory for HVAC, Dishwasher, Washer/Dryer, and Vacuum with per-circuit monthly profiles and share matrices.',
    features: ['Circuit Breakdown', 'Power Ratings (Watts)', 'Monthly Usage Matrix']
  },
  {
    id: 'health',
    name: 'Appliance Health & Baselines',
    path: '/app/health',
    category: 'Smart Home',
    icon: HeartPulse,
    badge: 'Estimated',
    description: 'Statistical consumption baselines, 3-sigma thresholds, overall fleet health score (95%), and preventive maintenance checklists.',
    features: ['Statistical Baselines', 'Fleet Health Score', 'Preventive Maintenance']
  },
  {
    id: 'automations',
    name: 'Automation Center',
    path: '/app/automations',
    category: 'Automation',
    icon: PlayCircle,
    badge: 'Measured',
    description: 'The 3 core SIC rules with mathematical exclusivity proof (0 historical overlaps, 0 test set overlaps) and human-in-the-loop approval lifecycle.',
    features: ['0 Rule Overlaps (ADR-015)', 'User Approval Gate', 'Lifecycle Audit Trail']
  },
  {
    id: 'rule-builder',
    name: 'Rule Builder',
    path: '/app/rule-builder',
    category: 'Automation',
    icon: Wrench,
    badge: 'Estimated',
    description: 'Visual IF-THEN rule composer. Validates custom logic against 5,832 historical readings and submits for user approval before activation.',
    features: ['Custom IF-THEN Logic', 'Historical Re-validation', 'Conflict Detection']
  },
  {
    id: 'scheduling',
    name: 'Smart Scheduling',
    path: '/app/scheduling',
    category: 'Automation',
    icon: Calendar,
    badge: 'Estimated',
    description: 'Tariff-aware appliance run time recommendations. Visualizes 24-hour time-of-use rates and captures up to $214.19/yr in arbitrage savings.',
    features: ['Tariff Visualizer', 'Arbitrage Savings', 'Explainable Recommendations']
  },
  {
    id: 'automation-history',
    name: 'Automation History & Suggestions',
    path: '/app/automation-history',
    category: 'Automation',
    icon: History,
    badge: 'Measured',
    description: 'Chronological execution ledger of automated actions, verified savings accrued, and 3 data-backed opportunity suggestions ready for 1-click queuing.',
    features: ['Action Audit Trail', 'Realized Dollar Savings', 'AI-Suggested Rules']
  },
  {
    id: 'alerts',
    name: 'Energy Alerts Spotlight',
    path: '/app/alerts',
    category: 'Monitoring',
    icon: Bell,
    badge: 'Simulated',
    description: 'Prominent latest alert spotlight with collapsible archive. Clearly distinguishes deterministic rule conditions from AI coach tips.',
    features: ['Rule Condition vs. Tip', 'Per-Rule Color Accents', 'Deep-Link to Coach']
  },
  {
    id: 'anomalies',
    name: 'Energy Anomalies',
    path: '/app/anomalies',
    category: 'Monitoring',
    icon: AlertTriangle,
    badge: 'Estimated',
    description: 'Statistical deviations beyond 3-sigma thresholds, filtered by peak tariff severity and strictly labeled as unusual deviations, never hardware faults.',
    features: ['3-Sigma Bounds', 'Peak Severity Filter', 'Non-Alarmist Terminology']
  },
  {
    id: 'coach',
    name: 'AI Energy Coach',
    path: '/app/coach',
    category: 'AI Intelligence',
    icon: Bot,
    badge: 'Estimated',
    description: 'Multi-turn chat powered by local LLM (Ollama) with guaranteed deterministic fallback, prompt-injection defense, and telemetry fact citations.',
    features: ['Telemetry Citations', 'Deterministic Fallback', 'Zero Hallucinations']
  },
  {
    id: 'simulator',
    name: 'What-If Simulator & Studio',
    path: '/app/simulator',
    category: 'Optimization',
    icon: SlidersHorizontal,
    badge: 'Simulated',
    description: 'Interactive sliders to model thermostat setbacks and load shifting, plus live Redis Streams event replay into the active ingestion pipeline.',
    features: ['Interactive Sliders', 'Instant Projections', 'Redis Stream Replay']
  },
  {
    id: 'budget',
    name: 'Budget Planner',
    path: '/app/budget',
    category: 'Optimization',
    icon: Wallet,
    badge: 'Measured',
    description: 'User-configured monthly spending limit ($150), alert threshold (85%), month-end spend projection, and 8-month historical billing ledger.',
    features: ['Configurable Limit', 'Spend Forecast', 'Historical Ledger']
  },
  {
    id: 'load',
    name: 'Load Management',
    path: '/app/load',
    category: 'Optimization',
    icon: Gauge,
    badge: 'Measured',
    description: 'Electrical circuit capacity, 6.154 kW historical peak demand, simultaneous concurrency matrix, and 0.815 coincidence factor.',
    features: ['Peak Demand (kW)', 'Concurrency Matrix', 'Coincidence Factor']
  },
  {
    id: 'sustainability',
    name: 'Sustainability Center',
    path: '/app/sustainability',
    category: 'Sustainability',
    icon: Leaf,
    badge: 'Assumption',
    description: 'Transparent carbon accounting with disclosed EPA eGRID factor (0.3850 kg CO₂e/kWh), monthly carbon ceilings, and mature tree offset metrics.',
    features: ['EPA Factor Disclosure', 'Emissions Ledger', 'Tree Equivalents']
  },
  {
    id: 'reports',
    name: 'Reports & Data Export',
    path: '/app/reports',
    category: 'Analytics & Reports',
    icon: FileBarChart,
    badge: 'Measured',
    description: 'Periodic monthly (8 mos), weekly (36 wks), and daily (60d) consumption ledgers, recommendation audit trail, and functional CSV & JSON export downloads.',
    features: ['Multi-Timeframe Ledgers', 'Recommendation Log', 'CSV & JSON Export']
  },
  {
    id: 'settings',
    name: 'Household Settings',
    path: '/app/settings',
    category: 'Account',
    icon: Settings,
    badge: 'Measured',
    description: 'Household configuration, regional carbon factor adjustments (ADR-012), notification delivery channels, and linked circuit sensors.',
    features: ['Carbon Factor Config', 'Notification Channels', 'Hardware Setup']
  },
  {
    id: 'profile',
    name: 'User Profile & Household',
    path: '/app/profile',
    category: 'Account',
    icon: User,
    badge: 'Measured',
    description: 'Active resident session credentials, household membership roles, security details, and quick demonstration parameters.',
    features: ['Resident Metadata', 'Session Management', 'Security Preferences']
  }
];

export const CATEGORIES = [
  'All',
  'Command Center',
  'Energy Intelligence',
  'Smart Home',
  'Automation',
  'Monitoring',
  'AI Intelligence',
  'Optimization',
  'Sustainability',
  'Analytics & Reports',
  'Account'
];

export default function ExploreModules() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter modules by category and query
  const filteredModules = MODULE_DIRECTORY.filter((mod) => {
    const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      mod.name.toLowerCase().includes(q) || 
      mod.description.toLowerCase().includes(q) ||
      mod.category.toLowerCase().includes(q) ||
      mod.features.some((f) => f.toLowerCase().includes(q));
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Explore Modules Directory"
        subtitle="Visual catalog of all verified smart-home energy management capabilities and analytical tools"
        badge={<Badge variant="Measured" label="18 Active Modules" />}
      />

      {/* Discovery Control Bar: Search & Category Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search capabilities by name, description, or keyword (e.g. 'Tariff', 'Baselines', 'Carbon')..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-text placeholder-muted focus:outline-none focus:border-primary/50 transition-colors shadow-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                selectedCategory === cat
                  ? "bg-primary text-black font-semibold shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                  : "bg-surface border border-border text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              className="bg-surface border border-border hover:border-primary/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group"
            >
              <div>
                {/* Header: Icon, Category & Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
                      {mod.category}
                    </span>
                    <Badge variant={mod.badge} />
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-text mt-3.5 group-hover:text-primary transition-colors">
                  {mod.name}
                </h3>
                <p className="text-xs text-muted leading-relaxed mt-1.5">
                  {mod.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border/50">
                  {mod.features.map((feat, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-2/70 text-text/80 border border-border/60"
                    >
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to={mod.path}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-surface-2 hover:bg-primary hover:text-black border border-border hover:border-primary text-xs font-semibold text-text transition-all"
                >
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-surface border border-border rounded-2xl">
          <Grid className="w-8 h-8 text-muted mx-auto" />
          <h4 className="font-semibold text-text text-sm">No modules found</h4>
          <p className="text-xs text-muted max-w-sm mx-auto">
            No active capabilities match your filter for "{searchQuery}". Try selecting "All" or a different category.
          </p>
        </div>
      )}
    </div>
  );
}

