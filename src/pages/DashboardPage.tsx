import React, { useState } from 'react';
import { CommandInput } from '../components/dashboard/CommandInput';
import { RecentActivityWidget } from '../components/dashboard/RecentActivityWidget';
import { IncomingWorkWidget } from '../components/tasks/IncomingWorkWidget';
import { CheckScanMailButton } from '../components/dashboard/CheckScanMailButton';
import { LiveExecutionCockpit } from '../components/tasks/LiveExecutionCockpit';
import { useAuth } from '../context/AuthContext';
import { EmailTaskItem } from '../../server/storage/emailTaskStore';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeExecutionTask, setActiveExecutionTask] = useState<EmailTaskItem | null>(null);

  const handleScanComplete = (_newTasks: EmailTaskItem[], allTasks: EmailTaskItem[]) => {
    const executing = allTasks.find(t => t.status === 'EXECUTING');
    if (executing) {
      setActiveExecutionTask(executing);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* 1. Greeting & Primary Command Focal Surface */}
      <div className="space-y-4">
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">
          {getTimeGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>

        <CommandInput />
      </div>

      {/* 2. Mail Scan Trigger */}
      <CheckScanMailButton onScanComplete={handleScanComplete} />

      {/* 3. Task Work Queue ("Needs attention") */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-text-muted uppercase font-mono tracking-wider">
          Needs attention
        </h2>
        <IncomingWorkWidget onExecuteTriggered={(task) => setActiveExecutionTask(task)} />
      </div>

      {/* 4. Recent Work List */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-text-muted uppercase font-mono tracking-wider">
          Recent work
        </h2>
        <RecentActivityWidget />
      </div>

      {/* Live Execution Cockpit Overlay */}
      {activeExecutionTask && (
        <LiveExecutionCockpit
          task={activeExecutionTask}
          onClose={() => setActiveExecutionTask(null)}
        />
      )}
    </div>
  );
};
