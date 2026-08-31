import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Send, Eye, X, Edit3, CheckCircle2, Clock } from 'lucide-react';

export const ApprovalModal: React.FC = () => {
  const { currentWorkflow, approveCurrentStep, resetWorkflow } = useWorkflow();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTo, setEditedTo] = useState('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!currentWorkflow || !currentWorkflow.approvalRequest) return null;

  const req = currentWorkflow.approvalRequest;

  const handleApprove = async () => {
    setSendingState('sending');
    await new Promise(r => setTimeout(r, 600)); // Smooth animation tick
    setSendingState('sent');
    await new Promise(r => setTimeout(r, 400));
    
    await approveCurrentStep({
      to: editedTo || req.targetRecipient,
      subject: editedSubject || req.subject,
      body: editedBody || req.contentPreview
    });
    setSendingState('idle');
  };

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
                ⚠ APPROVAL REQUIRED
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Send Email to {editedTo || req.targetRecipient || 'Acme VP'}?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              OrkaAI has paused autonomous execution for human verification.
            </p>
          </div>
        </div>

        {/* Structured Card: ACTION, TARGET, WHY, CONTENT */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-xs">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-white/5">
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">ACTION</span>
              <p className="text-slate-200 font-semibold mt-0.5">{req.actionName}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">TARGET</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editedTo || req.targetRecipient || ''}
                  onChange={(e) => setEditedTo(e.target.value)}
                  className="bg-black/60 border border-indigo-500/40 text-indigo-300 font-mono font-semibold px-2 py-1 rounded text-xs w-full outline-none mt-0.5"
                />
              ) : (
                <p className="text-indigo-300 font-semibold mt-0.5">{editedTo || req.targetRecipient}</p>
              )}
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold text-[10px]">WHY</span>
              <p className="text-amber-300 font-semibold mt-0.5">{req.riskReason}</p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold">Subject Line:</span>
            {isEditing ? (
              <input
                type="text"
                value={editedSubject || req.subject || ''}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="bg-black/60 border border-indigo-500/40 text-slate-100 font-bold px-2 py-1.5 rounded text-xs w-full outline-none mt-1"
              />
            ) : (
              <p className="text-slate-100 font-bold mt-0.5 text-sm">{editedSubject || req.subject}</p>
            )}
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 font-semibold">Message Content Preview:</span>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!editedBody) setEditedBody(req.contentPreview);
                  if (!editedTo) setEditedTo(req.targetRecipient || '');
                  if (!editedSubject) setEditedSubject(req.subject || '');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Save Edits' : 'Edit Email'}</span>
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={editedBody || req.contentPreview}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={6}
                className="w-full p-3 rounded-xl bg-black/60 border border-indigo-500/40 text-slate-200 text-xs outline-none font-sans leading-relaxed resize-none"
              />
            ) : (
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-sans text-slate-300 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                {editedBody || req.contentPreview}
              </div>
            )}
          </div>
        </div>

        {/* Actions: [Reject], [Approve & Send] */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={resetWorkflow}
            disabled={sendingState !== 'idle'}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
          >
            <X className="w-4 h-4" />
            <span>Reject Action</span>
          </button>

          <button
            onClick={handleApprove}
            disabled={sendingState !== 'idle'}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-75"
          >
            {sendingState === 'idle' ? (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Send Email</span>
              </>
            ) : sendingState === 'sending' ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-white" />
                <span>Sending Email...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Email Sent!</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
