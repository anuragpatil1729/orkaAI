import { google } from 'googleapis';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  connected: boolean;
}

export interface CalendarEventData {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  location?: string;
  attendees: string[];
  meetingLink?: string;
  description?: string;
}

export interface EmailMessageData {
  id: string;
  sender: string;
  recipient?: string;
  subject: string;
  date: string;
  snippet: string;
  body?: string;
}

export interface DriveDocumentData {
  id: string;
  title: string;
  type: string;
  lastModified: string;
  summary?: string;
  content?: string;
}

export interface WorkspaceDataProvider {
  getUserProfile(): Promise<UserProfile>;
  findCalendarEvents(query: string): Promise<CalendarEventData[]>;
  searchEmails(query: string): Promise<EmailMessageData[]>;
  searchDrive(query: string): Promise<DriveDocumentData[]>;
  getDriveDocument(docId: string): Promise<DriveDocumentData | null>;
  createEmailDraft(to: string, subject: string, body: string): Promise<{ draftId: string; status: string; message: string }>;
  sendEmail(to: string, subject: string, body: string): Promise<{ messageId: string; status: string; sentAt: string; recipient: string; subject: string }>;
}

export class GoogleWorkspaceDataProvider implements WorkspaceDataProvider {
  constructor(private authClient: any) {}

  async getUserProfile(): Promise<UserProfile> {
    if (this.authClient) {
      try {
        const oauth2 = google.oauth2({ version: 'v2', auth: this.authClient });
        const userInfo = await oauth2.userinfo.get();
        if (userInfo.data.email) {
          return {
            name: userInfo.data.name || userInfo.data.email.split('@')[0],
            email: userInfo.data.email,
            avatarUrl: userInfo.data.picture || undefined,
            connected: true
          };
        }
      } catch (err: any) {
        console.warn('[GoogleWorkspaceDataProvider] Error fetching user profile:', err.message || err);
      }
    }

    return {
      name: 'Unauthenticated User',
      email: 'not_connected@workspace.com',
      connected: false
    };
  }

  async findCalendarEvents(query: string): Promise<CalendarEventData[]> {
    if (!this.authClient) return [];

    try {
      const calendar = google.calendar({ version: 'v3', auth: this.authClient });
      const now = new Date().toISOString();
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now,
        q: query || undefined,
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = res.data.items || [];
      return events.map(e => ({
        id: e.id || 'evt_' + Math.random().toString(36).substring(7),
        title: e.summary || 'Untitled Event',
        startTime: e.start?.dateTime || e.start?.date || new Date().toISOString(),
        endTime: e.end?.dateTime || e.end?.date || undefined,
        location: e.location || 'Google Calendar',
        attendees: (e.attendees || []).map(a => a.email || a.displayName || '').filter(Boolean),
        meetingLink: e.hangoutLink || e.htmlLink || undefined,
        description: e.description || undefined
      }));
    } catch (err: any) {
      console.warn('[GoogleWorkspaceDataProvider] Error querying Calendar API:', err.message || err);
      return [];
    }
  }

  async searchEmails(query: string): Promise<EmailMessageData[]> {
    if (!this.authClient) return [];

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.authClient });
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query || '',
        maxResults: 10
      });

      const messages = res.data.messages || [];
      const emailList: EmailMessageData[] = [];

      for (const msg of messages.slice(0, 5)) {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id!
        });
        const headers = detail.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const from = headers.find(h => h.name === 'From')?.value || 'Unknown Sender';
        const to = headers.find(h => h.name === 'To')?.value || undefined;
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();

        emailList.push({
          id: msg.id!,
          sender: from,
          recipient: to,
          subject: subject,
          date: date,
          snippet: detail.data.snippet || 'No snippet content'
        });
      }

      return emailList;
    } catch (err: any) {
      console.warn('[GoogleWorkspaceDataProvider] Error querying Gmail API:', err.message || err);
      return [];
    }
  }

  async searchDrive(query: string): Promise<DriveDocumentData[]> {
    if (!this.authClient) return [];

    try {
      const drive = google.drive({ version: 'v3', auth: this.authClient });
      const res = await drive.files.list({
        pageSize: 10,
        fields: 'files(id, name, mimeType, modifiedTime)',
        q: query ? `name contains '${query}'` : undefined
      });

      const files = res.data.files || [];
      return files.map(f => ({
        id: f.id || 'doc_' + Math.random().toString(36).substring(7),
        title: f.name || 'Untitled Document',
        type: f.mimeType?.includes('pdf') ? 'PDF' : f.mimeType?.includes('spreadsheet') ? 'Spreadsheet' : 'Document',
        lastModified: f.modifiedTime || new Date().toISOString(),
        summary: `Google Drive file (${f.mimeType || 'file'})`
      }));
    } catch (err: any) {
      console.warn('[GoogleWorkspaceDataProvider] Error querying Drive API:', err.message || err);
      return [];
    }
  }

  async getDriveDocument(docId: string): Promise<DriveDocumentData | null> {
    if (!this.authClient) return null;

    try {
      const drive = google.drive({ version: 'v3', auth: this.authClient });
      const res = await drive.files.get({
        fileId: docId,
        fields: 'id, name, mimeType, modifiedTime, description'
      });

      return {
        id: res.data.id || docId,
        title: res.data.name || 'Untitled Document',
        type: res.data.mimeType || 'Document',
        lastModified: res.data.modifiedTime || new Date().toISOString(),
        summary: res.data.description || 'Google Drive File'
      };
    } catch (err: any) {
      console.warn('[GoogleWorkspaceDataProvider] Error getting Drive document:', err.message || err);
      return null;
    }
  }

  async createEmailDraft(to: string, subject: string, body: string) {
    if (!this.authClient) {
      throw new Error('Google Workspace account not connected. Please connect your Google account to create email drafts.');
    }

    const gmail = google.gmail({ version: 'v1', auth: this.authClient });
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
      draftId: res.data.id || 'draft_' + Date.now(),
      status: 'created',
      message: `Draft created in real Gmail inbox for ${to}`
    };
  }

  async sendEmail(to: string, subject: string, body: string) {
    if (!this.authClient) {
      throw new Error('Google Workspace account not connected. Please connect your Google account to send emails.');
    }

    const gmail = google.gmail({ version: 'v1', auth: this.authClient });
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
      messageId: res.data.id || 'msg_' + Date.now(),
      status: 'sent',
      sentAt: new Date().toISOString(),
      recipient: to,
      subject: subject
    };
  }
}

export function getWorkspaceProvider(authClient?: any): WorkspaceDataProvider {
  return new GoogleWorkspaceDataProvider(authClient);
}
