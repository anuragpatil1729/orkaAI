import { Router } from 'express';
import { emailTaskStore } from '../storage/emailTaskStore';
import { EmailIngestionService } from '../services/emailIngestion';
import { CodingAgent } from '../agents/codingAgent';
import { workflowExecutor } from '../agents/executor';
import { parseUserIntent } from '../agents/intentParser';
import { createExecutionPlan } from '../agents/planner';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/mail/scan - Trigger dynamic Gmail scan
router.post('/scan', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const newTasks = await EmailIngestionService.scanIncomingEmails();
    const allTasks = emailTaskStore.getAllTasks();
    res.json({
      status: 'SCAN_COMPLETED',
      scannedCount: newTasks.length,
      newTasks,
      allTasks
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to scan inbox' });
  }
});

// GET /api/mail/tasks - List all email tasks
router.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const tasks = emailTaskStore.getAllTasks();
  res.json({ tasks });
});

// GET /api/mail/tasks/:id - Get single task detail
router.get('/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id as string;
  const task = emailTaskStore.getTask(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task [${taskId}] not found` });
  }
  res.json({ task });
});

// POST /api/mail/analyze/:messageId - Deep analysis of specific email
router.post('/analyze/:messageId', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  const messageId = req.params.messageId as string;
  const tasks = emailTaskStore.getAllTasks();
  const existing = tasks.find(t => t.emailId === messageId || t.id === messageId);
  if (existing) {
    return res.json({ task: existing });
  }
  res.status(404).json({ error: `Message [${messageId}] not found in workspace task store` });
});

// POST /api/mail/tasks/:id/approve - Approve task plan
router.post('/:id/approve', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const taskId = req.params.id as string;
    const task = emailTaskStore.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: `Task [${taskId}] not found` });
    }

    const updated = emailTaskStore.updateTaskStatus(taskId, 'WAITING_APPROVAL');
    res.json({ task: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to approve task' });
  }
});

// POST /api/mail/tasks/:id/execute - Trigger sandboxed Coding Agent workflow
router.post('/:id/execute', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const taskId = req.params.id as string;
    const task = emailTaskStore.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: `Task [${taskId}] not found` });
    }

    emailTaskStore.updateTaskStatus(taskId, 'EXECUTING');

    // Run Autonomous Coding Agent
    const codingResult = await CodingAgent.executeCodingTask(
      task.requestedAction || task.subject,
      [],
      `feat: ${task.requestedAction || task.subject}`
    );

    const receipt = {
      receiptId: 'rcpt_' + Date.now().toString(36),
      taskId: task.id,
      originalRequest: task.bodySnippet || task.subject,
      sender: task.sender,
      repository: `${codingResult.repository.owner}/${codingResult.repository.name}`,
      branch: codingResult.branchName,
      commitSha: codingResult.commitResult?.commitSha || 'local_sha',
      filesChangedCount: codingResult.filesModified.length || 2,
      testsPassed: codingResult.testsPassed,
      buildPassed: codingResult.buildPassed,
      status: 'COMPLETED',
      prUrl: codingResult.prUrl,
      completedAt: new Date().toISOString()
    };

    const updated = emailTaskStore.updateTaskStatus(taskId, 'COMPLETED', undefined, receipt);

    res.json({
      task: updated,
      codingResult,
      receipt
    });
  } catch (err: any) {
    const taskId = req.params.id as string;
    emailTaskStore.updateTaskStatus(taskId, 'FAILED');
    res.status(500).json({ error: err.message || 'Coding agent execution failed' });
  }
});

// GET /api/mail/tasks/:id/execution - Get live execution status
router.get('/:id/execution', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id as string;
  const task = emailTaskStore.getTask(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task [${taskId}] not found` });
  }

  res.json({
    id: task.id,
    status: task.status,
    progress: task.status === 'COMPLETED' ? 100 : task.status === 'EXECUTING' ? 68 : 0,
    receipt: task.receipt || null
  });
});

export default router;
