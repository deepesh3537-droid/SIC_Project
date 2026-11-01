import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  Cpu, 
  ShieldAlert,
  Flame,
  Moon,
  Wind,
  SlidersHorizontal,
  TrendingDown,
  DollarSign,
  Leaf,
  Layers,
  Info,
  Zap,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import ChartCard from '../../components/cards/ChartCard.jsx';
import AlertCard from '../../components/cards/AlertCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { formatCurrency, formatKwh, formatNumber } from '../../lib/utils.js';

export default function Simulator() {
  const [activeTab, setActiveTab] = useState('what_if'); // 'what_if' | 'replay'

  // --- What-if Scenario Modeler State ---
  const [hvacDelta, setHvacDelta] = useState(1.5);
  const [shiftDishwasher, setShiftDishwasher] = useState(true);
  const [shiftLaundry, setShiftLaundry] = useState(true);
  const [generalConservation, setGeneralConservation] = useState(5);
  const [carbonFactor, setCarbonFactor] = useState(0.385);
  const [simResults, setSimResults] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // --- Event Replay State ---
  const [selectedRow, setSelectedRow] = useState(6);
  const [replaying, setReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [latestSimulatedAlert, setLatestSimulatedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoPoll, setAutoPoll] = useState(true);

  // Run What-If calculation
  const calculateWhatIf = async () => {
    try {
      setSimLoading(true);
      const res = await api.post('/simulator/what-if', {
        hvacSetpointDelta: parseFloat(hvacDelta),
        shiftDishwasherToOffPeak: shiftDishwasher,
        shiftLaundryToOffPeak: shiftLaundry,
        generalReductionPercent: parseFloat(generalConservation),
        carbonFactor: parseFloat(carbonFactor)
      });
      setSimResults(res.data);
    } catch (err) {
      console.error('Failed to run what-if simulation:', err);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    calculateWhatIf();
  }, [hvacDelta, shiftDishwasher, shiftLaundry, generalConservation, carbonFactor]);

  // Fetch test set metadata
  const fetchMetadata = async () => {
    try {
      const res = await api.get('/rules/test-results');
      setTestResults(res.data);
    } catch (err) {
      console.error('Failed to load test evaluation results:', err);
    }
  };

  // Fetch latest simulated alert
  const fetchLatestAlert = async () => {
    try {
      const res = await api.get('/alerts');
      const simAlert = (res.data || []).find(a => a.is_simulated);
      if (simAlert) {
        setLatestSimulatedAlert(simAlert);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchMetadata(), fetchLatestAlert()]);
      setLoading(false);
    }
    init();
  }, []);

  // Polling loop for live pipeline updates
  useEffect(() => {
    if (!autoPoll || activeTab !== 'replay') return;
    const interval = setInterval(() => {
      fetchLatestAlert();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPoll, activeTab]);

  const handleReplay = async (rowIndex) => {
    const idx = typeof rowIndex === 'number' ? rowIndex : selectedRow;
    setSelectedRow(idx);
    setReplaying(true);
    setReplayResult(null);

    try {
      const res = await api.post('/simulator/replay', {
        rowIndex: idx,
        dataset: 'test'
      });
      setReplayResult(res.data);
      await fetchLatestAlert();
    } catch (err) {
      console.error('Replay execution failed:', err);
      alert(`Replay failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setReplaying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Simulator" subtitle="Initializing scenario engine and telemetry stream..." />
        <LoadingState message="Loading simulation model and test sets..." rows={3} />
      </div>
    );
  }

  const quickTriggers = [
    {
      row: 6,
      rule: 'R1',
      title: 'Peak Dishwasher (Row 6)',
      desc: '17:00 | Peak Tariff | Dishwasher: 1.25 kWh',
      icon: Flame,
      color: 'text-rule-r1 border-rule-r1/40 hover:bg-rule-r1/10'
    },
    {
      row: 21,
      rule: 'R2',
      title: 'Night Heating (Row 21)',
      desc: '02:00 | Cold Night: 14.8°C | HVAC: 0.95 kWh',
      icon: Moon,
      color: 'text-rule-r2 border-rule-r2/40 hover:bg-rule-r2/10'
    },
    {
      row: 19,
      rule: 'R3',
      title: 'Morning Pre-Heat (Row 19)',
      desc: '07:00 | Morning Warmup | HVAC: 1.10 kWh',
      icon: Wind,
      color: 'text-rule-r3 border-rule-r3/40 hover:bg-rule-r3/10'
    },
    {
      row: 0,
      rule: 'None',
      title: 'Normal Baseline (Row 0)',
      desc: '12:00 | Off-Peak | HVAC: 0.15 kWh (Standby)',
      icon: CheckCircle2,
      color: 'text-muted border-border hover:bg-surface-2'
    }
  ];

  const comparisonData = simResults ? [
    {
      metric: 'Energy (kWh/yr)',
      Baseline: simResults.baseline.annualKwh,
      Projected: simResults.projected.annualKwh
    },
    {
      metric: 'Cost ($/yr)',
      Baseline: simResults.baseline.annualCostUsd,
      Projected: simResults.projected.annualCostUsd
    },
    {
      metric: 'Carbon (kg CO2e)',
      Baseline: simResults.baseline.annualCarbonKg,
      Projected: simResults.projected.annualCarbonKg
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Energy Simulator & What-if Modeler"
        subtitle="Simulate usage reduction and tariff shifting, project carbon impacts, and test live IoT event streams"
        badge={<Badge variant="Estimated" label="Mathematical Projection" />}
        action={
          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs">
            <button
              onClick={() => setActiveTab('what_if')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'what_if' ? 'bg-primary text-black font-semibold shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              What-If Modeler
            </button>
            <button
              onClick={() => setActiveTab('replay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'replay' ? 'bg-primary text-black font-semibold shadow-sm' : 'text-muted hover:text-text'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              IoT Stream Replay
            </button>
          </div>
        }
      />

      {/* --- TAB 1: WHAT-IF SCENARIO MODELER --- */}
      {activeTab === 'what_if' && (
        <div className="space-y-6">
          {/* KPI Projection Cards */}
          {simResults && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Projected Cost Reduction"
                value={`$${simResults.savings.annualCostSavedUsd}/yr`}
                subvalue={`${simResults.savings.percentCostReduction}% reduction vs $${simResults.baseline.annualCostUsd} baseline`}
                icon={DollarSign}
                badge={<Badge variant="Estimated" label="Annual Savings" />}
              />
              <StatCard
                title="Projected Energy Savings"
                value={`${simResults.savings.annualKwhSaved} kWh/yr`}
                subvalue={`From ${simResults.baseline.annualKwh} down to ${simResults.projected.annualKwh} kWh`}
                icon={Zap}
                badge={<Badge variant="Estimated" label="Conservation" />}
              />
              <StatCard
                title="Avoided Carbon Footprint"
                value={`${simResults.savings.annualCarbonSavedKg} kg CO₂e`}
                subvalue={`~${Math.round(simResults.savings.annualCarbonSavedKg / 21)} mature trees planted equivalent`}
                icon={Leaf}
                badge={<Badge variant="Assumption" label="ADR-012 Factor" />}
              />
            </div>
          )}

          {/* Scenario Controls & Visual Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text text-sm">Interactive What-If Scenario Levers</h3>
                  <p className="text-xs text-muted">Adjust sliders to model shifts in behavior, setpoints, and schedules</p>
                </div>
                <Badge variant="Estimated" label="Dynamic Model" />
              </div>

              {/* Lever 1: Thermostat Delta */}
              <div className="space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    HVAC Thermostat Setback / Relaxation
                  </span>
                  <span className="font-mono font-bold text-primary">{hvacDelta}°C adjustment</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.5"
                  value={hvacDelta}
                  onChange={(e) => setHvacDelta(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted">
                  <span>0°C (Current baseline)</span>
                  <span>+1.5°C (Recommended)</span>
                  <span>+3.0°C (Aggressive)</span>
                </div>
              </div>

              {/* Lever 2: Shift Dishwasher to Off-Peak */}
              <div className="flex items-center justify-between bg-surface-2/40 p-3 rounded-lg border border-border/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-text flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    Shift Dishwasher 100% to Off-Peak
                  </div>
                  <div className="text-[11px] text-muted">
                    Move cycles from 19:00 dinner peak ($0.22/kWh) to 02:00 overnight ($0.10/kWh)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={shiftDishwasher}
                  onChange={(e) => setShiftDishwasher(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              {/* Lever 3: Shift Laundry to Off-Peak */}
              <div className="flex items-center justify-between bg-surface-2/40 p-3 rounded-lg border border-border/60">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-text flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-purple-400" />
                    Shift Washer/Dryer 100% to Off-Peak
                  </div>
                  <div className="text-[11px] text-muted">
                    Move 2,200W laundry runs to overnight hours (save 54.5% per cycle)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={shiftLaundry}
                  onChange={(e) => setShiftLaundry(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              {/* Lever 4: General Conservation */}
              <div className="space-y-2 bg-surface-2/40 p-3 rounded-lg border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    General Behavioral Conservation
                  </span>
                  <span className="font-mono font-bold text-primary">{generalConservation}% reduction</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="1"
                  value={generalConservation}
                  onChange={(e) => setGeneralConservation(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted">
                  <span>0%</span>
                  <span>5% (Habit tweaks)</span>
                  <span>25% (Eco warrior)</span>
                </div>
              </div>
            </div>

            {/* Visual Impact Comparison */}
            <ChartCard
              title="Baseline vs. Simulated Outcome"
              subtitle="Projected annual impact across Energy, Cost, and Carbon footprint"
              badge={<Badge variant="Estimated" label="Scenario Comparison" />}
            >
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#22272e" />
                    <XAxis dataKey="metric" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-surface border border-border p-2.5 rounded-lg shadow-lg text-xs space-y-1">
                              <div className="font-semibold text-text">{label}</div>
                              <div className="text-muted">Baseline: <span className="font-mono font-bold text-text">{payload[0].value}</span></div>
                              <div className="text-muted">Projected: <span className="font-mono font-bold text-emerald-400">{payload[1].value}</span></div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                    <Bar dataKey="Baseline" fill="#6b7280" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Projected" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Mathematical Assumptions Box */}
          {simResults && (
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-xs text-text">Transparent Modeling Assumptions (ADR-012)</h4>
                </div>
                <Badge variant="Assumption" label="Estimates != Measured" />
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted">
                {simResults.assumptions.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-surface-2/40 p-2.5 rounded-lg border border-border/40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: IOT EVENT STREAM REPLAY --- */}
      {activeTab === 'replay' && (
        <div className="space-y-6">
          {/* Quick Triggers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTriggers.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.row}
                  onClick={() => handleReplay(t.row)}
                  disabled={replaying}
                  className={`p-4 rounded-xl border bg-surface transition-all text-left flex flex-col justify-between space-y-3 ${t.color}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface-2 border border-border">
                      {t.rule}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-text">{t.title}</h4>
                    <p className="text-xs text-muted mt-1 font-mono">{t.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium pt-2 border-t border-border/50">
                    <Play className="w-3 h-3 fill-current" />
                    Inject Test Event
                  </div>
                </button>
              );
            })}
          </div>

          {/* Replay Studio & Live Telemetry Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text text-sm">Manual Test Dataset Slider</h3>
                  <p className="text-xs text-muted">Replay any row from the 30-row evaluation dataset into Redis Streams</p>
                </div>
                <Badge variant="Simulated" label="Synthetic Replay" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Target Dataset Row:</span>
                  <span className="font-mono font-bold text-primary">Row {selectedRow} of 29</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="29"
                  value={selectedRow}
                  onChange={(e) => setSelectedRow(parseInt(e.target.value, 10))}
                  className="w-full accent-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleReplay(selectedRow)}
                  disabled={replaying}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black font-semibold text-xs hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {replaying ? 'Injecting into Redis Stream...' : `Replay Row ${selectedRow}`}
                </button>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Stream: <span className="font-mono text-text">iot.reading.received</span>
                </div>
              </div>
            </div>

            {/* Latest Simulated Alert Card */}
            <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-text text-sm">Live Alert Output</h3>
                <Badge variant="Simulated" label="Pipeline Catch" />
              </div>

              {latestSimulatedAlert ? (
                <AlertCard
                  alert={latestSimulatedAlert}
                  onMarkRead={() => fetchLatestAlert()}
                />
              ) : (
                <div className="text-center py-8 text-xs text-muted">
                  No simulated alerts captured yet. Click any quick trigger to replay an IoT row.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
