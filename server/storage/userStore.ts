import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserAccount {
  id: string;
  googleId?: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserGoogleTokens {
  userId: string;
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

class UserStore {
  private dataDir = path.join(process.cwd(), 'server', 'storage', 'data');
  private usersFilePath = path.join(this.dataDir, 'users.json');
  private tokensFilePath = path.join(this.dataDir, 'user_tokens.json');

  private users = new Map<string, UserAccount>();
  private emailToUserId = new Map<string, string>();
  private googleIdToUserId = new Map<string, string>();
  private userTokens = new Map<string, UserGoogleTokens>();

  constructor() {
    this.ensureDir();
    this.hydrate();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private hydrate(): void {
    try {
      if (fs.existsSync(this.usersFilePath)) {
        const raw = fs.readFileSync(this.usersFilePath, 'utf8');
        const list: UserAccount[] = JSON.parse(raw);
        for (const user of list) {
          this.users.set(user.id, user);
          this.emailToUserId.set(user.email.toLowerCase(), user.id);
          if (user.googleId) {
            this.googleIdToUserId.set(user.googleId, user.id);
          }
        }
      }

      if (fs.existsSync(this.tokensFilePath)) {
        const raw = fs.readFileSync(this.tokensFilePath, 'utf8');
        const list: UserGoogleTokens[] = JSON.parse(raw);
        for (const token of list) {
          this.userTokens.set(token.userId, token);
        }
      }
    } catch (err) {
      console.warn('[UserStore] Error hydrating users/tokens:', err);
    }
  }

  private persistUsers(): void {
    try {
      this.ensureDir();
      const list = Array.from(this.users.values());
      fs.writeFileSync(this.usersFilePath, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.warn('[UserStore] Failed to persist users:', err);
    }
  }

  private persistTokens(): void {
    try {
      this.ensureDir();
      const list = Array.from(this.userTokens.values());
      fs.writeFileSync(this.tokensFilePath, JSON.stringify(list, null, 2), 'utf8');
    } catch (err) {
      console.warn('[UserStore] Failed to persist user tokens:', err);
    }
  }

  public findOrCreateUser(data: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
  }): UserAccount {
    const emailKey = data.email.toLowerCase();
    let existingId = this.emailToUserId.get(emailKey);
    if (!existingId && data.googleId) {
      existingId = this.googleIdToUserId.get(data.googleId);
    }

    const now = Date.now();

    if (existingId && this.users.has(existingId)) {
      const existing = this.users.get(existingId)!;
      existing.name = data.name || existing.name;
      existing.avatarUrl = data.avatarUrl || existing.avatarUrl;
      if (data.googleId) existing.googleId = data.googleId;
      existing.updatedAt = now;
      this.persistUsers();
      return existing;
    }

    const userId = 'usr_' + crypto.randomBytes(12).toString('hex');
    const newUser: UserAccount = {
      id: userId,
      googleId: data.googleId,
      email: data.email,
      name: data.name,
      avatarUrl: data.avatarUrl,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(userId, newUser);
    this.emailToUserId.set(emailKey, userId);
    if (data.googleId) {
      this.googleIdToUserId.set(data.googleId, userId);
    }
    this.persistUsers();
    return newUser;
  }

  public getUserById(userId: string): UserAccount | undefined {
    return this.users.get(userId);
  }

  public getUserByEmail(email: string): UserAccount | undefined {
    const userId = this.emailToUserId.get(email.toLowerCase());
    return userId ? this.users.get(userId) : undefined;
  }

  public saveUserTokens(userId: string, tokens: Partial<UserGoogleTokens>): void {
    const existing = this.userTokens.get(userId) || { userId };
    const updated: UserGoogleTokens = {
      ...existing,
      ...tokens,
      userId
    };

    this.userTokens.set(userId, updated);
    this.persistTokens();
  }

  public getUserTokens(userId: string): UserGoogleTokens | undefined {
    return this.userTokens.get(userId);
  }

  public getAllUsers(): UserAccount[] {
    return Array.from(this.users.values());
  }
}

export const userStore = new UserStore();
