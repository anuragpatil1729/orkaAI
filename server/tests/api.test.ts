import express from 'express';
import agentRoutes from '../routes/agentRoutes';
import authRoutes from '../routes/authRoutes';
import automationsRoutes from '../routes/automationsRoutes';
import activityRoutes from '../routes/activityRoutes';
import toolsRoutes from '../routes/toolsRoutes';

const app = express();
app.use(express.json());
app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/automations', automationsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/tools', toolsRoutes);

async function runApiValidationTests() {
  console.log('📡 Starting OrkaAI Express API Route & Validation Tests...\n');

  let testsPassed = true;
  const server = app.listen(0);
  const address = server.address() as any;
  const baseUrl = `http://localhost:${address.port}`;

  try {
    // Test 1: GET /api/auth/status
    const authStatusRes = await fetch(`${baseUrl}/api/auth/status`);
    if (authStatusRes.status !== 200) {
      console.error(`✕ Test 1 Failed: Expected 200, got ${authStatusRes.status}`);
      testsPassed = false;
    } else {
      const data = await authStatusRes.json();
      if (!data.workspace || !data.gemini) {
        console.error('✕ Test 1 Failed: Auth status response schema invalid.');
        testsPassed = false;
      } else {
        console.log('✓ Test 1 Passed: GET /api/auth/status returned 200 OK with valid schema.');
      }
    }

    // Test 2: POST /api/agent/execute Empty Prompt -> 400 Bad Request
    const emptyPromptRes = await fetch(`${baseUrl}/api/agent/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: '   ' })
    });
    if (emptyPromptRes.status !== 400) {
      console.error(`✕ Test 2 Failed: Expected 400 for empty prompt, got ${emptyPromptRes.status}`);
      testsPassed = false;
    } else {
      console.log('✓ Test 2 Passed: POST /api/agent/execute empty prompt rejected with 400 Bad Request.');
    }

    // Test 3: GET /api/agent/workflow/nonexistent_id -> 404 Not Found
    const nonexistentWfRes = await fetch(`${baseUrl}/api/agent/workflow/nonexistent_12345`);
    if (nonexistentWfRes.status !== 404) {
      console.error(`✕ Test 3 Failed: Expected 404 for nonexistent workflow, got ${nonexistentWfRes.status}`);
      testsPassed = false;
    } else {
      console.log('✓ Test 3 Passed: GET /api/agent/workflow/:id nonexistent ID returned 404 Not Found.');
    }

    // Test 4: POST /api/agent/workflow/nonexistent_id/advance -> 404 Not Found
    const advanceNonexistentRes = await fetch(`${baseUrl}/api/agent/workflow/nonexistent_12345/advance`, {
      method: 'POST'
    });
    if (advanceNonexistentRes.status !== 404) {
      console.error(`✕ Test 4 Failed: Expected 404 for advance nonexistent workflow, got ${advanceNonexistentRes.status}`);
      testsPassed = false;
    } else {
      console.log('✓ Test 4 Passed: POST /api/agent/workflow/:id/advance nonexistent ID returned 404 Not Found.');
    }

    // Test 5: POST /api/agent/workflow/:id/approve Missing stepId -> 400 Bad Request
    // First create a workflow
    const execRes = await fetch(`${baseUrl}/api/agent/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'prepare me for my meeting tomorrow' })
    });
    const execData = await execRes.json();
    const wfId = execData.workflow.id;

    const approveMissingStepRes = await fetch(`${baseUrl}/api/agent/workflow/${wfId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (approveMissingStepRes.status !== 400) {
      console.error(`✕ Test 5 Failed: Expected 400 for missing stepId, got ${approveMissingStepRes.status}`);
      testsPassed = false;
    } else {
      console.log('✓ Test 5 Passed: POST /api/agent/workflow/:id/approve missing stepId rejected with 400 Bad Request.');
    }

    // Test 6: GET /api/automations and GET /api/activity -> 200 OK
    const automationsRes = await fetch(`${baseUrl}/api/automations`);
    const activityRes = await fetch(`${baseUrl}/api/activity`);
    if (automationsRes.status !== 200 || activityRes.status !== 200) {
      console.error(`✕ Test 6 Failed: Automations or Activity GET endpoint returned error.`);
      testsPassed = false;
    } else {
      console.log('✓ Test 6 Passed: Automations and Activity GET endpoints returned 200 OK.');
    }

  } finally {
    server.close();
  }

  if (!testsPassed) {
    console.error('\n✕ API route validation tests failed!');
    process.exit(1);
  }

  console.log('\n🎉 ALL EXPRESS API ROUTE & VALIDATION TESTS PASSED!\n');
}

runApiValidationTests().catch(err => {
  console.error('✕ API test execution error:', err);
  process.exit(1);
});
