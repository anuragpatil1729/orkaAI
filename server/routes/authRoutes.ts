import { Router } from 'express';
import { geminiService } from '../ai/geminiService';
import { GoogleAuthService } from '../auth/googleOAuth';
import { getWorkspaceProvider } from '../providers/workspaceProvider';
import { sessionStore } from '../storage/sessionStore';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/status', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  const isOauthConfigured = GoogleAuthService.isConfigured();
  const authClient = GoogleAuthService.getAuthenticatedClient();
  const provider = getWorkspaceProvider(authClient);
  const profile = await provider.getUserProfile();

  const activeSession = req.session;

  res.json({
    workspace: {
      mode: profile.connected ? 'REAL WORKSPACE' : 'DISCONNECTED',
      connected: profile.connected,
      userEmail: activeSession?.email || profile.email,
      userName: activeSession?.name || profile.name,
      avatarUrl: activeSession?.avatarUrl || profile.avatarUrl,
      services: {
        gmail: profile.connected,
        calendar: profile.connected,
        drive: profile.connected
      }
    },
    session: activeSession ? {
      sessionId: activeSession.sessionId,
      email: activeSession.email,
      name: activeSession.name,
      expiresAt: activeSession.expiresAt
    } : null,
    gemini: {
      configured: geminiService.isConfigured(),
      model: geminiService.getModelName()
    },
    oauthAvailable: isOauthConfigured
  });
});

router.get('/me', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  if (req.session) {
    return res.json({
      name: req.session.name,
      email: req.session.email,
      avatarUrl: req.session.avatarUrl,
      connected: true,
      sessionId: req.session.sessionId
    });
  }

  const authClient = GoogleAuthService.getAuthenticatedClient();
  const provider = getWorkspaceProvider(authClient);
  const profile = await provider.getUserProfile();
  res.json(profile);
});

router.get('/google/url', (req, res) => {
  const url = GoogleAuthService.getAuthUrl();
  if (!url) {
    return res.status(400).json({
      error: 'Google OAuth credentials not configured in environment (GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET).'
    });
  }

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
    const tokens = await GoogleAuthService.handleCallback(code);
    const authClient = GoogleAuthService.getAuthenticatedClient();
    const provider = getWorkspaceProvider(authClient);
    const profile = await provider.getUserProfile();

    const session = sessionStore.createSession({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      accessToken: tokens?.access_token || undefined,
      refreshToken: tokens?.refresh_token || undefined
    });

    res.cookie('orka_session_id', session.sessionId, {
      httpOnly: true,
      secure: false, // Local dev
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Workspace Connected</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #17233B; color: #fff; text-align: center; padding: 50px; }
            .card { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); padding: 40px; border-radius: 28px; max-width: 500px; margin: 0 auto; backdrop-filter: blur(20px); }
            h1 { color: #34D399; }
            p { color: #CBD5E1; }
          </style>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'ORKA_AUTH_SUCCESS', sessionId: '${session.sessionId}' }, '*');
              setTimeout(() => window.close(), 1000);
            } else {
              setTimeout(() => { window.location.href = '/'; }, 1200);
            }
          </script>
        </head>
        <body>
          <div class="card">
            <h1>✓ Google Workspace Connected!</h1>
            <p>Welcome, ${profile.name} (${profile.email}).</p>
            <p>Redirecting to OrkaAI...</p>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

// Logout endpoint revoking session and tokens
router.post('/logout', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  const sessionId = req.headers['x-orka-session-id'] as string || req.cookies?.orka_session_id;
  if (sessionId) {
    sessionStore.invalidateSession(sessionId);
  }

  res.clearCookie('orka_session_id');
  res.json({
    success: true,
    message: 'Logged out successfully. Session invalidated.'
  });
});

export default router;
