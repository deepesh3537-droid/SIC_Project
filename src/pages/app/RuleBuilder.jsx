import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sliders, 
  Layers, 
  Clock, 
  Flame, 
  Wind, 
  Zap, 
  Send
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';

export default function RuleBuilder() {
  const navigate = useNavigate();

  // Form state
  const [ruleName, setRuleName] = useState('High Peak HVAC Draw Warning');
  const [description, setDescription] = useState('Notify when heat pump exceeds 2.5 kWh during expensive peak tariff window.');
  const [metric, setMetric] = useState('hvac_usage_kwh');
  const [operator, setOperator] = useState('>');
  const [threshold, setThreshold] = useState('2.5');
  const [tariffPeriod, setTariffPeriod] = useState('Peak');
  const [action, setAction] = useState('Issue High-Priority Proactive Alert & Coach Suggestion');

  // Validation state
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleValidate = async () => {
    try {
      setValidating(true);
      setSubmitSuccess(false);
      const res = await api.post('/rules/validate-custom', {
        metric,
        operator,
        threshold: parseFloat(threshold),
        tariff_period: tariffPeriod === 'Any' ? null : tariffPeriod
      });
      setValidationResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to validate rule against historical dataset');
    } finally {
      setValidating(false);
    }
  };

  const handleSubmitForApproval = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const triggerCondition = `${metric} ${operator} ${threshold}${tariffPeriod !== 'Any' ? ` AND tariff_period == '${tariffPeriod}'` : ''}`;
      
      await api.post('/automations', {
        name: ruleName,
        description,
        triggerCondition,
        action,
        ruleId: 'CUSTOM-' + Date.now().toString().slice(-4)
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/app/automations');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit rule for approval');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Custom IF-THEN Rule Builder"
        subtitle="Compose custom automations, validate trigger safety against 5,832 historical readings, and submit for user approval"
        badge={<Badge variant="Estimated" label="Human-in-the-Loop Gate" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rule Composition Form */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-text text-sm">Rule Configuration</h3>
            <span className="text-xs text-muted">Defines triggering criteria and action</span>
          </div>

          <form onSubmit={handleSubmitForApproval} className="space-y-4">
            {/* Rule Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text">Rule Name</label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* IF Clause */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-3">
              <div className="text-xs font-bold font-mono text-primary flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                IF (Trigger Condition)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] text-muted">Telemetry Metric</label>
                  <select
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text focus:outline-none focus:border-primary"
                  >
                    <option value="hvac_usage_kwh">HVAC Heat Pump / AC Draw (kWh)</option>
                    <option value="dishwasher_usage_kwh">Dishwasher Draw (kWh)</option>
                    <option value="washer_dryer_usage_kwh">Washer/Dryer Draw (kWh)</option>
                    <option value="total_usage_kwh">Total Household Usage (kWh)</option>
                    <option value="outdoor_temp_c">Outdoor Temperature (°C)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted">Operator</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs text-text font-mono focus:outline-none focus:border-primary"
                  >
                    <option value=">">&gt; (Greater than)</option>
                    <option value=">=">&gt;= (Greater or equal)</option>
                    <option value="<">&lt; (Less than)</option>
                    <option value="<=">&lt;= (Less or equal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted">Threshold Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Tariff Filter */}
              <div className="pt-2 border-t border-border/60 flex items-center gap-3 text-xs">
                <span className="text-muted">Tariff Period Filter:</span>
                {['Any', 'Peak', 'Off-Peak'].map((tp) => (
                  <label key={tp} className="flex items-center gap-1.5 cursor-pointer text-text">
                    <input
                      type="radio"
                      name="tariffPeriod"
                      checked={tariffPeriod === tp}
                      onChange={() => setTariffPeriod(tp)}
                      className="accent-primary"
                    />
                    {tp}
                  </label>
                ))}
              </div>
            </div>

            {/* THEN Clause */}
            <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-3">
              <div className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current" />
                THEN (Action to Execute)
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted">Automation Action</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-primary"
                >
                  <option value="Issue High-Priority Proactive Alert & Coach Suggestion">Issue High-Priority Proactive Alert & Coach Suggestion</option>
                  <option value="Send Push Notification & Recommend Thermostat Setback">Send Push Notification & Recommend Thermostat Setback</option>
                  <option value="Queue Appliance Delay Until Next Off-Peak Window">Queue Appliance Delay Until Next Off-Peak Window</option>
                  <option value="Log Advisory Event in Audit History">Log Advisory Event in Audit History</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleValidate}
                disabled={validating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-border text-xs font-semibold text-text hover:bg-surface hover:border-primary transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-primary" />
                {validating ? 'Testing Against 5,832 Readings...' : 'Validate Against History'}
              </button>

              <button
                type="submit"
                disabled={submitting || !validationResult}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-black text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>
          </form>

          {submitSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Rule submitted in "Pending" status! Redirecting to Automation Center for review...
            </div>
          )}
        </div>

        {/* Historical Validation Results Box */}
        <div className="bg-surface border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-semibold text-text text-sm">Historical Validation Proof</h3>
              <Badge variant={validationResult?.is_safe ? 'Measured' : 'Estimated'} label={validationResult ? 'Tested' : 'Ready'} />
            </div>

            {validationResult ? (
              <div className="space-y-4 pt-3">
                <div className={`p-3 rounded-lg border flex items-center justify-between ${
                  validationResult.is_safe ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-2 text-xs font-semibold text-text">
                    {validationResult.is_safe ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                    {validationResult.safety_assessment}
                  </div>
                  <span className="font-mono text-xs font-bold text-text">
                    {validationResult.trigger_count} hits
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/50 text-muted">
                    <span>Tested Dataset:</span>
                    <span className="font-mono text-text">5,832 historical readings</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50 text-muted">
                    <span>Trigger Frequency:</span>
                    <span className="font-mono text-primary font-bold">{validationResult.trigger_percentage}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50 text-muted">
                    <span>Overlap with Rule 1:</span>
                    <span className="font-mono text-text">{validationResult.overlap_with_r1} hrs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50 text-muted">
                    <span>Overlap with Rule 2:</span>
                    <span className="font-mono text-text">{validationResult.overlap_with_r2} hrs</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50 text-muted">
                    <span>Overlap with Rule 3:</span>
                    <span className="font-mono text-text">{validationResult.overlap_with_r3} hrs</span>
                  </div>
                </div>

                {validationResult.sample_timestamps?.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] text-muted font-medium">Sample Trigger Timestamps:</span>
                    <div className="space-y-1 font-mono text-[11px] text-text bg-surface-2 p-2.5 rounded-lg border border-border">
                      {validationResult.sample_timestamps.map((ts, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-muted" />
                          {ts}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted space-y-2">
                <ShieldCheck className="w-8 h-8 text-muted/60 mx-auto" />
                <p>Click "Validate Against History" to simulate rule behavior on the 5,832 historical records before deploying.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-surface-2/60 rounded-lg border border-border text-[11px] text-muted space-y-1">
            <span className="font-semibold text-text block">Safety Guarantee (OD-1)</span>
            <p>Rules never activate automatically. Submitting places the rule in 'Pending' state until explicitly reviewed and approved by you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

