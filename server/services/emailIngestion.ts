import { GoogleWorkspaceDataProvider } from '../providers/workspaceProvider';
import { GoogleAuthService } from '../auth/googleOAuth';
import { emailTaskStore, EmailTaskItem } from '../storage/emailTaskStore';
import { EmailClassifier } from '../agents/emailClassifier';

export class EmailIngestionService {
  /**
   * Extracts embedded URLs (including GitHub repository links) from raw email text
   */
  public static extractUrls(text: string): string[] {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s<>"{}|\\^`]+)/gi;
    const matches = text.match(urlRegex) || [];
    // Clean trailing punctuation
    return Array.from(new Set(matches.map(u => u.replace(/[.,;!)]+$/, ''))));
  }

  public static async scanIncomingEmails(userId?: string): Promise<EmailTaskItem[]> {
    const authClient = GoogleAuthService.getAuthenticatedClientForUser(userId) || GoogleAuthService.getAuthenticatedClient();
    const provider = new GoogleWorkspaceDataProvider(authClient);
    const emails = await provider.searchEmails('is:unread OR label:inbox');

    const newTasks: EmailTaskItem[] = [];

    for (const email of emails) {
      if (emailTaskStore.isProcessed(userId, email.id)) continue;

      const rawBody = email.body || email.snippet || '';
      const extractedLinks = this.extractUrls(rawBody);

      const classification = await EmailClassifier.classifyEmail(
        email.sender,
        email.subject,
        rawBody,
        extractedLinks
      );

      const task: EmailTaskItem = {
        id: 'task_email_' + email.id,
        userId,
        emailId: email.id,
        threadId: (email as any).threadId,
        sender: email.sender,
        recipient: email.recipient,
        subject: email.subject,
        receivedAt: email.date || new Date().toISOString(),
        bodySnippet: email.snippet || '',
        actionable: classification.actionable,
        summary: classification.summary,
        requestedAction: classification.requestedAction,
        priority: classification.priority,
        technicalTask: classification.technicalTask,
        category: classification.category,
        repositoryUrls: classification.repositoryUrls,
        repositoryHint: classification.repositoryHint,
        confidence: classification.confidence,
        status: classification.actionable ? 'NEW' : 'REJECTED',
        proposedPlan: classification.proposedPlan,
        createdAt: new Date().toISOString(),
        links: extractedLinks
      };

      emailTaskStore.addTask(task);
      if (task.actionable) {
        newTasks.push(task);
      }
    }

    return newTasks;
  }
}
