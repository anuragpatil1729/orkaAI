import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeTogglePill } from '../ui/NeoTactileSystem';

export const Header: React.FC = () => {
  const { activeTab, workspaceStatus } = useWorkflow();
  const { user } = useAuth();

  const titleMap: Record<string, string> = {
    dashboard: 'Overview',
    execution: 'Tasks',
    automations: 'Automations',
    activity: 'Activity',
    connected: 'Integrations',
  };

  return (
    <header className="h-12 border-b border-border-subtle bg-background-surface px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Page Title */}
      <h1 className="text-xs font-semibold text-text-primary">
        {titleMap[activeTab] || 'Overview'}
      </h1>

      {/* Right: Connected Account Info & Theme Toggle */}
      <div className="flex items-center gap-3">
        <ThemeTogglePill />

        {workspaceStatus.connected && (
          <div className="text-[11px] text-text-muted font-mono hidden sm:inline">
            {workspaceStatus.userEmail || user?.email}
          </div>
        )}
      </div>
    </header>
  );
};
