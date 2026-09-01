import { Router } from 'express';
import { store } from '../storage/store';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const userId = req.session?.userId;
  res.json({ activities: store.getActivities(userId) });
});

export default router;
