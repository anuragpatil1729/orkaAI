import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Send, Eye, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ApprovalModal: React.FC = () => {
  const { currentWorkflow, approveCurrentStep } = useWorkflow();
  const [showFullReview, setShowFullReview] = useState(false);

  if (!currentWorkflow || !currentWorkflow.approvalRequest) return null;

  const req = currentWorkflow.approvalRequest;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-[#12141d] border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top warning ambient banner */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⚠ HIGH-RISK ACTION APPROVAL REQUIRED
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Send Email to {req.targetRecipient || 'Acme VP'}?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              ActionOS has paused autonomous execution to prevent unintended external actions.
            </p>
          </div>
        </div>

        {/* Explanation Card: WHAT, WHO, WHY */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">WHAT</span>
              <p className="text-slate-200 font-semibold mt-0.5">{req.actionName}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">WHO</span>
              <p className="text-indigo-300 font-semibold mt-0.5">{req.targetRecipient}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">WHY</span>
              <p className="text-amber-300 font-semibold mt-0.5">{req.riskReason}</p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold">Subject Line:</span>
            <p className="text-slate-100 font-bold mt-0.5 text-sm">{req.subject}</p>
          </div>

          <div className="pt-2">
            <span className="text-slate-400 font-semibold">Message Preview:</span>
            <div className="mt-1.5 p-3 rounded-xl bg-black/40 border border-white/5 font-sans text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {req.contentPreview}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => setShowFullReview(!showFullReview)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4" />
            <span>{showFullReview ? 'Hide Details' : 'Review Draft'}</span>
          </button>

          <button
            onClick={approveCurrentStep}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Approve & Send Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
