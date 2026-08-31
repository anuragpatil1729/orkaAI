import React from 'react';
import { ExecutionReceipt } from '../../types/agent';
import { ShieldCheck, X } from 'lucide-react';
import { TactileButton } from '../ui/TactilePrimitives';

interface ExecutionReceiptModalProps {
  receipt: ExecutionReceipt;
  onClose: () => void;
}

export const ExecutionReceiptModal: React.FC<ExecutionReceiptModalProps> = ({ receipt, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg neo-glass-panel border border-emerald-500/40 rounded-[32px] p-7 shadow-2xl space-y-6 relative overflow-hidden font-sans">
        {/* Receipt header banner */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                OFFICIAL AUDIT REPORT
              </span>
              <h3 className="text-xl font-extrabold text-white tracking-tight">ORKA EXECUTION RECEIPT</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Monospaced System Audit Report */}
        <div className="p-5 rounded-2xl bg-[#0B0F15]/90 border border-white/10 space-y-4 font-mono text-xs text-slate-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-[11px]">
            <span className="text-slate-500 font-mono">ID: {receipt.receiptId}</span>
            <span className="text-emerald-400 font-bold font-mono">VERIFIED BY POLICY ENGINE</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-500 uppercase text-[10px] font-mono">GOAL:</span>
              <p className="text-white font-bold text-sm font-sans mt-0.5">{receipt.goal}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-[11px]">
              <div>
                <span className="text-slate-500">Actions Total:</span>
                <p className="text-slate-100 font-bold">{receipt.actionsTotal} Executed</p>
              </div>
              <div>
                <span className="text-slate-500">Verified by Tool API:</span>
                <p className="text-emerald-400 font-bold">✓ {receipt.actionsVerified} Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-500">Approvals Granted:</span>
                <p className="text-cyan-300 font-bold">{receipt.approvalsGranted} / {receipt.approvalsRequired} Granted</p>
              </div>
              <div>
                <span className="text-slate-500">Execution Time:</span>
                <p className="text-slate-100 font-bold">{receipt.executionTimeSeconds}s</p>
              </div>
            </div>
          </div>

          {/* Component Audit Status Breakdown */}
          <div className="space-y-2 pt-3 border-t border-white/10 text-[11px]">
            <span className="text-slate-500 uppercase text-[10px]">COMPONENT VERIFICATION:</span>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-bold">CALENDAR</span>
                <span className="text-emerald-400 font-bold">✓ Verified ({receipt.itemsAudited.calendarMeeting})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-bold">GMAIL</span>
                <span className="text-emerald-400 font-bold">✓ Verified ({receipt.itemsAudited.emailsScanned} scanned)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-bold">DRIVE</span>
                <span className="text-emerald-400 font-bold">✓ Verified ({receipt.itemsAudited.docsAnalyzed} analyzed)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
                <span className="font-bold">EMAIL DRAFT</span>
                <span className="text-cyan-300 font-bold">✓ Approved & Prepared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-slate-400 font-mono italic">
            Accountable • Auditable • Verified
          </span>

          <TactileButton onClick={onClose} variant="primary" className="px-5 py-2 text-xs">
            Close Receipt
          </TactileButton>
        </div>
      </div>
    </div>
  );
};
