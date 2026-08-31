export type RiskLevel = 'READ' | 'LOW_RISK_WRITE' | 'HIGH_RISK_WRITE';

export type StepStatus = 'pending' | 'running' | 'completed' | 'waiting_approval' | 'failed' | 'skipped';

export interface WorkflowStep {
  id: string;
  name: string;
  tool: string; // e.g. 'find_calendar_event', 'search_emails', 'search_drive', 'generate_brief', 'draft_email', 'send_email'
  description: string;
  risk: RiskLevel;
  requiresApproval: boolean;
  status: StepStatus;
  input?: Record<string, any>;
  output?: Record<string, any>;
  reasoningSnippet?: string; // safe user-facing reasoning explanation
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface IntentParseResult {
  rawPrompt: string;
  goal: string;
  entity?: string; // e.g. "Acme"
  timeframe?: string; // e.g. "tomorrow"
  targetActions: string[];
  isDemoScenario: boolean;
}

export interface ExecutiveBrief {
  title: string;
  meetingDetails: {
    title: string;
    time: string;
    participants: string[];
    location?: string;
  };
  summary: string;
  keyInsights: string[];
  unresolvedItems: string[];
  recommendedActions: string[];
  emailsAnalyzedCount: number;
  docsAnalyzedCount: number;
}

export interface EmailDraft {
  id: string;
  to: string;
  subject: string;
  body: string;
  rationale: string;
  requiresApproval: boolean;
  status: 'draft' | 'approved' | 'sent' | 'cancelled';
}

export interface TaskItem {
  id: string;
  title: string;
  assignee?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface ExecutionResult {
  brief: ExecutiveBrief;
  draftEmail?: EmailDraft;
  tasks: TaskItem[];
  emailsFound: Array<{
    id: string;
    sender: string;
    subject: string;
    date: string;
    snippet: string;
  }>;
  docsFound: Array<{
    id: string;
    title: string;
    lastModified: string;
    type: string;
    link?: string;
  }>;
  stats: {
    emailsAnalyzed: number;
    docsAnalyzed: number;
    unresolvedItemsDetected: number;
    draftsPrepared: number;
    actionsCompleted: number;
    totalTimeMs: number;
  };
}

export interface WorkflowExecution {
  id: string;
  prompt: string;
  mode: 'COPILOT' | 'AUTOPILOT';
  status: 'idle' | 'running' | 'waiting_approval' | 'completed' | 'failed';
  currentStepId?: string;
  steps: WorkflowStep[];
  approvalRequest?: {
    stepId: string;
    actionName: string;
    toolName: string;
    targetRecipient?: string;
    subject?: string;
    contentPreview: string;
    riskReason: string;
  };
  result?: ExecutionResult;
  reasoningLog: Array<{
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'tool';
  }>;
  createdAt: string;
}
