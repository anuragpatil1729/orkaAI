import { sessionStore } from '../storage/sessionStore';
import { CommandPolicyEngine } from '../security/commandPolicyEngine';

console.log('🔒 Starting OrkaAI Auth & Session Security Tests...\n');

// Test 1: Session creation and retrieval
const session = sessionStore.createSession({
  email: 'dev@orka.ai',
  name: 'Orka Dev User',
  avatarUrl: 'https://example.com/avatar.png'
});

if (!session || !session.sessionId.startsWith('sess_')) {
  console.error('✕ Test 1 Failed: Invalid session ID generated.');
  process.exit(1);
}
console.log('✓ Test 1 Passed: Valid session created with ID:', session.sessionId);

// Test 2: Session persistence and lookup
const retrieved = sessionStore.getSession(session.sessionId);
if (!retrieved || retrieved.email !== 'dev@orka.ai') {
  console.error('✕ Test 2 Failed: Session lookup failed.');
  process.exit(1);
}
console.log('✓ Test 2 Passed: Session lookup verified.');

// Test 3: Session invalidation (Logout)
sessionStore.invalidateSession(session.sessionId);
const afterLogout = sessionStore.getSession(session.sessionId);
if (afterLogout !== null) {
  console.error('✕ Test 3 Failed: Session was not invalidated on logout.');
  process.exit(1);
}
console.log('✓ Test 3 Passed: Logout session invalidation verified.');

// Test 4: Command execution policy engine
const safeCommand = CommandPolicyEngine.isCommandAllowed('npm run typecheck');
if (!safeCommand.allowed) {
  console.error('✕ Test 4 Failed: Safe command blocked.');
  process.exit(1);
}

const dangerousCommand = CommandPolicyEngine.isCommandAllowed('rm -rf /');
if (dangerousCommand.allowed) {
  console.error('✕ Test 4 Failed: Dangerous command was NOT blocked by Policy Engine!');
  process.exit(1);
}
console.log('✓ Test 4 Passed: Command Policy Engine security sandbox verified (whitelisted npm, blocked rm -rf).');

console.log('\n🎉 ALL AUTH & SESSION SECURITY TESTS PASSED CLEANLY!\n');
