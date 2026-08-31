import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';

export interface RepositoryMetadata {
  name: string;
  owner: string;
  defaultBranch: string;
  isPrivate: boolean;
  language: string;
  files: string[];
  workspacePath?: string;
  remoteUrl?: string;
}

export interface CommitResult {
  branch: string;
  commitSha: string;
  filesChanged: string[];
  message: string;
  pushed: boolean;
}

export interface PullRequestResult {
  prNumber: number;
  prUrl: string;
}

export class GitHubIntegrationNotConfiguredError extends Error {
  constructor(message = 'GitHub integration not configured: GITHUB_TOKEN is required to push branches and open pull requests.') {
    super(message);
    this.name = 'GitHubIntegrationNotConfiguredError';
  }
}

export class GitHubToolService {
  private static workspaceRoot = process.cwd();
  private static cloneRoot = path.join(os.tmpdir(), 'orkaai-coding-workspaces');
  private static activeWorkspaceByTarget = new Map<string, string>();

  public static parseRepoUrl(url?: string): { owner: string; repo: string } | null {
    if (!url) return null;
    const match = url.match(/github\.com[:/]([^/\s]+)\/([^/\s#?]+?)(?:\.git)?(?:[\s#?].*)?$/i);
    if (match) {
      return { owner: match[1], repo: match[2].replace(/\.git$/i, '') };
    }
    return null;
  }

  private static runGit(args: string, cwd: string): string {
    return execSync(`git ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  }

  private static targetKey(targetUrl?: string): string {
    return targetUrl || this.workspaceRoot;
  }

  public static getWorkspacePath(targetUrl?: string): string {
    const existing = this.activeWorkspaceByTarget.get(this.targetKey(targetUrl));
    return existing || this.workspaceRoot;
  }

  private static authenticatedTargetUrl(targetUrl: string): string {
    if (!process.env.GITHUB_TOKEN || !targetUrl.includes('github.com')) return targetUrl;
    return targetUrl.replace(/^https:\/\/github\.com\//i, `https://x-access-token:${process.env.GITHUB_TOKEN}@github.com/`);
  }

  private static gitIdentity(): { email: string; name: string } {
    const actor = process.env.GITHUB_ACTOR?.trim();
    return {
      email: actor ? `${actor}@users.noreply.github.com` : 'orka-agent@orkaai.dev',
      name: actor || 'OrkaAI Agent'
    };
  }

  private static configureWorkspaceGitIdentity(workspace: string): void {
    const identity = this.gitIdentity();
    this.runGit(`config user.email ${JSON.stringify(identity.email)}`, workspace);
    this.runGit(`config user.name ${JSON.stringify(identity.name)}`, workspace);
  }

  private static ensureWorkspace(targetUrl?: string): string {
    if (!targetUrl) return this.workspaceRoot;
    const key = this.targetKey(targetUrl);
    const existing = this.activeWorkspaceByTarget.get(key);
    if (existing && fs.existsSync(path.join(existing, '.git'))) return existing;

    fs.mkdirSync(this.cloneRoot, { recursive: true });
    const safe = Buffer.from(key).toString('base64url').slice(0, 32);
    const clonePath = fs.mkdtempSync(path.join(this.cloneRoot, `${safe}-`));
    const cloneUrl = this.authenticatedTargetUrl(targetUrl);
    execSync(`git clone ${JSON.stringify(cloneUrl)} ${JSON.stringify(clonePath)}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    if (cloneUrl !== targetUrl) {
      this.runGit(`remote set-url origin ${JSON.stringify(cloneUrl)}`, clonePath);
    }
    this.configureWorkspaceGitIdentity(clonePath);
    this.activeWorkspaceByTarget.set(key, clonePath);
    return clonePath;
  }

  public static async inspectRepository(targetUrl?: string): Promise<RepositoryMetadata> {
    const workspace = this.ensureWorkspace(targetUrl);
    const parsed = this.parseRepoUrl(targetUrl);
    const name = parsed?.repo || path.basename(workspace);
    const owner = parsed?.owner || (targetUrl ? 'local' : 'anuragpatil1729');
    let defaultBranch = 'main';
    try {
      defaultBranch = this.runGit('symbolic-ref --short refs/remotes/origin/HEAD', workspace).replace('origin/', '') || 'main';
    } catch {
      try { defaultBranch = this.runGit('branch --show-current', workspace) || 'main'; } catch {}
    }
    let files: string[] = [];
    try {
      files = this.runGit('ls-files', workspace).split('\n').filter(Boolean).slice(0, 200);
    } catch {
      files = fs.readdirSync(workspace).filter(f => !f.startsWith('.'));
    }
    return { name, owner, defaultBranch, isPrivate: false, language: 'Codebase', files, workspacePath: workspace, remoteUrl: targetUrl };
  }

  public static async createBranch(taskKey: string, targetUrl?: string): Promise<string> {
    const workspace = this.ensureWorkspace(targetUrl);
    const sanitized = taskKey.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().replace(/^_+|_+$/g, '') || 'task';
    const branchName = `orka/task/${sanitized}-${Date.now().toString(36)}`;
    this.runGit(`checkout -b ${JSON.stringify(branchName)}`, workspace);
    return branchName;
  }

  public static applyFileModifications(filesToModify: Array<{ filePath: string; content: string }>, targetUrl?: string): string[] {
    const workspace = this.ensureWorkspace(targetUrl);
    const changed: string[] = [];
    for (const item of filesToModify) {
      const normalized = path.normalize(item.filePath);
      if (path.isAbsolute(normalized) || normalized.startsWith('..')) {
        throw new Error(`Refusing to write outside repository workspace: ${item.filePath}`);
      }
      const absolute = path.join(workspace, normalized);
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, item.content, 'utf8');
      changed.push(normalized);
    }
    return changed;
  }

  public static async getGitDiff(targetUrl?: string): Promise<string> {
    const workspace = this.getWorkspacePath(targetUrl);
    return execSync('git diff -- . && git diff --cached -- .', { cwd: workspace, encoding: 'utf8' });
  }

  public static async commitAndPush(message: string, branchName: string, targetUrl?: string, push = true): Promise<CommitResult> {
    const workspace = this.ensureWorkspace(targetUrl);
    this.configureWorkspaceGitIdentity(workspace);
    this.runGit('add -A', workspace);
    const filesChanged = this.runGit('diff --cached --name-only', workspace).split('\n').filter(Boolean);
    if (filesChanged.length === 0) throw new Error('No repository changes to commit.');
    this.runGit(`commit -m ${JSON.stringify(message)}`, workspace);
    const commitSha = this.runGit('rev-parse HEAD', workspace);
    if (push) {
      if (!process.env.GITHUB_TOKEN && targetUrl?.includes('github.com')) throw new GitHubIntegrationNotConfiguredError();
      this.runGit(`push -u origin ${JSON.stringify(branchName)}`, workspace);
    }
    return { branch: branchName, commitSha, filesChanged, message, pushed: push };
  }

  public static async createPullRequest(targetUrl: string | undefined, title: string, body: string, branchName: string, base = 'main'): Promise<PullRequestResult> {
    const parsed = this.parseRepoUrl(targetUrl);
    if (!parsed) throw new Error('Cannot create a GitHub pull request without a valid GitHub repository URL.');
    if (!process.env.GITHUB_TOKEN) throw new GitHubIntegrationNotConfiguredError();
    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/pulls`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, head: branchName, base })
    });
    if (!res.ok) throw new Error(`GitHub pull request creation failed (${res.status}): ${await res.text()}`);
    const prData = await res.json();
    return { prNumber: prData.number, prUrl: prData.html_url };
  }
}
