import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { AIActivityIndicator, StatusIndicator, TactileToggle } from '../ui/TactilePrimitives';

export const Header: React.FC = () => {
  const { mode, setMode, workspaceStatus, geminiConfigured } = useWorkflow();

  return (
    <header className="h-16 border-b border-white/10 bg-[#080B10]/85 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Workspace Mode & Gemini Status */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-slate-400 font-mono">WORKSPACE:</span>
          {workspaceStatus.connected ? (
            <StatusIndicator status="connected" text="CONNECTED WORKSPACE" />
          ) : (
            <StatusIndicator status="disconnected" text="DISCONNECTED (SETUP REQUIRED)" />
          )}
        </div>

        <div className="h-4 w-[1px] bg-white/15" />

        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400 font-mono text-[11px]">AI Engine:</span>
          {geminiConfigured ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
              <AIActivityIndicator size="sm" active={true} />
              <span>Live (Gemini 1.5 Flash)</span>
            </div>
          ) : (
            <span className="text-slate-400 font-medium">Fallback LLM Reasoner</span>
          )}
        </div>
      </div>

      {/* Right: Tactile Policy Mode Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-inner">
          <button
            onClick={() => setMode('COPILOT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              mode === 'COPILOT'
                ? 'bg-blue-600 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_14px_rgba(59,130,246,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>COPILOT</span>
          </button>
          <button
            onClick={() => setMode('AUTOPILOT')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              mode === 'AUTOPILOT'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_14px_rgba(16,185,129,0.5)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AUTOPILOT</span>
          </button>
        </div>
      </div>
    </header>
  );
};
