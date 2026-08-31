import React from 'react';
import { WorkflowStep } from '../../types/agent';
import { CheckCircle2, Clock, ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';

export const ExecutionTimeline: React.FC<{ steps: WorkflowStep[] }> = ({ steps }) => {
  return (
    <div className="p-5 rounded-2xl bg-[#12141d]/80 border border-white/5 space-y-4">
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Live Execution Timeline</span>
      </h3>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10">
        {steps.map((s, idx) => {
          let statusColor = 'bg-slate-700 text-slate-400';
          let StatusIcon = Clock;

          if (s.status === 'completed') {
            statusColor = 'bg-emerald-500 text-white';
            StatusIcon = CheckCircle2;
          } else if (s.status === 'running') {
            statusColor = 'bg-indigo-500 text-white animate-pulse';
            StatusIcon = Clock;
          } else if (s.status === 'waiting_approval') {
            statusColor = 'bg-amber-500 text-white animate-bounce';
            StatusIcon = ShieldAlert;
          }

          return (
            <div key={s.id} className="relative flex items-start gap-4 pl-8 group">
              <div className={`absolute left-0 top-0.5 w-7 h-7 rounded-full ${statusColor} flex items-center justify-center text-xs shadow-md z-10`}>
                <StatusIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 p-3 rounded-xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{s.name}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">{s.tool}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{s.reasoningSnippet || s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
