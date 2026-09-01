import React from 'react';
import { Cpu } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ExecutionActivityCardProps {
  logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'tool';
  }>;
}

export const AIReasoningCard: React.FC<ExecutionActivityCardProps> = ({ logs }) => {
  return (
    <Card className="p-5 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between font-sans border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-text-primary text-xs uppercase font-mono tracking-wider">Execution Log Stream</span>
        </div>
        <Badge variant="accent" dot={true}>LIVE LOGS</Badge>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2 text-text-secondary text-[11px] leading-relaxed">
            <span className="text-text-muted font-mono shrink-0 select-none">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-emerald-400 font-medium'
                  : log.type === 'warning'
                  ? 'text-amber-400 font-medium'
                  : log.type === 'tool'
                  ? 'text-indigo-400 font-medium'
                  : 'text-text-secondary'
              }
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
