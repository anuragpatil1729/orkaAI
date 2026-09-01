import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ShieldAlert, Send, X, Edit3, CheckCircle2, Clock, Lock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GlassInput, GlassTextarea } from '../ui/NeoTactileSystem';

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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <Card className="w-full max-w-xl border-amber-500/40 p-6 shadow-modal space-y-5 relative">
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <Badge variant="warning" className="mb-1">Human Approval Required</Badge>
            <h3 className="text-base font-bold text-text-primary">
              Send email to {editedTo || req.targetRecipient || 'recipient'}?
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              OrkaAI has paused execution for human verification.
            </p>
          </div>
        </div>

        {/* Editor Box */}
        <div className="space-y-3 p-4 rounded-lg bg-background-elevated border border-border-subtle text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-border-subtle">
            <div>
              <span className="text-text-muted uppercase font-mono font-semibold text-[10px]">Action</span>
              <p className="text-text-primary font-medium mt-0.5">{req.actionName}</p>
            </div>
            <div>
              <span className="text-text-muted uppercase font-mono font-semibold text-[10px]">Recipient</span>
              {isEditing ? (
                <GlassInput
                  type="text"
                  value={editedTo || req.targetRecipient || ''}
                  onChange={(e) => setEditedTo(e.target.value)}
                  className="font-mono text-indigo-400 font-medium mt-1"
                />
              ) : (
                <p className="text-indigo-400 font-mono font-medium mt-0.5">{editedTo || req.targetRecipient}</p>
              )}
            </div>
          </div>

          <div>
            <span className="text-text-muted font-semibold text-[11px]">Subject Line:</span>
            {isEditing ? (
              <GlassInput
                type="text"
                value={editedSubject || req.subject || ''}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="font-semibold text-text-primary mt-1"
              />
            ) : (
              <p className="text-text-primary font-semibold mt-0.5">{editedSubject || req.subject}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-text-muted font-semibold text-[11px]">Message Content Preview:</span>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (!editedBody) setEditedBody(req.contentPreview);
                  if (!editedTo) setEditedTo(req.targetRecipient || '');
                  if (!editedSubject) setEditedSubject(req.subject || '');
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
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
              <div className="p-3 rounded-lg bg-background-card border border-border-subtle font-sans text-text-secondary whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto text-xs">
                {editedBody || req.contentPreview}
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-mono font-bold uppercase text-[10px]">WHY ORKA IS ASKING</span>
              <p className="mt-0.5 leading-relaxed text-amber-200/90">This action transmits external email communication on your behalf. Explicit sign-off is enforced by policy.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-1">
          <Button
            onClick={resetWorkflow}
            disabled={sendingState !== 'idle'}
            variant="danger"
            size="md"
          >
            <X className="w-4 h-4" />
            <span>Reject Action</span>
          </Button>

          <Button
            onClick={handleApprove}
            disabled={sendingState !== 'idle'}
            variant="primary"
            size="md"
          >
            {sendingState === 'idle' ? (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Send Email</span>
              </>
            ) : sendingState === 'sending' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Sending Email...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Sent!</span>
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};
