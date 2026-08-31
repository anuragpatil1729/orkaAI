import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { 
  Home, 
  Zap, 
  Activity, 
  Grid, 
  PlusCircle, 
  Layers,
  Cpu
} from 'lucide-react';
import { AIActivityIndicator } from '../ui/TactilePrimitives';

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
    <aside className="w-64 border-r border-white/10 bg-[#080B10]/95 backdrop-blur-2xl flex flex-col justify-between p-4 min-h-screen select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="OrkaAI Logo" 
              className="w-10 h-10 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.25)]" 
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#080B10] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">Orka<span className="text-blue-500">AI</span></span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">OS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Execution Engine</p>
          </div>
        </div>

        {/* Primary Tactile Action Button */}
        <button
          onClick={resetWorkflow}
          className="w-full flex items-center justify-center gap-2 neo-button-primary py-3 px-4 text-sm mb-6 shadow-lg shadow-blue-500/25 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>New Outcome</span>
        </button>

        {/* Physical Nav Surface */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[16px] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(59,130,246,0.4)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono shadow-[0_0_10px_#22D3EE]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Surface */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        <div className="px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AIActivityIndicator size="sm" active={true} />
            <span className="text-slate-300 font-semibold text-[11px]">Policy Guardrails</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE</span>
        </div>
        
        <div className="px-3 text-[11px] text-slate-400 flex items-center justify-between font-medium">
          <span>OrkaAI v1.0</span>
          <span className="flex items-center gap-1">
            <Cpu className="w-3 h-3 text-blue-400" />
            <span>Gemini Engine</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
