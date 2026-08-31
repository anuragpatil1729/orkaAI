import { Router } from 'express';
import { geminiService } from '../ai/geminiService';
import { GoogleAuthService } from '../auth/googleOAuth';

const router = Router();

router.get('/status', (req, res) => {
  const isOauthConfigured = GoogleAuthService.isConfigured();
  res.json({
    workspace: {
      mode: isOauthConfigured ? 'REAL WORKSPACE' : 'DEMO WORKSPACE',
      connected: true,
      userEmail: isOauthConfigured ? 'connected.user@workspace.com' : 'alex.v@orka.ai (Demo Workspace)',
      services: {
        gmail: true,
        calendar: true,
        drive: true
      }
    },
    gemini: {
      configured: geminiService.isConfigured(),
      model: geminiService.getModelName()
    },
    oauthAvailable: isOauthConfigured
  });
});

router.get('/google/url', (req, res) => {
  const url = GoogleAuthService.getAuthUrl();
  if (!url) {
    return res.status(400).json({
      error: 'Google OAuth credentials not configured in environment (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET).'
    });
  }
  res.json({ url });
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).send('OAuth authorization code missing.');
  }

  try {
    await GoogleAuthService.handleCallback(code);
    res.send('<h1>Google Workspace Connected Successfully!</h1><p>You can close this tab and return to OrkaAI.</p>');
  } catch (err: any) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

export default router;
