import { ToolDefinition } from '../../src/types/tools';

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  find_calendar_event: {
    id: 'find_calendar_event',
    name: 'Find Calendar Event',
    category: 'calendar',
    description: 'Searches user calendar for upcoming events matching query, contact, or company name.',
    riskLevel: 'READ',
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
    parameters: {
      entity: { type: 'string', description: 'Target company or meeting topic', required: true }
    }
  },
  create_task: {
    id: 'create_task',
    name: 'Create Task Item',
    category: 'tasks',
    description: 'Adds an outstanding task item to user task queue.',
    riskLevel: 'LOW_RISK_WRITE',
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
    parameters: {
      to: { type: 'string', description: 'Recipient email address', required: true },
      subject: { type: 'string', description: 'Email subject line', required: true },
      body: { type: 'string', description: 'Email body text', required: true }
    }
  }
};
