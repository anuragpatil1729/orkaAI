import { Router } from 'express';
import { INITIAL_ACTIVITIES } from '../data/demoStore';

const router = Router();

router.get('/', (req, res) => {
  res.json({ activities: INITIAL_ACTIVITIES });
});

export default router;
