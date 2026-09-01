import React, { useEffect, useState } from 'react';
import { AutomationRule, DiscoveredPattern } from '../types/automations';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { TactileToggle } from '../components/ui/NeoTactileSystem';
import { fetchWithAuth } from '../utils/api';

export const AutomationsPage: React.FC = () => {
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [pattern, setPattern] = useState<DiscoveredPattern | null>(null);
  const [patternCreated, setPatternCreated] = useState(false);

  useEffect(() => {
    fetchWithAuth('/api/automations')
      .then(res => res.json())
      .then(data => {
        if (data.automations) setAutomations(data.automations);
        if (data.discoveredPattern) setPattern(data.discoveredPattern);
      })
      .catch(() => {});
  }, []);

  const handleToggle = (id: string, active: boolean) => {
    fetchWithAuth('/api/automations/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, active: !active })
    })
      .then(res => res.json())
      .then(data => {
        if (data.automations) setAutomations(data.automations);
      });
  };

  const handleCreatePattern = () => {
    fetchWithAuth('/api/automations/create-pattern', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.automations) {
          setAutomations(data.automations);
          setPatternCreated(true);
        }
      });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h1 className="text-base font-semibold text-text-primary">
            Automations
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            Background triggers and recurring routines.
          </p>
        </div>

        <Button onClick={handleCreatePattern} variant="primary" size="sm">
          <Plus className="w-3.5 h-3.5" />
          <span>Create automation</span>
        </Button>
      </div>

      {/* Pattern Suggestion */}
      {pattern && !patternCreated && (
        <div className="p-4 rounded-lg border border-border-strong bg-background-card space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-text-primary">{pattern.title}</span>
            <Badge variant="accent">{pattern.occurrences} occurrences</Badge>
          </div>
          <p className="text-text-secondary leading-relaxed">{pattern.description}</p>
          <div className="pt-2 flex justify-end">
            <Button onClick={handleCreatePattern} variant="secondary" size="sm">
              Add automation rule
            </Button>
          </div>
        </div>
      )}

      {/* Automations Table */}
      {automations.length === 0 ? (
        <EmptyState
          title="No automations yet"
          description="Create an automation rule to handle recurring background routines automatically."
        />
      ) : (
        <div className="rounded-lg border border-border-subtle bg-background-card divide-y divide-border-subtle text-xs">
          {automations.map((auto) => (
            <div key={auto.id} className="p-3.5 flex items-center justify-between gap-4">
              <div className="space-y-0.5 max-w-md">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">{auto.title}</h3>
                  <Badge variant="neutral">{auto.category}</Badge>
                </div>
                <p className="text-[11px] text-text-secondary">{auto.description}</p>
              </div>

              <div className="flex items-center gap-4 text-text-muted font-mono text-[11px] shrink-0">
                <span>{auto.executionsCount} runs</span>
                <TactileToggle
                  checked={auto.active}
                  onChange={() => handleToggle(auto.id, auto.active)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
