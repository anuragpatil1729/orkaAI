import { Router } from 'express';
import { store } from '../storage/store';
import { AutomationRule } from '../../src/types/automations';

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
  const { id, active } = req.body;
  if (id) {
    store.toggleAutomation(id, active);
  }
  res.json({ automations: store.getAutomations() });
});

router.post('/create-pattern', (req, res) => {
  const patterns = store.discoverPatterns();
  if (patterns.length > 0) {
    const pattern = patterns[0];
    const newRule: AutomationRule = {
      id: 'rule_' + Date.now(),
      title: pattern.title,
      description: pattern.description,
      trigger: pattern.suggestedWorkflow.when,
      condition: pattern.suggestedWorkflow.if,
      actions: pattern.suggestedWorkflow.do,
      active: true,
      executionsCount: pattern.occurrences,
      approvalsRequiredCount: pattern.occurrences,
      category: 'invoice'
    };
    store.addAutomation(newRule);
  }
  res.json({ automations: store.getAutomations() });
});

router.post('/create', (req, res) => {
  const { title, description, trigger, condition, actions, category } = req.body;
  const newRule: AutomationRule = {
    id: 'rule_' + Date.now(),
    title: title || 'User Automation Rule',
    description: description || 'Custom user defined autonomous rule.',
    trigger: trigger || 'On Event',
    condition: condition || 'Always',
    actions: actions || ['Execute Action'],
    active: true,
    executionsCount: 0,
    approvalsRequiredCount: 0,
    category: category || 'custom'
  };
  store.addAutomation(newRule);
  res.json({ automations: store.getAutomations(), created: newRule });
});

export default router;
