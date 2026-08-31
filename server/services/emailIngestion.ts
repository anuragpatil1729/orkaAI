import { GoogleWorkspaceDataProvider } from '../providers/workspaceProvider';
import { GoogleAuthService } from '../auth/googleOAuth';
import { emailTaskStore, EmailTaskItem } from '../storage/emailTaskStore';
import { EmailClassifier } from '../agents/emailClassifier';

export class EmailIngestionService {
  public static async scanIncomingEmails(): Promise<EmailTaskItem[]> {
    const authClient = GoogleAuthService.getAuthenticatedClient();
    const provider = new GoogleWorkspaceDataProvider(authClient);
    const emails = await provider.searchEmails('is:unread OR label:inbox');

    const newTasks: EmailTaskItem[] = [];

    for (const email of emails) {
      if (emailTaskStore.isProcessed(email.id)) continue;

      const classification = await EmailClassifier.classifyEmail(
        email.sender,
        email.subject,
        email.snippet || email.body || ''
      );

      const task: EmailTaskItem = {
        id: 'task_email_' + email.id,
        emailId: email.id,
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
        repositoryHint: classification.repositoryHint,
        confidence: classification.confidence,
        status: classification.actionable ? 'NEW' : 'REJECTED',
        proposedPlan: classification.proposedPlan,
        createdAt: new Date().toISOString()
      };

      emailTaskStore.addTask(task);
      if (task.actionable) {
        newTasks.push(task);
      }
    }

    return newTasks;
  }
}
