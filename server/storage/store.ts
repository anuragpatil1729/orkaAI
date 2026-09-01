import { WorkflowExecution } from '../../src/types/agent';
import { AutomationRule, DiscoveredPattern } from '../../src/types/automations';

export interface ActivityItem {
  id: string;
  userId?: string;
  timestamp: string;
  timeFormatted: string;
  dateGroup: string;
  goal: string;
  actionsCount: number;
  status: 'Completed' | 'In Progress' | 'Action Required' | 'Failed';
  execution?: WorkflowExecution;
}

class Store {
  private activities: ActivityItem[] = [];
  private automationsByUserId = new Map<string, AutomationRule[]>();

  private getDefaultAutomations(): AutomationRule[] {
    return [
      {
        id: 'rule_1',
        title: 'Pre-Meeting Briefing & Audit Generator',
        description: 'Automatically compiles executive briefs, scours recent email threads and Google Drive documents 2 hours before scheduled client meetings.',
        trigger: 'Calendar Event starting in 2h',
        condition: 'Event attendees include external domain',
        actions: ['Find calendar event', 'Search Gmail threads', 'Search Drive documents', 'Synthesize brief & draft follow-up'],
        active: true,
        executionsCount: 14,
        approvalsRequiredCount: 14,
        category: 'meeting'
      },
      {
        id: 'rule_2',
        title: 'High-Risk Email Transmission Guardrail',
        description: 'Pauses execution and prompts explicit user verification whenever an external email communication payload is prepared.',
        trigger: 'Agent Action: send_email',
        condition: 'Recipient is external contact',
        actions: ['Intercept payload', 'Request Human-in-the-Loop Approval', 'Transmit on Approval'],
        active: true,
        executionsCount: 9,
        approvalsRequiredCount: 9,
        category: 'inbox'
      },
      {
        id: 'rule_3',
        title: 'Invoice & Vendor Document Extraction',
        description: 'Identifies incoming invoice attachments, parses key total values, and generates structured action items in task management.',
        trigger: 'Gmail message with attachment "Invoice"',
        condition: 'Amount < $10,000',
        actions: ['Download Drive file', 'Extract values', 'Create verified task item'],
        active: true,
        executionsCount: 6,
        approvalsRequiredCount: 0,
        category: 'invoice'
      }
    ];
  }

  public getActivities(userId?: string): ActivityItem[] {
    if (!userId) return this.activities;
    return this.activities.filter(a => !a.userId || a.userId === userId);
  }

  public addActivity(activity: ActivityItem): void {
    this.activities.unshift(activity);
  }

  public updateActivityStatus(id: string, status: ActivityItem['status'], execution?: WorkflowExecution): void {
    const act = this.activities.find(a => a.id === id || a.execution?.id === id);
    if (act) {
      act.status = status;
      if (execution) {
        act.execution = execution;
      }
    }
  }

  public getAutomations(userId?: string): AutomationRule[] {
    const key = userId || 'global';
    if (!this.automationsByUserId.has(key)) {
      this.automationsByUserId.set(key, this.getDefaultAutomations());
    }
    return this.automationsByUserId.get(key)!;
  }

  public addAutomation(automation: AutomationRule, userId?: string): void {
    const list = this.getAutomations(userId);
    list.push(automation);
  }

  public toggleAutomation(id: string, active?: boolean, userId?: string): void {
    const list = this.getAutomations(userId);
    const auto = list.find(a => a.id === id);
    if (auto) {
      auto.active = active !== undefined ? active : !auto.active;
    }
  }

  public discoverPatterns(userId?: string): DiscoveredPattern[] {
    const userActivities = this.getActivities(userId);
    if (userActivities.length < 2) {
      return [
        {
          id: 'pattern_1',
          title: 'Frequent Manual Invoice Workflow Detected',
          description: 'You\'ve manually processed 17 invoice emails from recurring vendors under $10,000 this month.',
          occurrences: 17,
          suggestedWorkflow: {
            when: 'Gmail message arrives with subject "Invoice"',
            if: 'Vendor amount < $10,000',
            do: ['Extract PDF totals to Sheets', 'Create verified task item', 'Notify via summary']
          }
        }
      ];
    }

    const goalCounts = new Map<string, number>();
    userActivities.forEach(a => {
      const simplifiedGoal = a.goal.toLowerCase().trim();
      goalCounts.set(simplifiedGoal, (goalCounts.get(simplifiedGoal) || 0) + 1);
    });

    const patterns: DiscoveredPattern[] = [];
    goalCounts.forEach((count, goal) => {
      patterns.push({
        id: 'p_' + Date.now(),
        title: `Recurring Intent Pattern: "${goal}"`,
        description: `OrkaAI detected ${count} executions for "${goal}".`,
        occurrences: count,
        suggestedWorkflow: {
          when: `User requests "${goal}"`,
          if: 'Goal pattern matches execution history',
          do: ['Execute tool orchestration sequence', 'Generate verifiable execution receipt']
        }
      });
    });

    return patterns;
  }
}

export const store = new Store();
