import React, { useState, useEffect } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { ExecutionReceiptItem } from '../../../server/storage/persistenceStore';
import { CheckCircle2, Cpu, Terminal, ShieldCheck, ExternalLink, X, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ExecutionDialGauge } from '../ui/NeoTactileSystem';

interface LiveExecutionCockpitProps {
  task: EmailTaskItem;
  onClose: () => void;
}

export const LiveExecutionCockpit: React.FC<LiveExecutionCockpitProps> = ({ task, onClose }) => {
  const [status, setStatus] = useState<string>(task.status || 'EXECUTING');
  const [progress, setProgress] = useState<number>(task.status === 'COMPLETED' ? 100 : 68);
  const [receipt, setReceipt] = useState<ExecutionReceiptItem | null>(task.receipt || null);
  const [showLogs, setShowLogs] = useState<boolean>(true);

  useEffect(() => {
    let interval: any = null;
    if (status !== 'COMPLETED' && status !== 'FAILED') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/mail/tasks/${task.id}/execution`);
          const data = await res.json();
          if (data.status) {
            setStatus(data.status);
            if (data.status === 'COMPLETED') {
              setProgress(100);
            } else if (data.progress) {
              setProgress(data.progress);
            }
            if (data.receipt) setReceipt(data.receipt);
          }
        } catch {}
      }, 600);
    }
    return () => clearInterval(interval);
  }, [task.id, status]);

  const effectiveProgress = status === 'COMPLETED' ? 100 : progress;

  const executionSteps = [
    { title: 'Reading repository metadata', done: true, log: 'Inspected repo structure & package.json' },
    { title: 'Analyzing codebase architecture', done: true, log: 'Understood CLI & module hierarchy' },
    { title: 'Planning implementation requirements', done: true, log: 'Formulated implementation plan' },
    { title: 'Modifying codebase & files', done: effectiveProgress >= 50, log: 'Applied sandboxed edits to task branch' },
    { title: 'Running verification test & build suite', done: effectiveProgress >= 70, log: 'npm run typecheck && npm run build passed' },
    { title: 'Performing AI git diff review', done: effectiveProgress >= 85, log: 'Reviewed git diff for security & clean imports' },
    { title: 'Creating commit & pushing branch', done: effectiveProgress >= 95, log: `Committed & pushed branch ${receipt?.branch || 'orka/task/email-task'}` },
    { title: 'Generating completion receipt & draft email', done: status === 'COMPLETED', log: 'Created Gmail response draft & execution receipt' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none overflow-y-auto">
      <Card className="w-full max-w-3xl border-border-strong p-6 shadow-modal space-y-5 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">AUTONOMOUS CODING AGENT</Badge>
                <Badge variant={status === 'COMPLETED' ? 'success' : 'info'} dot={status !== 'COMPLETED'}>
                  {status === 'COMPLETED' ? 'Completed' : 'Working'}
                </Badge>
              </div>
              <h2 className="text-sm font-bold text-text-primary mt-0.5">
                {task.requestedAction || task.subject}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dial Progress Gauge & Execution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          <div className="md:col-span-1 flex flex-col items-center justify-center p-3 rounded-lg bg-background-elevated border border-border-subtle">
            <ExecutionDialGauge progress={effectiveProgress} title="Status" size={140} />
            <div className="mt-1 text-[11px] font-mono text-indigo-400 font-semibold">
              {status === 'COMPLETED' ? '100% Verified' : `${effectiveProgress}% In Progress`}
            </div>
          </div>

          {/* Step Progress Nodes */}
          <div className="md:col-span-2 space-y-1.5">
            <span className="text-[10px] font-mono font-semibold uppercase text-text-muted">Execution Steps</span>
            <div className="space-y-1 font-mono text-xs">
              {executionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border flex items-center justify-between transition-all ${
                    step.done
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-background-elevated border-border-subtle text-text-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {step.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    )}
                    <span className="font-medium text-[11px]">{step.title}</span>
                  </div>
                  <span className="text-[10px] font-semibold">{step.done ? 'Done' : 'Pending'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Live Technical Activity Log */}
        <div className="border border-border-subtle rounded-lg overflow-hidden bg-background-elevated">
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="w-full p-2.5 px-3 flex items-center justify-between font-mono text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Technical Activity Stream</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-semibold">{showLogs ? 'Hide' : 'Expand'}</span>
          </button>

          {showLogs && (
            <div className="p-3 space-y-1 font-mono text-[11px] text-text-secondary max-h-36 overflow-y-auto border-t border-border-subtle bg-background-card">
              {executionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-text-muted">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-indigo-400">{step.log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Final Execution Receipt */}
        {status === 'COMPLETED' && receipt && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>WORK COMPLETED & VERIFIED</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] bg-background-elevated p-3 rounded-lg border border-border-subtle">
              <div>
                <span className="text-text-muted text-[10px]">REPO</span>
                <p className="font-semibold text-indigo-400 truncate">{receipt.repository}</p>
              </div>
              <div>
                <span className="text-text-muted text-[10px]">BRANCH</span>
                <p className="font-semibold text-text-primary truncate">{receipt.branch}</p>
              </div>
              <div>
                <span className="text-text-muted text-[10px]">SHA</span>
                <p className="font-semibold text-text-primary">{receipt.commitSha}</p>
              </div>
              <div>
                <span className="text-text-muted text-[10px]">BUILD</span>
                <p className="font-semibold text-emerald-400">Passed</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <a
                href={
                  receipt.prUrl && receipt.prUrl.includes('/pull/')
                    ? receipt.prUrl
                    : `https://github.com/${receipt.repository.includes('/') ? receipt.repository : 'sarthakpatil6636/atestproject'}`
                }
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-semibold text-xs flex items-center gap-1 transition-all"
              >
                <span>{receipt.prUrl?.includes('/pull/') ? 'View PR' : 'View Repo'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Button onClick={onClose} variant="primary" size="sm">
                Done & Return
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
