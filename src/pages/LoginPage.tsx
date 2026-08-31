import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { GlassPanel, TactileButton } from '../components/ui/NeoTactileSystem';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting spotlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

      <GlassPanel glowEdge={true} className="w-full max-w-lg p-10 shadow-2xl border border-white/20 text-center space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="space-y-4">
          <div className="relative inline-block">
            <img
              src="/logo.png"
              alt="OrkaAI Logo"
              className="w-16 h-16 rounded-3xl object-cover border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.4)] mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#17233B] flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black tracking-tight text-white">Orka<span className="text-blue-500">AI</span></span>
              <span className="text-xs uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                OS
              </span>
            </div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mt-1">
              AUTONOMOUS EMAIL-TO-ACTION AGENT
            </p>
          </div>
        </div>

        {/* Hero Tagline */}
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white leading-tight">
            "Tell it the outcome. <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              It handles the work.
            </span>"
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto font-medium">
            Connect your Google Workspace. OrkaAI scans actionable emails, generates tool execution plans, modifies code, runs tests, and pushes verified results.
          </p>
        </div>

        {/* Google OAuth Login Button */}
        <div className="pt-2 space-y-4">
          <TactileButton
            onClick={loginWithGoogle}
            variant="light"
            size="lg"
            className="w-full py-4 text-slate-900 justify-center shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_45px_rgba(59,130,246,0.3)]"
          >
            <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 ml-1 text-slate-600" />
          </TactileButton>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>OAuth 2.0 • Gmail, Calendar, & Drive Access</span>
          </div>
        </div>

        {/* Policy Invariant Note */}
        <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400 space-y-1 text-left font-mono">
          <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>ORKA SECURITY INVARIANT</span>
          </div>
          <p className="leading-relaxed">
            Your Google credentials and API keys remain encrypted on the server. High-risk actions always require human sign-off before transmission.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
};
