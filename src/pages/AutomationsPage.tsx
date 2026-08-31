import React, { useEffect, useState } from 'react';
import { AutomationRule, DiscoveredPattern } from '../types/automations';
import { Layers, Sparkles, Plus } from 'lucide-react';
import { GlassCard, TactileButton, TactileToggle } from '../components/ui/NeoTactileSystem';

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
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5 font-mono">
          <Layers className="w-6 h-6 text-blue-400" />
          <span>Autonomous Workflows & Rules</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          OrkaAI monitors background triggers and autonomously executes repetitive routines.
        </p>
      </div>

      {/* AI DISCOVERS AUTOMATION PATTERN CARD */}
      {pattern && !patternCreated && (
        <GlassCard className="p-7 border border-blue-500/40 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Sparkles className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  AI PATTERN DISCOVERY DETECTED
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{pattern.title}</h3>
              </div>
            </div>

            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 rounded-full">
              {pattern.occurrences} repetitive actions detected
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-medium">
            {pattern.description}
          </p>

          <div className="p-4.5 rounded-2xl bg-[#080B10]/95 border border-white/10 space-y-2 text-xs font-mono shadow-inner">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-blue-400 font-bold">WHEN:</span>
              <span>{pattern.suggestedWorkflow.when}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-blue-400 font-bold">IF:</span>
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
            <TactileButton onClick={handleCreatePattern} variant="primary" size="md">
              <Plus className="w-4 h-4" />
              <span>Create Automation Rule</span>
            </TactileButton>
          </div>
        </GlassCard>
      )}

      {/* Physical Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {automations.map((auto) => (
          <GlassCard
            key={auto.id}
            className={`p-6 transition-all flex flex-col justify-between h-64 ${
              auto.active ? 'border-blue-500/40 shadow-[0_15px_40px_rgba(59,130,246,0.15)]' : 'opacity-65'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold uppercase px-3 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">
                  {auto.category}
                </span>

                <TactileToggle
                  checked={auto.active}
                  onChange={() => handleToggle(auto.id, auto.active)}
                />
              </div>

              <h3 className="font-extrabold text-slate-100 text-base mb-1">{auto.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{auto.description}</p>

              <div className="space-y-1 text-xs text-slate-300 font-mono bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                <div><span className="text-slate-400">Trigger:</span> {auto.trigger}</div>
                <div><span className="text-slate-400">Condition:</span> {auto.condition}</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{auto.executionsCount} executions</span>
              <span className="text-emerald-400 font-semibold">{auto.approvalsRequiredCount} approvals</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
