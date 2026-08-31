import { ACMEMOCK_DATA } from '../data/demoStore';

export class GmailTool {
  static async searchEmails(query: string) {
    // If real Google OAuth token is configured on request, can call googleapis gmail API
    // Otherwise return rich mock data
    return ACMEMOCK_DATA.emails;
  }

  static async createDraft(to: string, subject: string, body: string) {
    return {
      draftId: 'draft_gmail_' + Date.now(),
      status: 'created',
      message: `Draft created in Gmail for ${to}`
    };
  }

  static async sendEmail(to: string, subject: string, body: string) {
    return {
      messageId: 'msg_sent_' + Date.now(),
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipient: to,
      subject: subject
    };
  }
}
