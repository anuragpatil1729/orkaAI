import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { mode, setMode, workspaceStatus, geminiConfigured } = useWorkflow();

  return (
    <header className="h-16 border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Workspace Mode & Gemini Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">WORKSPACE:</span>
          {workspaceStatus.connected ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CONNECTED WORKSPACE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>DISCONNECTED (SETUP REQUIRED)</span>
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Gemini AI Engine:</span>
          {geminiConfigured ? (
            <span className="text-indigo-300 font-semibold">Live (Gemini 1.5 Flash)</span>
          ) : (
            <span className="text-slate-400 font-medium">Not Configured</span>
          )}
        </div>
      </div>

      {/* Right: Policy Mode Switcher */}
      <div className="flex items-center gap-4">
        {/* COPILOT vs AUTOPILOT Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10">
          <button
            onClick={() => setMode('COPILOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'COPILOT'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>COPILOT</span>
          </button>
          <button
            onClick={() => setMode('AUTOPILOT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'AUTOPILOT'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/30'
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
