import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const IntegrationsPage: React.FC = () => {
  const { workspaceStatus, geminiConfigured } = useWorkflow();

  const services = [
    {
      name: 'Gmail API',
      description: 'Scan email threads and create email response drafts.',
      connected: workspaceStatus.services.gmail
    },
    {
      name: 'Google Calendar API',
      description: 'Retrieve upcoming meetings and attendee lists.',
      connected: workspaceStatus.services.calendar
    },
    {
      name: 'Google Drive API',
      description: 'Search documentation, specs, and PDFs.',
      connected: workspaceStatus.services.drive
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="border-b border-border-subtle pb-3">
        <h1 className="text-base font-semibold text-text-primary">
          Integrations
        </h1>
        <p className="text-xs text-text-secondary mt-0.5">
          Connected workspace accounts and API providers.
        </p>
      </div>

      {/* Account Info */}
      <div className="p-4 rounded-lg bg-background-card border border-border-subtle flex items-center justify-between text-xs">
        <div>
          <span className="text-[11px] text-text-muted font-mono uppercase">Authenticated Account</span>
          <h3 className="font-semibold text-text-primary mt-0.5">{workspaceStatus.userEmail || 'not_connected@workspace.com'}</h3>
        </div>

        <Badge variant={workspaceStatus.connected ? 'success' : 'warning'}>
          {workspaceStatus.connected ? 'Connected' : 'Setup Required'}
        </Badge>
      </div>

      {/* Settings List */}
      <div className="rounded-lg border border-border-subtle bg-background-card divide-y divide-border-subtle text-xs">
        {services.map((s, i) => (
          <div key={i} className="p-3.5 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-text-primary">{s.name}</h3>
              <p className="text-[11px] text-text-secondary">{s.description}</p>
            </div>

            <Badge variant={s.connected ? 'success' : 'neutral'}>
              {s.connected ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        ))}

        <div className="p-3.5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-text-primary font-mono">Google Gemini API Provider</h3>
            <p className="text-[11px] text-text-secondary">LLM reasoning engine configured on server.</p>
          </div>

          <Badge variant={geminiConfigured ? 'success' : 'neutral'}>
            {geminiConfigured ? 'Active' : 'Fallback Reasoner'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
