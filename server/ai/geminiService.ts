import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTENT_PARSER_SYSTEM_PROMPT, PLANNER_SYSTEM_PROMPT, BRIEF_GENERATION_PROMPT, EMAIL_DRAFT_PROMPT } from './prompts';
import { IntentParseResult, WorkflowStep, ExecutiveBrief, EmailDraft } from '../../src/types/agent';
import { ACMEMOCK_DATA } from '../data/demoStore';

const getApiKey = (): string | undefined => {
  return process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
    ? process.env.GEMINI_API_KEY
    : undefined;
};

export class GeminiService {
  private genAI?: GoogleGenerativeAI;
  private modelName = 'gemini-1.5-flash';

  constructor() {
    const apiKey = getApiKey();
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  public isConfigured(): boolean {
    return !!getApiKey();
  }

  async parseIntent(prompt: string): Promise<IntentParseResult> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const fullPrompt = `${INTENT_PARSER_SYSTEM_PROMPT}\n\nUser Prompt: "${prompt}"`;
        const response = await model.generateContent(fullPrompt);
        const text = response.response.text();
        const parsed = JSON.parse(text);
        return {
          rawPrompt: prompt,
          goal: parsed.goal || `Process request: ${prompt}`,
          entity: parsed.entity || (prompt.toLowerCase().includes('acme') ? 'Acme' : undefined),
          timeframe: parsed.timeframe || 'tomorrow',
          targetActions: parsed.targetActions || ['find_calendar_event', 'search_emails', 'search_drive'],
          isDemoScenario: prompt.toLowerCase().includes('acme')
        };
      } catch (err) {
        console.warn('[GeminiService] Fallback to structured intent parser:', err);
      }
    }

    // High quality fallback / Demo Mode parser
    const isAcme = prompt.toLowerCase().includes('acme');
    return {
      rawPrompt: prompt,
      goal: isAcme
        ? 'Prepare comprehensive meeting package, brief, open items analysis, and follow-up draft for Acme meeting'
        : `Execute autonomous workflow for: ${prompt}`,
      entity: isAcme ? 'Acme' : 'Workspace',
      timeframe: 'tomorrow',
      targetActions: [
        'find_calendar_event',
        'search_emails',
        'search_drive',
        'analyze_context',
        'generate_brief',
        'create_tasks',
        'draft_followup_email'
      ],
      isDemoScenario: isAcme
    };
  }

  async createPlan(intent: IntentParseResult): Promise<WorkflowStep[]> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${PLANNER_SYSTEM_PROMPT}\n\nGoal: "${intent.goal}"\nTarget Actions: ${JSON.stringify(intent.targetActions)}`;
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const steps = JSON.parse(text);
        if (Array.isArray(steps) && steps.length > 0) {
          return steps.map((s, idx) => ({
            id: s.id || `step_${idx + 1}`,
            name: s.name || `Action ${idx + 1}`,
            tool: s.tool || 'analyze_context',
            description: s.description || 'Executing step',
            risk: s.risk || 'READ',
            requiresApproval: s.requiresApproval ?? (s.risk === 'HIGH_RISK_WRITE'),
            status: 'pending',
            reasoningSnippet: s.reasoningSnippet || 'Analyzing contextual requirements'
          }));
        }
      } catch (err) {
        console.warn('[GeminiService] Fallback to standard planner:', err);
      }
    }

    // Default canonical workflow execution plan for Hackathon Demo
    return [
      {
        id: 'step_1',
        name: 'Find Calendar Event',
        tool: 'find_calendar_event',
        description: 'Locate upcoming Acme sync meeting & attendees on Google Calendar',
        risk: 'READ',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Searching upcoming calendar events for Acme Corp sync tomorrow'
      },
      {
        id: 'step_2',
        name: 'Search Gmail History',
        tool: 'search_emails',
        description: 'Scan recent email threads for Acme commitment updates',
        risk: 'READ',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Scanning recent Acme Corp conversation threads for unresolved questions'
      },
      {
        id: 'step_3',
        name: 'Search Drive Documents',
        tool: 'search_drive',
        description: 'Retrieve Acme specs, term sheets, & compliance docs from Google Drive',
        risk: 'READ',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Locating modified integration specs and pricing sheets in Google Drive'
      },
      {
        id: 'step_4',
        name: 'Analyze Commitments & Gaps',
        tool: 'analyze_context',
        description: 'Synthesize 14 emails & 3 documents to detect unresolved items',
        risk: 'READ',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Cross-referencing email threads with Drive specs to detect 3 unresolved items'
      },
      {
        id: 'step_5',
        name: 'Generate Executive Brief',
        tool: 'generate_brief',
        description: 'Compile structured meeting briefing with agenda and background',
        risk: 'LOW_RISK_WRITE',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Building executive meeting brief with summary and key insights'
      },
      {
        id: 'step_6',
        name: 'Create Action Tasks',
        tool: 'create_task',
        description: 'Queue 3 outstanding action items into user task manager',
        risk: 'LOW_RISK_WRITE',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Auto-creating 3 structured tasks for deployment, docs, and auth'
      },
      {
        id: 'step_7',
        name: 'Draft Follow-Up Email',
        tool: 'create_draft_email',
        description: 'Prepare pre-meeting alignment email for Acme VP of Product',
        risk: 'LOW_RISK_WRITE',
        requiresApproval: false,
        status: 'pending',
        reasoningSnippet: 'Drafting clear follow-up email addressing unresolved questions for Rahul Sharma'
      },
      {
        id: 'step_8',
        name: 'Send Follow-Up Email',
        tool: 'send_email',
        description: 'Transmit confirmation email to Rahul Sharma at Acme Corp',
        risk: 'HIGH_RISK_WRITE',
        requiresApproval: true,
        status: 'pending',
        reasoningSnippet: 'High-risk action: Sending external email requires explicit human sign-off'
      }
    ];
  }

  async generateBrief(entity: string, emailContext: any[], docContext: any[]): Promise<ExecutiveBrief> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${BRIEF_GENERATION_PROMPT}\n\nEntity: ${entity}\nEmails: ${JSON.stringify(emailContext)}\nDocs: ${JSON.stringify(docContext)}`;
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        return {
          title: parsed.title || `Executive Brief: ${entity} Sync`,
          meetingDetails: {
            title: ACMEMOCK_DATA.meeting.title,
            time: ACMEMOCK_DATA.meeting.startTime,
            participants: ACMEMOCK_DATA.meeting.attendees,
            location: ACMEMOCK_DATA.meeting.location
          },
          summary: parsed.summary || 'Acme Corp integration is progressing smoothly with pricing finalized. Technical deployment timeline and security sign-off remain key priorities.',
          keyInsights: parsed.keyInsights || [
            'Pricing discussion resolved at $48,000/yr enterprise tier.',
            'SOC2 Type II sign-off completed conditionally.',
            'Engineering team ready for API rollout.'
          ],
          unresolvedItems: parsed.unresolvedItems || [
            'Confirm target deployment date for enterprise tier.',
            'Send updated OAuth API documentation to security team.',
            'Resolve token refresh authentication rate limits question.'
          ],
          recommendedActions: parsed.recommendedActions || [
            'Share finalized deployment roadmap during 11 AM sync.',
            'Attach OAuth specs to pre-meeting email.'
          ],
          emailsAnalyzedCount: 14,
          docsAnalyzedCount: 3
        };
      } catch (err) {
        console.warn('[GeminiService] Fallback for brief generation:', err);
      }
    }

    return {
      title: 'Acme Corp Executive Briefing',
      meetingDetails: {
        title: ACMEMOCK_DATA.meeting.title,
        time: ACMEMOCK_DATA.meeting.startTime,
        participants: ACMEMOCK_DATA.meeting.attendees,
        location: ACMEMOCK_DATA.meeting.location
      },
      summary: 'Acme Corp is waiting for final API integration deployment confirmation. Commercial pricing of $48,000/yr has been fully resolved and signed.',
      keyInsights: [
        'Commercial pricing agreement signed ($48k/yr enterprise tier).',
        'Engineering team reviewed integration spec v2.4.',
        'SLA 99.99% uptime commitment confirmed in Schedule B.'
      ],
      unresolvedItems: [
        'Confirm enterprise tier deployment date.',
        'Send updated OAuth 2.0 API documentation.',
        'Resolve authentication token refresh policy question.'
      ],
      recommendedActions: [
        'Review token refresh rate limits with Lead Architect Sarah Chen.',
        'Send pre-meeting alignment email to VP Rahul Sharma.'
      ],
      emailsAnalyzedCount: 14,
      docsAnalyzedCount: 3
    };
  }

  async generateEmailDraft(recipient: string, unresolvedItems: string[]): Promise<EmailDraft> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: this.modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${EMAIL_DRAFT_PROMPT}\n\nRecipient: ${recipient}\nUnresolved Items: ${JSON.stringify(unresolvedItems)}`;
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        return {
          id: 'draft_' + Date.now(),
          to: parsed.to || 'rahul.sharma@acmecorp.com',
          subject: parsed.subject || 'Acme Integration Sync - Pre-Meeting Brief & OAuth Docs',
          body: parsed.body || `Hi Rahul,\n\nFollowing up ahead of our meeting tomorrow at 11 AM...\n\nBest,\nAlex`,
          rationale: parsed.rationale || 'Addresses 3 outstanding technical audit points.',
          requiresApproval: true,
          status: 'draft'
        };
      } catch (err) {
        console.warn('[GeminiService] Fallback email draft:', err);
      }
    }

    return {
      id: 'draft_acme_101',
      to: 'rahul.sharma@acmecorp.com',
      subject: 'Acme Integration Sync - Pre-Meeting Alignment & Docs',
      body: `Hi Rahul,

Following up ahead of our sync tomorrow at 11:00 AM. 

I've reviewed your team's feedback regarding our integration specs. Here is where we stand on your three core questions:

1. Deployment Date: We are set to deploy the Enterprise Tier on October 15th.
2. API Documentation: Updated OAuth 2.0 documentation is attached for your security team.
3. Token Refresh Policy: Our gateway handles up to 50k token refreshes/min with zero latency degradation.

Looking forward to finalizing the rollout tomorrow!

Best regards,
Alex V
ActionOS Team`,
      rationale: 'Addresses all 3 unresolved items identified in previous email threads before the 11 AM meeting.',
      requiresApproval: true,
      status: 'draft'
    };
  }
}

export const geminiService = new GeminiService();
