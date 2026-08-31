import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { WorkflowGraph } from '../components/workflow/WorkflowGraph';
import { ExecutionTimeline } from '../components/workflow/ExecutionTimeline';
import { AIReasoningCard } from '../components/workflow/AIReasoningCard';
import { ApprovalModal } from '../components/workflow/ApprovalModal';
import { ResultView } from '../components/result/ResultView';
import { Sparkles, ArrowLeft, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ExecutionPage: React.FC = () => {
  const { currentWorkflow, resetWorkflow, isExecuting } = useWorkflow();

  if (!currentWorkflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-200">No Execution Currently Active</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Start a new task from the home dashboard or click "Launch Acme Demo" in the top bar to run the centerpiece scenario.
        </p>
        <button
          onClick={resetWorkflow}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all"
        >
          Go to Home Control Center
        </button>
      </div>
    );
  }

  const isCompleted = currentWorkflow.status === 'completed' && currentWorkflow.result;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetWorkflow}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Control Center</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Goal:</span>
          <span className="text-xs font-bold text-indigo-300 max-w-xs truncate">{currentWorkflow.prompt}</span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              currentWorkflow.status === 'completed'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : currentWorkflow.status === 'waiting_approval'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
            }`}
          >
            {currentWorkflow.status}
          </span>
        </div>
      </div>

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
