import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Clock, 
  Activity, 
  SlidersHorizontal, 
  Leaf, 
  Bot, 
  Cpu, 
  CheckCircle2, 
  Flame, 
  Wind, 
  Play, 
  Sparkles,
  ChevronRight,
  Layers,
  DollarSign
} from 'lucide-react';
import EnergyOrbHero from '../../components/3d/EnergyOrbHero.jsx';
import Badge from '../../components/ui/Badge.jsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary/20 selection:text-primary flex flex-col font-sans">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-base tracking-tight text-text">WattWise</span>
              <span className="text-primary font-bold text-xs ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-muted">
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-text transition-colors">How It Works</a>
            <a href="#sustainability" className="hover:text-text transition-colors">Sustainability</a>
            <a href="#architecture" className="hover:text-text transition-colors">Architecture</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-text hover:bg-surface-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              Launch App
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-border">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-text font-medium">Evidence-First Energy Intelligence</span>
                <span className="text-muted font-mono">• PoC v1.0</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.1]">
                Your home. Your energy.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                  Smarter decisions.
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-primary">
                Make every watt count.
              </p>

              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Deterministic analytics verify the facts; local AI coaching explains the actions. Stop guessing with raw smart meters—automate tariff arbitrage, eliminate peak spikes, and retain full human approval over every household circuit.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/app"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.02]"
                >
                  Explore Live Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text font-medium text-sm hover:bg-surface-2 transition-colors"
                >
                  Resident Sign In (James Miller)
                </Link>
              </div>

              {/* Trust & Architecture Chips */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>5,832 Verified IoT Readings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>0 SIC Rule Overlaps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Human-in-the-Loop Gate (OD-1)</span>
                </div>
              </div>
            </div>

            {/* 3D Energy Orb Hero Component */}
            <div className="lg:col-span-5 h-[360px] sm:h-[440px] lg:h-[480px] w-full relative flex items-center justify-center">
              <EnergyOrbHero />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Problem vs. Solution */}
      <section className="py-20 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              The Architecture Difference
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              Why Raw Meters & Pure LLMs Fail Smart Homes
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Most platforms suffer from ungrounded AI hallucinations or overwhelming raw graphs. WattWise AI decouples facts from explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-surface border border-rose-500/20 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <h4 className="text-lg font-bold text-text">The Traditional Dilemma</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Hallucinatory Advice:</strong> LLMs generate plausible but fabricated kWh totals without mathematical grounding.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Peak Tariff Blindness:</strong> Evening energy costs 2.2x more ($0.22 vs $0.10), but appliances run indiscriminately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Opaque Black Boxes:</strong> Users are told devices have "faults" without baseline evidence or false-positive audits.</span>
                </li>
              </ul>
            </div>

            {/* The WattWise AI Way */}
            <div className="bg-surface border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-text">The WattWise AI Standard</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Evidence First:</strong> Deterministic Python EDA owns all calculations (3,337.29 kWh, $452.83). The LLM only explains.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Time-of-Use Arbitrage:</strong> Automatically suggests shifting 1.3 kWh cycles to save up to $214.19 annually.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span><strong>Human-in-the-Loop Governance:</strong> Automations require explicit resident approval before executing.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Feature Showcase */}
      <section id="features" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Feature Showcase
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              Built for Complete Smart-Home Dominance
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Every module is mathematically backed, authenticated, and fully interactive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">Energy Command Center</h4>
              <p className="text-xs text-muted leading-relaxed">
                Daily, weekly, and monthly trends with a transparent Efficiency Score formula: 100 - (Peak_Tariff_Pct × 0.4).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">Smart Device Intelligence</h4>
              <p className="text-xs text-muted leading-relaxed">
                Telemetry inventory for HVAC, Dishwasher, Washer/Dryer, and Vacuum with per-circuit monthly profiles and share matrices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">Tariff-Aware Scheduling</h4>
              <p className="text-xs text-muted leading-relaxed">
                Capture 54.5% tariff discounts ($0.10 vs $0.22/kWh) by automatically shifting laundry and dish cycles into overnight windows.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">AI Energy Coach</h4>
              <p className="text-xs text-muted leading-relaxed">
                Multi-turn resident chat powered by local LLM (Ollama) with guaranteed deterministic fallback and prompt-injection defense.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">What-If Scenario Modeler</h4>
              <p className="text-xs text-muted leading-relaxed">
                Interactive sliders to model thermostat setbacks and load shifting with instant kWh, dollar, and carbon avoided projections.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-surface border border-border rounded-xl p-6 space-y-3 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Leaf className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-base text-text">Sustainability Center</h4>
              <p className="text-xs text-muted leading-relaxed">
                Transparent carbon accounting with EPA eGRID factor disclosure (0.385 kg/kWh), monthly carbon ceilings, and eco-badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (Demo Story Walkthrough) */}
      <section id="how-it-works" className="py-20 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Demo Story Walkthrough
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              From IoT Reading to Explainable Action
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Experience the end-to-end event lifecycle running across Docker Compose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'IoT Ingestion',
                desc: 'Telemetry streams into Redis iot.reading.received channel.',
                tag: 'Redis Stream'
              },
              {
                step: '02',
                title: 'Pattern Mining',
                desc: 'Python analytics identifies evening peaks and thermal signatures.',
                tag: 'Deterministic'
              },
              {
                step: '03',
                title: 'Rule Evaluation',
                desc: 'Active rules evaluate without overlaps and publish alert events.',
                tag: '0 Overlaps'
              },
              {
                step: '04',
                title: 'User Approval',
                desc: 'Resident reviews suggested automation and approves or rejects.',
                tag: 'Human Gate'
              },
              {
                step: '05',
                title: 'Coach Explains',
                desc: 'Resident asks "why did I get this alert?" and receives evidence.',
                tag: 'AI Coach'
              }
            ].map((s) => (
              <div key={s.step} className="bg-surface border border-border rounded-xl p-5 space-y-2 relative">
                <div className="font-mono text-xs font-bold text-primary">{s.step}</div>
                <h4 className="font-semibold text-sm text-text">{s.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                <div className="pt-2">
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-surface-2 border border-border text-muted">
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Sustainability Spotlight */}
      <section id="sustainability" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-surface-2 via-surface to-surface border border-border rounded-2xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
                  Configured Factor Transparency (ADR-012)
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text">
                1,284.9 kg CO₂e Tracked Across 8 Months
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                We never fabricate unmeasured carbon. Emissions are derived via an explicit factor of 0.3850 kg CO₂e/kWh based on the U.S. EPA eGRID national benchmark, paired with a 200 kg monthly ceiling target.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text pt-2">
                <div className="bg-surface px-3 py-1.5 rounded-lg border border-border">
                  Offset: <span className="text-primary font-bold">~61 Mature Trees</span>
                </div>
                <div className="bg-surface px-3 py-1.5 rounded-lg border border-border">
                  Spring Low-Carbon: <span className="text-emerald-400 font-bold">&lt;60 kg in April</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 bg-surface p-6 rounded-xl border border-border space-y-4 shrink-0 text-center">
              <div className="text-3xl font-bold font-mono text-emerald-400">1.28 Tons</div>
              <div className="text-xs text-muted">Cumulative Footprint Derived</div>
              <div className="w-full bg-surface-2 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }} />
              </div>
              <p className="text-[11px] text-muted">
                80.3% of 200 kg monthly ceiling goal achieved
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Live Demo Quick Access Callout */}
      <section id="demo" className="py-20 bg-surface/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Evaluator Access
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-text">
            Ready to explore the live environment?
          </h3>

          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Sign in with the verified test account credentials to test the dashboard, run What-if scenarios, inspect 3-sigma anomalies, and chat with the Energy Coach.
          </p>

          <div className="bg-surface border border-border p-4 rounded-xl max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-muted">Demo Email:</span>
              <span className="text-text font-bold">james@wattwise.ai</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-muted">Password:</span>
              <span className="text-text font-bold">Password123!</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-muted">Household:</span>
              <span className="text-primary font-bold">HOME-JAMES-001 (Owner)</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-colors shadow-sm"
            >
              Log In as James Miller
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="mt-auto py-12 bg-surface border-t border-border text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-text">WattWise AI</span>
            <span>• Proof-of-Concept for SIC Smart-Home Track</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/app" className="hover:text-text transition-colors">Dashboard</Link>
            <Link to="/login" className="hover:text-text transition-colors">Resident Login</Link>
            <a href="#features" className="hover:text-text transition-colors">Features</a>
            <a href="#architecture" className="hover:text-text transition-colors">Stack</a>
          </div>

          <div>
            © 2026 WattWise AI. Built with React, Vite, FastAPI, PostgreSQL, and Redis.
          </div>
        </div>
      </footer>
    </div>
  );
}

