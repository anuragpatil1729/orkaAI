import React, { useEffect, useState } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { Badge } from '../ui/Badge';
import { TaskDetailModal } from './TaskDetailModal';

interface IncomingWorkWidgetProps {
  onExecuteTriggered?: (task: EmailTaskItem) => void;
}

export const IncomingWorkWidget: React.FC<IncomingWorkWidgetProps> = ({ onExecuteTriggered }) => {
  const [tasks, setTasks] = useState<EmailTaskItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<EmailTaskItem | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/mail/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks.filter((t: EmailTaskItem) => t.actionable));
      }
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskClick = (task: EmailTaskItem) => {
    if ((task.status === 'EXECUTING' || task.status === 'COMPLETED') && onExecuteTriggered) {
      onExecuteTriggered(task);
    } else {
      setSelectedTask(task);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-background-card border border-border-subtle text-xs text-text-muted">
        No pending tasks waiting for attention.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-subtle bg-background-card divide-y divide-border-subtle">
      {tasks.slice(0, 5).map((task) => (
        <div
          key={task.id}
          onClick={() => handleTaskClick(task)}
          className="p-3 px-4 flex items-center justify-between hover:bg-background-elevated cursor-pointer transition-colors group text-xs"
        >
          <div className="space-y-0.5 max-w-lg">
            <h4 className="font-semibold text-text-primary group-hover:underline">
              {task.requestedAction || task.subject}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-text-muted">
              <span>From: {task.sender}</span>
              <span>•</span>
              <span>{task.receivedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Badge variant={task.status === 'COMPLETED' ? 'success' : task.status === 'EXECUTING' ? 'info' : 'warning'}>
              {task.status}
            </Badge>
            <span className="text-xs text-text-secondary group-hover:text-text-primary font-medium">Review →</span>
          </div>
        </div>
      ))}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onExecuteTriggered={(task) => {
            setSelectedTask(null);
            if (onExecuteTriggered) onExecuteTriggered(task);
          }}
        />
      )}
    </div>
  );
};
