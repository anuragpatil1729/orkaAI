import React from 'react';
import { Bot } from 'lucide-react';

interface ExecutionActivityCardProps {
  logs: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'tool';
  }>;
}

export const AIReasoningCard: React.FC<ExecutionActivityCardProps> = ({ logs }) => {
  return (
    <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/5 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between font-sans border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="font-bold text-slate-200 text-sm">Execution Activity</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Real-Time Event Stream</span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2 text-slate-300">
            <span className="text-slate-500 select-none">[{log.timestamp}]</span>
            <span
              className={
                log.type === 'success'
                  ? 'text-emerald-400'
                  : log.type === 'warning'
                  ? 'text-amber-400 font-semibold'
                  : log.type === 'tool'
                  ? 'text-indigo-300'
                  : 'text-slate-300'
              }
            >
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
