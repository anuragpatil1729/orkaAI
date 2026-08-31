import { Router } from 'express';
import { store } from '../storage/store';

const router = Router();

router.get('/', (req, res) => {
  const automations = store.getAutomations();
  const patterns = store.discoverPatterns();
  const discoveredPattern = patterns.length > 0 ? patterns[0] : null;

  res.json({
    automations,
    discoveredPattern
  });
});

router.post('/toggle', (req, res) => {
  const { id } = req.body;
  if (id) {
    store.toggleAutomation(id);
  }
  res.json({ automations: store.getAutomations() });
});

router.post('/create', (req, res) => {
  const { name, trigger, action, risk } = req.body;
  const newRule = {
    id: 'auto_' + Date.now(),
    name: name || 'User Automation Rule',
    trigger: trigger || 'On Event',
    action: action || 'Execute Action',
    risk: risk || 'LOW_RISK_WRITE',
    enabled: true,
    executionCount: 0
  };
  store.addAutomation(newRule);
  res.json({ automations: store.getAutomations(), created: newRule });
});

export default router;
