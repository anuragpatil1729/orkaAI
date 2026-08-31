import { spawnSync } from 'child_process';
import path from 'path';

console.log('🚀 Running OrkaAI Complete Automated Verification Test Suite...\n');

const testFiles = [
  'server/tests/dynamicEngine.test.ts',
  'server/tests/securityApproval.test.ts',
  'server/tests/geminiFailures.test.ts',
  'server/tests/api.test.ts'
];

let allPassed = true;

for (const file of testFiles) {
  const fullPath = path.join(process.cwd(), file);
  console.log(`▶ Executing: ${file}`);
  const result = spawnSync('npx', ['tsx', fullPath], { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n✕ Test suite failed in file: ${file}`);
    allPassed = false;
    break;
  }
}

if (!allPassed) {
  console.error('\n❌ COMPLETE TEST SUITE FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ ALL TEST SUITES PASSED CLEANLY & VERIFIED 100%!');
}
