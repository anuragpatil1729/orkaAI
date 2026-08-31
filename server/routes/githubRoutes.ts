import { Router } from 'express';
import { GitHubToolService } from '../tools/githubTool';
import { CodingAgent } from '../agents/codingAgent';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/repos', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const repo = await GitHubToolService.inspectRepository();
    res.json({
      repositories: [repo]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to inspect repositories' });
  }
});

router.get('/repo/:owner/:repo', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const repo = await GitHubToolService.inspectRepository();
    res.json({ repository: repo });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to inspect repository' });
  }
});

router.post('/task/:id/execute', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const taskId = req.params.id as string;
    const { prompt = 'Execute task' } = req.body;
    const codingResult = await CodingAgent.executeCodingTask(prompt);
    res.json({ codingResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to execute GitHub task' });
  }
});

export default router;
