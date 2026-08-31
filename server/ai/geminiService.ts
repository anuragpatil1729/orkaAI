import { GoogleGenerativeAI } from '@google/generative-ai';
import { INTENT_PARSER_SYSTEM_PROMPT, PLANNER_SYSTEM_PROMPT, BRIEF_GENERATION_PROMPT, EMAIL_DRAFT_PROMPT } from './prompts';
import { IntentParseResult, WorkflowStep, ExecutiveBrief, EmailDraft } from '../../src/types/agent';
import { isValidTool } from '../tools/registry';

const getApiKey = (): string | undefined => {
  return process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ''
    ? process.env.GEMINI_API_KEY
    : undefined;
};

const getModelName = (): string => {
  return process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim() !== ''
    ? process.env.GEMINI_MODEL
    : 'gemini-1.5-flash';
};

export class GeminiService {
  private genAI?: GoogleGenerativeAI;

  constructor() {
    const apiKey = getApiKey();
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  public isConfigured(): boolean {
    return !!getApiKey();
  }

  public getModelName(): string {
    return getModelName();
  }

  async parseIntent(prompt: string): Promise<IntentParseResult> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: getModelName(),
          generationConfig: { responseMimeType: 'application/json' }
        });
        const fullPrompt = `${INTENT_PARSER_SYSTEM_PROMPT}\n\nUser Request: "${prompt}"`;
        const response = await model.generateContent(fullPrompt);
        const text = response.response.text();
        const parsed = JSON.parse(text);
        
        const validActions = Array.isArray(parsed.targetActions)
          ? parsed.targetActions.filter((a: string) => isValidTool(a))
          : ['find_calendar_event', 'search_emails', 'search_drive'];

        return {
          rawPrompt: prompt,
          goal: parsed.goal || `Execute outcome for: ${prompt}`,
          entity: parsed.entity || undefined,
          timeframe: parsed.timeframe || 'today',
          targetActions: validActions.length > 0 ? validActions : ['find_calendar_event', 'search_emails', 'search_drive'],
          isDemoScenario: false
        };
      } catch (err: any) {
        console.warn('[GeminiService] Error during intent parsing:', err.message || err);
      }
    }

    // Tailored intent parsing fallback based on prompt context
    const lowerPrompt = prompt.toLowerCase();
    let targetActions: string[] = [];

    if (lowerPrompt.includes('weather') || lowerPrompt.includes('poem') || lowerPrompt.includes('joke') || lowerPrompt.includes('hello')) {
      targetActions = ['analyze_context', 'generate_brief'];
    } else if (lowerPrompt.includes('calendar') || lowerPrompt.includes('meeting') || lowerPrompt.includes('schedule') || lowerPrompt.includes('agenda')) {
      targetActions = ['find_calendar_event', 'analyze_context', 'generate_brief', 'create_task'];
    } else if (lowerPrompt.includes('email') || lowerPrompt.includes('mail') || lowerPrompt.includes('inbox') || lowerPrompt.includes('message')) {
      targetActions = ['search_emails', 'analyze_context', 'generate_brief', 'create_draft_email', 'send_email'];
    } else if (lowerPrompt.includes('doc') || lowerPrompt.includes('drive') || lowerPrompt.includes('spec') || lowerPrompt.includes('pdf')) {
      targetActions = ['search_drive', 'get_drive_document', 'analyze_context', 'generate_brief', 'create_task'];
    } else {
      targetActions = [
        'find_calendar_event',
        'search_emails',
        'search_drive',
        'analyze_context',
        'generate_brief',
        'create_task'
      ];
    }

    return {
      rawPrompt: prompt,
      goal: `Execute autonomous workflow for: ${prompt}`,
      timeframe: 'today',
      targetActions,
      isDemoScenario: false
    };
  }

  async createPlan(intent: IntentParseResult): Promise<WorkflowStep[]> {
    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: getModelName(),
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${PLANNER_SYSTEM_PROMPT}\n\nGoal: "${intent.goal}"\nTarget Actions: ${JSON.stringify(intent.targetActions)}`;
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const rawSteps = JSON.parse(text);

        if (Array.isArray(rawSteps) && rawSteps.length > 0) {
          const validatedSteps: WorkflowStep[] = [];

          for (let idx = 0; idx < rawSteps.length; idx++) {
            const s = rawSteps[idx];
            // Reject unknown tools strictly
            if (!isValidTool(s.tool)) {
              console.warn(`[GeminiService] Rejecting unknown tool ID "${s.tool}" requested by LLM`);
              continue;
            }
            
            validatedSteps.push({
              id: s.id || `step_${idx + 1}`,
              name: s.name || `Action ${idx + 1}`,
              tool: s.tool,
              description: s.description || 'Executing step',
              risk: s.risk || (s.tool === 'send_email' ? 'HIGH_RISK_WRITE' : 'READ'),
              requiresApproval: s.requiresApproval ?? (s.tool === 'send_email'),
              status: 'pending',
              reasoningSnippet: s.reasoningSnippet || `Executing tool [${s.tool}]`
            });
          }

          if (validatedSteps.length > 0) {
            return validatedSteps;
          }
        }
      } catch (err: any) {
        console.warn('[GeminiService] Error during plan generation:', err.message || err);
      }
    }

    // Generic execution plan based on targetActions
    const steps: WorkflowStep[] = [];
    const actions = intent.targetActions || ['search_emails', 'search_drive', 'analyze_context', 'generate_brief', 'send_email'];

    actions.forEach((tool, idx) => {
      if (isValidTool(tool)) {
        steps.push({
          id: `step_${idx + 1}`,
          name: tool.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          tool: tool,
          description: `Execute tool [${tool}] for goal: ${intent.goal}`,
          risk: tool === 'send_email' ? 'HIGH_RISK_WRITE' : 'READ',
          requiresApproval: tool === 'send_email',
          status: 'pending',
          reasoningSnippet: `Running tool [${tool}]`
        });
      }
    });

    return steps;
  }

  async generateBrief(entity: string | undefined, emailContext: any[], docContext: any[], meetingData?: any, userName?: string): Promise<ExecutiveBrief> {
    const emailsCount = Array.isArray(emailContext) ? emailContext.length : 0;
    const docsCount = Array.isArray(docContext) ? docContext.length : 0;

    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: getModelName(),
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${BRIEF_GENERATION_PROMPT}\n\nEntity: ${entity || 'Workspace'}\nMeeting Data: ${JSON.stringify(meetingData || {})}\nEmails Payload: ${JSON.stringify(emailContext)}\nDocs Payload: ${JSON.stringify(docContext)}`;
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());

        return {
          title: parsed.title || `Executive Briefing: ${entity || 'Workspace Context'}`,
          meetingDetails: {
            title: meetingData?.title || 'Workspace Overview',
            time: meetingData?.startTime || 'Today',
            participants: meetingData?.attendees || [userName || 'Authenticated User'],
            location: meetingData?.location || 'Google Workspace'
          },
          summary: parsed.summary || `Analyzed ${emailsCount} emails and ${docsCount} documents for ${entity || 'workspace context'}.`,
          keyInsights: Array.isArray(parsed.keyInsights) && parsed.keyInsights.length > 0
            ? parsed.keyInsights
            : [`Scanned ${emailsCount} email threads.`, `Analyzed ${docsCount} documents.`],
          unresolvedItems: Array.isArray(parsed.unresolvedItems) && parsed.unresolvedItems.length > 0
            ? parsed.unresolvedItems
            : (emailsCount > 0 ? ['Review recent conversation details.', 'Confirm follow-up items.'] : ['No unresolved items identified.']),
          recommendedActions: Array.isArray(parsed.recommendedActions) && parsed.recommendedActions.length > 0
            ? parsed.recommendedActions
            : ['Send status update email.'],
          emailsAnalyzedCount: emailsCount,
          docsAnalyzedCount: docsCount
        };
      } catch (err: any) {
        console.warn('[GeminiService] Error during brief generation:', err.message || err);
      }
    }

    // Honest structural fallback (strictly dynamic counts, zero fabricated Acme business context)
    return {
      title: entity ? `${entity} Executive Briefing` : 'Workspace Executive Briefing',
      meetingDetails: {
        title: meetingData?.title || 'Workspace Briefing',
        time: meetingData?.startTime || 'Today',
        participants: meetingData?.attendees || [userName || 'Authenticated User'],
        location: meetingData?.location || 'Google Workspace'
      },
      summary: emailsCount > 0 || docsCount > 0
        ? `Analyzed ${emailsCount} emails and ${docsCount} documents for ${entity || 'workspace'}.`
        : 'No emails or documents were found matching this search query.',
      keyInsights: emailsCount > 0
        ? [`Scanned ${emailsCount} relevant email threads.`, `Verified ${docsCount} attached Drive documents.`]
        : ['Workspace search completed with 0 results.'],
      unresolvedItems: emailsCount > 0
        ? ['Review recent conversation details.', 'Confirm follow-up summary.']
        : ['No open commitments found.'],
      recommendedActions: emailsCount > 0
        ? ['Send follow-up response email.']
        : ['Check search query parameters.'],
      emailsAnalyzedCount: emailsCount,
      docsAnalyzedCount: docsCount
    };
  }

  async generateEmailDraft(recipient: string, unresolvedItems: string[], userName?: string): Promise<EmailDraft> {
    const targetRecipient = recipient || 'user@workspace.com';
    const senderName = userName || 'OrkaAI Agent';

    const apiKey = getApiKey();
    if (apiKey && this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: getModelName(),
          generationConfig: { responseMimeType: 'application/json' }
        });
        const prompt = `${EMAIL_DRAFT_PROMPT}\n\nRecipient: ${targetRecipient}\nSender Name: ${senderName}\nUnresolved Items: ${JSON.stringify(unresolvedItems)}`;
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        return {
          id: 'draft_' + Date.now(),
          to: parsed.to || targetRecipient,
          subject: parsed.subject || 'Workspace Updates & Follow-up',
          body: parsed.body || `Hi,\n\nFollowing up with a summary of recent workspace updates.\n\nBest regards,\n${senderName}`,
          rationale: parsed.rationale || 'Addresses outstanding workspace updates.',
          requiresApproval: true,
          status: 'draft'
        };
      } catch (err: any) {
        console.warn('[GeminiService] Error generating email draft:', err.message || err);
      }
    }

    const recipientName = targetRecipient.includes('@') ? targetRecipient.split('@')[0] : 'there';
    const formattedItems = Array.isArray(unresolvedItems) && unresolvedItems.length > 0
      ? unresolvedItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n')
      : '1. Review workspace updates.';

    return {
      id: 'draft_' + Date.now(),
      to: targetRecipient,
      subject: 'Workspace Status Update & Follow-up',
      body: `Hi ${recipientName},

Following up on our recent workspace conversation. Here is a summary of open items:

${formattedItems}

Please let me know if you have any questions or updates!

Best regards,
${senderName}`,
      rationale: 'Summarizes workspace context and unresolved items for recipient.',
      requiresApproval: true,
      status: 'draft'
    };
  }
}

export const geminiService = new GeminiService();
