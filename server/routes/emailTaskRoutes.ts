import { Router } from 'express';
import { emailTaskStore } from '../storage/emailTaskStore';
import { EmailIngestionService } from '../services/emailIngestion';
import { workflowExecutor } from '../agents/executor';
import { parseUserIntent } from '../agents/intentParser';
import { createExecutionPlan } from '../agents/planner';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

// Get all email tasks
router.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const tasks = emailTaskStore.getAllTasks();
  res.json({ tasks });
});

// Trigger email scan
router.post('/scan', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const newTasks = await EmailIngestionService.scanIncomingEmails();
    const allTasks = emailTaskStore.getAllTasks();
    res.json({
      scannedCount: newTasks.length,
      newTasks,
      allTasks
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to scan inbox' });
  }
});

// Get single task details
router.get('/:id', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const taskId = req.params.id as string;
  const task = emailTaskStore.getTask(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task [${taskId}] not found` });
  }
  res.json({ task });
});

// Approve & execute email task plan
router.post('/:id/approve', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const taskId = req.params.id as string;
    const task = emailTaskStore.getTask(taskId);
    if (!task) {
      return res.status(404).json({ error: `Task [${taskId}] not found` });
    }

    const mode = req.body?.mode || 'COPILOT';
    const goalPrompt = task.requestedAction || task.subject;

    // Compile dynamic execution workflow for email task
    const intent = await parseUserIntent(goalPrompt);
    const steps = await createExecutionPlan(intent);

    const workflow = workflowExecutor.createWorkflow(goalPrompt, mode, steps);
    emailTaskStore.updateTaskStatus(taskId, 'EXECUTING', workflow.id);

    res.json({
      task: emailTaskStore.getTask(taskId),
      workflow
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to execute email task' });
  }
});

export default router;
