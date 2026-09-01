import React, { useEffect, useState } from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { ActivityLogItem } from '../../types/activity';
import { Badge } from '../ui/Badge';
import { fetchWithAuth } from '../../utils/api';

export const RecentActivityWidget: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const { setActiveTab } = useWorkflow();

  useEffect(() => {
    fetchWithAuth('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data.activities) setActivities(data.activities);
      })
      .catch(() => {});
  }, []);

  if (activities.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-background-card border border-border-subtle text-xs text-text-muted">
        No recent work executed yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-background-card divide-y divide-border-subtle">
      {activities.slice(0, 4).map((act) => (
        <div
          key={act.id}
          onClick={() => setActiveTab('activity')}
          className="p-3 px-4 flex items-center justify-between hover:bg-background-elevated cursor-pointer transition-colors text-xs"
        >
          <div className="space-y-0.5">
            <h4 className="font-semibold text-text-primary">{act.goal}</h4>
            <div className="text-[11px] text-text-muted">
              {act.timeFormatted} • {act.actionsCount} verified actions
            </div>
          </div>

          <Badge variant={act.status === 'Completed' ? 'success' : act.status === 'In Progress' ? 'info' : 'error'}>
            {act.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};
