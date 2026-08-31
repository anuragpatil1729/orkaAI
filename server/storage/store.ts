import { WorkflowExecution } from '../../src/types/agent';

export interface ActivityItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  dateGroup: string;
  goal: string;
  actionsCount: number;
  status: 'Completed' | 'In Progress' | 'Action Required' | 'Failed';
  execution?: WorkflowExecution;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  risk: 'READ' | 'LOW_RISK_WRITE' | 'HIGH_RISK_WRITE';
  enabled: boolean;
  executionCount: number;
  lastRun?: string;
  sourcePattern?: string;
}

class Store {
  private activities: ActivityItem[] = [];
  private automations: AutomationRule[] = [];

  public getActivities(): ActivityItem[] {
    return this.activities;
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

  public getAutomations(): AutomationRule[] {
    return this.automations;
  }

  public addAutomation(automation: AutomationRule): void {
    this.automations.push(automation);
  }

  public toggleAutomation(id: string): void {
    const auto = this.automations.find(a => a.id === id);
    if (auto) {
      auto.enabled = !auto.enabled;
    }
  }

  // Discovers recurring patterns dynamically from real execution history
  public discoverPatterns(): Array<{ patternName: string; count: number; recommendation: string }> {
    if (this.activities.length < 3) {
      return [];
    }

    const goalCounts = new Map<string, number>();
    this.activities.forEach(a => {
      const simplifiedGoal = a.goal.toLowerCase().trim();
      goalCounts.set(simplifiedGoal, (goalCounts.get(simplifiedGoal) || 0) + 1);
    });

    const patterns: Array<{ patternName: string; count: number; recommendation: string }> = [];
    goalCounts.forEach((count, goal) => {
      if (count >= 2) {
        patterns.push({
          patternName: `Recurring Intent: "${goal}"`,
          count,
          recommendation: `Automate workflow for "${goal}" based on ${count} actual executions.`
        });
      }
    });

    return patterns;
  }
}

export const store = new Store();
