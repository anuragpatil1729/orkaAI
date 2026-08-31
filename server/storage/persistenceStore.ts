import fs from 'fs';
import path from 'path';
import { EmailTaskItem } from './emailTaskStore';

export interface ExecutionReceiptItem {
  receiptId: string;
  taskId: string;
  originalRequest: string;
  sender: string;
  repository: string;
  branch: string;
  commitSha: string;
  filesChangedCount: number;
  testsPassed: boolean;
  buildPassed: boolean;
  status: string;
  prUrl?: string;
  draftEmailId?: string;
  completedAt: string;
}

class PersistenceStore {
  private dataDir = path.join(process.cwd(), 'server', 'storage', 'data');
  private tasksFilePath = path.join(this.dataDir, 'email_tasks.json');
  private receiptsFilePath = path.join(this.dataDir, 'execution_receipts.json');

  constructor() {
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  public saveTasks(tasks: EmailTaskItem[]): void {
    try {
      this.ensureDir();
      fs.writeFileSync(this.tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
    } catch (err) {
      console.warn('[PersistenceStore] Failed to save tasks:', err);
    }
  }

  public loadTasks(): EmailTaskItem[] {
    try {
      if (fs.existsSync(this.tasksFilePath)) {
        const raw = fs.readFileSync(this.tasksFilePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[PersistenceStore] Failed to load tasks:', err);
    }
    return [];
  }

  public saveReceipt(receipt: ExecutionReceiptItem): void {
    try {
      this.ensureDir();
      const receipts = this.loadReceipts();
      receipts.unshift(receipt);
      fs.writeFileSync(this.receiptsFilePath, JSON.stringify(receipts, null, 2), 'utf8');
    } catch (err) {
      console.warn('[PersistenceStore] Failed to save receipt:', err);
    }
  }

  public loadReceipts(): ExecutionReceiptItem[] {
    try {
      if (fs.existsSync(this.receiptsFilePath)) {
        const raw = fs.readFileSync(this.receiptsFilePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[PersistenceStore] Failed to load receipts:', err);
    }
    return [];
  }
}

export const persistenceStore = new PersistenceStore();
