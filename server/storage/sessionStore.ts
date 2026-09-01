import crypto from 'crypto';

export interface UserSession {
  sessionId: string;
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
  expiresAt: number;
}

class SessionStore {
  private sessions = new Map<string, UserSession>();

  // Default session TTL: 24 hours
  private readonly defaultTTL = 24 * 60 * 60 * 1000;

  public createSession(userData: {
    userId?: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): UserSession {
    const sessionId = 'sess_' + crypto.randomBytes(24).toString('hex');
    const now = Date.now();
    const session: UserSession = {
      sessionId,
      userId: userData.userId || 'usr_' + crypto.randomBytes(12).toString('hex'),
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.avatarUrl,
      createdAt: now,
      expiresAt: now + this.defaultTTL
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  public getSession(sessionId: string): UserSession | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  public invalidateSession(sessionId: string): boolean {
    if (!sessionId) return false;
    return this.sessions.delete(sessionId);
  }

  public clearAllSessions(): void {
    this.sessions.clear();
  }
}

export const sessionStore = new SessionStore();
