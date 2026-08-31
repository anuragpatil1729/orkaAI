import React from 'react';
import { CommandInput } from '../components/dashboard/CommandInput';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { IntegrationBar } from '../components/dashboard/IntegrationBar';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { Sparkles, Bot, Zap, ArrowRight } from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

export const DashboardPage: React.FC = () => {
  const { launchDemoScenario } = useWorkflow();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-950/90 border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ActionOS • AI Execution Layer for Productivity</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            "Don't manage your work. <span className="gradient-text">Let AI do it.</span>"
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Traditional AI assistants tell users what to do. ActionOS understands your intent, builds a live execution graph, interacts with Gmail, Calendar, and Drive, performs the work, and asks for approval when actions are sensitive.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={launchDemoScenario}
              className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Run Acme Meeting Scenario</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Input Box */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-slate-300">Command Control Center</h2>
        <CommandInput />
      </div>

      {/* Quick Action Chips */}
      <QuickActionCards />

      {/* Workspace Status Bar */}
      <IntegrationBar />

      {/* Recent Executions */}
      <RecentActivityWidget />
    </div>
  );
};
