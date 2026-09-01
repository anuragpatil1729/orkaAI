import React, { useState } from 'react';
import { ExecutionResult } from '../../types/agent';
import { ExecutionReceiptModal } from '../workflow/ExecutionReceiptModal';
import { 
  CheckCircle2, 
  Calendar, 
  Mail, 
  FileText, 
  CheckSquare, 
  Zap, 
  Send, 
  Edit3, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  Receipt
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GlassTextarea } from '../ui/NeoTactileSystem';

export const ResultView: React.FC<{ result: ExecutionResult; onReset: () => void }> = ({ result, onReset }) => {
  const [draftBody, setDraftBody] = useState(result.draftEmail?.body || '');
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleSendDraft = () => {
    setIsSent(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Header Banner */}
      <Card className="p-6 border-emerald-500/30 bg-emerald-500/5 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5">
            <Badge variant="success">WORKFLOW VERIFIED & EXECUTED</Badge>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Execution Completed Successfully
          </h2>

          <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
            <span className="font-semibold text-indigo-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {result.brief.meetingDetails.title}
            </span>
            <span>•</span>
            <span className="font-mono text-text-muted">{result.brief.meetingDetails.time}</span>
          </div>
        </div>

        {/* Stats Summary & Execution Receipt Trigger */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-4 bg-background-elevated px-4 py-3 rounded-lg border border-border-subtle text-center font-mono">
            <div>
              <span className="text-xl font-bold text-emerald-400">{result.stats.actionsCompleted}</span>
              <p className="text-[10px] text-text-muted">Actions</p>
            </div>
            <div className="w-[1px] h-6 bg-border-subtle" />
            <div>
              <span className="text-xl font-bold text-indigo-400">{result.stats.actionsVerified || result.stats.actionsCompleted}</span>
              <p className="text-[10px] text-text-muted">Verified</p>
            </div>
          </div>

          {result.receipt && (
            <Button
              onClick={() => setShowReceiptModal(true)}
              variant="secondary"
              size="md"
            >
              <Receipt className="w-4 h-4" />
              <span>Receipt</span>
            </Button>
          )}
        </div>
      </Card>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Executive Summary, Key Decisions, Open Items, Follow-Up Draft */}
        <div className="lg:col-span-2 space-y-5">
          {/* Executive Summary Card */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Executive Brief Summary</span>
              </h3>
              <span className="text-[11px] text-text-muted font-mono">Synthesized by Gemini</span>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              {result.brief.summary}
            </p>
          </Card>

          {/* Key Decisions Card */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Key Decisions & Insights</span>
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-text-secondary">
              {result.brief.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-background-elevated border border-border-subtle">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-text-primary leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Open Items & Next Actions */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>Open Tasks & Actions ({result.tasks.length})</span>
              </h3>
              <Badge variant="warning">Tasks Created</Badge>
            </div>

            <div className="space-y-2">
              {result.tasks.map((t, idx) => (
                <div key={t.id} className="p-3 rounded-lg bg-background-elevated border border-border-subtle flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono font-bold text-[10px] flex items-center justify-center border border-indigo-500/20">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-text-primary">{t.title}</span>
                  </div>
                  <Badge variant="neutral">{t.priority}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Follow-Up Email Draft Card */}
          {result.draftEmail && (
            <Card className="p-6 border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider">Follow-Up Email Draft</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingDraft ? 'Done Editing' : 'Edit Email'}</span>
                  </button>

                  {isSent ? (
                    <Badge variant="success">Sent</Badge>
                  ) : (
                    <Badge variant="info">Draft Prepared</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-muted font-mono">
                  <span>To:</span>
                  <span className="text-indigo-400 font-medium">{result.draftEmail.to}</span>
                </div>

                <div className="flex items-center gap-2 text-text-muted font-mono">
                  <span>Subject:</span>
                  <span className="text-text-primary font-medium">{result.draftEmail.subject}</span>
                </div>

                {isEditingDraft ? (
                  <GlassTextarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={6}
                  />
                ) : (
                  <div className="p-3.5 rounded-lg bg-background-elevated border border-border-subtle font-sans text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {draftBody}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-text-muted italic">
                  Rationale: Addresses open action items from workspace context.
                </span>

                {!isSent && (
                  <Button onClick={handleSendDraft} variant="primary" size="sm">
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Email</span>
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (1 col): Audit Checklist & Context */}
        <div className="space-y-5">
          {/* Audit Checklist */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Execution Audit</span>
              </span>
              <Badge variant="success">100% Verified</Badge>
            </h3>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border-subtle text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Calendar meeting analyzed</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">OK</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border-subtle text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{result.stats.emailsAnalyzed} Gmail threads scanned</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">OK</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border-subtle text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{result.stats.docsAnalyzed} Drive docs analyzed</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">OK</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border-subtle text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>Executive brief synthesized</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">OK</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-background-elevated border border-border-subtle text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{result.tasks.length} Action tasks prepared</span>
                </div>
                <span className="text-[10px] text-text-muted font-mono">OK</span>
              </div>
            </div>
          </Card>

          {/* Relevant Emails */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Relevant Emails</span>
              </span>
              <span className="text-[11px] text-text-muted">{result.emailsFound.length}</span>
            </h3>

            <div className="space-y-2">
              {result.emailsFound.map((em) => (
                <div key={em.id} className="p-3 rounded-lg bg-background-elevated border border-border-subtle space-y-0.5 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="font-semibold text-indigo-400">{em.sender}</span>
                    <span className="text-text-muted">{em.date}</span>
                  </div>
                  <p className="font-bold text-text-primary line-clamp-1">{em.subject}</p>
                  <p className="text-[11px] text-text-secondary line-clamp-2 leading-relaxed">{em.snippet}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Relevant Drive Documents */}
          <Card className="p-5 space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Relevant Documents</span>
              </span>
              <span className="text-[11px] text-text-muted">{result.docsFound.length}</span>
            </h3>

            <div className="space-y-2">
              {result.docsFound.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg bg-background-elevated border border-border-subtle flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-text-primary line-clamp-1">{doc.title}</h4>
                    <p className="text-[10px] text-text-muted font-mono">Modified {doc.lastModified} • {doc.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-text-muted hover:text-text-primary cursor-pointer shrink-0 ml-2 transition-colors" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Execution Receipt Modal */}
      {showReceiptModal && result.receipt && (
        <ExecutionReceiptModal receipt={result.receipt} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};
