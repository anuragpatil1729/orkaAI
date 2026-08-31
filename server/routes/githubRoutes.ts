import { Router } from 'express';
import fs from 'fs';
import path from 'path';
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

// POST /api/github/token - Save GitHub PAT dynamically & persist to .env
router.post('/token', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const { token } = req.body;
  if (token && typeof token === 'string') {
    const cleanToken = token.trim();
    process.env.GITHUB_TOKEN = cleanToken;

    // Persist to .env
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('GITHUB_TOKEN=')) {
        envContent = envContent.replace(/GITHUB_TOKEN=.*/g, `GITHUB_TOKEN=${cleanToken}`);
      } else {
        envContent += `\nGITHUB_TOKEN=${cleanToken}\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
    }

    return res.json({ status: 'connected', message: 'GitHub Personal Access Token configured successfully and persisted to .env' });
  }
  res.status(400).json({ error: 'Invalid GitHub token provided' });
});

export default router;
