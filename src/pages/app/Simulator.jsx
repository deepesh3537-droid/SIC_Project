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
  Wind
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import AlertCard from '../../components/cards/AlertCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function Simulator() {
  const [selectedRow, setSelectedRow] = useState(6);
  const [replaying, setReplaying] = useState(false);
  const [replayResult, setReplayResult] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [latestSimulatedAlert, setLatestSimulatedAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoPoll, setAutoPoll] = useState(true);

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
    if (!autoPoll) return;
    const interval = setInterval(() => {
      fetchLatestAlert();
    }, 3000);
    return () => clearInterval(interval);
  }, [autoPoll]);

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
      // Immediately pull alerts
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
        <PageHeader title="Replay Studio" subtitle="Initializing event stream simulator..." />
        <LoadingState message="Loading test set evaluations and Redis stream status..." rows={3} />
      </div>
    );
  }

  // Pre-configured SIC test triggers
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
      desc: '03:00 | Heat Mode | Outdoor: 12.8°C > 10°C',
      icon: Moon,
      color: 'text-rule-r2 border-rule-r2/40 hover:bg-rule-r2/10'
    },
    {
      row: 19,
      rule: 'R3',
      title: 'Free Cooling (Row 19)',
      desc: '11:00 | Cool Mode | Outdoor: 20.3°C ≤ 21.6°C',
      icon: Wind,
      color: 'text-rule-r3 border-rule-r3/40 hover:bg-rule-r3/10'
    },
    {
      row: 0,
      rule: 'None',
      title: 'Nominal Baseline (Row 0)',
      desc: '00:00 | Off-Peak | All within normal bounds',
      icon: Activity,
      color: 'text-muted border-border hover:bg-surface-2'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <PageHeader
        title="Event Stream Simulator & Replay"
        subtitle="Inject simulated test readings into Redis Streams (iot.reading.received) and observe live actuations"
        badge={<Badge variant="Simulated" tooltip="All readings generated here are flagged is_simulated: true" />}
        actions={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoPoll(!autoPoll)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                autoPoll
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-surface-2 text-muted border-border'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${autoPoll ? 'animate-pulse text-primary' : ''}`} />
              <span>{autoPoll ? 'Live Polling Active (3s)' : 'Polling Paused'}</span>
            </button>
          </div>
        }
      />

      {/* Warning & Transparency Notice */}
      <div className="bg-surface border border-info/30 rounded-card p-4 flex items-start gap-3">
        <Activity className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-text flex items-center gap-2">
            <span>Isolated Event Pipeline Guarantee</span>
            <Badge variant="Simulated" />
          </p>
          <p className="text-muted leading-relaxed">
            Replayed readings are tagged with <code className="text-text bg-surface-2 px-1 py-0.5 rounded font-mono">is_simulated: true</code> throughout the message broker, rule engine, and alerts database. They verify end-to-end reactivity without contaminating verified historical telemetry.
          </p>
        </div>
      </div>

      {/* Main Grid: Control Panel & Live Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Replay Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Quick Triggers */}
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Recommended SIC Verification Scenarios</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickTriggers.map(t => {
                const Icon = t.icon;
                const isSelected = selectedRow === t.row;
                return (
                  <button
                    key={t.row}
                    onClick={() => handleReplay(t.row)}
                    disabled={replaying}
                    className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${t.color} ${
                      isSelected ? 'ring-2 ring-primary bg-surface-2' : 'bg-surface-2/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-text flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          {t.title}
                        </span>
                        <Badge variant="Simulated" />
                      </div>
                      <p className="text-[11px] text-muted font-mono leading-tight">{t.desc}</p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-primary font-semibold">
                      <span>Trigger Replay</span>
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Index Selector */}
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
              <Cpu className="w-4 h-4 text-muted" />
              <span>Manual Row Selector (0 – 29)</span>
            </h3>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="29"
                value={selectedRow}
                onChange={(e) => setSelectedRow(parseInt(e.target.value, 10))}
                className="flex-1 accent-primary cursor-pointer"
              />
              <span className="font-mono text-base font-bold text-primary w-12 text-center bg-surface-2 py-1 px-2 rounded border border-border">
                #{selectedRow}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted font-mono">Dataset: sic_IoT_test.csv</span>
              <button
                onClick={() => handleReplay(selectedRow)}
                disabled={replaying}
                className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-bg font-semibold text-xs font-mono transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{replaying ? 'Injecting into Redis...' : `Replay Test Row #${selectedRow}`}</span>
              </button>
            </div>
          </div>

          {/* Execution Pipeline Status */}
          {replayResult && (
            <div className="bg-surface border border-primary/40 rounded-card p-4 shadow-sm space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-primary">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Replay Executed Successfully
                </span>
                <span className="font-mono text-muted">{replayResult.replayData?.message_id}</span>
              </div>
              <p className="text-xs text-muted font-mono">
                Published to <strong className="text-text">iot.reading.received</strong> → Evaluated by Analytics Consumer → Alert Consumer generated {replayResult.alertsProcessed || 0} alert(s).
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Live Stream Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-surface border border-border rounded-card p-5 shadow-sm h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                  <Activity className="w-4 h-4 text-warning" />
                  <span>Latest Simulated Actuation / Alert</span>
                </h3>
                <Badge variant="Simulated" label="Live Stream Event" />
              </div>

              {latestSimulatedAlert ? (
                <div className="animate-in fade-in duration-300">
                  <AlertCard alert={latestSimulatedAlert} />
                </div>
              ) : (
                <EmptyState
                  icon={Radio}
                  title="No Simulated Alerts In Session"
                  description="Click any scenario on the left to inject a simulated reading into the message stream."
                />
              )}
            </div>

            {testResults?.warnings && testResults.warnings.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-warning text-xs font-semibold mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Dataset Quality Integrity Audit</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono text-muted">
                  {testResults.warnings.slice(0, 3).map((w, i) => (
                    <div key={i} className="p-2 rounded bg-surface-2 border border-border/50">
                      ⚠️ {w}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

