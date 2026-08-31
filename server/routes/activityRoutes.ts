import { Router } from 'express';
import { store } from '../storage/store';

const router = Router();

router.get('/', (req, res) => {
  res.json({ activities: store.getActivities() });
});

export default router;
