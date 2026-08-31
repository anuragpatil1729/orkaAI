import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  Home, 
  Zap, 
  Activity, 
  Grid, 
  Settings, 
  PlusCircle, 
  Sparkles,
  Layers,
  CheckSquare
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, resetWorkflow, currentWorkflow } = useWorkflow();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'execution', label: 'Active Execution', icon: Zap, badge: currentWorkflow ? 'LIVE' : undefined },
    { id: 'automations', label: 'Automations', icon: Layers },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'connected', label: 'Connected Apps', icon: Grid },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0b0d14] flex flex-col justify-between p-4 min-h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">Action<span className="text-indigo-400">OS</span></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">MVP</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none">AI Execution Layer</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={resetWorkflow}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-98 mb-6"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-white/5 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-300 font-medium">Autopilot Engine</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
        </div>
        
        <div className="px-3 text-[11px] text-slate-500 flex items-center justify-between">
          <span>ActionOS v1.0</span>
          <span>Google Gemini 1.5</span>
        </div>
      </div>
    </aside>
  );
};
