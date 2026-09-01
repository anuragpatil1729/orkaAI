import { google } from 'googleapis';
import { userStore } from '../storage/userStore';

const getOAuth2Client = (tokens?: any) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

  if (!clientId || !clientSecret || clientId === 'your_google_client_id_here') {
    return null;
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  if (tokens) {
    client.setCredentials(tokens);
  }
  return client;
};

export class GoogleAuthService {
  static isConfigured(): boolean {
    return !!getOAuth2Client();
  }

  static getAuthenticatedClientForUser(userId?: string) {
    if (!userId) return null;
    const userTokens = userStore.getUserTokens(userId);
    if (!userTokens || !userTokens.access_token) return null;

    const client = getOAuth2Client(userTokens);
    return client;
  }

  static getAuthenticatedClient() {
    // Legacy fallback: check if any user has tokens
    const users = userStore.getAllUsers();
    for (const u of users) {
      const client = this.getAuthenticatedClientForUser(u.id);
      if (client) return client;
    }
    return null;
  }

  static getAuthUrl(): string | null {
    const client = getOAuth2Client();
    if (!client) return null;

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ];

    return client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  static async handleCallback(code: string) {
    const client = getOAuth2Client();
    if (!client) throw new Error('OAuth credentials not configured');

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    return { tokens, client };
  }
}
