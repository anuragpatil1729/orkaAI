import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';
import { CodingAgent } from '../agents/codingAgent';
import { GitHubToolService } from '../tools/githubTool';

function sh(command: string, cwd: string) {
  return execSync(command, { cwd, encoding: 'utf8' }).trim();
}

function createScratchRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'orkaai-agent-test-'));
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'node test.js', build: 'node -e "import(\'./src/message.js\')"' }, type: 'module' }, null, 2));
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'message.js'), 'export const message = "before";\n');
  fs.writeFileSync(path.join(dir, 'test.js'), 'import { message } from "./src/message.js"; if (message !== "after") process.exit(1);\n');
  sh('git init -b main', dir);
  sh('git config user.email test@example.com', dir);
  sh('git config user.name "Orka Test"', dir);
  sh('git add .', dir);
  sh('git commit -m initial', dir);
  return dir;
}

async function runCodingAgentTests() {
  console.log('💻 Starting OrkaAI Autonomous Coding Agent Tests...\n');
  const repoDir = createScratchRepo();

  const repo = await GitHubToolService.inspectRepository(repoDir);
  if (!repo.workspacePath || !repo.files.includes('src/message.js')) {
    console.error('✕ Test 1 Failed: Repository inspection did not clone/read scratch repo state.');
    process.exit(1);
  }
  console.log(`✓ Test 1 Passed: Scratch repository inspected at ${repo.workspacePath}.`);

  const result = await CodingAgent.executeCodingTask(
    'Update exported message to after',
    repoDir,
    [{ filePath: 'src/message.js', content: 'export const message = "after";\n' }],
    'test: update scratch repo message'
  );

  if (result.status !== 'COMPLETED' || !result.branchName.startsWith('orka/task/') || !result.commitResult) {
    console.error('✕ Test 2 Failed: Coding task did not create a real branch and commit.', result);
    process.exit(1);
  }
  if (!result.testsPassed || !result.buildPassed) {
    console.error('✕ Test 2 Failed: Target repository verification scripts failed.', result.auditLogs);
    process.exit(1);
  }
  const workspace = GitHubToolService.getWorkspacePath(repoDir);
  const headSha = sh('git rev-parse HEAD', workspace);
  const committedContent = sh(`git show ${headSha}:src/message.js`, workspace);
  if (headSha !== result.commitResult.commitSha || !committedContent.includes('after')) {
    console.error('✕ Test 2 Failed: Reported commit SHA/content does not match git state.');
    process.exit(1);
  }
  console.log(`✓ Test 2 Passed: Real git commit ${headSha} contains requested file change.`);

  const missingConfig = await CodingAgent.executeCodingTask(
    'Attempt GitHub workflow without credentials',
    'https://github.com/example/disposable-repo',
    [{ filePath: 'README.md', content: 'change\n' }]
  );
  if (missingConfig.status !== 'NOT_CONFIGURED' || !missingConfig.error?.includes('GITHUB_TOKEN')) {
    console.error('✕ Test 3 Failed: Missing GitHub credentials did not surface NOT_CONFIGURED.', missingConfig);
    process.exit(1);
  }
  console.log('✓ Test 3 Passed: Missing GitHub credentials fail loudly without fake PR/commit data.');

  console.log('\n🎉 ALL CODING AGENT TESTS PASSED CLEANLY!\n');
}

runCodingAgentTests().catch(err => {
  console.error('Coding agent test error:', err);
  process.exit(1);
});
