import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { theme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'execution', label: 'Active Execution', icon: Zap, badge: currentWorkflow ? 'LIVE' : undefined },
    { id: 'automations', label: 'Automations', icon: Layers },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'connected', label: 'Connected Apps', icon: Grid },
  ];

  return (
    <aside className={`w-64 border-r backdrop-blur-2xl flex flex-col justify-between p-5 min-h-screen select-none shrink-0 transition-colors duration-300 ${
      theme === 'dark' ? 'border-white/10 bg-[#17233B]/95 text-slate-100' : 'border-slate-300 bg-white/80 text-slate-900'
    }`}>
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3.5 px-2 py-4 mb-6">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="OrkaAI Logo" 
              className="w-10 h-10 rounded-2xl object-cover border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.35)]" 
            />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#17233B] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`font-extrabold text-xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Orka<span className="text-blue-500">AI</span></span>
              <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">OS</span>
            </div>
            <p className={`text-[11px] font-medium leading-none mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI Execution Engine</p>
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
                    : theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.08]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className={isActive ? 'text-white' : ''}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-mono shadow-[0_0_12px_#42DFF5] animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Surface */}
      <div className={`pt-4 border-t space-y-3 ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
        <div className={`px-4 py-3 rounded-2xl border flex items-center justify-between text-xs ${
          theme === 'dark' ? 'bg-white/[0.04] border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <AIIndicator size="sm" active={true} />
            <span className={`font-semibold text-[11px] ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Policy Guardrails</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-mono font-bold">ACTIVE</span>
        </div>
        
        <div className={`px-3 text-[11px] flex items-center justify-between font-mono ${
          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <span>OrkaAI v1.0</span>
          <span className={`flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>Gemini Engine</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
