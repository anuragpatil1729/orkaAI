import { Router, Response } from 'express';
import { emailTaskStore } from '../storage/emailTaskStore';
import { EmailIngestionService } from '../services/emailIngestion';
import { CodingAgent } from '../agents/codingAgent';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Helper handlers to support both /:id and /tasks/:id route parameters
const handleGetTasks = (req: AuthenticatedRequest, res: Response) => {
  const tasks = emailTaskStore.getAllTasks();
  res.json({ tasks });
};

const handleGetTaskById = (req: AuthenticatedRequest, res: Response) => {
  const taskId = req.params.id as string;
  const task = emailTaskStore.getTask(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task [${taskId}] not found` });
  }
  res.json({ task });
};

const handleApproveTask = async (req: AuthenticatedRequest, res: Response) => {
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
};

const handleExecuteTask = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const task = emailTaskStore.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: `Task [${taskId}] not found` });
    }

    emailTaskStore.updateTaskStatus(taskId, 'EXECUTING');

    const targetRepo = (task.repositoryUrls && task.repositoryUrls.length > 0)
      ? task.repositoryUrls[0]
      : undefined;

    // Run Sandboxed Coding Agent
    const codingResult = await CodingAgent.executeCodingTask(
      task.requestedAction || task.subject,
      targetRepo,
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
};

const handleGetExecution = (req: AuthenticatedRequest, res: Response) => {
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
};

// POST /api/mail/scan - Trigger dynamic Gmail scan
router.post('/scan', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
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

// POST /api/mail/analyze/:messageId
router.post('/analyze/:messageId', optionalAuthMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const messageId = req.params.messageId as string;
  const tasks = emailTaskStore.getAllTasks();
  const existing = tasks.find(t => t.emailId === messageId || t.id === messageId);
  if (existing) {
    return res.json({ task: existing });
  }
  res.status(404).json({ error: `Message [${messageId}] not found in workspace task store` });
});

// Task List endpoints
router.get('/tasks', optionalAuthMiddleware, handleGetTasks);
router.get('/', optionalAuthMiddleware, handleGetTasks);

// Task Detail & Execution endpoints (supporting both /tasks/:id and /:id)
router.get('/tasks/:id', optionalAuthMiddleware, handleGetTaskById);
router.get('/:id', optionalAuthMiddleware, handleGetTaskById);

router.post('/tasks/:id/approve', optionalAuthMiddleware, handleApproveTask);
router.post('/:id/approve', optionalAuthMiddleware, handleApproveTask);

router.post('/tasks/:id/execute', optionalAuthMiddleware, handleExecuteTask);
router.post('/:id/execute', optionalAuthMiddleware, handleExecuteTask);

router.get('/tasks/:id/execution', optionalAuthMiddleware, handleGetExecution);
router.get('/:id/execution', optionalAuthMiddleware, handleGetExecution);

export default router;
