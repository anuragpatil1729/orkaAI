import React, { useEffect, useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ActivityLogItem } from '../../types/activity';
import { Clock, ChevronRight, Zap } from 'lucide-react';
import { GlassCard, StatusIndicator } from '../ui/TactilePrimitives';

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
    <GlassCard className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>Recent Autonomous Executions</span>
        </h3>

        <button
          onClick={() => setActiveTab('activity')}
          className="text-xs text-blue-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {activities.slice(0, 3).map((act) => (
          <div
            key={act.id}
            onClick={() => setActiveTab('activity')}
            className="p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
                  {act.goal}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-medium">
                  <span>{act.timeFormatted}</span>
                  <span>•</span>
                  <span className="text-cyan-300 font-semibold flex items-center gap-1 font-mono">
                    {act.actionsCount} verified actions
                  </span>
                </div>
              </div>
            </div>

            <StatusIndicator
              status={
                act.status === 'Completed'
                  ? 'completed'
                  : act.status === 'In Progress'
                  ? 'running'
                  : 'failed'
              }
              text={act.status}
            />
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
