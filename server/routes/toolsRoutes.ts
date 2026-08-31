import { Router } from 'express';
import { TOOL_REGISTRY } from '../tools/registry';

const router = Router();

router.get('/registry', (req, res) => {
  res.json({ tools: Object.values(TOOL_REGISTRY) });
});

export default router;
