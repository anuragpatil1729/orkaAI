import { Router } from 'express';
import { INITIAL_AUTOMATIONS, DISCOVERED_PATTERN } from '../data/demoStore';

const router = Router();
let automations = [...INITIAL_AUTOMATIONS];

router.get('/', (req, res) => {
  res.json({
    automations,
    discoveredPattern: DISCOVERED_PATTERN
  });
});

router.post('/toggle', (req, res) => {
  const { id, active } = req.body;
  const item = automations.find(a => a.id === id);
  if (item) {
    item.active = active;
  }
  res.json({ automations });
});

router.post('/create-pattern', (req, res) => {
  const newAuto = {
    id: 'auto_created_' + Date.now(),
    title: 'Automated Invoice Processing',
    description: DISCOVERED_PATTERN.description,
    trigger: DISCOVERED_PATTERN.suggestedWorkflow.when,
    condition: DISCOVERED_PATTERN.suggestedWorkflow.if,
    actions: DISCOVERED_PATTERN.suggestedWorkflow.do,
    active: true,
    executionsCount: 0,
    approvalsRequiredCount: 0,
    category: 'invoice' as const
  };
  automations.unshift(newAuto);
  res.json({ automations, created: newAuto });
});

export default router;
