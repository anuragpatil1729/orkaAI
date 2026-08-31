import { execSync } from 'child_process';

export interface CommandPolicyResult {
  allowed: boolean;
  reason?: string;
  output?: string;
  exitCode?: number;
}

export class CommandPolicyEngine {
  // Whitelisted command patterns for testing, building, and git inspection
  private static allowedCommands = [
    /^npm\s+run\s+typecheck$/i,
    /^npm\s+run\s+build$/i,
    /^npm\s+test$/i,
    /^npm\s+run\s+test:server$/i,
    /^git\s+status$/i,
    /^git\s+diff(\s+.*)?$/i,
    /^flutter\s+analyze$/i,
    /^flutter\s+test$/i
  ];

  // Explicitly blocked dangerous commands
  private static blockedPatterns = [
    /rm\s+-rf/i,
    /sudo/i,
    /chmod/i,
    /curl\s+.*\|\s*sh/i,
    /wget/i,
    />\s*\/dev\/sd/i,
    /cat\s+~\/\.ssh/i,
    /cat\s+~\/\.aws/i,
    /cat\s+~\/\.env/i
  ];

  public static isCommandAllowed(command: string): { allowed: boolean; reason?: string } {
    const trimmed = command.trim();

    for (const blocked of this.blockedPatterns) {
      if (blocked.test(trimmed)) {
        return {
          allowed: false,
          reason: `Command Policy Engine blocked dangerous shell command matching pattern: ${blocked}`
        };
      }
    }

    const matchesWhitelist = this.allowedCommands.some(allowed => allowed.test(trimmed));
    if (matchesWhitelist) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `Command Policy Engine: Command [${trimmed}] is not in the security whitelist.`
    };
  }

  public static executeWhitelistedCommand(command: string, cwd?: string): CommandPolicyResult {
    const check = this.isCommandAllowed(command);
    if (!check.allowed) {
      return {
        allowed: false,
        reason: check.reason,
        exitCode: 1
      };
    }

    try {
      const output = execSync(command, {
        cwd: cwd || process.cwd(),
        encoding: 'utf8',
        timeout: 30000
      });

      return {
        allowed: true,
        output,
        exitCode: 0
      };
    } catch (err: any) {
      return {
        allowed: true,
        output: err.stdout || err.stderr || err.message,
        reason: `Command execution failed with exit code ${err.status || 1}`,
        exitCode: err.status || 1
      };
    }
  }
}
