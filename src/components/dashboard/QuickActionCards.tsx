import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Calendar, Mail, FileText, CheckCircle, Sparkles } from 'lucide-react';

export const QuickActionCards: React.FC = () => {
  const { startWorkflow } = useWorkflow();

  const actions = [
    {
      title: 'Prepare Meeting',
      prompt: 'Prepare me for my next upcoming meeting on Google Calendar.',
      icon: Calendar,
      gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      border: 'border-indigo-500/30',
      badge: 'MEETING AGENT',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      title: 'Handle My Inbox',
      prompt: 'Scan inbox for high priority emails requiring responses and draft replies.',
      icon: Mail,
      gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
      border: 'border-cyan-500/30',
      badge: 'GMAIL AGENT',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      title: 'Summarize Today\'s Work',
      prompt: 'Analyze sent emails, calendar invites, and updated docs today and generate summary.',
      icon: FileText,
      gradient: 'from-violet-500/20 via-violet-500/5 to-transparent',
      border: 'border-violet-500/30',
      badge: 'WORKSPACE SUMMARY',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
    },
    {
      title: 'Clean Up My Tasks',
      prompt: 'Extract open commitments from recent email threads and organize task priorities.',
      icon: CheckCircle,
      gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      border: 'border-emerald-500/30',
      badge: 'TASK AGENT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>Suggested AI Actions</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={() => startWorkflow(act.prompt)}
              className={`p-4 rounded-2xl bg-gradient-to-b ${act.gradient} border ${act.border} bg-[#12141d]/60 backdrop-blur-md text-left transition-all hover:scale-[1.02] hover:bg-[#181b28] group flex flex-col justify-between h-36`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">{act.title}</h4>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{act.prompt}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
