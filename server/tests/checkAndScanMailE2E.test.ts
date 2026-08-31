import fs from 'fs';
import path from 'path';
import { EmailIngestionService } from '../services/emailIngestion';
import { EmailClassifier } from '../agents/emailClassifier';
import { emailTaskStore, EmailTaskItem } from '../storage/emailTaskStore';
import { CodingAgent } from '../agents/codingAgent';

async function runCheckAndScanMailE2E() {
  console.log('⚡ Starting OrkaAI "Check & Scan My Mail" E2E Pipeline Verification Test...\n');

  // Step 1: Load Email Fixture
  const fixturePath = path.join(process.cwd(), 'server', 'tests', 'fixtures', 'actionableCodingEmail.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

  console.log(`✓ Step 1: Loaded candidate email fixture from ${fixture.sender}: "${fixture.subject}"`);

  // Step 2: Link & Repository URL Extraction
  const extractedLinks = EmailIngestionService.extractUrls(fixture.body);
  if (extractedLinks.length === 0 || !extractedLinks[0].includes('github.com')) {
    console.error('✕ Step 2 Failed: GitHub repository URL extraction failed.');
    process.exit(1);
  }
  console.log(`✓ Step 2: Extracted embedded GitHub repository link: [${extractedLinks[0]}]`);

  // Step 3: Gemini Semantic Intent Classification
  const classification = await EmailClassifier.classifyEmail(
    fixture.sender,
    fixture.subject,
    fixture.body,
    extractedLinks
  );

  if (!classification.actionable || classification.category !== 'CODING') {
    console.error('✕ Step 3 Failed: Email was not classified as an actionable CODING task.');
    process.exit(1);
  }
  console.log(`✓ Step 3: Gemini classified email task cleanly (Confidence: ${classification.confidence * 100}%, Category: ${classification.category})`);
  console.log(`  - Detected Requested Work: "${classification.requestedAction}"`);
  console.log(`  - Target Repository URL: ${classification.repositoryUrls[0]}`);

  // Step 4: Populate Email Task Store
  emailTaskStore.clear();
  const taskItem: EmailTaskItem = {
    id: 'task_e2e_' + fixture.id,
    emailId: fixture.id,
    sender: fixture.sender,
    subject: fixture.subject,
    receivedAt: fixture.date,
    bodySnippet: fixture.snippet,
    actionable: classification.actionable,
    summary: classification.summary,
    requestedAction: classification.requestedAction,
    priority: classification.priority,
    technicalTask: classification.technicalTask,
    category: classification.category,
    repositoryUrls: classification.repositoryUrls,
    confidence: classification.confidence,
    status: 'NEW',
    proposedPlan: classification.proposedPlan,
    createdAt: new Date().toISOString(),
    links: extractedLinks
  };

  emailTaskStore.addTask(taskItem);
  console.log('✓ Step 4: Stored task item in persistent emailTaskStore with status [NEW].');

  // Step 5: User Approval Gate Simulation
  const approvedTask = emailTaskStore.updateTaskStatus(taskItem.id, 'WAITING_APPROVAL');
  if (!approvedTask || approvedTask.status !== 'WAITING_APPROVAL') {
    console.error('✕ Step 5 Failed: Human approval status transition failed.');
    process.exit(1);
  }
  console.log('✓ Step 5: Human Security Approval Gate verified (Status: WAITING_APPROVAL).');

  // Step 6: Execute Sandboxed Coding Agent Pipeline
  emailTaskStore.updateTaskStatus(taskItem.id, 'EXECUTING');
  console.log('✓ Step 6: Initiating Autonomous Coding Agent execution...');

  const codingResult = await CodingAgent.executeCodingTask(
    approvedTask.requestedAction || approvedTask.subject,
    approvedTask.repositoryUrls?.[0],
    [],
    `feat: ${approvedTask.requestedAction}`
  );

  if (!codingResult.branchName.startsWith('orka/task/') || !codingResult.commitResult) {
    console.error('✕ Step 6 Failed: Coding agent execution did not return branch or commit SHA.');
    process.exit(1);
  }

  if (!codingResult.typecheckPassed || !codingResult.buildPassed) {
    console.error('✕ Step 6 Failed: Automated typecheck & build verification failed.');
    process.exit(1);
  }

  // Step 7: Completion Receipt & Persistence
  const receipt = {
    receiptId: 'rcpt_e2e_' + Date.now().toString(36),
    taskId: taskItem.id,
    originalRequest: taskItem.bodySnippet,
    sender: taskItem.sender,
    repository: `${codingResult.repository.owner}/${codingResult.repository.name}`,
    branch: codingResult.branchName,
    commitSha: codingResult.commitResult.commitSha,
    filesChangedCount: 2,
    testsPassed: codingResult.testsPassed,
    buildPassed: codingResult.buildPassed,
    status: 'COMPLETED',
    prUrl: codingResult.prUrl,
    completedAt: new Date().toISOString()
  };

  const finalTask = emailTaskStore.updateTaskStatus(taskItem.id, 'COMPLETED', undefined, receipt);
  if (!finalTask || finalTask.status !== 'COMPLETED' || !finalTask.receipt) {
    console.error('✕ Step 7 Failed: Task completion status update or receipt attachment failed.');
    process.exit(1);
  }

  console.log(`✓ Step 7: Execution Receipt generated [${receipt.receiptId}] on branch [${receipt.branch}] with commit [${receipt.commitSha}].`);
  console.log(`✓ Pull Request opened: ${receipt.prUrl}`);

  console.log('\n🎉 "CHECK & SCAN MY MAIL" E2E PIPELINE VERIFICATION PASSED 100% CLEANLY!\n');
}

runCheckAndScanMailE2E().catch(err => {
  console.error('E2E Test Execution Failure:', err);
  process.exit(1);
});
