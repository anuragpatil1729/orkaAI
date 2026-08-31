import React, { useState } from 'react';
import { WorkflowStep } from '../../types/agent';
import { Calendar, Mail, HardDrive, Cpu, CheckCircle2, AlertTriangle, Clock, ShieldAlert, HelpCircle } from 'lucide-react';

interface WorkflowGraphProps {
  steps: WorkflowStep[];
  currentStepId?: string;
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ steps, currentStepId }) => {
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  const getToolIcon = (tool: string) => {
    if (tool.includes('calendar')) return Calendar;
    if (tool.includes('email')) return Mail;
    if (tool.includes('drive')) return HardDrive;
    return Cpu;
  };

  const getStatusBadge = (status: WorkflowStep['status'], verified?: boolean) => {
    switch (status) {
      case 'completed':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-400',
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          symbol: verified ? '✓ VERIFIED' : '✓ Completed'
        };
      case 'running':
        return {
          icon: Clock,
          color: 'text-indigo-400 animate-spin',
          bg: 'bg-indigo-500/20 border-indigo-500/40 shadow-glow-indigo',
          symbol: '◉ Running'
        };
      case 'waiting_approval':
        return {
          icon: ShieldAlert,
          color: 'text-amber-400 animate-pulse',
          bg: 'bg-amber-500/20 border-amber-500/40 shadow-glow-amber',
          symbol: '⚠ Approval Required'
        };
      case 'failed':
        return {
          icon: AlertTriangle,
          color: 'text-rose-400',
          bg: 'bg-rose-500/10 border-rose-500/30',
          symbol: '✕ Failed'
        };
      default:
        return {
          icon: Clock,
          color: 'text-slate-500',
          bg: 'bg-white/5 border-white/10',
          symbol: '○ Pending'
        };
    }
  };

  return (
    <div className="w-full p-6 rounded-3xl bg-[#0f111a]/90 backdrop-blur-xl border border-indigo-500/20 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Autonomous Plan Execution Graph</span>
          </h3>
          <p className="text-xs text-slate-400">Live visualization of tool orchestration, verification, and policy guardrails</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>READ</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span>LOW RISK</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>HIGH RISK (GATED)</span>
          </div>
        </div>
      </div>

      {/* Execution Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const ToolIcon = getToolIcon(step.tool);
          const badge = getStatusBadge(step.status, step.verified);
          const StatusIcon = badge.icon;
          const isCurrent = step.id === currentStepId;
          const showWhy = hoveredStepId === step.id;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStepId(step.id)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`p-4 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between h-44 ${
                badge.bg
              } ${isCurrent ? 'ring-2 ring-indigo-500 scale-[1.02]' : ''}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-slate-200">
                  <ToolIcon className="w-4 h-4" />
                </div>

                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${badge.bg}`}>
                  <StatusIcon className={`w-3 h-3 ${badge.color}`} />
                  <span className="text-slate-200">{badge.symbol}</span>
                </div>
              </div>

              {/* Body / Why Orka Did This Overlay */}
              <div className="my-2 relative min-h-[50px]">
                {showWhy ? (
                  <div className="p-2 rounded-xl bg-black/80 border border-indigo-500/40 text-[10px] text-indigo-200 leading-tight space-y-1 animate-fadeIn">
                    <span className="font-bold text-indigo-400 block uppercase tracking-wider">WHY ORKA DID THIS:</span>
                    <p>{step.whyExplanation || 'Required to fulfill goal outcome.'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{step.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{step.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="font-mono text-slate-500">Node #{idx + 1}</span>
                  <span title="Hover to see Why Orka Did This"><HelpCircle className="w-3 h-3 text-slate-500 cursor-pointer" /></span>
                </div>
                <span
                  className={`font-semibold uppercase px-1.5 py-0.5 rounded ${
                    step.risk === 'HIGH_RISK_WRITE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : step.risk === 'LOW_RISK_WRITE'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {step.risk}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
