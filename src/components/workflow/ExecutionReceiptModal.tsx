import React from 'react';
import { ExecutionReceipt } from '../../types/agent';
import { ShieldCheck, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ExecutionReceiptModalProps {
  receipt: ExecutionReceipt;
  onClose: () => void;
}

export const ExecutionReceiptModal: React.FC<ExecutionReceiptModalProps> = ({ receipt, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none">
      <Card className="w-full max-w-lg border-border-strong p-6 shadow-modal space-y-4 relative font-sans">
        {/* Receipt header banner */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <Badge variant="success" className="mb-0.5">OFFICIAL AUDIT REPORT</Badge>
              <h3 className="text-base font-bold text-text-primary">Orka Execution Receipt</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Monospaced Diagnostic Audit Report */}
        <div className="p-4 rounded-lg bg-background-elevated border border-border-subtle space-y-3 font-mono text-xs text-text-secondary">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 text-[11px]">
            <span className="text-text-muted">ID: {receipt.receiptId}</span>
            <span className="text-emerald-400 font-semibold">VERIFIED BY POLICY ENGINE</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-text-muted uppercase text-[10px]">GOAL:</span>
              <p className="text-text-primary font-bold text-xs font-sans mt-0.5">{receipt.goal}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle text-[11px]">
              <div>
                <span className="text-text-muted">Actions Total:</span>
                <p className="text-text-primary font-semibold">{receipt.actionsTotal} Executed</p>
              </div>
              <div>
                <span className="text-text-muted">Verified by API:</span>
                <p className="text-emerald-400 font-semibold">✓ {receipt.actionsVerified} Verified</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-text-muted">Approvals Granted:</span>
                <p className="text-indigo-400 font-semibold">{receipt.approvalsGranted} / {receipt.approvalsRequired}</p>
              </div>
              <div>
                <span className="text-text-muted">Execution Time:</span>
                <p className="text-text-primary font-semibold">{receipt.executionTimeSeconds}s</p>
              </div>
            </div>
          </div>

          {/* Component Audit Status Breakdown */}
          <div className="space-y-1.5 pt-2 border-t border-border-subtle text-[11px]">
            <span className="text-text-muted uppercase text-[10px]">COMPONENT VERIFICATION:</span>
            <div className="space-y-1 text-text-secondary">
              <div className="flex items-center justify-between p-2 rounded-lg bg-background-card border border-border-subtle">
                <span className="font-semibold">CALENDAR</span>
                <span className="text-emerald-400 font-semibold">✓ Verified ({receipt.itemsAudited.calendarMeeting})</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background-card border border-border-subtle">
                <span className="font-semibold">GMAIL</span>
                <span className="text-emerald-400 font-semibold">✓ Verified ({receipt.itemsAudited.emailsScanned} scanned)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background-card border border-border-subtle">
                <span className="font-semibold">DRIVE</span>
                <span className="text-emerald-400 font-semibold">✓ Verified ({receipt.itemsAudited.docsAnalyzed} analyzed)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-background-card border border-border-subtle">
                <span className="font-semibold">EMAIL DRAFT</span>
                <span className="text-indigo-400 font-semibold">✓ Approved & Prepared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-text-muted font-mono italic">
            Accountable • Auditable • Verified
          </span>

          <Button onClick={onClose} variant="primary" size="sm">
            Close Receipt
          </Button>
        </div>
      </Card>
    </div>
  );
};
