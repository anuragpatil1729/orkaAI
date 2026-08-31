import React, { useState } from 'react';
import { WorkflowStep } from '../../types/agent';
import { Calendar, Mail, HardDrive, Cpu, HelpCircle } from 'lucide-react';
import { GlassPanel, GlassCard, StatusPill, AIIndicator } from '../ui/NeoTactileSystem';

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

  const getNodeStateStyle = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed':
        return {
          cardStyle: 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.2)]',
          badgeStatus: 'completed' as const,
          badgeText: step.verified ? '✓ VERIFIED' : '✓ COMPLETED',
          iconColor: 'text-emerald-400'
        };
      case 'running':
        return {
          cardStyle: 'bg-blue-500/25 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.6),0_0_15px_rgba(34,211,238,0.5)] scale-[1.03] z-10 animate-pulse',
          badgeStatus: 'running' as const,
          badgeText: 'RUNNING',
          iconColor: 'text-cyan-300'
        };
      case 'waiting_approval':
        return {
          cardStyle: 'bg-amber-500/20 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-[1.02] z-10',
          badgeStatus: 'waiting_approval' as const,
          badgeText: '⚠ APPROVAL REQUIRED',
          iconColor: 'text-amber-300'
        };
      case 'failed':
        return {
          cardStyle: 'bg-rose-500/15 border-rose-500/50 text-rose-300',
          badgeStatus: 'failed' as const,
          badgeText: '✕ FAILED',
          iconColor: 'text-rose-400'
        };
      default:
        return {
          cardStyle: 'bg-white/[0.03] border-white/10 opacity-70',
          badgeStatus: 'pending' as const,
          badgeText: '○ PENDING',
          iconColor: 'text-slate-500'
        };
    }
  };

  return (
    <GlassPanel glowEdge={true} className="p-7 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2.5 font-mono">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>Autonomous Execution Network</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Live visual flow of AI tool orchestration nodes and policy gates</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>READ</span>
          </div>
          <div className="flex items-center gap-2 text-blue-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>LOW RISK</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>HIGH RISK (GATED)</span>
          </div>
        </div>
      </div>

      {/* Execution Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
        {steps.map((step, idx) => {
          const ToolIcon = getToolIcon(step.tool);
          const nodeStyle = getNodeStateStyle(step);
          const showWhy = hoveredStepId === step.id;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStepId(step.id)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`p-5 rounded-[24px] border transition-all duration-300 relative flex flex-col justify-between h-48 backdrop-blur-xl ${
                nodeStyle.cardStyle
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-slate-200 shadow-inner">
                  <ToolIcon className={`w-5 h-5 ${nodeStyle.iconColor}`} />
                </div>

                <StatusPill status={nodeStyle.badgeStatus} text={nodeStyle.badgeText} />
              </div>

              {/* Body / Why Explanation Overlay */}
              <div className="my-2 relative min-h-[54px]">
                {showWhy ? (
                  <div className="p-3 rounded-2xl bg-black/90 border border-cyan-400/50 text-[10px] text-cyan-200 leading-tight space-y-1 animate-fadeIn shadow-xl">
                    <span className="font-mono font-bold text-cyan-300 block uppercase tracking-wider">WHY ORKA DID THIS:</span>
                    <p>{step.whyExplanation || 'Required to fulfill goal outcome.'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-slate-100 line-clamp-1">{step.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{step.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                  <span className="text-slate-300 font-bold">Node #{idx + 1}</span>
                  <span title="Hover to see Why Orka Did This"><HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-cyan-300 cursor-pointer" /></span>
                </div>
                <span
                  className={`font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    step.risk === 'HIGH_RISK_WRITE'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : step.risk === 'LOW_RISK_WRITE'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-white/10 text-slate-400 border border-white/10'
                  }`}
                >
                  {step.risk}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
};
