import React from 'react';
import { ExecutionReceipt } from '../../types/agent';
import { ShieldCheck, CheckCircle2, Clock, FileText, Download, X, Sparkles } from 'lucide-react';

interface ExecutionReceiptModalProps {
  receipt: ExecutionReceipt;
  onClose: () => void;
}

export const ExecutionReceiptModal: React.FC<ExecutionReceiptModalProps> = ({ receipt, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg bg-[#0d0f17] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden font-sans">
        {/* Receipt header banner */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  OFFICIAL AUDIT TRAIL
                </span>
              </div>
              <h3 className="text-lg font-black text-white tracking-tight">ORKA EXECUTION RECEIPT</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Monospaced Formal Receipt Payload */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-4 font-mono text-xs text-slate-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px]">
            <span className="text-slate-500">ID: {receipt.receiptId}</span>
            <span className="text-emerald-400 font-bold">VERIFIED BY POLICY ENGINE</span>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-slate-500 uppercase text-[10px]">GOAL:</span>
              <p className="text-white font-bold text-sm font-sans mt-0.5">{receipt.goal}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
              <div>
                <span className="text-slate-500">Total Actions:</span>
                <p className="text-slate-100 font-bold">{receipt.actionsTotal} Executed</p>
              </div>
              <div>
                <span className="text-slate-500">Verified by Tool API:</span>
                <p className="text-emerald-400 font-bold">✓ {receipt.actionsVerified} Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500">Approvals Granted:</span>
                <p className="text-indigo-300 font-bold">1 / 1 Granted</p>
              </div>
              <div>
                <span className="text-slate-500">Execution Time:</span>
                <p className="text-slate-100 font-bold">{receipt.executionTimeSeconds}s</p>
              </div>
            </div>
          </div>

          {/* Audit breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-white/10 text-[11px]">
            <span className="text-slate-500 uppercase text-[10px]">AUDITED ITEMS:</span>
            <div className="space-y-1 text-slate-300">
              <div className="flex items-center justify-between">
                <span>• Calendar Meeting:</span>
                <span className="text-slate-100 truncate max-w-[200px]">{receipt.itemsAudited.calendarMeeting}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Gmail Threads Scanned:</span>
                <span className="text-slate-100">{receipt.itemsAudited.emailsScanned} messages</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Drive Docs Analyzed:</span>
                <span className="text-slate-100">{receipt.itemsAudited.docsAnalyzed} documents</span>
              </div>
              <div className="flex items-center justify-between">
                <span>• Open Commitments Isolated:</span>
                <span className="text-amber-300 font-bold">{receipt.itemsAudited.openCommitments} items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <span className="text-[11px] text-slate-500 italic">
            Accountable • Auditable • Verified
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
