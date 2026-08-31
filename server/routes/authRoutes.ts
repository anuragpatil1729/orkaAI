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

  // If accessed directly in browser or with redirect query, redirect to Google consent page
  if (req.query.redirect === 'true' || req.headers.accept?.includes('text/html')) {
    return res.redirect(url);
  }

  res.json({ url });
});

router.get('/google/login', (req, res) => {
  const url = GoogleAuthService.getAuthUrl();
  if (!url) {
    return res.status(400).send('Google OAuth credentials not configured.');
  }
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    return res.status(400).send('OAuth authorization code missing.');
  }

  try {
    await GoogleAuthService.handleCallback(code);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Workspace Connected</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0b0d14; color: #fff; text-align: center; padding: 50px; }
            .card { background: #12141d; border: 1px solid #10b981; padding: 40px; border-radius: 24px; max-width: 500px; margin: 0 auto; }
            h1 { color: #10b981; }
            p { color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✓ Google Workspace Connected!</h1>
            <p>Gmail, Google Calendar, and Google Drive have been authorized for OrkaAI.</p>
            <p>You can close this tab and return to OrkaAI.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

export default router;
