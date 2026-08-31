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
    const { prompt = 'Execute task', targetRepoUrl } = req.body;
    const codingResult = await CodingAgent.executeCodingTask(prompt, targetRepoUrl);
    res.json({ codingResult });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to execute GitHub task' });
  }
});

// POST /api/github/token - Save GitHub PAT dynamically
router.post('/token', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const { token } = req.body;
  if (token && typeof token === 'string') {
    process.env.GITHUB_TOKEN = token.trim();
    return res.json({ status: 'connected', message: 'GitHub Personal Access Token configured successfully' });
  }
  res.status(400).json({ error: 'Invalid GitHub token provided' });
});

export default router;
