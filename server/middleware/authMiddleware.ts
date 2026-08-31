import { Request, Response, NextFunction } from 'express';
import { sessionStore, UserSession } from '../storage/sessionStore';

export interface AuthenticatedRequest extends Request {
  session?: UserSession;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionId = req.headers['x-orka-session-id'] as string || req.cookies?.orka_session_id;

  if (!sessionId) {
    // Check if development/demo bypass is active when no tokens/sessions exist
    const session = sessionStore.getSession(sessionId);
    if (!session) {
      return res.status(401).json({
        error: 'Unauthorized: Session missing or expired. Please sign in with Google.',
        code: 'UNAUTHORIZED'
      });
    }
  }

  const session = sessionStore.getSession(sessionId);
  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: Session missing or expired. Please sign in with Google.',
      code: 'UNAUTHORIZED'
    });
  }

  req.session = session;
  next();
}

export function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const sessionId = req.headers['x-orka-session-id'] as string || req.cookies?.orka_session_id;
  if (sessionId) {
    const session = sessionStore.getSession(sessionId);
    if (session) {
      req.session = session;
    }
  }
  next();
}
