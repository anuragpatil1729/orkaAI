import { WorkflowExecution } from './agent';

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  timeFormatted: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  goal: string;
  actionsCount: number;
  status: 'Completed' | 'Failed' | 'In Progress';
  execution: WorkflowExecution;
}
