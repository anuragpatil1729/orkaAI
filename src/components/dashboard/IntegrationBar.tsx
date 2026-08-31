import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Mail, Calendar, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../ui/NeoTactileSystem';

export const IntegrationBar: React.FC = () => {
  const { workspaceStatus, setActiveTab } = useWorkflow();

  const services = [
    { name: 'Gmail', icon: Mail, connected: workspaceStatus.services.gmail },
    { name: 'Calendar', icon: Calendar, connected: workspaceStatus.services.calendar },
    { name: 'Google Drive', icon: HardDrive, connected: workspaceStatus.services.drive },
  ];

  return (
    <GlassCard className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)]">
          <ShieldCheck className="w-5.5 h-5.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-100">Google Workspace Integrations</h4>
          <p className="text-xs text-slate-400">Connected account: <span className="text-cyan-300 font-mono font-semibold">{workspaceStatus.userEmail || 'not_connected@workspace.com'}</span></p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold">
              <Icon className="w-4 h-4 text-blue-400" />
              <span className="text-slate-200">{s.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
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
  );
};
