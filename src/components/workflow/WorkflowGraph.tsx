import React, { useState } from 'react';
import { WorkflowStep } from '../../types/agent';
import { Calendar, Mail, HardDrive, Cpu, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface WorkflowGraphProps {
  steps: WorkflowStep[];
  currentStepId?: string;
}

export const WorkflowGraph: React.FC<WorkflowGraphProps> = ({ steps }) => {
  const [hoveredStepId, setHoveredStepId] = useState<string | null>(null);

  const getToolIcon = (tool: string) => {
    if (tool.includes('calendar')) return Calendar;
    if (tool.includes('email')) return Mail;
    if (tool.includes('drive')) return HardDrive;
    return Cpu;
  };

  const getNodeBadge = (step: WorkflowStep) => {
    switch (step.status) {
      case 'completed': return <Badge variant="success">{step.verified ? 'Verified' : 'Completed'}</Badge>;
      case 'running': return <Badge variant="info" dot={true}>Running</Badge>;
      case 'waiting_approval': return <Badge variant="warning">Approval Required</Badge>;
      case 'failed': return <Badge variant="error">Failed</Badge>;
      default: return <Badge variant="neutral">Pending</Badge>;
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Autonomous Execution Flow</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Live visual tool orchestration nodes</p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-text-muted"></span>READ</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-400"></span>LOW RISK</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span>HIGH RISK</span>
        </div>
      </div>

      {/* Execution Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const ToolIcon = getToolIcon(step.tool);
          const showWhy = hoveredStepId === step.id;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setHoveredStepId(step.id)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`p-4 rounded-lg border transition-all flex flex-col justify-between h-44 bg-background-elevated ${
                step.status === 'running'
                  ? 'border-indigo-500/60 shadow-subtle ring-1 ring-indigo-500/30'
                  : 'border-border-subtle'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-border-subtle flex items-center justify-center text-text-primary">
                  <ToolIcon className="w-4 h-4 text-indigo-400" />
                </div>
                {getNodeBadge(step)}
              </div>

              {/* Body / Why Explanation Overlay */}
              <div className="my-2 min-h-[44px]">
                {showWhy ? (
                  <div className="p-2.5 rounded-md bg-background-card border border-indigo-500/30 text-[11px] text-indigo-300 leading-tight space-y-1">
                    <span className="font-mono font-semibold text-indigo-400 block text-[10px] uppercase">WHY ORKA DID THIS:</span>
                    <p className="line-clamp-2">{step.whyExplanation || 'Required to fulfill goal outcome.'}</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-text-primary line-clamp-1">{step.name}</h4>
                    <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{step.description}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1 text-text-muted font-mono">
                  <span>Step #{idx + 1}</span>
                  <HelpCircle className="w-3 h-3 text-text-muted hover:text-text-primary cursor-pointer" />
                </div>
                <span className="font-mono font-medium text-text-muted text-[10px]">
                  {step.risk}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
