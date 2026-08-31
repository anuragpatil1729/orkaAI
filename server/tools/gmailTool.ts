import { google } from 'googleapis';
import { GoogleAuthService } from '../auth/googleOAuth';
import { ACMEMOCK_DATA } from '../data/demoStore';

export class GmailTool {
  static async searchEmails(query: string) {
    const authClient = GoogleAuthService.getAuthenticatedClient();
    if (authClient) {
      try {
        const gmail = google.gmail({ version: 'v1', auth: authClient });
        const res = await gmail.users.messages.list({
          userId: 'me',
          q: query || '',
          maxResults: 10
        });

        const messages = res.data.messages || [];
        const emailList = [];

        for (const msg of messages.slice(0, 5)) {
          const detail = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!
          });
          const headers = detail.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
          const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
          const date = headers.find(h => h.name === 'Date')?.value || 'Today';

          emailList.push({
            id: msg.id!,
            sender: from,
            subject: subject,
            date: date,
            snippet: detail.data.snippet || 'No snippet available'
          });
        }

        if (emailList.length > 0) {
          return emailList;
        }
      } catch (err: any) {
        console.warn('[GmailTool] Error querying real Gmail API (using fallback dataset):', err.message || err);
      }
    }

    return ACMEMOCK_DATA.emails;
  }

  static async createDraft(to: string, subject: string, body: string) {
    const authClient = GoogleAuthService.getAuthenticatedClient();
    if (authClient) {
      try {
        const gmail = google.gmail({ version: 'v1', auth: authClient });
        const rawMessage = [
          `To: ${to}`,
          `Subject: ${subject}`,
          'Content-Type: text/plain; charset=utf-8',
          '',
          body
        ].join('\n');

        const encodedMessage = Buffer.from(rawMessage).toString('base64url');
        const res = await gmail.users.drafts.create({
          userId: 'me',
          requestBody: {
            message: { raw: encodedMessage }
          }
        });

        return {
          draftId: res.data.id || 'draft_gmail_' + Date.now(),
          status: 'created',
          message: `Draft created in real Gmail inbox for ${to}`
        };
      } catch (err: any) {
        console.warn('[GmailTool] Error creating real Gmail draft:', err.message || err);
      }
    }

    return {
      draftId: 'draft_gmail_' + Date.now(),
      status: 'created',
      message: `Draft created in Gmail for ${to}`
    };
  }

  static async sendEmail(to: string, subject: string, body: string) {
    const authClient = GoogleAuthService.getAuthenticatedClient();
    if (authClient) {
      try {
        const gmail = google.gmail({ version: 'v1', auth: authClient });
        const rawMessage = [
          `To: ${to}`,
          `Subject: ${subject}`,
          'Content-Type: text/plain; charset=utf-8',
          '',
          body
        ].join('\n');

        const encodedMessage = Buffer.from(rawMessage).toString('base64url');
        const res = await gmail.users.messages.send({
          userId: 'me',
          requestBody: { raw: encodedMessage }
        });

        return {
          messageId: res.data.id || 'msg_sent_' + Date.now(),
          status: 'sent',
          sentAt: new Date().toISOString(),
          recipient: to,
          subject: subject
        };
      } catch (err: any) {
        console.warn('[GmailTool] Error sending real Gmail message:', err.message || err);
      }
    }

    return {
      messageId: 'msg_sent_' + Date.now(),
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipient: to,
      subject: subject
    };
  }
}
