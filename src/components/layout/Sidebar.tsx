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
import { TactileButton, AIIndicator } from '../ui/NeoTactileSystem';

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
    <aside className="w-64 border-r border-white/10 bg-[#080B10]/95 backdrop-blur-2xl flex flex-col justify-between p-5 min-h-screen select-none shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 px-2 py-4 mb-6">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="OrkaAI Logo" 
              className="w-10 h-10 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.35)]" 
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#080B10] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white">Orka<span className="text-blue-500">AI</span></span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">OS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-none mt-1">AI Execution Engine</p>
          </div>
        </div>

        {/* Primary Tactile Action Button */}
        <TactileButton
          onClick={resetWorkflow}
          variant="primary"
          size="lg"
          className="w-full justify-center mb-6 py-3 shadow-[0_10px_25px_rgba(59,130,246,0.5)]"
        >
          <PlusCircle className="w-4.5 h-4.5 text-white" />
          <span>New Outcome</span>
        </TactileButton>

        {/* Physical Nav Surface */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/40 shadow-[0_10px_25px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono shadow-[0_0_12px_#22D3EE] animate-pulse">
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
        <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AIIndicator size="sm" active={true} />
            <span className="text-slate-300 font-semibold text-[11px]">Policy Guardrails</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE</span>
        </div>
        
        <div className="px-3 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>OrkaAI v1.0</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>Gemini Engine</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
