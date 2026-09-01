import { Router } from 'express';
import { store } from '../storage/store';
import { AutomationRule } from '../../src/types/automations';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.session?.userId;
  const automations = store.getAutomations(userId);
  const patterns = store.discoverPatterns(userId);
  const discoveredPattern = patterns.length > 0 ? patterns[0] : null;

  res.json({
    automations,
    discoveredPattern
  });
});

router.post('/toggle', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.session?.userId;
  const { id, active } = req.body;
  if (id) {
    store.toggleAutomation(id, active, userId);
  }
  res.json({ automations: store.getAutomations(userId) });
});

router.post('/create-pattern', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.session?.userId;
  const patterns = store.discoverPatterns(userId);
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
    store.addAutomation(newRule, userId);
  }
  res.json({ automations: store.getAutomations(userId) });
});

router.post('/create', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.session?.userId;
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
  store.addAutomation(newRule, userId);
  res.json({ automations: store.getAutomations(userId), created: newRule });
});

export default router;
