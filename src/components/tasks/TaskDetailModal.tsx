import React, { useState } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { Mail, Cpu, ArrowRight, X, Clock, Code, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useWorkflow } from '../../context/WorkflowContext';

interface TaskDetailModalProps {
  task: EmailTaskItem;
  onClose: () => void;
  onExecuteTriggered?: (task: EmailTaskItem) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onExecuteTriggered }) => {
  const { startWorkflow } = useWorkflow();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleApproveAndExecute = async () => {
    setIsExecuting(true);
    try {
      await fetch(`/api/mail/tasks/${task.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      fetch(`/api/mail/tasks/${task.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).catch(err => console.error('Execute error:', err));

      const updatedTask: EmailTaskItem = { ...task, status: 'EXECUTING' };
      if (onExecuteTriggered) {
        onExecuteTriggered(updatedTask);
      } else {
        await startWorkflow(task.requestedAction || task.subject);
      }
      onClose();
    } catch (err) {
      console.error('Task approval failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none overflow-y-auto">
      <Card className="w-full max-w-xl p-6 border-border-strong shadow-modal space-y-4 relative my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">EMAIL-TO-ACTION TASK</Badge>
                <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'EXECUTING' ? 'info' : 'warning'}>
                  {task.status}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-text-primary mt-0.5">
                {task.requestedAction || task.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="space-y-3 text-xs">
          {/* Email Sender */}
          <div className="p-3 rounded-lg bg-background-elevated border border-border-subtle space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-text-muted">
              <div className="flex items-center gap-1.5 truncate">
                <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Sender:</span>
                <span className="text-indigo-400 font-semibold truncate">{task.sender}</span>
              </div>
              <span>{task.receivedAt}</span>
            </div>

            <div className="pt-1.5 border-t border-border-subtle">
              <span className="text-text-muted font-semibold text-[10px]">EMAIL SNIPPET:</span>
              <p className="text-text-secondary mt-0.5 italic font-sans">
                "{task.bodySnippet || task.subject}"
              </p>
            </div>
          </div>

          {/* AI Understanding */}
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold font-mono text-[10px] uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>ORKA AI UNDERSTANDING</span>
            </div>
            <p className="text-text-primary font-semibold leading-relaxed">{task.summary}</p>
            {task.technicalTask && (
              <div className="inline-flex items-center gap-1 text-[10px] font-mono text-indigo-400 pt-0.5">
                <Code className="w-3 h-3" />
                <span>Technical Task • Repo: {task.repositoryHint || 'orkaAI'}</span>
              </div>
            )}
          </div>

          {/* Proposed Execution Plan */}
          <div className="p-3 rounded-lg bg-background-elevated border border-border-subtle space-y-1.5">
            <span className="font-mono font-semibold text-text-muted text-[10px] uppercase">PROPOSED EXECUTION PLAN</span>
            <div className="space-y-1 font-mono text-[11px]">
              {task.proposedPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-text-secondary">
                  <span className="text-emerald-400 font-semibold">✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="text-xs text-text-muted hover:text-text-primary font-medium"
          >
            Cancel
          </button>

          <Button
            onClick={handleApproveAndExecute}
            disabled={isExecuting || task.status === 'EXECUTING' || task.status === 'COMPLETED'}
            isLoading={isExecuting}
            variant="primary"
            size="md"
          >
            <span>Approve & Execute Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
