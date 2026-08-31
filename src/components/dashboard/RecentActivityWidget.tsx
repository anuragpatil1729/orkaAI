import React, { useEffect, useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ActivityLogItem } from '../../types/activity';
import { CheckCircle2, Clock, ChevronRight, Zap } from 'lucide-react';

export const RecentActivityWidget: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const { setActiveTab } = useWorkflow();

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data.activities) setActivities(data.activities);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-[#12141d]/80 border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Recent Autonomous Executions</span>
        </h3>

        <button
          onClick={() => setActiveTab('activity')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {activities.slice(0, 3).map((act) => (
          <div
            key={act.id}
            onClick={() => setActiveTab('activity')}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                  {act.goal}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>{act.timeFormatted}</span>
                  <span>•</span>
                  <span className="text-indigo-300 font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3 text-indigo-400" />
                    {act.actionsCount} actions completed
                  </span>
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {act.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
