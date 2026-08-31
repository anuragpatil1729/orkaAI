import React from 'react';
import { CommandInput } from '../components/dashboard/CommandInput';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { IntegrationBar } from '../components/dashboard/IntegrationBar';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { Sparkles, Layers } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OrkaAI • Autonomous Execution Layer for Productivity</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            "Tell it the outcome. <span className="gradient-text">It handles the work.</span>"
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            OrkaAI parses your outcome goal, generates a dynamic tool plan, interacts with Gmail, Calendar, and Drive, executes verified work, and asks approval before sensitive external actions.
          </p>
        </div>
      </div>

      {/* Outcome-First Command Control Center */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-300">Command Control Center</h2>
          <span className="text-xs text-indigo-400 font-mono">GOAL → PLAN → EXECUTE → VERIFY</span>
        </div>
        <CommandInput />
      </div>

      {/* Suggested Outcomes */}
      <QuickActionCards />

      {/* SECTION 6: HOW ORKA WORKS CONTRAST CARD */}
      <div className="p-6 rounded-3xl bg-[#12141d]/80 border border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>How OrkaAI Differs From Traditional Automation</span>
          </h3>
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            AGENTIC EXECUTION
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">TRADITIONAL AUTOMATION</span>
            <p className="text-slate-300 font-mono">IF event occurs THEN execute static script Y</p>
            <p className="text-[11px] text-slate-500">Fixed rigid rules, cannot adapt to ambiguous context or missing information.</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/20 space-y-2">
            <span className="text-indigo-300 font-bold uppercase text-[10px]">ORKAAI AGENT ENGINE</span>
            <p className="text-emerald-400 font-mono">GOAL → CONTEXT → PLAN → EXECUTE → VERIFY</p>
            <p className="text-[11px] text-slate-300">Decomposes natural intent, reasons over Gmail/Drive context, enforces policy guardrails, and verifies outcomes.</p>
          </div>
        </div>
      </div>

      {/* Workspace Connection Status Bar */}
      <IntegrationBar />

      {/* Recent Executions */}
      <RecentActivityWidget />
    </div>
  );
};
