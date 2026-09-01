import React from 'react';
import { WorkflowStep } from '../../types/agent';
import { CheckCircle2, Clock, ShieldAlert, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ExecutionTimeline: React.FC<{ steps: WorkflowStep[] }> = ({ steps }) => {
  return (
    <Card className="p-5 space-y-4">
      <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center gap-2 border-b border-border-subtle pb-3">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <span>Live Execution Timeline</span>
      </h3>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-border-subtle">
        {steps.map((s) => {
          let StatusIcon = Clock;
          let badgeVariant: 'success' | 'info' | 'warning' | 'neutral' | 'error' = 'neutral';

          if (s.status === 'completed') {
            StatusIcon = CheckCircle2;
            badgeVariant = 'success';
          } else if (s.status === 'running') {
            StatusIcon = Clock;
            badgeVariant = 'info';
          } else if (s.status === 'waiting_approval') {
            StatusIcon = ShieldAlert;
            badgeVariant = 'warning';
          } else if (s.status === 'failed') {
            badgeVariant = 'error';
          }

          return (
            <div key={s.id} className="relative flex items-start gap-3 pl-7">
              <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-background-elevated border border-border-subtle flex items-center justify-center text-text-secondary text-xs z-10">
                <StatusIcon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 p-3 rounded-lg bg-background-elevated border border-border-subtle text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-text-primary">{s.name}</h4>
                  <Badge variant={badgeVariant}>{s.tool}</Badge>
                </div>
                <p className="text-[11px] text-text-secondary leading-relaxed">{s.reasoningSnippet || s.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
