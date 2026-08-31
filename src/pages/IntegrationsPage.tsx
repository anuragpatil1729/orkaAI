import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Mail, Calendar, HardDrive, CheckCircle2, ShieldCheck, Key, Lock } from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const { workspaceStatus, geminiConfigured } = useWorkflow();

  const services = [
    {
      name: 'Gmail API',
      description: 'Search email threads, analyze context, create drafts, send approved emails.',
      icon: Mail,
      connected: workspaceStatus.services.gmail
    },
    {
      name: 'Google Calendar API',
      description: 'Find upcoming meetings, retrieve attendee lists, add pre-meeting brief notes.',
      icon: Calendar,
      connected: workspaceStatus.services.calendar
    },
    {
      name: 'Google Drive API',
      description: 'Search specs, technical docs, PDFs, spreadsheets for meeting background.',
      icon: HardDrive,
      connected: workspaceStatus.services.drive
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Grid className="w-6 h-6 text-indigo-400" />
          <span>Connected Workspace & APIs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Google Workspace OAuth 2.0 integration and Gemini LLM provider settings.
        </p>
      </div>

      {/* Account Info Banner */}
      <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Active Google Account</span>
            <h3 className="text-lg font-bold text-white font-mono">{workspaceStatus.userEmail}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Google OAuth Connected</span>
        </div>
      </div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Connected
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-base">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{s.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gemini Engine Banner */}
      <div className="p-6 rounded-3xl bg-[#12141d]/90 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">Google Gemini API Provider</h3>
          </div>
          {geminiConfigured ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ✓ GEMINI_API_KEY Active
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Mode (Using Fallback LLM Reasoner)
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400">
          ActionOS uses Google Gemini API key securely on backend server. Keys are never exposed to client side.
        </p>
      </div>
    </div>
  );
};
import { Grid } from 'lucide-react';
