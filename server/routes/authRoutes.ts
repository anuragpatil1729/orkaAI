import { Router } from 'express';
import { geminiService } from '../ai/geminiService';
import { GoogleAuthService } from '../auth/googleOAuth';
import { getWorkspaceProvider } from '../providers/workspaceProvider';
import { sessionStore } from '../storage/sessionStore';
import { userStore } from '../storage/userStore';
import { optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/authMiddleware';

const router = Router();

router.get('/status', optionalAuthMiddleware, async (req: AuthenticatedRequest, res) => {
  const isOauthConfigured = GoogleAuthService.isConfigured();
  const activeSession = req.session;

  if (activeSession) {
    const authClient = GoogleAuthService.getAuthenticatedClientForUser(activeSession.userId);
    const provider = getWorkspaceProvider(authClient);
    const profile = await provider.getUserProfile();

    return res.json({
      workspace: {
        mode: 'REAL WORKSPACE',
        connected: true,
        userEmail: activeSession.email,
        userName: activeSession.name,
        avatarUrl: activeSession.avatarUrl,
        services: {
          gmail: true,
          calendar: true,
          drive: true
        }
      },
      session: {
        sessionId: activeSession.sessionId,
        userId: activeSession.userId,
        email: activeSession.email,
        name: activeSession.name,
        expiresAt: activeSession.expiresAt
      },
      gemini: {
        configured: geminiService.isConfigured(),
        model: geminiService.getModelName()
      },
      oauthAvailable: isOauthConfigured
    });
  }

  // Fallback for unauthenticated state
  res.json({
    workspace: {
      mode: 'DISCONNECTED',
      connected: false,
      userEmail: '',
      userName: '',
      avatarUrl: undefined,
      services: {
        gmail: false,
        calendar: false,
        drive: false
      }
    },
    session: null,
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
      userId: req.session.userId,
      name: req.session.name,
      email: req.session.email,
      avatarUrl: req.session.avatarUrl,
      connected: true,
      sessionId: req.session.sessionId
    });
  }

  res.status(401).json({ connected: false, error: 'Not authenticated' });
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
    const { tokens, client } = await GoogleAuthService.handleCallback(code);
    const provider = getWorkspaceProvider(client);
    const profile = await provider.getUserProfile();

    if (!profile.email) {
      throw new Error('Failed to retrieve user profile email from Google OAuth.');
    }

    const user = userStore.findOrCreateUser({
      email: profile.email,
      name: profile.name || profile.email.split('@')[0],
      avatarUrl: profile.avatarUrl,
    });

    userStore.saveUserTokens(user.id, {
      access_token: tokens.access_token || undefined,
      refresh_token: tokens.refresh_token || undefined,
      scope: tokens.scope,
      token_type: tokens.token_type || undefined,
      expiry_date: tokens.expiry_date || undefined
    });

    const session = sessionStore.createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl
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
            body { font-family: system-ui, sans-serif; background: #F7F7F5; color: #171717; text-align: center; padding: 50px; }
            .card { background: #FFFFFF; border: 1px solid #E8E8E5; padding: 40px; border-radius: 12px; max-width: 450px; margin: 0 auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
            h1 { color: #10B981; font-size: 20px; }
            p { color: #6B6B6B; font-size: 14px; }
          </style>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'ORKA_AUTH_SUCCESS', sessionId: '${session.sessionId}' }, '*');
              setTimeout(() => window.close(), 600);
            } else {
              setTimeout(() => { window.location.href = '/'; }, 800);
            }
          </script>
        </head>
        <body>
          <div class="card">
            <h1>✓ Google Workspace Connected</h1>
            <p>Welcome, ${user.name} (${user.email}).</p>
            <p>Redirecting to OrkaAI...</p>
          </div>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`Authentication failed: ${err.message}`);
  }
});

// Logout endpoint revoking session
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
