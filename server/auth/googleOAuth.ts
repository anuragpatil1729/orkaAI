import { google } from 'googleapis';

let storedTokens: any = null;

const getOAuth2Client = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

  if (!clientId || !clientSecret || clientId === 'your_google_client_id_here') {
    return null;
  }

  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  if (storedTokens) {
    client.setCredentials(storedTokens);
  }
  return client;
};

export class GoogleAuthService {
  static isConfigured(): boolean {
    return !!getOAuth2Client();
  }

  static isAuthorized(): boolean {
    return !!storedTokens;
  }

  static getAuthenticatedClient() {
    const client = getOAuth2Client();
    if (client && storedTokens) {
      return client;
    }
    return null;
  }

  static getAuthUrl(): string | null {
    const client = getOAuth2Client();
    if (!client) return null;

    const scopes = [
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
    storedTokens = tokens;
    client.setCredentials(tokens);
    return tokens;
  }
}
