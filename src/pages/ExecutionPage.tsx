import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { ExecutionTimeline } from '../components/workflow/ExecutionTimeline';
import { AIReasoningCard } from '../components/workflow/AIReasoningCard';
import { ApprovalModal } from '../components/workflow/ApprovalModal';
import { ResultView } from '../components/result/ResultView';
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';

export const ExecutionPage: React.FC = () => {
  const { currentWorkflow, resetWorkflow } = useWorkflow();

  if (!currentWorkflow) {
    return (
      <div className="py-8 max-w-xl mx-auto">
        <EmptyState
          title="No active task"
          description="Enter a task description on the Overview page to start execution."
          actionLabel="Go to Overview"
          onAction={resetWorkflow}
        />
      </div>
    );
  }

  const isCompleted = currentWorkflow.status === 'completed' && currentWorkflow.result;
  const completedStepsCount = currentWorkflow.steps.filter(s => s.status === 'completed').length;
  const totalStepsCount = currentWorkflow.steps.length || 1;

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          onClick={resetWorkflow}
          variant="ghost"
          size="sm"
          className="text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </Button>

        <Badge variant={currentWorkflow.status === 'completed' ? 'success' : 'info'}>
          {currentWorkflow.status}
        </Badge>
      </div>

      {/* Task Goal Header */}
      <Card className="p-5 space-y-3">
        <div className="space-y-1">
          <span className="text-[11px] font-mono text-text-muted uppercase">Active Task</span>
          <h2 className="text-base font-semibold text-text-primary">{currentWorkflow.prompt}</h2>
          <p className="text-xs text-text-secondary">
            {completedStepsCount} of {totalStepsCount} steps completed
          </p>
        </div>

        {/* Clean step list */}
        <div className="space-y-1.5 pt-2 border-t border-border-subtle text-xs font-mono">
          {currentWorkflow.steps.map((step, idx) => {
            const isDone = step.status === 'completed';
            const isRunning = step.status === 'running';
            return (
              <div key={step.id || idx} className="flex items-center gap-2 text-text-secondary">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : isRunning ? (
                  <Clock className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 text-center text-text-muted shrink-0">○</span>
                )}
                <span className={isDone ? 'text-text-primary font-medium' : isRunning ? 'text-text-primary font-semibold' : 'text-text-muted'}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* High-Risk Approval Modal Gate */}
      <ApprovalModal />

      {/* Main Content: Timeline & Reasoning logs, OR ResultView when completed */}
      {isCompleted ? (
        <ResultView result={currentWorkflow.result!} onReset={resetWorkflow} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExecutionTimeline steps={currentWorkflow.steps} />
          <AIReasoningCard logs={currentWorkflow.reasoningLog} />
        </div>
      )}
    </div>
  );
};
