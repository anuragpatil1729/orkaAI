import { WorkspaceDataProvider } from '../providers/workspaceProvider';

export class GmailTool {
  static async searchEmails(provider: WorkspaceDataProvider, query: string) {
    return await provider.searchEmails(query);
  }

  static async createDraft(provider: WorkspaceDataProvider, to: string, subject: string, body: string) {
    return await provider.createEmailDraft(to, subject, body);
  }

  static async sendEmail(provider: WorkspaceDataProvider, to: string, subject: string, body: string) {
    return await provider.sendEmail(to, subject, body);
  }
}
