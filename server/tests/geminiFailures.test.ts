import { geminiService } from '../ai/geminiService';
import { isValidTool } from '../tools/registry';

async function runGeminiFailureTests() {
  console.log('🤖 Starting OrkaAI Gemini Failure & Tool Registry Security Tests...\n');

  let testsPassed = true;

  // Test 1: Validate Tool Registry rejects unknown tool injections
  const maliciousTools = ['execute_bash', 'rm_rf_root', 'steal_tokens', 'arbitrary_eval'];
  for (const t of maliciousTools) {
    if (isValidTool(t)) {
      console.error(`✕ Test 1 Failed: Registry accepted malicious tool [${t}]!`);
      testsPassed = false;
    }
  }
  if (testsPassed) {
    console.log('✓ Test 1 Passed: Tool registry strictly rejects unknown/malicious tool names.');
  }

  // Test 2: Gemini Intent Parsing Fallback when unconfigured / error
  const fallbackIntent = await geminiService.parseIntent('Check my current email');
  if (!fallbackIntent.goal || !Array.isArray(fallbackIntent.targetActions)) {
    console.error('✕ Test 2 Failed: Fallback intent format invalid.');
    testsPassed = false;
  } else {
    console.log('✓ Test 2 Passed: Intent parser handles unconfigured API gracefully with valid fallback intent.');
  }

  // Test 3: Plan Creation Tool Validation
  const plan = await geminiService.createPlan(fallbackIntent);
  if (!Array.isArray(plan) || plan.length === 0) {
    console.error('✕ Test 3 Failed: Plan creation returned empty plan.');
    testsPassed = false;
  } else {
    const hasInvalidTools = plan.some(step => !isValidTool(step.tool));
    if (hasInvalidTools) {
      console.error('✕ Test 3 Failed: Plan contains unregistered tools.');
      testsPassed = false;
    } else {
      console.log(`✓ Test 3 Passed: Plan creation generated ${plan.length} valid policy-registered steps.`);
    }
  }

  if (!testsPassed) {
    console.error('\n✕ Gemini failure tests failed!');
    process.exit(1);
  }

  console.log('\n🎉 ALL GEMINI FAILURE & TOOL REGISTRY TESTS PASSED!\n');
}

runGeminiFailureTests().catch(err => {
  console.error('✕ Gemini test execution error:', err);
  process.exit(1);
});
