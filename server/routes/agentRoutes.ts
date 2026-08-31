import { Router } from 'express';
import { parseUserIntent } from '../agents/intentParser';
import { createExecutionPlan } from '../agents/planner';
import { workflowExecutor } from '../agents/executor';
import { INITIAL_ACTIVITIES } from '../data/demoStore';

const router = Router();

// Start new workflow execution
router.post('/execute', async (req, res) => {
  try {
    const { prompt, mode = 'COPILOT' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const intent = await parseUserIntent(prompt);
    const steps = await createExecutionPlan(intent);
    const workflow = workflowExecutor.createWorkflow(prompt, mode, steps);

    // Save to initial activity log
    INITIAL_ACTIVITIES.unshift({
      id: 'act_' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeFormatted: 'Just now',
      dateGroup: 'Today',
      goal: intent.goal,
      actionsCount: steps.length + 4,
      status: 'In Progress',
      execution: workflow
    });

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
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json({ workflow });
});

// Approve sensitive step in workflow
router.post('/workflow/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { stepId } = req.body;
    const workflow = await workflowExecutor.approveStep(id, stepId);
    res.json({ workflow });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to approve workflow step' });
  }
});

export default router;
