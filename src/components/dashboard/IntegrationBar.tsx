import React, { useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Mail, Calendar, HardDrive, CheckCircle2, ShieldCheck, Github, Key, X, ArrowRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

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
    { name: 'Drive', icon: HardDrive, connected: workspaceStatus.services.drive },
    { name: 'GitHub', icon: Github, connected: githubConnected },
  ];

  return (
    <>
      <Card className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-text-primary uppercase font-mono tracking-wider">Connected Workspace</h4>
            <p className="text-xs text-text-secondary">
              Account: <span className="text-indigo-400 font-mono font-medium">{workspaceStatus.userEmail || 'not_connected@workspace.com'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                onClick={s.name === 'GitHub' ? () => setShowGithubModal(true) : undefined}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                  s.name === 'GitHub' && !githubConnected
                    ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
                    : 'bg-background-elevated border-border-subtle text-text-primary'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{s.name}</span>
                {s.connected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-indigo-400 font-mono font-semibold">+ Connect</span>
                )}
              </div>
            );
          })}

          <button
            onClick={() => setActiveTab('connected')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
          >
            Manage →
          </button>
        </div>
      </Card>

      {/* GitHub Token Config Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn select-none">
          <Card className="w-full max-w-md p-6 space-y-4 border-border-strong relative">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Github className="w-4.5 h-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-text-primary">Connect GitHub Token</h3>
              </div>
              <button onClick={() => setShowGithubModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Paste a GitHub Personal Access Token (PAT with <code className="text-indigo-400">repo</code> scope) to enable OrkaAI to publish real Pull Requests directly to target repositories.
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-semibold text-text-muted uppercase">GITHUB PERSONAL ACCESS TOKEN</label>
              <div className="relative">
                <Key className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  className="w-full bg-background-elevated border border-border-subtle rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-text-primary placeholder:text-text-muted focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setShowGithubModal(false)} className="text-xs text-text-muted hover:text-text-primary">
                Cancel
              </button>
              <Button onClick={handleSaveToken} variant="primary" size="sm">
                <span>Save Token & Connect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
