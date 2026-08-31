import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Mail, Calendar, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';

export const IntegrationBar: React.FC = () => {
  const { workspaceStatus, setActiveTab } = useWorkflow();

  const services = [
    { name: 'Gmail', icon: Mail, connected: workspaceStatus.services.gmail },
    { name: 'Calendar', icon: Calendar, connected: workspaceStatus.services.calendar },
    { name: 'Google Drive', icon: HardDrive, connected: workspaceStatus.services.drive },
  ];

  return (
    <div className="p-4 rounded-2xl bg-[#12141d]/80 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-200">Google Workspace Integrations</h4>
          <p className="text-xs text-slate-400">Connected account: <span className="text-indigo-300 font-mono">{workspaceStatus.userEmail}</span></p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {services.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-medium">
              <Icon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300">{s.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            </div>
          );
        })}

        <button
          onClick={() => setActiveTab('connected')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1"
        >
          Manage →
        </button>
      </div>
    </div>
  );
};
