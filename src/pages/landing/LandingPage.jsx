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
  DollarSign,
  Gauge,
  Calendar,
  Grid,
  Radio,
  Eye,
  Compass,
  PlayCircle
} from 'lucide-react';
import EnergyOrbHero from '../../components/3d/EnergyOrbHero.jsx';
import Badge from '../../components/ui/Badge.jsx';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-transparent text-text selection:bg-primary/20 selection:text-primary flex flex-col font-sans">
      {/* 1. Navigation / Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-surface/85 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(34,211,238,0.2)] group-hover:border-primary transition-colors">
              <Zap className="w-4 h-4 text-primary fill-primary/20" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-base tracking-tight text-text">WattWise</span>
              <span className="text-primary font-bold text-xs ml-1.5 px-1.5 py-0.5 rounded bg-primary/10 border border-primary/30 font-mono">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-muted">
            <a href="#capabilities" className="hover:text-primary transition-colors">Capabilities</a>
            <a href="#preview" className="hover:text-primary transition-colors">Live Preview</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Architecture</a>
            <a href="#sustainability" className="hover:text-primary transition-colors">Sustainability</a>
            <Link to="/app/explore" className="hover:text-primary transition-colors flex items-center gap-1">
              <Grid className="w-3.5 h-3.5 text-primary" />
              <span>Explore Directory</span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg border border-border text-xs font-medium text-text hover:bg-surface-2 hover:border-primary/40 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/app"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]"
            >
              Launch App
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-border">
        {/* Ambient cyan glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-text font-medium">Futuristic Energy Intelligence Control Center</span>
                <span className="text-muted font-mono text-[11px]">• SIC Track</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.1]">
                Your home. Your energy.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-blue-400">
                  Smarter decisions.
                </span>
              </h1>

              <p className="text-lg sm:text-xl font-medium text-primary tracking-wide">
                Make every watt count.
              </p>

              <p className="text-sm sm:text-base text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Deterministic analytics own the mathematical facts; local AI coaching explains the actions. Stop guessing with raw smart meters—automate tariff arbitrage, eliminate peak spikes, and retain complete human approval over every household circuit.
              </p>

              {/* CTAs matching Guide requirements */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  to="/app"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-all shadow-[0_0_25px_rgba(34,211,238,0.35)] hover:scale-[1.02]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/app/explore"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border text-text font-medium text-sm hover:bg-surface-2 hover:border-primary/50 transition-colors"
                >
                  <Grid className="w-4 h-4 text-primary" />
                  Explore Platform
                </Link>
              </div>

              {/* Verified Proof Badges */}
              <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>5,832 Verified Readings</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>0 Rule Overlaps (ADR-015)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
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

      {/* 3. Problem vs. Solution Architecture */}
      <section className="py-20 bg-surface/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Architecture Difference
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              Why Raw Smart Meters & Pure LLMs Fail
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Most platforms suffer from ungrounded hallucinations or overwhelming data graphs. WattWise AI decouples mathematical facts from explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Traditional Dilemma */}
            <div className="bg-surface border border-rose-500/25 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5 text-rose-400" />
              </div>
              <h4 className="text-lg font-bold text-text">The Traditional Dilemma</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>AI Hallucinations:</strong> LLMs generate plausible-sounding but completely made-up kWh totals and costs without telemetry grounding.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Peak Tariff Blindness:</strong> Evening energy costs 2.2× more ($0.22 vs $0.10/kWh), yet appliances run indiscriminately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Opaque Black Boxes:</strong> Users are told devices have "faults" without baseline evidence or false-positive audits.</span>
                </li>
              </ul>
            </div>

            {/* The WattWise AI Standard */}
            <div className="bg-surface border border-primary/40 rounded-2xl p-6 sm:p-8 space-y-4 relative overflow-hidden shadow-[0_0_35px_rgba(34,211,238,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <h4 className="text-lg font-bold text-text">The WattWise AI Standard</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  <span><strong>Evidence First:</strong> Deterministic Python analytics owns all numbers (3,337.29 kWh, $452.83). The LLM only explains.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  <span><strong>Tariff Arbitrage:</strong> Automatically suggests shifting loads into off-peak windows to capture up to $214.19/yr in savings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-primary font-bold shrink-0">✓</span>
                  <span><strong>Human-in-the-Loop Gate:</strong> Suggested automations require explicit resident review and approval before execution.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Five Core Capability Pillars (Section 4 of Guide) */}
      <section id="capabilities" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Core Capabilities
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              Five Pillars of Smart-Home Energy Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Engineered across monitoring, habit mining, automation governance, tariff optimization, and sustainability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Monitoring */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">1. Real-Time Monitoring</h4>
                <Badge variant="Measured" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Live simulated IoT stream listening on Redis channel <code className="text-primary font-mono text-[11px]">iot.reading.received</code>. Telemetry aggregated across 4 monitored circuits with 3-sigma statistical anomaly alarms.
              </p>
            </div>

            {/* 2. Insights */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">2. Lifestyle Insights</h4>
                <Badge variant="Measured" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Evidence-first habit pattern mining: 24-hr diurnal usage profiles, weekday vs. weekend shifts, daypart load variance, and appliance duty cycles derived from 5,832 historical intervals.
              </p>
            </div>

            {/* 3. Automation */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">3. Governed Automation</h4>
                <Badge variant="Measured" label="0 Overlaps" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Versioned rule engine evaluating the 3 SIC rules with mathematical exclusivity proof (0 historical and 0 test overlaps), paired with human-in-the-loop approve/reject gates.
              </p>
            </div>

            {/* 4. Optimization */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">4. Tariff Optimization</h4>
                <Badge variant="Estimated" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Smart scheduling capturing 54.5% tariff discounts ($0.10 vs $0.22/kWh), paired with What-if scenario sliders to model thermostat setbacks and instant dollar savings.
              </p>
            </div>

            {/* 5. Sustainability */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">5. Carbon Accounting</h4>
                <Badge variant="Assumption" label="EPA 0.385 kg/kWh" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Transparent ecological accounting with EPA eGRID national benchmark factor disclosure, 1,284.9 kg emissions ledger, monthly ceiling goals, and mature tree offset calculations.
              </p>
            </div>

            {/* 6. AI Coaching */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-3 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.06)] group">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-text">6. AI Energy Coach</h4>
                <Badge variant="Estimated" label="Deterministic Fallback" />
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Multi-turn resident chat with prompt injection defense and fact citation badges. Operates seamlessly online via Ollama or 100% offline via deterministic fallback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Live Product Preview (Section 4 of Guide) */}
      <section id="preview" className="py-20 bg-surface/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Control Center Preview
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              Real Telemetry Grounded in Truth
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              A high-density cockpit displaying validated data for household HOME-JAMES-001.
            </p>
          </div>

          {/* Interactive Mock Container */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xl space-y-6 relative overflow-hidden max-w-5xl mx-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs font-mono text-muted pl-2">wattwise-ai://control-center/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="Measured" label="5,832 Verified Readings" />
                <Badge variant="Simulated" label="Live Redis Stream" />
              </div>
            </div>

            {/* Metric Preview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted">Total Consumption</span>
                <div className="text-xl font-bold font-mono text-text">3,337.29 kWh</div>
                <span className="text-[10px] text-muted">5,832 hourly intervals</span>
              </div>
              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted">Total Billed Cost</span>
                <div className="text-xl font-bold font-mono text-primary">$452.83</div>
                <span className="text-[10px] text-muted">Peak: $254.56 | Off-Peak: $198.27</span>
              </div>
              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted">Peak Tariff Share</span>
                <div className="text-xl font-bold font-mono text-warning">40.6% kWh</div>
                <span className="text-[10px] text-muted">56.2% of total dollar spend</span>
              </div>
              <div className="bg-surface-2 p-4 rounded-xl border border-border space-y-1">
                <span className="text-xs text-muted">Efficiency Score</span>
                <div className="text-xl font-bold font-mono text-primary">84 / 100</div>
                <span className="text-[10px] text-muted">Formula: 100 - (Peak_Pct × 0.4)</span>
              </div>
            </div>

            {/* Quick Link into Live App */}
            <div className="text-center pt-2">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-semibold text-xs hover:bg-primary-hover transition-colors shadow-sm"
              >
                <span>Launch Interactive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works (Event Lifecycle) */}
      <section id="how-it-works" className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-wider font-mono font-bold text-primary">
              Demo Story Walkthrough
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-text">
              From IoT Stream to Explainable Action
            </h3>
            <p className="text-xs sm:text-sm text-muted">
              Experience the end-to-end event lifecycle running across Docker Compose containers.
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
                desc: 'Active rules evaluate with 0 overlaps and emit alert events.',
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
                desc: 'Resident asks "why did I get this alert?" and receives citations.',
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

      {/* 7. Evaluator Test Account Callout */}
      <section className="py-16 bg-surface/40 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs text-primary font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Evaluator Access
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-text">
            Ready to explore the live environment?
          </h3>

          <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
            Sign in with the verified test account credentials to test the dashboard, run What-if scenarios, inspect 3-sigma anomalies, and chat with the Energy Coach.
          </p>

          <div className="bg-surface border border-border p-4 rounded-xl max-w-md mx-auto text-left text-xs space-y-2 shadow-lg">
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold text-sm hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >
              Sign In as James Miller
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Final CTA & Footer */}
      <footer className="mt-auto py-12 bg-surface/85 border-t border-border text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-text">WattWise AI</span>
            <span>• Proof-of-Concept for SIC Smart-Home Track</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/app" className="hover:text-primary transition-colors">Dashboard</Link>
            <Link to="/app/explore" className="hover:text-primary transition-colors">Explore Directory</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Resident Login</Link>
            <a href="#capabilities" className="hover:text-primary transition-colors">Capabilities</a>
          </div>

          <div>
            © 2026 WattWise AI. Built with React, Vite, FastAPI, PostgreSQL, and Redis.
          </div>
        </div>
      </footer>
    </div>
  );
}
