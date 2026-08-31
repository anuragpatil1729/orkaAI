import React, { useState } from 'react';
import { ExecutionResult } from '../../types/agent';
import { 
  CheckCircle2, 
  Calendar, 
  Mail, 
  FileText, 
  CheckSquare, 
  Zap, 
  Send, 
  Edit3, 
  Users, 
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const ResultView: React.FC<{ result: ExecutionResult; onReset: () => void }> = ({ result, onReset }) => {
  const [draftBody, setDraftBody] = useState(result.draftEmail?.body || '');
  const [isSent, setIsSent] = useState(false);

  const handleSendDraft = () => {
    setIsSent(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Success Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-indigo-950/60 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>WORKFLOW EXECUTED & VERIFIED</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white">
            MEETING PACKAGE READY
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-semibold text-indigo-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {result.brief.meetingDetails.title}
            </span>
            <span>•</span>
            <span>{result.brief.meetingDetails.time}</span>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 text-center">
          <div>
            <span className="text-2xl font-black text-emerald-400">{result.stats.actionsCompleted}</span>
            <p className="text-[10px] text-slate-400 font-medium">Actions Done</p>
          </div>
          <div className="w-[1px] h-8 bg-white/10" />
          <div>
            <span className="text-2xl font-black text-indigo-400">{result.stats.unresolvedItemsDetected}</span>
            <p className="text-[10px] text-slate-400 font-medium">Open Items</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Executive Summary, Open Items, Follow-Up Draft */}
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

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Context Insights</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.brief.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Open Items Checklist */}
          <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>DETECTED OPEN ITEMS & COMMITMENTS ({result.tasks.length})</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                ACTION ITEMS CREATED
              </span>
            </div>

            <div className="space-y-2">
              {result.tasks.map((t, idx) => (
                <div key={t.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-200">{t.title}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Email Follow-Up Draft Card */}
          {result.draftEmail && (
            <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-indigo-500/30 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-100">FOLLOW-UP DRAFT PREPARED</h3>
                </div>
                {isSent ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Sent to Rahul Sharma
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Ready for Approval
                  </span>
                )}
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

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-sans text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {draftBody}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 italic">
                  Rationale: Addresses 3 outstanding technical questions ahead of meeting.
                </span>

                {!isSent && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendDraft}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Approve & Send Email</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Relevant Email & Document Cards + AI Activity Stats */}
        <div className="space-y-6">
          {/* AI Activity Summary Card */}
          <div className="p-5 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>AI ACTIVITY SUMMARY</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-slate-100">{result.stats.emailsAnalyzed}</span>
                <p className="text-[10px] text-slate-400">Emails Analyzed</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-slate-100">{result.stats.docsAnalyzed}</span>
                <p className="text-[10px] text-slate-400">Docs Analyzed</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-slate-100">{result.stats.unresolvedItemsDetected}</span>
                <p className="text-[10px] text-slate-400">Open Items</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xl font-bold text-slate-100">{result.stats.draftsPrepared}</span>
                <p className="text-[10px] text-slate-400">Draft Prepared</p>
              </div>
            </div>
          </div>

          {/* Relevant Emails */}
          <div className="p-5 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>RELEVANT EMAILS</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">14 total</span>
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
              <span className="text-[11px] text-slate-400 font-normal">3 total</span>
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
    </div>
  );
};
