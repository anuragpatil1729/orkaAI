import React from 'react';
import { Bot, Cpu } from 'lucide-react';
import { AIActivityIndicator, GlassCard } from '../ui/TactilePrimitives';

interface ExecutionActivityCardProps {
  logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'tool';
  }>;
}

export const AIReasoningCard: React.FC<ExecutionActivityCardProps> = ({ logs }) => {
  return (
    <GlassCard className="p-6 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between font-sans border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4.5 h-4.5 text-cyan-400" />
          <span className="font-bold text-slate-100 text-sm">Execution Activity Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <AIActivityIndicator size="sm" active={true} />
          <span className="text-[10px] text-cyan-300 font-mono font-bold tracking-wider">REAL-TIME EVENT STREAM</span>
        </div>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2.5 text-slate-300 text-[11px] leading-relaxed">
            <span className="text-slate-400 font-mono shrink-0 select-none">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-emerald-300 font-semibold'
                  : log.type === 'warning'
                  ? 'text-amber-300 font-bold'
                  : log.type === 'tool'
                  ? 'text-blue-300'
                  : 'text-slate-300'
              }
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
