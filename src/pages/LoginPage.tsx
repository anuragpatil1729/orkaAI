import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-text-primary select-none">
      <div className="w-full max-w-sm text-center space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <img src="/logo.png" alt="OrkaAI" className="w-7 h-7 rounded object-cover" />
            <span className="font-semibold text-lg tracking-tight text-text-primary">OrkaAI</span>
          </div>
          <p className="text-sm font-medium text-text-secondary">
            Your work, automated.
          </p>
        </div>

        {/* Content Box */}
        <div className="p-6 rounded-lg bg-background-card border border-border-subtle space-y-5">
          <p className="text-xs text-text-secondary leading-relaxed">
            Connect your Google Workspace to let OrkaAI work on your behalf.
          </p>

          <Button
            onClick={loginWithGoogle}
            variant="primary"
            size="lg"
            className="w-full py-2.5 text-xs font-semibold justify-center"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="#ffffff"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#ffffff"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#ffffff"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#ffffff"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="pt-2 border-t border-border-subtle text-center space-y-1">
            <h4 className="text-[11px] font-semibold text-text-primary">Privacy</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Your account stays yours. You can disconnect access at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
