import { workflowExecutor } from '../agents/executor';
import { GoogleAuthService } from '../auth/googleOAuth';
import { getWorkspaceProvider } from '../providers/workspaceProvider';

async function runSecurityApprovalTests() {
  console.log('🔒 Starting OrkaAI Security & Approval Gate Verification Tests...\n');

  let testsPassed = true;

  // Test 1: Invariant — send_email tool NEVER executes in advanceWorkflow prior to approval
  const steps = [
    {
      id: 'step_1',
      name: 'Search Emails',
      tool: 'search_emails',
      description: 'Search Gmail messages',
      risk: 'READ' as const,
      requiresApproval: false,
      status: 'pending' as const,
      reasoningSnippet: 'Searching emails'
    },
    {
      id: 'step_2',
      name: 'Send Follow-up Email',
      tool: 'send_email',
      description: 'Transmit external email',
      risk: 'HIGH_RISK_WRITE' as const,
      requiresApproval: true,
      status: 'pending' as const,
      reasoningSnippet: 'Transmitting email'
    }
  ];

  const wf = workflowExecutor.createWorkflow('Test Security Invariant Goal', 'COPILOT', steps);

  // Advance step 1 (READ)
  const afterStep1 = await workflowExecutor.advanceWorkflow(wf.id);
  if (afterStep1.steps[0].status !== 'completed') {
    console.error('✕ Test 1.1 Failed: Step 1 did not complete cleanly.');
    testsPassed = false;
  } else {
    console.log('✓ Test 1.1 Passed: READ action executed cleanly.');
  }

  // Advance step 2 (HIGH_RISK_WRITE in COPILOT mode)
  const afterStep2 = await workflowExecutor.advanceWorkflow(wf.id);
  
  if (afterStep2.status !== 'waiting_approval') {
    console.error(`✕ Test 1.2 Failed: Expected workflow status "waiting_approval", got "${afterStep2.status}"`);
    testsPassed = false;
  } else if (!afterStep2.approvalRequest) {
    console.error('✕ Test 1.2 Failed: Approval request payload was missing.');
    testsPassed = false;
  } else if (afterStep2.steps[1].status === 'completed') {
    console.error('✕ CRITICAL SECURITY FAILURE: send_email executed BEFORE human approval!');
    testsPassed = false;
  } else {
    console.log('✓ Test 1.2 Passed: CRITICAL SECURITY INVARIANT VERIFIED — send_email paused at waiting_approval with ZERO pre-approval transmission.');
  }

  // Test 2: Modify payload during approval and execute
  const customPayload = {
    to: 'verified.client@domain.com',
    subject: 'Updated Compliance Subject',
    body: 'Custom verified body text.'
  };

  const afterApprove = await workflowExecutor.approveStep(wf.id, afterStep2.approvalRequest!.stepId, customPayload);

  if (afterApprove.status !== 'completed') {
    console.error(`✕ Test 2 Failed: Expected workflow status "completed", got "${afterApprove.status}"`);
    testsPassed = false;
  } else if (afterApprove.steps[1].status !== 'completed') {
    console.error('✕ Test 2 Failed: Approved step was not marked completed.');
    testsPassed = false;
  } else {
    console.log('✓ Test 2 Passed: Custom payload approval executed successfully and workflow completed.');
  }

  // Test 3: Invalid Approval Attempts
  try {
    await workflowExecutor.approveStep('nonexistent_wf_id', 'step_2');
    console.error('✕ Test 3.1 Failed: Expected error for nonexistent workflow ID.');
    testsPassed = false;
  } catch (err: any) {
    console.log('✓ Test 3.1 Passed: Nonexistent workflow approval rejected cleanly.');
  }

  if (!testsPassed) {
    console.error('\n✕ Security approval tests failed!');
    process.exit(1);
  }

  console.log('\n🎉 ALL SECURITY & APPROVAL GATE VERIFICATION TESTS PASSED!\n');
}

runSecurityApprovalTests().catch(err => {
  console.error('✕ Security test execution error:', err);
  process.exit(1);
});
