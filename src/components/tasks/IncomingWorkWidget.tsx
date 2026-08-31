import React, { useEffect, useState } from 'react';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { Mail, RefreshCw, ArrowRight, ShieldAlert, Code } from 'lucide-react';
import { GlassCard, StatusPill, TactileButton } from '../ui/NeoTactileSystem';
import { TaskDetailModal } from './TaskDetailModal';

export const IncomingWorkWidget: React.FC = () => {
  const [tasks, setTasks] = useState<EmailTaskItem[]>([]);
  const [selectedTask, setSelectedTask] = useState<EmailTaskItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks.filter((t: EmailTaskItem) => t.actionable));
      }
    } catch {}
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleScanInbox = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/tasks/scan', { method: 'POST' });
      const data = await res.json();
      if (data.allTasks) {
        setTasks(data.allTasks.filter((t: EmailTaskItem) => t.actionable));
      }
    } catch (err) {
      console.error('Failed to scan inbox:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <GlassCard className="p-7 space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-mono">
              <span>INCOMING WORK (EMAIL-TO-ACTION)</span>
            </h3>
            <p className="text-xs text-slate-400">OrkaAI automatically scans Gmail inbox for actionable requests.</p>
          </div>
        </div>

        <button
          onClick={handleScanInbox}
          disabled={isScanning}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-bold font-mono px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Inbox...' : 'Scan Gmail Inbox'}</span>
        </button>
      </div>

      {/* Incoming Work Task Items List */}
      {tasks.length === 0 ? (
        <div className="p-8 text-center space-y-2 bg-white/[0.02] rounded-2xl border border-white/5">
          <p className="text-xs text-slate-400 font-medium">No pending actionable email tasks detected.</p>
          <p className="text-[11px] text-slate-500 font-mono">Click "Scan Gmail Inbox" above to scan recent unread messages.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className="p-4.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center justify-between cursor-pointer transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  {task.technicalTask ? <Code className="w-4 h-4 text-cyan-300" /> : <Mail className="w-4 h-4 text-blue-400" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-cyan-300 font-bold">{task.sender}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{task.receivedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {task.requestedAction || task.subject}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                    {task.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusPill status={task.status === 'COMPLETED' ? 'completed' : task.status === 'EXECUTING' ? 'running' : 'waiting_approval'} text={task.status} />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </GlassCard>
  );
};
