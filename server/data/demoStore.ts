import { AcmeMockData } from '../../src/types/tools';
import { AutomationRule, DiscoveredPattern } from '../../src/types/automations';
import { ActivityLogItem } from '../../src/types/activity';

export const ACMEMOCK_DATA: AcmeMockData = {
  meeting: {
    id: 'evt_acme_101',
    title: 'Acme Corp × Product Integration & Strategy Sync',
    company: 'Acme Corp',
    startTime: 'Tomorrow, 11:00 AM',
    endTime: 'Tomorrow, 12:00 PM',
    attendees: [
      'rahul.sharma@acmecorp.com (VP of Product)',
      'sarah.chen@acmecorp.com (Lead Architect)',
      'alex.v@actionos.ai (You)'
    ],
    location: 'Google Meet (meet.google.com/acme-sync)'
  },
  emails: [
    {
      id: 'em_101',
      sender: 'rahul.sharma@acmecorp.com',
      recipient: 'alex.v@actionos.ai',
      subject: 'Re: Acme Integration Rollout Timeline & API Specs',
      snippet: 'Hi Alex, looking forward to tomorrow. We need to lock down the OAuth redirect flows and confirm the production rate limits before signing off...',
      body: 'Hi Alex,\n\nLooking forward to our sync tomorrow at 11 AM.\n\nOur architecture team reviewed your proposed integration spec. Overall it looks solid, but we have 3 critical questions before moving forward:\n1. Confirm the final deployment date for the enterprise tier.\n2. Send over updated OAuth API documentation for our security team.\n3. Resolve the token refresh authentication question raised in last week\'s security audit.\n\nAlso, happy to share that our executive committee approved the pricing tier discussion from Tuesday!\n\nBest,\nRahul Sharma\nVP of Product, Acme Corp',
      date: 'Yesterday 4:15 PM'
    },
    {
      id: 'em_102',
      sender: 'sarah.chen@acmecorp.com',
      recipient: 'alex.v@actionos.ai',
      subject: 'Acme Auth Token Refresh Rate Limits',
      snippet: 'Hey Alex, quick note regarding the security audit. If we issue 10k sub-tokens per hour, will your gateway throttle or queue them?',
      body: 'Hey Alex,\n\nQuick note for tomorrow\'s meeting agenda: We want to verify if your rate limiter gracefully handles burst refreshes during peak morning syncs.\n\nLooking forward to closing the loop on this.\n\n- Sarah',
      date: '2 days ago'
    },
    {
      id: 'em_103',
      sender: 'finance@acmecorp.com',
      recipient: 'alex.v@actionos.ai',
      subject: 'Acme SLA Agreement & Enterprise Terms',
      snippet: 'Confirmed: 99.99% uptime guarantee included in revised Schedule B...',
      body: 'Hi Alex,\n\nAttached is the executed SLA agreement. Enterprise SLA terms are finalized.',
      date: '3 days ago'
    }
  ],
  documents: [
    {
      id: 'doc_201',
      title: 'Acme Corp Integration Requirements & API Mapping v2.4.docx',
      type: 'Google Doc',
      lastModified: '3 days ago',
      summary: 'Comprehensive specification outlining OAuth 2.0 scopes, webhook subscriptions, rate limiting policies, and enterprise SLA commitments for Acme Corp.'
    },
    {
      id: 'doc_202',
      title: 'Acme Q3 Commercial Terms & Pricing Agreement.pdf',
      type: 'PDF / Drive',
      lastModified: '5 days ago',
      summary: 'Signed commercial term sheet confirming $48,000/yr enterprise tier subscription with annual billing.'
    },
    {
      id: 'doc_203',
      title: 'Security Audit & Compliance Signoff - Acme.pdf',
      type: 'PDF / Drive',
      lastModified: '1 week ago',
      summary: 'SOC2 Type II sign-off report with conditional approval pending token refresh policy confirmation.'
    }
  ]
};

