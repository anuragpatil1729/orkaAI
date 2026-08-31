import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Cpu } from 'lucide-react';
import { StatusPill, AIIndicator } from '../ui/NeoTactileSystem';

export const Header: React.FC = () => {
  const { mode, setMode, workspaceStatus, geminiConfigured } = useWorkflow();

  return (
    <header className="h-16 border-b border-white/10 bg-[#080B10]/85 backdrop-blur-2xl px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Workspace Mode & Gemini Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold tracking-wider text-slate-400 font-mono">WORKSPACE:</span>
          {workspaceStatus.connected ? (
            <StatusPill status="connected" text="CONNECTED WORKSPACE" />
          ) : (
            <StatusPill status="disconnected" text="DISCONNECTED (SETUP REQUIRED)" />
          )}
        </div>

        <div className="h-4 w-[1px] bg-white/15" />

        <div className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
          <Cpu className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400 font-mono text-[11px]">AI Engine:</span>
          {geminiConfigured ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <AIIndicator size="sm" active={true} />
              <span>Live (Gemini 1.5 Flash)</span>
            </div>
          ) : (
            <span className="text-slate-400 font-medium">Fallback LLM Reasoner</span>
          )}
        </div>
      </div>

      {/* Right: Physical Policy Mode Switcher Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/15 shadow-inner">
          <button
            onClick={() => setMode('COPILOT')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              mode === 'COPILOT'
                ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>COPILOT</span>
          </button>
          <button
            onClick={() => setMode('AUTOPILOT')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              mode === 'AUTOPILOT'
                ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white shadow-[0_4px_15px_rgba(16,185,129,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]'
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
