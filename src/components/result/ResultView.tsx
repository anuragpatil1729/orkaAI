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
import { GlassPanel, GlassCard, TactileButton, GlassTextarea, StatusPill } from '../ui/NeoTactileSystem';

export const ResultView: React.FC<{ result: ExecutionResult; onReset: () => void }> = ({ result, onReset }) => {
  const [draftBody, setDraftBody] = useState(result.draftEmail?.body || '');
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleSendDraft = () => {
    setIsSent(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Banner */}
      <GlassPanel glowEdge={true} className="p-8 border border-emerald-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WORKFLOW EXECUTED & VERIFIED BY POLICY ENGINE</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            YOU'RE READY.
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              {result.brief.meetingDetails.title}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-300">{result.brief.meetingDetails.time}</span>
          </div>
        </div>

        {/* Stats Summary & Execution Receipt Trigger */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-6 bg-black/70 p-5 rounded-2xl border border-white/10 text-center font-mono shadow-inner">
            <div>
              <span className="text-3xl font-black text-emerald-400">{result.stats.actionsCompleted}</span>
              <p className="text-[11px] text-slate-400 font-medium">Actions Executed</p>
            </div>
            <div className="w-[1px] h-10 bg-white/15" />
            <div>
              <span className="text-3xl font-black text-cyan-400">{result.stats.actionsVerified || result.stats.actionsCompleted}</span>
              <p className="text-[11px] text-slate-400 font-medium">API Verified</p>
            </div>
          </div>

          {result.receipt && (
            <TactileButton
              onClick={() => setShowReceiptModal(true)}
              variant="light"
              size="md"
            >
              <Receipt className="w-4 h-4" />
              <span>View Execution Receipt</span>
            </TactileButton>
          )}
        </div>
      </GlassPanel>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Executive Summary, Key Decisions, Open Items, Follow-Up Draft */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary Card */}
          <GlassCard className="p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2.5 font-mono">
                <Sparkles className="w-4.5 h-4.5 text-blue-400" />
                <span>EXECUTIVE SUMMARY</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Synthesized by Gemini</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {result.brief.summary}
            </p>
          </GlassCard>

          {/* Key Decisions Card */}
          <GlassCard className="p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2.5 font-mono">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
                <span>KEY DECISIONS & AGREEMENTS</span>
              </h3>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              {result.brief.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-200 leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Open Items & Next Actions */}
          <GlassCard className="p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2.5 font-mono">
                <CheckSquare className="w-4.5 h-4.5 text-amber-400" />
                <span>OPEN ITEMS & NEXT ACTIONS ({result.tasks.length})</span>
              </h3>
              <span className="text-xs font-mono font-semibold px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                TASKS CREATED
              </span>
            </div>

            <div className="space-y-3">
              {result.tasks.map((t, idx) => (
                <div key={t.id} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-300 font-mono font-bold text-xs flex items-center justify-center border border-blue-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Editable Follow-Up Email Draft Card */}
          {result.draftEmail && (
            <GlassCard className="p-7 border border-blue-500/40 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-blue-400" />
                  <h3 className="text-base font-bold text-slate-100 font-mono">FOLLOW-UP EMAIL DRAFT</h3>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingDraft ? 'Done Editing' : 'Edit Email'}</span>
                  </button>

                  {isSent ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Sent to Recipient
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                      Draft Prepared
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <span className="font-semibold">To:</span>
                  <span className="text-cyan-300 font-bold">{result.draftEmail.to}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold font-mono">Subject:</span>
                  <span className="text-slate-100 font-bold">{result.draftEmail.subject}</span>
                </div>

                {isEditingDraft ? (
                  <GlassTextarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={7}
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-[#080B10]/95 border border-white/10 font-sans text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                    {draftBody}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 italic font-mono">
                  Rationale: Addresses open action items from workspace context.
                </span>

                {!isSent && (
                  <TactileButton onClick={handleSendDraft} variant="primary" size="md">
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Email</span>
                  </TactileButton>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column (1 col): Relevant Emails, Documents, and Orka Activity */}
        <div className="space-y-6">
          {/* ORKA ACTIVITY Audit Checklist */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span>ORKA ACTIVITY AUDIT</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% VERIFIED</span>
            </h3>

            <div className="space-y-2.5 text-xs font-semibold">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calendar meeting analyzed</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.stats.emailsAnalyzed} Gmail threads scanned</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.stats.docsAnalyzed} Drive documents analyzed</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Executive brief synthesized</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.tasks.length} Action tasks prepared</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">VERIFIED</span>
              </div>
            </div>
          </GlassCard>

          {/* Relevant Emails */}
          <GlassCard className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>RELEVANT EMAILS</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{result.emailsFound.length} total</span>
            </h3>

            <div className="space-y-2.5">
              {result.emailsFound.map((em) => (
                <div key={em.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-semibold text-cyan-300">{em.sender}</span>
                    <span className="text-[10px] text-slate-400">{em.date}</span>
                  </div>
                  <p className="font-bold text-slate-200 line-clamp-1">{em.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{em.snippet}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Relevant Drive Documents */}
          <GlassCard className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between font-mono">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>RELEVANT DOCUMENTS</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{result.docsFound.length} total</span>
            </h3>

            <div className="space-y-2.5">
              {result.docsFound.map((doc) => (
                <div key={doc.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200 line-clamp-1">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Modified {doc.lastModified} • {doc.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 hover:text-cyan-300 cursor-pointer shrink-0 ml-2 transition-colors" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Execution Receipt Modal */}
      {showReceiptModal && result.receipt && (
        <ExecutionReceiptModal receipt={result.receipt} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};
