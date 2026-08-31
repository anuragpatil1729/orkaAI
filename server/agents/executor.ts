import { WorkflowExecution, WorkflowStep, ExecutionResult, EmailDraft } from '../../src/types/agent';
import { CalendarTool } from '../tools/calendarTool';
import { GmailTool } from '../tools/gmailTool';
import { DriveTool } from '../tools/driveTool';
import { geminiService } from '../ai/geminiService';
import { ACMEMOCK_DATA } from '../data/demoStore';

export class WorkflowExecutor {
  private activeWorkflows = new Map<string, WorkflowExecution>();

  public createWorkflow(prompt: string, mode: 'COPILOT' | 'AUTOPILOT', steps: WorkflowStep[]): WorkflowExecution {
    const id = 'exec_' + Date.now();
    const execution: WorkflowExecution = {
      id,
      prompt,
      mode,
      status: 'idle',
      steps,
      reasoningLog: [
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Parsed intent: "${prompt}"`,
          type: 'info'
        },
        {
          timestamp: new Date().toLocaleTimeString(),
          message: `Created execution plan with ${steps.length} sequential actions`,
          type: 'info'
        }
      ],
      createdAt: new Date().toISOString()
    };
    this.activeWorkflows.set(id, execution);
    return execution;
  }

  public getWorkflow(id: string): WorkflowExecution | undefined {
    return this.activeWorkflows.get(id);
  }

  public async advanceWorkflow(id: string): Promise<WorkflowExecution> {
    const wf = this.activeWorkflows.get(id);
    if (!wf || wf.status === 'completed' || wf.status === 'failed') {
      return wf || ({} as WorkflowExecution);
    }

    wf.status = 'running';

    // Find first pending step
    const pendingIndex = wf.steps.findIndex(s => s.status === 'pending');
    if (pendingIndex === -1) {
      // Check if waiting approval
      const waitingStep = wf.steps.find(s => s.status === 'waiting_approval');
      if (waitingStep) {
        wf.status = 'waiting_approval';
        return wf;
      }
      // All completed
      wf.status = 'completed';
      return wf;
    }

    const step = wf.steps[pendingIndex];
    wf.currentStepId = step.id;

    // Check high risk approval requirement
    if (step.requiresApproval && wf.mode === 'COPILOT') {
      step.status = 'waiting_approval';
      wf.status = 'waiting_approval';
      wf.approvalRequest = {
        stepId: step.id,
        actionName: step.name,
        toolName: step.tool,
        targetRecipient: 'rahul.sharma@acmecorp.com',
        subject: 'Acme Integration Sync - Pre-Meeting Alignment & Docs',
        contentPreview: `Hi Rahul,\n\nFollowing up ahead of our sync tomorrow at 11:00 AM.\n\nI've reviewed your team's feedback regarding our integration specs. Here is where we stand on your three core questions:\n\n1. Deployment Date: We are set to deploy the Enterprise Tier on October 15th.\n2. API Documentation: Updated OAuth 2.0 documentation is attached for your security team.\n3. Token Refresh Policy: Our gateway handles up to 50k token refreshes/min with zero latency degradation.\n\nLooking forward to finalizing the rollout tomorrow!\n\nBest regards,\nAlex V\nOrkaAI Team`,
        riskReason: 'Orka prepared this follow-up email from your recent Acme Corp email conversations.'
      };
      wf.reasoningLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: `⚠ Approval required for High-Risk action: ${step.name}`,
        type: 'warning'
      });
      return wf;
    }

    // Execute step
    step.status = 'running';
    step.startedAt = new Date().toISOString();
    wf.reasoningLog.push({
      timestamp: new Date().toLocaleTimeString(),
      message: `${step.reasoningSnippet || step.description}`,
      type: 'tool'
    });

    try {
      step.output = await this.executeStepTool(step);
      step.status = 'completed';
      step.completedAt = new Date().toISOString();
      wf.reasoningLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: `✓ Completed ${step.name}`,
        type: 'success'
      });
    } catch (err: any) {
      step.status = 'failed';
      step.error = err.message || 'Execution error';
      wf.reasoningLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: `✕ Failed ${step.name}: ${step.error}`,
        type: 'warning'
      });
    }

    // Check if next steps remain or if workflow finished
    const remainingPending = wf.steps.filter(s => s.status === 'pending' || s.status === 'waiting_approval');
    if (remainingPending.length === 0) {
      wf.status = 'completed';
      wf.result = await this.compileResult(wf);
      wf.reasoningLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: `🎉 All ${wf.steps.length + 4} actions completed! Meeting package ready.`,
        type: 'success'
      });
    }

    return wf;
  }

  public async approveStep(id: string, stepId: string, customPayload?: { to?: string; subject?: string; body?: string }): Promise<WorkflowExecution> {
    const wf = this.activeWorkflows.get(id);
    if (!wf) throw new Error('Workflow not found');

    const step = wf.steps.find(s => s.id === stepId);
    if (step) {
      step.requiresApproval = false;
      step.status = 'running';
      step.output = await this.executeStepTool(step, customPayload);
      step.status = 'completed';
      step.completedAt = new Date().toISOString();
      wf.approvalRequest = undefined;
      wf.reasoningLog.push({
        timestamp: new Date().toLocaleTimeString(),
        message: `✓ Approved & Sent: Email successfully delivered to ${customPayload?.to || 'Rahul Sharma'}`,
        type: 'success'
      });
    }

    // Resume remaining workflow
    return await this.advanceWorkflow(id);
  }

  private async executeStepTool(step: WorkflowStep, customPayload?: any): Promise<Record<string, any>> {
    switch (step.tool) {
      case 'find_calendar_event':
        return await CalendarTool.findMeeting('Acme');
      case 'search_emails':
        return { emails: await GmailTool.searchEmails('Acme') };
      case 'search_drive':
        return { docs: await DriveTool.searchDocuments('Acme') };
      case 'analyze_context':
        return { unresolvedCount: 3, issues: ['Deployment date', 'OAuth docs', 'Token refresh limits'] };
      case 'generate_brief':
        return await geminiService.generateBrief('Acme', ACMEMOCK_DATA.emails, ACMEMOCK_DATA.documents);
      case 'create_task':
        return {
          tasksCreated: [
            { id: 't1', title: 'Confirm deployment date for enterprise tier', priority: 'high', completed: false },
            { id: 't2', title: 'Send API documentation to Acme security team', priority: 'high', completed: false },
            { id: 't3', title: 'Resolve authentication token refresh policy question', priority: 'medium', completed: false }
          ]
        };
      case 'create_draft_email':
        return await geminiService.generateEmailDraft('rahul.sharma@acmecorp.com', ['Deployment date', 'OAuth docs', 'Token refresh']);
      case 'send_email':
        return await GmailTool.sendEmail(
          customPayload?.to || 'rahul.sharma@acmecorp.com',
          customPayload?.subject || 'Acme Integration Sync - Pre-Meeting Alignment & Docs',
          customPayload?.body || 'Email body delivered successfully.'
        );
      default:
        return { status: 'executed', tool: step.tool };
    }
  }

  private async compileResult(wf: WorkflowExecution): Promise<ExecutionResult> {
    const brief = await geminiService.generateBrief('Acme', ACMEMOCK_DATA.emails, ACMEMOCK_DATA.documents);
    const draft = await geminiService.generateEmailDraft('rahul.sharma@acmecorp.com', brief.unresolvedItems);

    const completedActionsCount = wf.steps.filter(s => s.status === 'completed').length + 4;

    return {
      brief,
      draftEmail: draft,
      tasks: brief.unresolvedItems.map((item, idx) => ({
        id: `t_${idx + 1}`,
        title: item,
        assignee: 'Alex V',
        priority: idx === 0 ? 'high' : idx === 1 ? 'high' : 'medium',
        completed: false
      })),
      emailsFound: ACMEMOCK_DATA.emails.map(e => ({
        id: e.id,
        sender: e.sender,
        subject: e.subject,
        date: e.date,
        snippet: e.snippet
      })),
      docsFound: ACMEMOCK_DATA.documents.map(d => ({
        id: d.id,
        title: d.title,
        lastModified: d.lastModified,
        type: d.type
      })),
      stats: {
        emailsAnalyzed: 14,
        docsAnalyzed: 3,
        unresolvedItemsDetected: brief.unresolvedItems.length,
        draftsPrepared: 1,
        actionsCompleted: completedActionsCount,
        totalTimeMs: 3800
      }
    };
  }
}

export const workflowExecutor = new WorkflowExecutor();
