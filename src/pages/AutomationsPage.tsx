import React, { useEffect, useState } from 'react';
import { AutomationRule, DiscoveredPattern } from '../types/automations';
import { Layers, Sparkles, CheckCircle2, Zap, ToggleLeft, ToggleRight, Plus, ArrowRight } from 'lucide-react';

export const AutomationsPage: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [pattern, setPattern] = useState<DiscoveredPattern | null>(null);
  const [patternCreated, setPatternCreated] = useState(false);

  useEffect(() => {
    fetch('/api/automations')
      .then(res => res.json())
      .then(data => {
        if (data.automations) setAutomations(data.automations);
        if (data.discoveredPattern) setPattern(data.discoveredPattern);
      })
      .catch(() => {});
  }, []);

  const handleToggle = (id: string, active: boolean) => {
    fetch('/api/automations/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active })
    })
      .then(res => res.json())
      .then(data => {
        if (data.automations) setAutomations(data.automations);
      });
  };

  const handleCreatePattern = () => {
    fetch('/api/automations/create-pattern', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.automations) {
          setAutomations(data.automations);
          setPatternCreated(true);
        }
      });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          <span>Autonomous Workflows & Rules</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ActionOS monitors background triggers and autonomously executes safe repetitive routines.
        </p>
      </div>

      {/* SECTION 13: "AI DISCOVERS AUTOMATION" FEATURE CARD */}
      {pattern && !patternCreated && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/80 border border-indigo-500/40 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI PATTERN DISCOVERY DETECTED
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{pattern.title}</h3>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              {pattern.occurrences} repetitive actions detected
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            {pattern.description}
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-indigo-400 font-bold">WHEN:</span>
              <span>{pattern.suggestedWorkflow.when}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-indigo-400 font-bold">IF:</span>
              <span>{pattern.suggestedWorkflow.if}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <span className="text-emerald-400 font-bold">DO:</span>
              <div className="space-y-1">
                {pattern.suggestedWorkflow.do.map((step, i) => (
                  <div key={i} className="text-slate-200">✓ {step}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              onClick={handleCreatePattern}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Automation Rule</span>
            </button>
          </div>
        </div>
      )}

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {automations.map((auto) => (
          <div
            key={auto.id}
            className={`p-6 rounded-3xl bg-[#12141d]/90 border transition-all flex flex-col justify-between h-64 shadow-xl ${
              auto.active ? 'border-indigo-500/30' : 'border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                  {auto.category}
                </span>

                <button
                  onClick={() => handleToggle(auto.id, auto.active)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {auto.active ? (
                    <ToggleRight className="w-7 h-7 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600" />
                  )}
                </button>
              </div>

              <h3 className="font-bold text-slate-100 text-base mb-1">{auto.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">{auto.description}</p>

              <div className="space-y-1 text-xs text-slate-300 font-mono bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                <div><span className="text-slate-500">Trigger:</span> {auto.trigger}</div>
                <div><span className="text-slate-500">Condition:</span> {auto.condition}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>{auto.executionsCount} executions</span>
              <span className="text-emerald-400 font-semibold">{auto.approvalsRequiredCount} approvals required</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
