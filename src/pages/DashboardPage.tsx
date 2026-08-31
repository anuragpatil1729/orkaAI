import React from 'react';
import { CommandInput } from '../components/dashboard/CommandInput';
import { IntegrationBar } from '../components/dashboard/IntegrationBar';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { IncomingWorkWidget } from '../components/tasks/IncomingWorkWidget';
import { Sparkles, Layers, Cpu } from 'lucide-react';
import { GlassPanel, GlassCard, ExecutionDialGauge, StatusPill } from '../components/ui/NeoTactileSystem';
import { useWorkflow } from '../context/WorkflowContext';

export const DashboardPage: React.FC = () => {
  const { currentWorkflow } = useWorkflow();

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Hero Welcome & Goal Section */}
      <GlassPanel glowEdge={true} className="relative p-8 shadow-2xl border border-white/20">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OrkaAI • Autonomous AI Execution OS</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Prepare me <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">for tomorrow.</span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed font-medium opacity-90">
            Tell Orka what outcome you need. It handles calendar alignment, Gmail thread scanning, technical doc verification, and executes verified work.
          </p>
        </div>
      </GlassPanel>

      {/* INCOMING WORK (EMAIL-TO-ACTION) TASK CENTER */}
      <IncomingWorkWidget />

      {/* Hero 2-Column Section: Command Input & Active Execution Progress Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base font-bold flex items-center gap-2.5 font-mono">
              <Cpu className="w-5 h-5 text-blue-400" />
              <span>Command Control Center</span>
            </h2>
            <span className="text-xs text-cyan-300 font-mono font-bold tracking-wider">
              GOAL → CONTEXT → PLAN → EXECUTE
            </span>
          </div>
          <CommandInput />
        </div>

        {/* Active Workflow Dial Gauge */}
        <GlassCard className="lg:col-span-1 p-6 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-2">
            <span className="text-xs font-mono font-bold uppercase text-slate-400">ACTIVE WORKFLOW GAUGE</span>
            <StatusPill status={currentWorkflow ? 'running' : 'completed'} text={currentWorkflow ? 'EXECUTING' : 'READY'} />
          </div>

          <ExecutionDialGauge progress={currentWorkflow ? 68 : 100} title="Progress" subtitle="Track Record" size={190} />

          <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-white/10 font-mono text-xs text-left">
            <div>
              <span className="text-slate-400 text-[10px]">Actions:</span>
              <p className="font-bold text-cyan-300">8 Executed</p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px]">Verification:</span>
              <p className="font-bold text-emerald-400">✓ Verified</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* HOW ORKA WORKS CONTRAST CARD */}
      <GlassCard className="p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>How OrkaAI Differs From Traditional Automation</span>
          </h3>
          <span className="text-[10px] font-bold font-mono uppercase px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            AGENTIC EXECUTION ENGINE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <span className="text-slate-400 font-mono font-bold uppercase text-[10px]">TRADITIONAL AUTOMATION</span>
            <p className="font-mono font-semibold">IF event occurs THEN execute static script Y</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">Fixed rigid rules, cannot adapt to ambiguous context or missing workspace information.</p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/[0.12] border border-blue-500/30 space-y-2">
            <span className="text-blue-300 font-mono font-bold uppercase text-[10px]">ORKAAI AGENT ENGINE</span>
            <p className="text-emerald-400 font-mono font-bold">GOAL → CONTEXT → PLAN → EXECUTE → VERIFY</p>
            <p className="text-[11px] opacity-90 leading-relaxed">Decomposes natural intent, reasons over Gmail/Drive context, enforces policy guardrails, and verifies outcomes.</p>
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
