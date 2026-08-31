import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  connected: boolean;
  sessionId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const sessionId = localStorage.getItem('orka_session_id');
      const headers: Record<string, string> = {};
      if (sessionId) headers['x-orka-session-id'] = sessionId;

      const res = await fetch('/api/auth/status', { headers });
      const data = await res.json();

      if (data.workspace?.connected) {
        setUser({
          name: data.workspace.userName || 'Workspace User',
          email: data.workspace.userEmail || '',
          avatarUrl: data.workspace.avatarUrl,
          connected: true,
          sessionId: data.session?.sessionId
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ORKA_AUTH_SUCCESS' && event.data.sessionId) {
        localStorage.setItem('orka_session_id', event.data.sessionId);
        checkAuthStatus();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loginWithGoogle = () => {
    window.open('/api/auth/google/login', 'OrkaGoogleAuth', 'width=600,height=700');
  };

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('orka_session_id');
      const headers: Record<string, string> = {};
      if (sessionId) headers['x-orka-session-id'] = sessionId;

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('orka_session_id');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.connected,
        isLoading,
        loginWithGoogle,
        logout,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
