import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowGraph } from '../components/workflow/WorkflowGraph';
import { ExecutionTimeline } from '../components/workflow/ExecutionTimeline';
import { AIReasoningCard } from '../components/workflow/AIReasoningCard';
import { ApprovalModal } from '../components/workflow/ApprovalModal';
import { ResultView } from '../components/result/ResultView';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { GlassPanel, GlassCard, TactileButton, StatusPill, ExecutionDialGauge } from '../components/ui/NeoTactileSystem';

export const ExecutionPage: React.FC = () => {
  const { currentWorkflow, resetWorkflow } = useWorkflow();

  if (!currentWorkflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 text-center">
        <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.3)]">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-xl font-extrabold text-white">No Execution Currently Active</h3>
        <p className="text-sm text-slate-400 max-w-md leading-relaxed">
          Start a new outcome goal in the Command Control Center to run autonomous workflow tool execution.
        </p>
        <TactileButton
          onClick={resetWorkflow}
          variant="primary"
          size="md"
        >
          Go to Home Control Center
        </TactileButton>
      </div>
    );
  }

  const isCompleted = currentWorkflow.status === 'completed' && currentWorkflow.result;
  const completedStepsCount = currentWorkflow.steps.filter(s => s.status === 'completed').length;
  const totalStepsCount = currentWorkflow.steps.length || 1;
  const progressPercent = Math.min(100, Math.round((completedStepsCount / totalStepsCount) * 100));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetWorkflow}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono font-medium">Goal:</span>
          <span className="text-xs font-bold text-cyan-300 max-w-xs truncate font-mono">{currentWorkflow.prompt}</span>
          <StatusPill
            status={
              currentWorkflow.status === 'completed'
                ? 'completed'
                : currentWorkflow.status === 'waiting_approval'
                ? 'waiting_approval'
                : 'running'
            }
            text={currentWorkflow.status}
          />
        </div>
      </div>

      {/* Hero Execution Control Card with Radial Dial Gauge (Target Image 2) */}
      <GlassPanel glowEdge={true} className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-blue-500/40">
        <div className="space-y-3 max-w-lg">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            LIVE AI CONTROL SCREEN
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {currentWorkflow.prompt}
          </h2>
          <p className="text-xs text-slate-300 font-mono">
            {completedStepsCount} of {totalStepsCount} tool actions completed • {currentWorkflow.status.toUpperCase()}
          </p>
        </div>

        {/* Circular Progress Arc Gauge */}
        <div className="shrink-0">
          <ExecutionDialGauge progress={progressPercent} title="Progress" subtitle="Track Record" size={190} />
        </div>
      </GlassPanel>

      {/* Interactive Execution Graph */}
      <WorkflowGraph steps={currentWorkflow.steps} currentStepId={currentWorkflow.currentStepId} />

      {/* High-Risk Approval Modal Gate */}
      <ApprovalModal />

      {/* Main Content: Timeline & Reasoning logs during execution, OR ResultView when completed */}
      {isCompleted ? (
        <ResultView result={currentWorkflow.result!} onReset={resetWorkflow} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExecutionTimeline steps={currentWorkflow.steps} />
          <AIReasoningCard logs={currentWorkflow.reasoningLog} />
        </div>
      )}
    </div>
  );
};
