import { ToolDefinition } from '../../src/types/tools';
import { RiskLevel } from '../../src/types/agent';

export interface ExtendedToolDefinition extends ToolDefinition {
  whyExplanation: string;
}

export const TOOL_REGISTRY: Record<string, ExtendedToolDefinition> = {
  find_calendar_event: {
    id: 'find_calendar_event',
    name: 'Find Calendar Event',
    category: 'calendar',
    description: 'Searches user calendar for upcoming events matching query, contact, or company name.',
    riskLevel: 'READ',
    whyExplanation: 'Your request requires verifying upcoming meeting time, topic, and attendee details.',
    parameters: {
      query: { type: 'string', description: 'Event title or partner company name', required: true },
      timeframe: { type: 'string', description: 'Time range, e.g. "tomorrow", "this week"', required: false }
    }
  },
  search_emails: {
    id: 'search_emails',
    name: 'Search Gmail Messages',
    category: 'gmail',
    description: 'Searches Gmail inbox for messages matching contact, domain, or subject keywords.',
    riskLevel: 'READ',
    whyExplanation: 'Recent email conversations contain critical commitment context and unresolved questions.',
    parameters: {
      query: { type: 'string', description: 'Email address, subject, or domain search query', required: true },
      maxResults: { type: 'number', description: 'Maximum emails to retrieve', required: false }
    }
  },
  get_email_thread: {
    id: 'get_email_thread',
    name: 'Get Email Thread Content',
    category: 'gmail',
    description: 'Fetches full body text and attachments metadata of specific email threads.',
    riskLevel: 'READ',
    whyExplanation: 'Extracts detailed technical feedback from primary email conversation thread.',
    parameters: {
      threadId: { type: 'string', description: 'Gmail thread ID', required: true }
    }
  },
  search_drive: {
    id: 'search_drive',
    name: 'Search Google Drive Files',
    category: 'drive',
    description: 'Searches Google Drive documents, specs, PDFs, and spreadsheets matching query.',
    riskLevel: 'READ',
    whyExplanation: 'Project specifications and term sheets in Drive contain required compliance details.',
    parameters: {
      query: { type: 'string', description: 'File name or content keywords', required: true }
    }
  },
  get_drive_document: {
    id: 'get_drive_document',
    name: 'Read Drive Document Content',
    category: 'drive',
    description: 'Extracts full content or summary from specified Google Drive document.',
    riskLevel: 'READ',
    whyExplanation: 'Cross-references active API rate limits and SLA commitments in attached PDF doc.',
    parameters: {
      documentId: { type: 'string', description: 'Drive file ID', required: true }
    }
  },
  analyze_context: {
    id: 'analyze_context',
    name: 'AI Context & Commitments Analyzer',
    category: 'ai',
    description: 'Analyzes combined emails, meeting invites, and documents to synthesize unresolved items.',
    riskLevel: 'READ',
    whyExplanation: 'Synthesizes emails and docs to isolate unresolved commitments ahead of meeting.',
    parameters: {
      contextData: { type: 'object', description: 'Combined raw content payload', required: true }
    }
  },
  generate_brief: {
    id: 'generate_brief',
    name: 'Generate Executive Briefing',
    category: 'ai',
    description: 'Compiles structured meeting brief with agenda, background context, and key decisions.',
    riskLevel: 'LOW_RISK_WRITE',
    whyExplanation: 'Compiles executive briefing package so you go into the meeting fully prepared.',
    parameters: {
      entity: { type: 'string', description: 'Target company or meeting topic', required: true }
    }
  },
  create_task: {
    id: 'create_task',
    name: 'Create Task Item',
    category: 'tasks',
    description: 'Adds an outstanding task item to user task manager.',
    riskLevel: 'LOW_RISK_WRITE',
    whyExplanation: 'Auto-queues open action items directly into your productivity task queue.',
    parameters: {
      title: { type: 'string', description: 'Task title', required: true },
      priority: { type: 'string', description: 'Task priority (low, medium, high)', required: false }
    }
  },
  create_draft_email: {
    id: 'create_draft_email',
    name: 'Create Draft Email',
    category: 'gmail',
    description: 'Creates a draft email in user Gmail draft folder for review before sending.',
    riskLevel: 'LOW_RISK_WRITE',
    whyExplanation: 'Prepares alignment email draft addressing 3 unresolved questions.',
    parameters: {
      to: { type: 'string', description: 'Recipient email address', required: true },
      subject: { type: 'string', description: 'Email subject line', required: true },
      body: { type: 'string', description: 'Email body text', required: true }
    }
  },
  send_email: {
    id: 'send_email',
    name: 'Send Email',
    category: 'gmail',
    description: 'Sends an email message directly to external recipients.',
    riskLevel: 'HIGH_RISK_WRITE',
    whyExplanation: 'Transmitting external email to client contacts requires explicit human sign-off.',
    parameters: {
      to: { type: 'string', description: 'Recipient email address', required: true },
      subject: { type: 'string', description: 'Email subject line', required: true },
      body: { type: 'string', description: 'Email body text', required: true }
    }
  }
};

/**
 * Deterministic Policy Engine:
 * Security policy is enforced by code, NOT by LLM recommendation.
 */
export class ActionPolicyEngine {
  static requiresHumanApproval(toolId: string, mode: 'COPILOT' | 'AUTOPILOT'): boolean {
    const tool = TOOL_REGISTRY[toolId];
    if (!tool) return true;

    // HIGH_RISK_WRITE ALWAYS requires approval in Copilot mode
    if (tool.riskLevel === 'HIGH_RISK_WRITE') {
      return mode === 'COPILOT';
    }

    return false;
  }

  static getWhyExplanation(toolId: string): string {
    const tool = TOOL_REGISTRY[toolId];
    return tool?.whyExplanation || 'Required to complete user outcome goal.';
  }
}

export function isValidTool(toolId: string): boolean {
  return toolId in TOOL_REGISTRY;
}

export function validateToolParams(toolId: string, params?: Record<string, any>): { valid: boolean; reason?: string } {
  const tool = TOOL_REGISTRY[toolId];
  if (!tool) {
    return { valid: false, reason: `Tool [${toolId}] is not registered in allowlist.` };
  }
  return { valid: true };
}
