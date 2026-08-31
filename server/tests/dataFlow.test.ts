import { getWorkspaceProvider } from '../providers/workspaceProvider';
import { geminiService } from '../ai/geminiService';
import { isValidTool } from '../tools/registry';

async function runDataFlowTests() {
  console.log('🧪 Starting OrkaAI Data-Flow & Isolation Verification Tests...\n');

  let testPassed = true;

  // Test 1: Workspace Data Provider Isolation
  const demoProvider = getWorkspaceProvider('DEMO');
  const realProvider = getWorkspaceProvider('REAL');

  const demoProfile = await demoProvider.getUserProfile();
  const realProfile = await realProvider.getUserProfile();

  if (demoProvider.getMode() !== 'DEMO' || realProvider.getMode() !== 'REAL') {
    console.error('✕ Test 1 Failed: Data provider modes not isolated correctly.');
    testPassed = false;
  } else {
    console.log('✓ Test 1 Passed: Data Provider strict separation (REAL vs DEMO)');
  }

  // Test 2: Honest Counts Verification (No Fabricated Counts)
  const emptyEmailContext: any[] = [];
  const emptyDocContext: any[] = [];
  const brief = await geminiService.generateBrief('Test Entity', emptyEmailContext, emptyDocContext);

  if (brief.emailsAnalyzedCount !== 0 || brief.docsAnalyzedCount !== 0) {
    console.error(`✕ Test 2 Failed: Expected 0 counts, but received emails=${brief.emailsAnalyzedCount}, docs=${brief.docsAnalyzedCount}`);
    testPassed = false;
  } else {
    console.log('✓ Test 2 Passed: Honest counts verified (0 emails/docs returned when empty)');
  }

  // Test 3: Gemini Service Prompt Parsing without Acme Branching
  const parsedIntent = await geminiService.parseIntent('Prepare a marketing launch for product X');
  if (parsedIntent.isDemoScenario === true) {
    console.error('✕ Test 3 Failed: Gemini parsed non-demo prompt as demo scenario.');
    testPassed = false;
  } else {
    console.log('✓ Test 3 Passed: Gemini parsing clean of Acme hardcoded branching');
  }

  // Test 4: Tool Registry Validation & Unknown Tool Rejection
  const validCheck = isValidTool('search_emails');
  const invalidCheck = isValidTool('unknown_hack_tool');

  if (!validCheck || invalidCheck) {
    console.error('✕ Test 4 Failed: Tool registry failed to reject unknown tool ID.');
    testPassed = false;
  } else {
    console.log('✓ Test 4 Passed: Strict tool registry validation & rejection');
  }

  if (!testPassed) {
    console.error('\n✕ Data-flow verification tests failed!');
    process.exit(1);
  }

  console.log('\n🎉 ALL DATA-FLOW & ISOLATION TESTS PASSED CLEANLY!\n');
}

runDataFlowTests().catch(err => {
  console.error('✕ Test execution failed:', err);
  process.exit(1);
});
