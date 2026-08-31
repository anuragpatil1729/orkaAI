import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Mail, Calendar, HardDrive, ShieldCheck, Key, Grid } from 'lucide-react';
import { GlassCard, StatusPill } from '../components/ui/NeoTactileSystem';

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
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5 font-mono">
          <Grid className="w-6 h-6 text-blue-400" />
          <span>Connected Workspace & APIs</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Google Workspace OAuth 2.0 integration and Gemini LLM provider settings.
        </p>
      </div>

      {/* Account Info Banner */}
      <GlassCard className="p-7 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-mono">Active Google Account</span>
            <h3 className="text-lg font-bold text-white font-mono">{workspaceStatus.userEmail || 'not_connected@workspace.com'}</h3>
          </div>
        </div>

        <StatusPill status={workspaceStatus.connected ? 'connected' : 'disconnected'} text={workspaceStatus.connected ? 'Google OAuth Connected' : 'Setup Required'} />
      </GlassCard>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <GlassCard key={i} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-blue-400 shadow-inner">
                  <Icon className="w-5.5 h-5.5" />
                </div>
                <StatusPill status={s.connected ? 'connected' : 'disconnected'} text={s.connected ? 'Connected' : 'Offline'} />
              </div>

              <div>
                <h3 className="font-extrabold text-slate-100 text-base">{s.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.description}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Gemini Engine Banner */}
      <GlassCard className="p-7 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Key className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-base font-mono">Google Gemini API Provider</h3>
          </div>
          {geminiConfigured ? (
            <span className="text-xs font-bold font-mono px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              ✓ GEMINI_API_KEY Active
            </span>
          ) : (
            <span className="text-xs font-bold font-mono px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Mode (Fallback LLM Reasoner)
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          OrkaAI uses Google Gemini API key securely on backend server. Keys are never exposed to client side.
        </p>
      </GlassCard>
    </div>
  );
};
