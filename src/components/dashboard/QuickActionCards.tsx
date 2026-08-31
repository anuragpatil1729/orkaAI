import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Calendar, Mail, FileText, CheckCircle, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/TactilePrimitives';

export const QuickActionCards: React.FC = () => {
  const { startWorkflow } = useWorkflow();

  const actions = [
    {
      title: 'Prepare Meeting',
      prompt: 'Prepare me for my next upcoming meeting on Google Calendar.',
      icon: Calendar,
      badge: 'MEETING AGENT',
      badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    },
    {
      title: 'Handle My Inbox',
      prompt: 'Scan inbox for high priority emails requiring responses and draft replies.',
      icon: Mail,
      badge: 'GMAIL AGENT',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    },
    {
      title: 'Summarize Today\'s Work',
      prompt: 'Analyze sent emails, calendar invites, and updated docs today and generate summary.',
      icon: FileText,
      badge: 'WORKSPACE SUMMARY',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
    },
    {
      title: 'Clean Up My Tasks',
      prompt: 'Extract open commitments from recent email threads and organize task priorities.',
      icon: CheckCircle,
      badge: 'TASK AGENT',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>Suggested AI Actions</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <GlassCard
              key={i}
              onClick={() => startWorkflow(act.prompt)}
              className="p-5 flex flex-col justify-between h-40 group transition-all duration-200 active:scale-98"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/15 transition-all">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                    {act.badge}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-100 group-hover:text-blue-300 transition-colors">{act.title}</h4>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">{act.prompt}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
