import React, { useState } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { Mail, CheckCircle2, ShieldAlert, Cpu, ArrowRight, X, Clock, Code, User } from 'lucide-react';
import { GlassPanel, TactileButton, StatusPill } from '../ui/NeoTactileSystem';
import { useWorkflow } from '../../context/WorkflowContext';

interface TaskDetailModalProps {
  task: EmailTaskItem;
  onClose: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose }) => {
  const { startWorkflow } = useWorkflow();
  const [isExecuting, setIsExecuting] = useState(false);

  const handleApproveAndExecute = async () => {
    setIsExecuting(true);
    try {
      await fetch(`/api/tasks/${task.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'COPILOT' })
      });
      await startWorkflow(task.requestedAction || task.subject);
      onClose();
    } catch (err) {
      console.error('Task approval failed:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn select-none">
      <GlassPanel glowEdge={true} className="w-full max-w-2xl border border-blue-500/40 p-8 shadow-2xl space-y-6 relative overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.35)]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  EMAIL-TO-ACTION TASK
                </span>
                <StatusPill status={task.status === 'COMPLETED' ? 'completed' : task.status === 'EXECUTING' ? 'running' : 'waiting_approval'} text={task.status} />
              </div>
              <h3 className="text-xl font-extrabold text-white mt-1 leading-snug">
                {task.requestedAction || task.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details Grid */}
        <div className="space-y-4 text-xs font-sans">
          {/* Email Sender & Context */}
          <div className="p-4 rounded-2xl bg-[#0B0F15]/95 border border-white/10 space-y-2 shadow-inner">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">Sender:</span>
                <span className="text-cyan-300 font-bold">{task.sender}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.receivedAt}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <span className="text-slate-400 font-semibold font-mono text-[10px]">ORIGINAL EMAIL SNIPPET:</span>
              <p className="text-slate-200 mt-1 leading-relaxed italic bg-black/40 p-3 rounded-xl border border-white/5">
                "{task.bodySnippet || task.subject}"
              </p>
            </div>
          </div>

          {/* AI Understanding Breakdown */}
          <div className="p-4 rounded-2xl bg-blue-500/[0.08] border border-blue-500/25 space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="font-mono font-bold text-blue-300 text-[11px] uppercase">ORKA AI UNDERSTANDING</span>
            </div>
            <p className="text-slate-100 font-semibold leading-relaxed">{task.summary}</p>
            {task.technicalTask && (
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30 font-bold">
                <Code className="w-3 h-3" />
                <span>TECHNICAL CODING TASK • REPO HINT: {task.repositoryHint || 'orkaAI'}</span>
              </div>
            )}
          </div>

          {/* Proposed Execution Plan */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
            <span className="font-mono font-bold text-slate-400 text-[10px] uppercase">PROPOSED EXECUTION PLAN</span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {task.proposedPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-bold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <TactileButton
            onClick={handleApproveAndExecute}
            disabled={isExecuting || task.status === 'EXECUTING' || task.status === 'COMPLETED'}
            variant="primary"
            size="md"
          >
            {isExecuting ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-white" />
                <span>Initializing Agent...</span>
              </>
            ) : (
              <>
                <span>Approve & Execute Plan</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </TactileButton>
        </div>
      </GlassPanel>
    </div>
  );
};
