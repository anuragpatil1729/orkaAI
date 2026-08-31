import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Cpu, LogOut, User } from 'lucide-react';
import { StatusPill, AIIndicator, ThemeTogglePill } from '../ui/NeoTactileSystem';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { mode, setMode, workspaceStatus, geminiConfigured } = useWorkflow();
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <header className={`h-16 border-b px-8 flex items-center justify-between sticky top-0 z-30 select-none backdrop-blur-2xl transition-colors duration-300 ${
      theme === 'dark' ? 'border-white/10 bg-[#17233B]/85' : 'border-slate-300/80 bg-white/75 text-slate-900'
    }`}>
      {/* Left: Workspace Mode & Gemini Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold tracking-wider font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>WORKSPACE:</span>
          {workspaceStatus.connected ? (
            <StatusPill status="connected" text="CONNECTED WORKSPACE" />
          ) : (
            <StatusPill status="disconnected" text="DISCONNECTED (SETUP REQUIRED)" />
          )}
        </div>

        <div className={`h-4 w-[1px] ${theme === 'dark' ? 'bg-white/15' : 'bg-slate-300'}`} />

        <div className="flex items-center gap-2.5 text-xs font-medium">
          <Cpu className="w-4 h-4 text-blue-500" />
          <span className={`font-mono text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>AI Engine:</span>
          {geminiConfigured ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <AIIndicator size="sm" active={true} />
              <span>Live (Gemini 1.5 Flash)</span>
            </div>
          ) : (
            <span className={theme === 'dark' ? 'text-slate-400 font-medium' : 'text-slate-600 font-medium'}>Fallback LLM Reasoner</span>
          )}
        </div>
      </div>

      {/* Right: User Profile, Logout & Policy Mode Switcher */}
      <div className="flex items-center gap-4">
        {/* User Profile Pill & Logout Button */}
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium font-mono">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-cyan-300" />
            )}
            <span className="text-slate-200 font-bold max-w-[120px] truncate">{user.name}</span>
            <button
              onClick={logout}
              title="Sign Out & Invalidate Session"
              className="text-slate-400 hover:text-rose-400 p-1 rounded-full hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Physical Theme Toggle Pill */}
        <ThemeTogglePill />

        {/* Policy Mode Switcher Bar */}
        <div className={`flex items-center gap-2 p-1.5 rounded-full border shadow-inner ${
          theme === 'dark' ? 'bg-black/60 border-white/15' : 'bg-slate-200/80 border-slate-300'
        }`}>
          <button
            onClick={() => setMode('COPILOT')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              mode === 'COPILOT'
                ? 'bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0_4px_15px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.4)]'
                : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
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
                : theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
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
