import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Send, X, Edit3, CheckCircle2, Clock, Lock } from 'lucide-react';
import { GlassPanel, GlassInput, GlassTextarea, TactileButton } from '../ui/NeoTactileSystem';

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
    await new Promise(r => setTimeout(r, 600));
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
    <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
      <GlassPanel glowEdge={true} className="w-full max-w-xl border border-amber-500/40 p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top security amber light beam */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-blue-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(251,191,36,0.35)]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ⚠ ACTION REQUIRES APPROVAL
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Send Email to {editedTo || req.targetRecipient || 'recipient'}?
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              OrkaAI has paused autonomous execution for human verification.
            </p>
          </div>
        </div>

        {/* Floating Glass Cockpit Editor */}
        <div className="space-y-4 p-5 rounded-2xl bg-[#0B0F15]/95 border border-white/10 text-xs shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-white/10">
            <div>
              <span className="text-slate-400 uppercase font-mono font-bold text-[10px]">ACTION</span>
              <p className="text-slate-100 font-semibold mt-0.5">{req.actionName}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-mono font-bold text-[10px]">TARGET RECIPIENT</span>
              {isEditing ? (
                <GlassInput
                  type="text"
                  value={editedTo || req.targetRecipient || ''}
                  onChange={(e) => setEditedTo(e.target.value)}
                  className="font-mono text-cyan-300 font-semibold mt-1"
                />
              ) : (
                <p className="text-cyan-300 font-mono font-semibold mt-0.5">{editedTo || req.targetRecipient}</p>
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold">Subject Line:</span>
            {isEditing ? (
              <GlassInput
                type="text"
                value={editedSubject || req.subject || ''}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="font-bold text-slate-100 mt-1"
              />
            ) : (
              <p className="text-slate-100 font-bold mt-0.5 text-sm">{editedSubject || req.subject}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 font-semibold">Message Content Preview:</span>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!editedBody) setEditedBody(req.contentPreview);
                  if (!editedTo) setEditedTo(req.targetRecipient || '');
                  if (!editedSubject) setEditedSubject(req.subject || '');
                }}
                className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Done Editing' : 'Edit Email'}</span>
              </button>
            </div>

            {isEditing ? (
              <GlassTextarea
                value={editedBody || req.contentPreview}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={5}
              />
            ) : (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-sans text-slate-200 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                {editedBody || req.contentPreview}
              </div>
            )}
          </div>

          {/* WHY ORKA IS ASKING */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold uppercase text-[10px] text-amber-400">WHY ORKA IS ASKING</span>
              <p className="mt-0.5 leading-relaxed">This action transmits external email communication on your behalf. Explicit human sign-off is required.</p>
            </div>
          </div>
        </div>

        {/* Actions: [Reject], [Approve & Send] */}
        <div className="flex items-center justify-between pt-2">
          <TactileButton
            onClick={resetWorkflow}
            disabled={sendingState !== 'idle'}
            variant="danger"
            size="md"
          >
            <X className="w-4 h-4" />
            <span>Reject Action</span>
          </TactileButton>

          <TactileButton
            onClick={handleApprove}
            disabled={sendingState !== 'idle'}
            variant="primary"
            size="md"
            className="shadow-[0_0_25px_rgba(34,211,238,0.5)]"
          >
            {sendingState === 'idle' ? (
              <>
                <Send className="w-4 h-4 text-white" />
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
          </TactileButton>
        </div>
      </GlassPanel>
    </div>
  );
};
