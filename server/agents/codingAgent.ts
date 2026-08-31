import fs from 'fs';
import path from 'path';
import { GitHubToolService, RepositoryMetadata, CommitResult, GitHubIntegrationNotConfiguredError } from '../tools/githubTool';
import { CommandPolicyEngine } from '../security/commandPolicyEngine';

export interface CodingTaskResult {
  repository: RepositoryMetadata;
  branchName: string;
  filesModified: string[];
  testsPassed: boolean;
  typecheckPassed: boolean;
  buildPassed: boolean;
  diffSummary: string;
  commitResult?: CommitResult;
  prUrl?: string;
  status: 'COMPLETED' | 'FAILED' | 'NOT_CONFIGURED';
  error?: string;
  auditLogs: Array<{ timestamp: string; message: string; type: 'info' | 'success' | 'warning' }>;
}

export class CodingAgent {
  private static detectVerificationCommands(workspacePath: string): string[] {
    const pkgPath = path.join(workspacePath, 'package.json');
    if (!fs.existsSync(pkgPath)) return [];
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { scripts?: Record<string, string> };
    const scripts = pkg.scripts || {};
    return ['typecheck', 'test', 'build'].filter(script => scripts[script]).map(script => script === 'test' ? 'npm test' : `npm run ${script}`);
  }

  public static async executeCodingTask(
    taskGoal: string,
    targetRepoUrl?: string,
    filesToModify?: Array<{ filePath: string; content: string }>,
    customCommitMessage?: string
  ): Promise<CodingTaskResult> {
    const logs: Array<{ timestamp: string; message: string; type: 'info' | 'success' | 'warning' }> = [];
    const now = () => new Date().toLocaleTimeString();
    const githubTarget = Boolean(targetRepoUrl && GitHubToolService.parseRepoUrl(targetRepoUrl));

    logs.push({ timestamp: now(), message: `Initializing Autonomous Coding Agent for: "${taskGoal}"`, type: 'info' });

    try {
      if (githubTarget && !process.env.GITHUB_TOKEN) {
        throw new GitHubIntegrationNotConfiguredError();
      }

      const repo = await GitHubToolService.inspectRepository(targetRepoUrl);
      logs.push({ timestamp: now(), message: `Inspected target repository [${repo.owner}/${repo.name}] (${repo.files.length} tracked files)`, type: 'info' });

      const taskKey = taskGoal.substring(0, 24).replace(/\s+/g, '-');
      const branchName = await GitHubToolService.createBranch(taskKey, targetRepoUrl);
      logs.push({ timestamp: now(), message: `Created isolated task branch [${branchName}]`, type: 'success' });

      let modifications = filesToModify || [];
      if (modifications.length === 0) {
        modifications = [{
          filePath: 'gui.py',
          content: `# gui.py - Tkinter Graphical User Interface for Calculator Project\nimport tkinter as tk\nfrom tkinter import messagebox\nfrom calc import add, subtract, multiply, divide\n\nclass CalculatorGUI:\n    def __init__(self, root):\n        self.root = root\n        self.root.title("Python Calculator GUI")\n        self.root.geometry("320x420")\n        self.result_var = tk.StringVar(value="0")\n        \n        # Display screen\n        entry = tk.Entry(root, textvariable=self.result_var, font=("Inter", 20), justify="right", bd=10)\n        entry.pack(fill="both", expand=True, padding=10)\n        \n        # Keypad buttons\n        buttons = [\n            ['7', '8', '9', '/'],\n            ['4', '5', '6', '*'],\n            ['1', '2', '3', '-'],\n            ['C', '0', '=', '+']\n        ]\n        for row in buttons:\n            frame = tk.Frame(root)\n            frame.pack(fill="both", expand=True)\n            for char in row:\n                btn = tk.Button(frame, text=char, font=("Inter", 16), command=lambda c=char: self.on_click(c))\n                btn.pack(side="left", fill="both", expand=True)\n\n    def on_click(self, char):\n        if char == "C":\n            self.result_var.set("0")\n        elif char == "=":\n            try:\n                self.result_var.set(str(eval(self.result_var.get())))\n            except Exception:\n                self.result_var.set("Error")\n        else:\n            curr = self.result_var.get()\n            if curr == "0":\n                self.result_var.set(char)\n            else:\n                self.result_var.set(curr + char)\n\nif __name__ == "__main__":\n    root = tk.Tk()\n    app = CalculatorGUI(root)\n    root.mainloop()\n`
        }];
      }

      const modifiedFiles = GitHubToolService.applyFileModifications(modifications, targetRepoUrl);
      modifiedFiles.forEach(filePath => logs.push({ timestamp: now(), message: `Modified file [${filePath}]`, type: 'info' }));

      logs.push({ timestamp: now(), message: 'Running target repository verification commands...', type: 'info' });
      const workspacePath = GitHubToolService.getWorkspacePath(targetRepoUrl);
      const commands = this.detectVerificationCommands(workspacePath);
      let typecheckPassed = true;
      let testsPassed = true;
      let buildPassed = true;
      for (const command of commands) {
        const result = CommandPolicyEngine.executeWhitelistedCommand(command, workspacePath);
        const passed = result.exitCode === 0;
        if (command.includes('typecheck')) typecheckPassed = passed;
        if (command.includes('test')) testsPassed = passed;
        if (command.includes('build')) buildPassed = passed;
        logs.push({ timestamp: now(), message: passed ? `✓ ${command} passed in target repository` : `✕ ${command} failed: ${result.reason || result.output || 'unknown error'}`, type: passed ? 'success' : 'warning' });
      }

      const diff = await GitHubToolService.getGitDiff(targetRepoUrl);
      const diffSummary = diff.length > 500 ? diff.substring(0, 500) + '... [TRUNCATED]' : diff;
      logs.push({ timestamp: now(), message: `Reviewed git diff (${diff.length} bytes)`, type: 'info' });

      const commitMsg = customCommitMessage || `feat: ${taskGoal.substring(0, 60)}`;
      const shouldPush = githubTarget;
      const commitResult = await GitHubToolService.commitAndPush(commitMsg, branchName, targetRepoUrl, shouldPush);
      logs.push({ timestamp: now(), message: `Created git commit [${commitResult.commitSha}] on branch [${branchName}]`, type: 'success' });

      let prUrl: string | undefined;
      if (githubTarget) {
        const pr = await GitHubToolService.createPullRequest(targetRepoUrl, commitMsg, `## Summary\n${taskGoal}\n\n## Verification\n${commands.map(c => `- ${c}`).join('\n') || '- No package verification scripts found'}`, branchName, repo.defaultBranch);
        prUrl = pr.prUrl;
        logs.push({ timestamp: now(), message: `Opened Pull Request #${pr.prNumber} at ${pr.prUrl}`, type: 'success' });
      }

      return { repository: repo, branchName, filesModified: modifiedFiles, testsPassed, typecheckPassed, buildPassed, diffSummary, commitResult, prUrl, status: 'COMPLETED', auditLogs: logs };
    } catch (err: any) {
      const notConfigured = err instanceof GitHubIntegrationNotConfiguredError;
      logs.push({ timestamp: now(), message: err.message, type: 'warning' });
      return { repository: { name: 'unknown', owner: 'unknown', defaultBranch: 'main', isPrivate: false, language: 'unknown', files: [] }, branchName: '', filesModified: [], testsPassed: false, typecheckPassed: false, buildPassed: false, diffSummary: '', status: notConfigured ? 'NOT_CONFIGURED' : 'FAILED', error: err.message, auditLogs: logs };
    }
  }
}
