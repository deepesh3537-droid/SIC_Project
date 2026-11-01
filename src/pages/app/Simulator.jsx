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
      color: 'text-primary border-primary/40 hover:bg-primary/10'
    },
    {
      row: 21,
      rule: 'R2',
      title: 'Night Heating (Row 21)',
      desc: '02:00 | Cold Night: 14.8°C | HVAC: 0.95 kWh',
      icon: Moon,
      color: 'text-secondary border-secondary/40 hover:bg-secondary/10'
    },
    {
      row: 19,
      rule: 'R3',
      title: 'Morning Warmup (Row 19)',
      desc: '07:00 | Morning Warmup | HVAC: 1.10 kWh',
      icon: Wind,
      color: 'text-purple-400 border-purple-400/40 hover:bg-purple-400/10'
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Energy Simulator & What-if Modeler"
        subtitle="Simulate usage reduction and tariff shifting, project carbon impacts, and test live IoT event streams"
        badge={<Badge variant="Estimated" label="Mathematical Projection" />}
        actions={
          <div className="flex items-center gap-1.5 bg-surface-2 p-1 rounded-lg border border-border text-xs font-mono">
            <button
              onClick={() => setActiveTab('what_if')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'what_if' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.25)]' : 'text-muted hover:text-text'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>What-If Modeler</span>
            </button>
            <button
              onClick={() => setActiveTab('replay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'replay' ? 'bg-primary text-black font-bold shadow-[0_0_10px_rgba(34,211,238,0.25)]' : 'text-muted hover:text-text'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>IoT Stream Replay</span>
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
                subtitle={`${simResults.savings.percentCostReduction}% reduction vs $${simResults.baseline.annualCostUsd} baseline`}
                icon={DollarSign}
                badge="Estimated"
                badgeTooltip="Annual savings model"
                accent="primary"
              />
              <StatCard
                title="Projected Energy Savings"
                value={`${simResults.savings.annualKwhSaved} kWh/yr`}
                subtitle={`From ${simResults.baseline.annualKwh} down to ${simResults.projected.annualKwh} kWh`}
                icon={Zap}
                badge="Estimated"
                badgeTooltip="Conservation projection"
                accent="info"
              />
              <StatCard
                title="Avoided Carbon Footprint"
                value={`${simResults.savings.annualCarbonSavedKg} kg CO₂e`}
                subtitle={`~${Math.round(simResults.savings.annualCarbonSavedKg / 21)} mature trees planted equivalent`}
                icon={Leaf}
                badge="Assumption"
                badgeTooltip="ADR-012 EPA Factor (0.385 kg/kWh)"
                accent="warning"
              />
            </div>
          )}

          {/* Scenario Controls & Visual Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="bg-surface border border-border rounded-card p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-text text-sm">Interactive What-If Scenario Levers</h3>
                  <p className="text-xs text-muted font-mono">Adjust sliders to model shifts in behavior, setpoints, and schedules</p>
                </div>
                <Badge variant="Estimated" label="Dynamic Model" />
              </div>

              {/* Lever 1: Thermostat Delta */}
              <div className="space-y-2 bg-surface-2 p-3.5 rounded-xl border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-warning" />
                    <span>HVAC Thermostat Setback / Relaxation</span>
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
                <p className="text-[11px] text-muted">Reduces continuous heating/cooling load by approx. 6% per °C setback.</p>
              </div>

              {/* Lever 2: Off-Peak Appliance Shifts */}
              <div className="space-y-2.5 bg-surface-2 p-3.5 rounded-xl border border-border/60">
                <span className="font-medium text-text text-xs block mb-1">Time-of-Use Appliance Shift (Tariff Arbitrage)</span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg bg-surface border border-border hover:border-primary/40 transition-colors">
                    <span className="text-muted flex items-center gap-2">
                      <Wind className="w-3.5 h-3.5 text-primary" />
                      <span>Shift Dishwasher runs after 21:00 (Off-Peak)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={shiftDishwasher}
                      onChange={(e) => setShiftDishwasher(e.target.checked)}
                      className="accent-primary w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg bg-surface border border-border hover:border-primary/40 transition-colors">
                    <span className="text-muted flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-secondary" />
                      <span>Shift Washer & Dryer to weekends or off-peak</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={shiftLaundry}
                      onChange={(e) => setShiftLaundry(e.target.checked)}
                      className="accent-primary w-4 h-4"
                    />
                  </label>
                </div>
              </div>

              {/* Lever 3: Conservation Percentage */}
              <div className="space-y-2 bg-surface-2 p-3.5 rounded-xl border border-border/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>General Household Conservation</span>
                  </span>
                  <span className="font-mono font-bold text-primary">{generalConservation}% reduction</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={generalConservation}
                  onChange={(e) => setGeneralConservation(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <p className="text-[11px] text-muted">Eliminates vampire draw and standby power through automated smart plugs.</p>
              </div>

              {/* Lever 4: Carbon Factor Source (ADR-012) */}
              <div className="p-3.5 bg-surface-2 rounded-xl border border-border/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-warning" />
                    <span>Regional Carbon Emission Factor</span>
                  </span>
                  <span className="font-mono text-primary font-bold">{carbonFactor} kg/kWh</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  {[
                    { label: 'EPA eGRID US Avg', val: 0.385 },
                    { label: 'Clean Hydro Grid', val: 0.120 },
                    { label: 'Coal Heavy Grid', val: 0.820 }
                  ].map((cfg) => (
                    <button
                      key={cfg.label}
                      onClick={() => setCarbonFactor(cfg.val)}
                      className={`p-2 rounded-lg border text-center transition-all ${
                        carbonFactor === cfg.val 
                          ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm' 
                          : 'bg-surface border-border text-muted hover:text-text'
                      }`}
                    >
                      <div>{cfg.val}</div>
                      <div className="text-[9px] text-muted truncate">{cfg.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Comparison Chart */}
            <ChartCard
              title="Baseline vs. Simulated Projection Comparison"
              subtitle="Annual impact across energy consumption, dollar costs, and carbon ledger"
              badge="Estimated"
              badgeTooltip="Calculated dynamically based on active slider positions"
            >
              <div className="h-80 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F334D" />
                    <XAxis dataKey="metric" stroke="#8FA1A8" fontSize={10} fontFamily="monospace" />
                    <YAxis stroke="#8FA1A8" fontSize={10} fontFamily="monospace" />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-surface/95 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl text-xs font-mono space-y-1">
                              <div className="font-semibold text-text border-b border-border/60 pb-1">{label}</div>
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="font-bold text-text">{formatNumber(entry.value, 1)}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#8FA1A8' }} />
                    <Bar dataKey="Baseline" fill="#8FA1A8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Projected" fill="#22D3EE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {simResults && (
                <div className="mt-3 p-3 bg-surface-2 rounded-xl border border-border/60 text-xs text-muted flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    Simulated configuration achieves <strong className="text-primary font-mono">{simResults.savings.percentCostReduction}% annual cost savings</strong> while eliminating <strong className="text-warning font-mono">{simResults.savings.annualCarbonSavedKg} kg</strong> of emissions.
                  </span>
                </div>
              )}
            </ChartCard>
          </div>
        </div>
      )}

      {/* --- TAB 2: IOT STREAM EVENT REPLAY --- */}
      {activeTab === 'replay' && (
        <div className="space-y-6">
          {/* Quick Triggers Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-text text-sm">Targeted Rule Trigger Rows</h3>
                <p className="text-xs text-muted font-mono">One-click event replay targeting verified test dataset intervals</p>
              </div>
              <Badge variant="Simulated" label="Redis Replay Engine" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickTriggers.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedRow === t.row;

                return (
                  <button
                    key={t.row}
                    onClick={() => handleReplay(t.row)}
                    disabled={replaying}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-surface border-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'bg-surface border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-primary">{t.rule}</span>
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="font-semibold text-sm text-text">{t.title}</div>
                    <p className="text-xs text-muted mt-1 font-mono">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Replay Result Banner */}
          {replayResult && (
            <div className="p-4 rounded-xl bg-surface border border-primary/30 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Event Published to Redis ({replayResult.event_id})
                </span>
                <span className="text-xs font-mono text-muted">{replayResult.timestamp}</span>
              </div>
              <p className="text-xs text-muted">
                Channel: <code className="text-primary font-mono">{replayResult.channel}</code> • Reading replayed into analytics consumer.
              </p>
            </div>
          )}

          {/* Latest Alert Preview */}
          {latestSimulatedAlert && (
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Latest Pipeline Alert Generated by Simulator
              </span>
              <AlertCard alert={latestSimulatedAlert} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
