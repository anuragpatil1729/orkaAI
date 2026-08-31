import { Router } from 'express';
import { geminiService } from '../ai/geminiService';

const router = Router();

router.get('/status', (req, res) => {
  const hasClientId = !!process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here';
  res.json({
    workspace: {
      connected: true, // Demo environment active
      userEmail: 'alex.v@actionos.ai',
      services: {
        gmail: true,
        calendar: true,
        drive: true
      }
    },
    gemini: {
      configured: geminiService.isConfigured()
    },
    oauthAvailable: hasClientId
  });
});

export default router;
