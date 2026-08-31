import React from 'react';
import { WorkflowStep } from '../../types/agent';
import { CheckCircle2, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/NeoTactileSystem';

export const ExecutionTimeline: React.FC<{ steps: WorkflowStep[] }> = ({ steps }) => {
  return (
    <GlassCard className="p-6 space-y-5">
      <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
        <Sparkles className="w-4 h-4 text-blue-400" />
        <span>Live Execution Timeline</span>
      </h3>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
        {steps.map((s) => {
          let statusColor = 'bg-slate-800 text-slate-400 border-white/10';
          let StatusIcon = Clock;

          if (s.status === 'completed') {
            statusColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]';
            StatusIcon = CheckCircle2;
          } else if (s.status === 'running') {
            statusColor = 'bg-blue-500/25 text-white border-blue-400 shadow-[0_0_15px_#3B82F6] animate-pulse';
            StatusIcon = Clock;
          } else if (s.status === 'waiting_approval') {
            statusColor = 'bg-amber-500/25 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] animate-bounce';
            StatusIcon = ShieldAlert;
          }

          return (
            <div key={s.id} className="relative flex items-start gap-4 pl-8 group">
              <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full border ${statusColor} flex items-center justify-center text-xs shadow-md z-10`}>
                <StatusIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 p-4 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:bg-white/[0.08] transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{s.name}</h4>
                  <span className="text-[10px] text-cyan-300 font-mono font-semibold">{s.tool}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.reasoningSnippet || s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
