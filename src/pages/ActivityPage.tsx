import React, { useEffect, useState } from 'react';
import { ActivityLogItem } from '../types/activity';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';

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
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="border-b border-border-subtle pb-3">
        <h1 className="text-base font-semibold text-text-primary">
          Activity Audit Log
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          History of all goal executions and verified outputs.
        </p>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="No activity recorded"
          description="Activity logs will appear here after your first task execution."
        />
      ) : (
        <div className="rounded-lg border border-border-subtle bg-background-card divide-y divide-border-subtle text-xs">
          {activities.map((act) => (
            <div key={act.id} className="p-3 px-4 flex items-center justify-between gap-4 font-mono">
              <div className="flex items-center gap-4">
                <span className="text-text-muted text-[11px] shrink-0">{act.timeFormatted}</span>
                <span className="font-sans font-medium text-text-primary">{act.goal}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-text-muted text-[11px] font-sans">{act.actionsCount} actions</span>
                <Badge variant={act.status === 'Completed' ? 'success' : act.status === 'In Progress' ? 'info' : 'error'}>
                  {act.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
