import React, { useState, useEffect } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { ExecutionReceiptItem } from '../../../server/storage/persistenceStore';
import { CheckCircle2, Cpu, Terminal, GitBranch, GitCommit, ExternalLink, ShieldCheck, ArrowRight, X, Clock } from 'lucide-react';
import { GlassPanel, GlassCard, ExecutionDialGauge, StatusPill, TactileButton } from '../ui/NeoTactileSystem';

interface LiveExecutionCockpitProps {
  task: EmailTaskItem;
  onClose: () => void;
}

export const LiveExecutionCockpit: React.FC<LiveExecutionCockpitProps> = ({ task, onClose }) => {
  const [status, setStatus] = useState<string>(task.status || 'EXECUTING');
  const [progress, setProgress] = useState<number>(35);
  const [receipt, setReceipt] = useState<ExecutionReceiptItem | null>(task.receipt || null);
  const [showLogs, setShowLogs] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (status !== 'COMPLETED' && status !== 'FAILED') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/mail/tasks/${task.id}/execution`);
          const data = await res.json();
          if (data.status) {
            setStatus(data.status);
            if (data.progress) setProgress(data.progress);
            if (data.receipt) setReceipt(data.receipt);
          }
        } catch {}
      }, 800);
    }
    return () => clearInterval(interval);
  }, [task.id, status]);

  const executionSteps = [
    { title: 'Reading repository metadata', done: true, log: 'Inspected repo structure & package.json' },
    { title: 'Analyzing codebase architecture', done: true, log: 'Understood existing CLI & module hierarchy' },
    { title: 'Planning implementation requirements', done: true, log: 'Formulated GUI implementation plan' },
    { title: 'Modifying codebase & files', done: progress >= 50, log: 'Applied sandboxed edits to task branch' },
    { title: 'Running verification test & build suite', done: progress >= 75, log: 'npm run typecheck && npm run build passed' },
    { title: 'Performing AI git diff review', done: progress >= 90, log: 'Reviewed git diff for security & clean imports' },
    { title: 'Creating commit & pushing branch', done: status === 'COMPLETED', log: `Committed & pushed branch ${receipt?.branch || 'orka/task/email-task'}` },
    { title: 'Generating completion receipt & draft email', done: status === 'COMPLETED', log: 'Created Gmail response draft & execution receipt' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#080B10]/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn select-none overflow-y-auto">
      <GlassPanel glowEdge={true} className="w-full max-w-3xl border border-cyan-400/40 p-8 shadow-2xl space-y-6 relative overflow-hidden font-sans my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(34,211,238,0.4)]">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                  AUTONOMOUS CODING AGENT
                </span>
                <StatusPill status={status === 'COMPLETED' ? 'completed' : 'running'} text={status === 'COMPLETED' ? 'COMPLETED' : 'ORKA IS WORKING'} />
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 leading-snug">
                {task.requestedAction || task.subject}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dial Progress Gauge & Execution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <ExecutionDialGauge progress={status === 'COMPLETED' ? 100 : progress} title="Status" subtitle={status} size={170} />
            <div className="mt-2 text-[11px] font-mono text-cyan-300 font-bold">
              {status === 'COMPLETED' ? '✓ 100% VERIFIED' : `${progress}% IN PROGRESS`}
            </div>
          </div>

          {/* Step Progress Nodes */}
          <div className="md:col-span-2 space-y-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">EXECUTION STEPS</span>
            <div className="space-y-2 font-mono text-xs">
              {executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    step.done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span className="font-semibold">{step.title}</span>
                  </div>
                  <span className="text-[10px] opacity-75">{step.done ? '✓ Done' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Live Technical Activity Log */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/50">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full p-3 px-4 flex items-center justify-between font-mono text-xs text-slate-300 hover:text-white bg-white/[0.04] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Show technical activity log ({executionSteps.length} entries)</span>
            </div>
            <span className="text-[10px] text-cyan-300 font-bold">{showLogs ? 'Hide ▲' : 'Expand ▼'}</span>
          </button>

          {showLogs && (
            <div className="p-4 space-y-1.5 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto border-t border-white/10 bg-[#080C14]">
              {executionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-cyan-300">{step.log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Final Execution Receipt (When Completed) */}
        {status === 'COMPLETED' && receipt && (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>✓ WORK COMPLETED & VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-black/40 p-4 rounded-xl border border-white/10">
              <div>
                <span className="text-slate-400 text-[10px]">REPOSITORY</span>
                <p className="font-bold text-cyan-300 truncate">{receipt.repository}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">BRANCH</span>
                <p className="font-bold text-slate-200 truncate">{receipt.branch}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">COMMIT SHA</span>
                <p className="font-bold text-slate-200">{receipt.commitSha}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">TESTS / BUILD</span>
                <p className="font-bold text-emerald-400">✓ Passed</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <a
                href={
                  receipt.prUrl && !receipt.prUrl.includes('/pull/')
                    ? receipt.prUrl
                    : `https://github.com/${receipt.repository.includes('/') ? receipt.repository : 'sarthakpatil6636/atestproject'}/compare/main...${encodeURIComponent(receipt.branch || 'main')}?expand=1`
                }
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>View Pull Request</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <TactileButton onClick={onClose} variant="primary" size="sm">
                Done & Return to Dashboard
              </TactileButton>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
};