export const INITIAL_AUTOMATIONS: AutomationRule[] = [
  {
    id: 'auto_1',
    title: 'Invoice Processing Assistant',
    description: 'Extract vendor details, verify total under threshold, and record in financial sheet.',
    trigger: 'Routine invoice email arrives',
    condition: 'Amount < ₹50,000',
    actions: ['Extract invoice PDF', 'Verify line items', 'Update expense log', 'Draft payment confirmation'],
    active: true,
    executionsCount: 24,
    approvalsRequiredCount: 0,
    category: 'invoice'
  },
  {
    id: 'auto_2',
    title: 'Meeting Briefing Generator',
    description: 'Auto-compile participant history, Gmail context, and Drive attachments 30 mins prior to external meetings.',
    trigger: '30 mins before external meeting',
    condition: 'Attendees count > 1',
    actions: ['Fetch calendar details', 'Search Gmail thread history', 'Summarize open commitments', 'Deliver briefing notification'],
    active: true,
    executionsCount: 18,
    approvalsRequiredCount: 0,
    category: 'meeting'
  },
  {
    id: 'auto_3',
    title: 'Inbox Triage & VIP Dispatch',
    description: 'Categorize incoming emails, flag urgent requests from key accounts, and draft intelligent follow-ups.',
    trigger: 'New unread email from priority domain',
    condition: 'Sender domain in VIP list',
    actions: ['Analyze urgency', 'Generate AI draft', 'Create task item', 'Notify in ActionOS'],
    active: false,
    executionsCount: 5,
    approvalsRequiredCount: 2,
    category: 'inbox'
  }
];

export const DISCOVERED_PATTERN: DiscoveredPattern = {
  id: 'pattern_inv_17',
  title: 'Frequent Manual Invoice Workflow Detected',
  description: "You've manually processed 17 invoice emails from recurring vendors under ₹50,000 this month. ActionOS can automate this end-to-end.",
  occurrences: 17,
  suggestedWorkflow: {
    when: 'Invoice email arrives from trusted vendor',
    if: 'Invoice amount is below ₹50,000',
    do: [
      'Extract invoice metadata & line items',
      'Update accounting spreadsheet',
      'Create task in ERP system',
      'Send receipt acknowledgment email'
    ]
  }
};

export const INITIAL_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act_101',
    timestamp: '09:42 AM',
    timeFormatted: 'Today at 09:42 AM',
    dateGroup: 'Today',
    goal: 'Prepare me for my Acme meeting tomorrow',
    actionsCount: 12,
    status: 'Completed',
    execution: {
      id: 'exec_demo_past',
      prompt: 'Prepare me for my Acme meeting tomorrow',
      mode: 'COPILOT',
      status: 'completed',
      steps: [],
      createdAt: '2026-08-31T09:42:00Z',
      reasoningLog: []
    }
  },
  {
    id: 'act_102',
    timestamp: '09:10 AM',
    timeFormatted: 'Today at 09:10 AM',
    dateGroup: 'Today',
    goal: 'Process 4 routine vendor invoices',
    actionsCount: 8,
    status: 'Completed',
    execution: {
      id: 'exec_past_2',
      prompt: 'Process 4 routine vendor invoices',
      mode: 'AUTOPILOT',
      status: 'completed',
      steps: [],
      createdAt: '2026-08-31T09:10:00Z',
      reasoningLog: []
    }
  },
  {
    id: 'act_103',
    timestamp: '5:31 PM',
    timeFormatted: 'Yesterday at 5:31 PM',
    dateGroup: 'Yesterday',
    goal: 'Summarize Q3 Product Roadmap feedback and create action items',
    actionsCount: 6,
    status: 'Completed',
    execution: {
      id: 'exec_past_3',
      prompt: 'Summarize Q3 Product Roadmap feedback and create action items',
      mode: 'COPILOT',
      status: 'completed',
      steps: [],
      createdAt: '2026-08-30T17:31:00Z',
      reasoningLog: []
    }
  }
];
