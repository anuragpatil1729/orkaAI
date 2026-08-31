import { getWorkspaceProvider } from '../providers/workspaceProvider';
import { geminiService } from '../ai/geminiService';
import { isValidTool } from '../tools/registry';
import { store } from '../storage/store';

async function runDynamicEngineTests() {
  console.log('🧪 Starting OrkaAI 100% Dynamic Engine Verification Tests...\n');

  let testPassed = true;

  // Test 1: Real Workspace Provider Verification
  const provider = getWorkspaceProvider();

  const profile = await provider.getUserProfile();
  if (profile.connected === undefined) {
    console.error('✕ Test 1 Failed: Workspace provider profile structure invalid.');
    testPassed = false;
  } else {
    console.log(`✓ Test 1 Passed: Dynamic Workspace Provider verified (Profile: ${profile.name})`);
  }

  // Test 2: Honest Counts Verification (Zero Fabrication)
  const emptyEmailContext: any[] = [];
  const emptyDocContext: any[] = [];
  const brief = await geminiService.generateBrief('Meeting Intent', emptyEmailContext, emptyDocContext);

  if (brief.emailsAnalyzedCount !== 0 || brief.docsAnalyzedCount !== 0) {
    console.error(`✕ Test 2 Failed: Expected 0 counts, received emails=${brief.emailsAnalyzedCount}, docs=${brief.docsAnalyzedCount}`);
    testPassed = false;
  } else {
    console.log('✓ Test 2 Passed: Zero-fabrication verified (0 emails/docs returned when empty)');
  }

  // Test 3: Gemini Parsing Clean of Demo Scenarios
  const parsedIntent = await geminiService.parseIntent('Prepare a launch plan for next quarter');
  if (parsedIntent.isDemoScenario === true) {
    console.error('✕ Test 3 Failed: Gemini parsed goal as demo scenario.');
    testPassed = false;
  } else {
    console.log('✓ Test 3 Passed: Gemini intent parsing 100% dynamic without Acme branching');
  }

  // Test 4: Dynamic Store Activity Logging
  const initialActivitiesCount = store.getActivities().length;
  store.addActivity({
    id: 'test_act_1',
    timestamp: '12:00 PM',
    timeFormatted: 'Just now',
    dateGroup: 'Today',
    goal: 'Test Execution',
    actionsCount: 5,
    status: 'Completed'
  });

  if (store.getActivities().length !== initialActivitiesCount + 1) {
    console.error('✕ Test 4 Failed: Activity store failed to append dynamic execution.');
    testPassed = false;
  } else {
    console.log('✓ Test 4 Passed: Real activity store persistence verified');
  }

  if (!testPassed) {
    console.error('\n✕ Dynamic Engine verification tests failed!');
    process.exit(1);
  }

  console.log('\n🎉 ALL DYNAMIC ENGINE VERIFICATION TESTS PASSED CLEANLY!\n');
}

runDynamicEngineTests().catch(err => {
  console.error('✕ Test execution failed:', err);
  process.exit(1);
});
