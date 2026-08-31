import React, { useEffect, useState } from 'react';
import { ActivityLogItem } from '../types/activity';
import { Activity, CheckCircle2, Zap, ExternalLink, Inbox } from 'lucide-react';

export const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data.activities) setActivities(data.activities);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-400" />
          <span>Autonomous Activity Log</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete audit trail of all goals, plans, tools used, approvals, and verified outputs.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12141d]/50 border border-white/5 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mx-auto">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-300">No executions recorded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Enter an outcome goal in the Command Control Center to begin executing autonomous AI workflows.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-[#12141d]/90 border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {act.goal}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="font-mono">{act.timeFormatted}</span>
                    <span>•</span>
                    <span className="text-indigo-300 font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      {act.actionsCount} actions completed
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {act.status}
                </span>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
