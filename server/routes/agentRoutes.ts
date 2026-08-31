import { Router } from 'express';
import { parseUserIntent } from '../agents/intentParser';
import { createExecutionPlan } from '../agents/planner';
import { workflowExecutor } from '../agents/executor';

const router = Router();

// Start new workflow execution
router.post('/execute', async (req, res) => {
  try {
    const { prompt, mode = 'COPILOT' } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt string is required' });
    }

    const intent = await parseUserIntent(prompt.trim());
    const steps = await createExecutionPlan(intent);
    const workflow = workflowExecutor.createWorkflow(prompt.trim(), mode, steps);

    res.json({
      intent,
      workflow
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start workflow' });
  }
});

// Advance workflow execution step by step
router.post('/workflow/:id/advance', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = workflowExecutor.getWorkflow(id);
    if (!existing) {
      return res.status(404).json({ error: `Workflow [${id}] not found` });
    }
    if (existing.status === 'completed' || existing.status === 'failed') {
      return res.status(409).json({ error: `Workflow [${id}] is already ${existing.status}`, workflow: existing });
    }

    const workflow = await workflowExecutor.advanceWorkflow(id);
    res.json({ workflow });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to advance workflow' });
  }
});

// Get workflow status
router.get('/workflow/:id', (req, res) => {
  const { id } = req.params;
  const workflow = workflowExecutor.getWorkflow(id);
  if (!workflow) {
    return res.status(404).json({ error: `Workflow [${id}] not found` });
  }
  res.json({ workflow });
});

// Approve sensitive step in workflow
router.post('/workflow/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { stepId, to, subject, body } = req.body;
    const existing = workflowExecutor.getWorkflow(id);
    if (!existing) {
      return res.status(404).json({ error: `Workflow [${id}] not found` });
    }
    if (!stepId || typeof stepId !== 'string') {
      return res.status(400).json({ error: 'stepId is required for approval' });
    }
    if (existing.status === 'completed' || existing.status === 'failed') {
      return res.status(409).json({ error: `Workflow [${id}] is already ${existing.status}` });
    }

    const workflow = await workflowExecutor.approveStep(id, stepId, { to, subject, body });
    res.json({ workflow });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to approve workflow step' });
  }
});

export default router;
