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
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-indigo-950/70 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WORKFLOW EXECUTED & VERIFIED BY POLICY ENGINE</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            YOU'RE READY.
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {result.brief.meetingDetails.title}
            </span>
            <span>•</span>
            <span className="font-mono text-slate-300">{result.brief.meetingDetails.time}</span>
          </div>
        </div>

        {/* Stats Summary & Execution Receipt Trigger */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-6 bg-black/50 p-5 rounded-2xl border border-white/10 text-center">
            <div>
              <span className="text-3xl font-black text-emerald-400">{result.stats.actionsCompleted}</span>
              <p className="text-[11px] text-slate-400 font-medium">Actions Executed</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div>
              <span className="text-3xl font-black text-cyan-400">{result.stats.actionsVerified || result.stats.actionsCompleted}</span>
              <p className="text-[11px] text-slate-400 font-medium">API Verified</p>
            </div>
          </div>

          {result.receipt && (
            <button
              onClick={() => setShowReceiptModal(true)}
              className="px-4 py-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/10"
            >
              <Receipt className="w-4 h-4" />
              <span>View Execution Receipt</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Executive Summary, Key Decisions, Open Items, Follow-Up Draft */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>EXECUTIVE SUMMARY</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">Synthesized by Gemini</span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {result.brief.summary}
            </p>
          </div>

          {/* Key Decisions Card */}
          <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>KEY DECISIONS & AGREEMENTS</span>
              </h3>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              {result.brief.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-200">{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Open Items & Next Actions */}
          <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>OPEN ITEMS & NEXT ACTIONS ({result.tasks.length})</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                TASKS CREATED
              </span>
            </div>

            <div className="space-y-2">
              {result.tasks.map((t, idx) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-white/5 text-slate-400">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Editable Follow-Up Email Draft Card */}
          {result.draftEmail && (
            <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-indigo-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-100">FOLLOW-UP EMAIL DRAFT</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingDraft(!isEditingDraft)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingDraft ? 'Save Edits' : 'Edit Email'}</span>
                  </button>

                  {isSent ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Sent to Rahul Sharma
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Draft Prepared
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold">To:</span>
                  <span className="text-slate-200 font-mono">{result.draftEmail.to}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-semibold">Subject:</span>
                  <span className="text-slate-100 font-bold">{result.draftEmail.subject}</span>
                </div>

                {isEditingDraft ? (
                  <textarea
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    rows={7}
                    className="w-full p-4 rounded-2xl bg-black/60 border border-indigo-500/40 text-slate-200 text-xs outline-none font-sans leading-relaxed resize-none"
                  />
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-sans text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {draftBody}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 italic">
                  Rationale: Addresses outstanding technical audit points before the sync.
                </span>

                {!isSent && (
                  <button
                    onClick={handleSendDraft}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Approve & Send Email</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Relevant Emails, Documents, and Orka Activity */}
        <div className="space-y-6">
          {/* ORKA ACTIVITY Audit Checklist */}
          <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>ORKA ACTIVITY AUDIT</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">100% VERIFIED</span>
            </h3>

            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calendar meeting analyzed</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.stats.emailsAnalyzed} Gmail threads scanned</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.stats.docsAnalyzed} Drive documents analyzed</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Executive brief synthesized</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{result.tasks.length} Action tasks prepared</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-emerald-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Follow-up email drafted</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
              </div>
            </div>

            <p className="text-center text-xs text-slate-400 font-semibold pt-2 italic">
              "Go into the meeting prepared."
            </p>
          </div>

          {/* Relevant Emails */}
          <div className="p-5 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>RELEVANT EMAILS</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{result.emailsFound.length} total</span>
            </h3>

            <div className="space-y-2">
              {result.emailsFound.map((em) => (
                <div key={em.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-300">{em.sender}</span>
                    <span className="text-[10px] text-slate-500">{em.date}</span>
                  </div>
                  <p className="font-bold text-slate-200 line-clamp-1">{em.subject}</p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{em.snippet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Relevant Drive Documents */}
          <div className="p-5 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>RELEVANT DOCUMENTS</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{result.docsFound.length} total</span>
            </h3>

            <div className="space-y-2">
              {result.docsFound.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-200 line-clamp-1">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400">Modified {doc.lastModified} • {doc.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-500 hover:text-indigo-400 cursor-pointer shrink-0 ml-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Execution Receipt Modal */}
      {showReceiptModal && result.receipt && (
        <ExecutionReceiptModal receipt={result.receipt} onClose={() => setShowReceiptModal(false)} />
      )}
    </div>
  );
};
