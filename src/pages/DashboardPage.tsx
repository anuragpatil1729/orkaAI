import React from 'react';
import { CommandInput } from '../components/dashboard/CommandInput';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { IntegrationBar } from '../components/dashboard/IntegrationBar';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { Sparkles, Layers, Cpu } from 'lucide-react';
import { GlassCard } from '../components/ui/TactilePrimitives';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <GlassCard className="relative p-8 overflow-hidden shadow-2xl border border-white/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OrkaAI • Autonomous AI Execution OS</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
            "Tell it the outcome. <span className="gradient-text">It handles the work.</span>"
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            OrkaAI parses your outcome goal, generates a dynamic tool plan, interacts with Gmail, Calendar, and Drive, executes verified work, and asks human approval before sensitive external actions.
          </p>
        </div>
      </GlassCard>

      {/* Outcome-First Command Control Center */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2 font-mono">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Command Control Center</span>
          </h2>
          <span className="text-xs text-cyan-400 font-mono font-bold tracking-wider">
            GOAL → CONTEXT → PLAN → EXECUTE → VERIFY
          </span>
        </div>
        <CommandInput />
      </div>

      {/* Suggested Outcomes */}
      <QuickActionCards />

      {/* HOW ORKA WORKS CONTRAST CARD */}
      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>How OrkaAI Differs From Traditional Automation</span>
          </h3>
          <span className="text-[10px] font-bold font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            AGENTIC EXECUTION ENGINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <span className="text-slate-400 font-mono font-bold uppercase text-[10px]">TRADITIONAL AUTOMATION</span>
            <p className="text-slate-300 font-mono font-semibold">IF event occurs THEN execute static script Y</p>
            <p className="text-[11px] text-slate-400">Fixed rigid rules, cannot adapt to ambiguous context or missing workspace information.</p>
          </div>

          <div className="p-4.5 rounded-2xl bg-blue-500/[0.08] border border-blue-500/25 space-y-2">
            <span className="text-blue-300 font-mono font-bold uppercase text-[10px]">ORKAAI AGENT ENGINE</span>
            <p className="text-emerald-400 font-mono font-bold">GOAL → CONTEXT → PLAN → EXECUTE → VERIFY</p>
            <p className="text-[11px] text-slate-300">Decomposes natural intent, reasons over Gmail/Drive context, enforces policy guardrails, and verifies outcomes.</p>
          </div>
        </div>
      </GlassCard>

      {/* Workspace Connection Status Bar */}
      <IntegrationBar />

      {/* Recent Executions */}
      <RecentActivityWidget />
    </div>
  );
};
