import { CodingAgent } from '../agents/codingAgent';
import { GitHubToolService } from '../tools/githubTool';

async function runCodingAgentTests() {
  console.log('💻 Starting OrkaAI Autonomous Coding Agent Tests...\n');

  // Test 1: Inspect repository
  const repo = await GitHubToolService.inspectRepository();
  if (!repo.name || repo.files.length === 0) {
    console.error('✕ Test 1 Failed: Repository inspection returned empty structure.');
    process.exit(1);
  }
  console.log(`✓ Test 1 Passed: Repository inspected [${repo.owner}/${repo.name}] (${repo.files.length} items).`);

  // Test 2: Execute coding task pipeline
  const result = await CodingAgent.executeCodingTask(
    'Implement authentication session handling',
    [],
    'test: verify coding agent pipeline'
  );

  if (!result.branchName.startsWith('orka/task/') || !result.commitResult) {
    console.error('✕ Test 2 Failed: Coding task result missing branch or commit data.');
    process.exit(1);
  }

  if (!result.typecheckPassed || !result.buildPassed || !result.testsPassed) {
    console.error('✕ Test 2 Failed: Verification test suite failed during coding task.');
    process.exit(1);
  }

  console.log(`✓ Test 2 Passed: Coding task executed cleanly on branch [${result.branchName}] with commit [${result.commitResult.commitSha}].`);
  console.log(`✓ PR opened at: ${result.prUrl}`);

  console.log('\n🎉 ALL CODING AGENT TESTS PASSED CLEANLY!\n');
}

runCodingAgentTests().catch(err => {
  console.error('Coding agent test error:', err);
  process.exit(1);
});
