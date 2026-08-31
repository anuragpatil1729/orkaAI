import React, { useState } from 'react';
import { WorkflowStep } from '../../types/agent';
import { Calendar, Mail, HardDrive, Cpu, CheckCircle2, AlertTriangle, Clock, ShieldAlert, HelpCircle } from 'lucide-react';
import { AIActivityIndicator, GlassCard, StatusIndicator } from '../ui/TactilePrimitives';

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

  const getNodeStateStyle = (step: WorkflowStep, isCurrent: boolean) => {
    switch (step.status) {
      case 'completed':
        return {
          cardStyle: 'bg-emerald-500/10 border-emerald-500/30 shadow-sm',
          badgeText: step.verified ? '✓ VERIFIED' : '✓ COMPLETED',
          badgeStyle: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          iconColor: 'text-emerald-400'
        };
      case 'running':
        return {
          cardStyle: 'bg-blue-500/20 border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.4)] scale-[1.03] z-10',
          badgeText: 'RUNNING',
          badgeStyle: 'bg-blue-500/30 text-white border-blue-400 shadow-[0_0_12px_#3B82F6]',
          iconColor: 'text-blue-300 animate-pulse'
        };
      case 'waiting_approval':
        return {
          cardStyle: 'bg-amber-500/20 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.35)] scale-[1.02] z-10',
          badgeText: '⚠ APPROVAL REQUIRED',
          badgeStyle: 'bg-amber-500/30 text-amber-300 border-amber-400 animate-pulse',
          iconColor: 'text-amber-400'
        };
      case 'failed':
        return {
          cardStyle: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          badgeText: '✕ FAILED',
          badgeStyle: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconColor: 'text-rose-400'
        };
      default:
        return {
          cardStyle: 'bg-white/[0.04] border-white/10 opacity-75',
          badgeText: '○ PENDING',
          badgeStyle: 'bg-white/10 text-slate-400 border-white/10',
          iconColor: 'text-slate-500'
        };
    }
  };

  return (
    <GlassCard className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-mono">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>Autonomous Execution Network</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Live node visualization of dynamic AI tool orchestration</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold font-mono">
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>READ</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
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
          const isCurrent = step.id === currentStepId;
          const nodeStyle = getNodeStateStyle(step, isCurrent);
          const showWhy = hoveredStepId === step.id;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStepId(step.id)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`p-4.5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between h-44 ${
                nodeStyle.cardStyle
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-slate-200 shadow-inner">
                  <ToolIcon className={`w-4.5 h-4.5 ${nodeStyle.iconColor}`} />
                </div>

                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${nodeStyle.badgeStyle}`}>
                  {step.status === 'running' && <AIActivityIndicator size="sm" active={true} />}
                  <span>{nodeStyle.badgeText}</span>
                </div>
              </div>

              {/* Body / Why Orka Did This Overlay */}
              <div className="my-2 relative min-h-[50px]">
                {showWhy ? (
                  <div className="p-2.5 rounded-xl bg-black/85 border border-cyan-500/40 text-[10px] text-cyan-200 leading-tight space-y-1 animate-fadeIn shadow-lg">
                    <span className="font-mono font-bold text-cyan-400 block uppercase tracking-wider">WHY ORKA DID THIS:</span>
                    <p>{step.whyExplanation || 'Required to fulfill goal outcome.'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{step.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{step.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                  <span className="text-slate-400 font-bold">Node #{idx + 1}</span>
                  <span title="Hover to see Why Orka Did This"><HelpCircle className="w-3 h-3 text-slate-400 hover:text-cyan-300 cursor-pointer" /></span>
                </div>
                <span
                  className={`font-mono font-semibold uppercase px-2 py-0.5 rounded-md ${
                    step.risk === 'HIGH_RISK_WRITE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : step.risk === 'LOW_RISK_WRITE'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {step.risk}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};
