import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Mail, Calendar, HardDrive, CheckCircle2, ShieldCheck, Github, Key, X, ArrowRight } from 'lucide-react';
import { GlassCard, TactileButton } from '../ui/NeoTactileSystem';

export const IntegrationBar: React.FC = () => {
  const { workspaceStatus, setActiveTab } = useWorkflow();
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);

  const handleSaveToken = async () => {
    if (!githubToken.trim()) return;
    try {
      const res = await fetch('/api/github/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken })
      });
      if (res.ok) {
        setGithubConnected(true);
        setShowGithubModal(false);
      }
    } catch (err) {
      console.error('Failed to save GitHub token:', err);
    }
  };

  const services = [
    { name: 'Gmail', icon: Mail, connected: workspaceStatus.services.gmail },
    { name: 'Calendar', icon: Calendar, connected: workspaceStatus.services.calendar },
    { name: 'Google Drive', icon: HardDrive, connected: workspaceStatus.services.drive },
    { name: 'GitHub API', icon: Github, connected: githubConnected },
  ];

  return (
    <>
      <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">Workspace & API Integrations</h4>
            <p className="text-xs text-slate-400">
              Connected account: <span className="text-cyan-300 font-mono font-semibold">{workspaceStatus.userEmail || 'not_connected@workspace.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                onClick={s.name === 'GitHub API' ? () => setShowGithubModal(true) : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                  s.name === 'GitHub API' && !githubConnected
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                    : 'bg-white/[0.04] border-white/10 text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{s.name}</span>
                {s.connected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                ) : (
                  <span className="text-[10px] text-cyan-300 font-mono font-bold ml-1">+ Connect</span>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setActiveTab('connected')}
            className="text-xs text-blue-400 hover:text-cyan-300 font-extrabold px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
          >
            Manage →
          </button>
        </div>
      </GlassCard>

      {/* GitHub Token Config Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-[#080B10]/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn select-none">
          <GlassCard className="w-full max-w-md p-6 space-y-5 border border-cyan-400/40 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Github className="w-5 h-5 text-cyan-300" />
                <h3 className="text-base font-extrabold text-white">Connect GitHub Token</h3>
              </div>
              <button onClick={() => setShowGithubModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Paste a GitHub Personal Access Token (PAT with <code className="text-cyan-300">repo</code> scope) to enable OrkaAI to publish real Pull Requests directly to target repositories like <code className="text-cyan-300">sarthakpatil6636/atestproject</code>.
            </p>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">GITHUB PERSONAL ACCESS TOKEN</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowGithubModal(false)} className="text-xs text-slate-400 hover:text-white">
                Cancel
              </button>
              <TactileButton onClick={handleSaveToken} variant="primary" size="sm">
                <span>Save Token & Connect</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </TactileButton>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
};
