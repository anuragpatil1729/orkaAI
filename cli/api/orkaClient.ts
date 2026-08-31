import { WorkflowExecution, IntentParseResult } from '../../src/types/agent';
import { ActivityLogItem } from '../../src/types/activity';
import { AutomationRule, DiscoveredPattern } from '../../src/types/automations';

const getBaseUrl = (): string => {
  return process.env.ORKA_API_URL || 'http://localhost:3001';
};

export class OrkaClient {
  static async getStatus() {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/status`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      throw new Error(`Orka couldn't reach the backend server at ${getBaseUrl()}.\nMake sure the Orka server is running with 'npm run dev' or 'npm start'.`);
    }
  }

  static async executeOutcome(prompt: string, mode: 'COPILOT' | 'AUTOPILOT' = 'COPILOT'): Promise<{ intent: IntentParseResult; workflow: WorkflowExecution }> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/agent/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, mode })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      throw new Error(`Failed to start execution: ${err.message}`);
    }
  }

  static async advanceWorkflow(workflowId: string): Promise<WorkflowExecution> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/agent/workflow/${workflowId}/advance`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.workflow;
    } catch (err: any) {
      throw new Error(`Failed to advance workflow step: ${err.message}`);
    }
  }

  static async approveStep(workflowId: string, stepId: string, customPayload?: { to?: string; subject?: string; body?: string }): Promise<WorkflowExecution> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/agent/workflow/${workflowId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, ...customPayload })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.workflow;
    } catch (err: any) {
      throw new Error(`Failed to approve workflow action: ${err.message}`);
    }
  }

  static async getActivity(): Promise<ActivityLogItem[]> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/activity`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data.activities || [];
    } catch (err: any) {
      throw new Error(`Failed to fetch activity log: ${err.message}`);
    }
  }

  static async getAutomations(): Promise<{ automations: AutomationRule[]; discoveredPattern: DiscoveredPattern }> {
    try {
      const res = await fetch(`${getBaseUrl()}/api/automations`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      throw new Error(`Failed to fetch automations: ${err.message}`);
    }
  }
}
