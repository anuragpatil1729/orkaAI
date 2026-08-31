import { persistenceStore, ExecutionReceiptItem } from './persistenceStore';

export interface EmailTaskItem {
  id: string;
  emailId: string;
  threadId?: string;
  messageId?: string;
  sender: string;
  recipient?: string;
  subject: string;
  receivedAt: string;
  bodySnippet: string;
  actionable: boolean;
  summary: string;
  requestedAction: string;
  priority: 'high' | 'medium' | 'low';
  technicalTask: boolean;
  category: 'CODING' | 'PRODUCTIVITY' | 'COMMUNICATION' | 'DOCUMENT' | 'CALENDAR' | 'OTHER' | 'NONE';
  repositoryUrls: string[];
  repositoryHint?: string;
  confidence: number;
  status: 'NEW' | 'ACTIONABLE' | 'WAITING_APPROVAL' | 'EXECUTING' | 'TESTING' | 'COMMITTED' | 'PUSHED' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  proposedPlan: string[];
  executionId?: string;
  receipt?: ExecutionReceiptItem;
  createdAt: string;
  links?: string[];
}

class EmailTaskStore {
  private tasks = new Map<string, EmailTaskItem>();
  private processedEmailIds = new Set<string>();

  constructor() {
    this.hydrateFromPersistence();
  }

  private hydrateFromPersistence(): void {
    const saved = persistenceStore.loadTasks();
    for (const task of saved) {
      this.tasks.set(task.id, task);
      this.processedEmailIds.add(task.emailId);
    }
  }

  private persist(): void {
    persistenceStore.saveTasks(Array.from(this.tasks.values()));
  }

  public isProcessed(emailId: string): boolean {
    return this.processedEmailIds.has(emailId);
  }

  public addTask(task: EmailTaskItem): EmailTaskItem {
    this.tasks.set(task.id, task);
    this.processedEmailIds.add(task.emailId);
    this.persist();
    return task;
  }

  public getTask(id: string): EmailTaskItem | undefined {
    return this.tasks.get(id);
  }

  public getAllTasks(): EmailTaskItem[] {
    return Array.from(this.tasks.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getActionableTasks(): EmailTaskItem[] {
    return this.getAllTasks().filter(t => t.actionable);
  }

  public updateTaskStatus(
    id: string,
    status: EmailTaskItem['status'],
    executionId?: string,
    receipt?: ExecutionReceiptItem
  ): EmailTaskItem | null {
    const task = this.tasks.get(id);
    if (!task) return null;

    task.status = status;
    if (executionId) task.executionId = executionId;
    if (receipt) {
      task.receipt = receipt;
      persistenceStore.saveReceipt(receipt);
    }
    this.persist();
    return task;
  }

  public clear(): void {
    this.tasks.clear();
    this.processedEmailIds.clear();
    this.persist();
  }
}

export const emailTaskStore = new EmailTaskStore();
