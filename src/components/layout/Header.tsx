import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Cpu, Play, CheckCircle2, AlertCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const { mode, setMode, workspaceStatus, geminiConfigured, launchDemoScenario, isExecuting } = useWorkflow();

  return (
    <header className="h-16 border-b border-white/5 bg-[#090a0f]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Tagline & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">STATUS:</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Workspace Connected</span>
          </div>
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Gemini AI Engine:</span>
          {geminiConfigured ? (
            <span className="text-indigo-300 font-semibold">Live (Gemini API)</span>
          ) : (
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <span>Demo Mode</span>
              <span className="text-[10px] text-slate-400 font-mono">(Key Optional)</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Mode Switcher & Quick Demo Launcher */}
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

        {/* Demo Scenario Launch Button */}
        <button
          onClick={launchDemoScenario}
          disabled={isExecuting}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:opacity-90 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Acme Demo</span>
        </button>
      </div>
    </header>
  );
};
