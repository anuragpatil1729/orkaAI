import React, { useState } from 'react';
import { Mail, Sparkles, RefreshCw, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GlassPanel, TactileButton, AIIndicator } from '../ui/NeoTactileSystem';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';

interface CheckScanMailButtonProps {
  onScanComplete: (newTasks: EmailTaskItem[], allTasks: EmailTaskItem[]) => void;
}

export const CheckScanMailButton: React.FC<CheckScanMailButtonProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleScanMail = async () => {
    setIsScanning(true);
    setScanMessage('Connecting to Gmail API & searching candidate threads...');
    try {
      setTimeout(() => setScanMessage('Running Gemini semantic task classifier...'), 1200);

      const res = await fetch('/api/mail/scan', { method: 'POST' });
      const data = await res.json();

      setIsScanning(false);
      setScanMessage(null);
      if (data.allTasks) {
        onScanComplete(data.newTasks || [], data.allTasks || []);
      }
    } catch (err) {
      console.error('Mail scan failed:', err);
      setIsScanning(false);
      setScanMessage(null);
    }
  };

  return (
    <GlassPanel glowEdge={true} className="p-8 border border-cyan-400/40 shadow-2xl relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AUTONOMOUS EMAIL SCANNER</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Check & Scan My Mail
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
            Scans your authenticated Gmail inbox for actionable work, repository invitations, bug reports, and task assignments.
          </p>

          {scanMessage && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 animate-pulse pt-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{scanMessage}</span>
            </div>
          )}
        </div>

        {/* Hero Scan Action Button */}
        <TactileButton
          onClick={handleScanMail}
          disabled={isScanning}
          variant="primary"
          size="lg"
          className="py-5 px-8 text-white font-extrabold justify-center shadow-[0_15px_35px_rgba(59,130,246,0.4)] hover:shadow-[0_20px_45px_rgba(34,211,238,0.5)] shrink-0"
        >
          {isScanning ? (
            <div className="flex items-center gap-3">
              <AIIndicator size="sm" active={true} />
              <span>✦ Scanning your workspace...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              <span className="text-base">✦ Check & Scan My Mail</span>
              <ArrowRight className="w-4 h-4 ml-1 text-white" />
            </div>
          )}
        </TactileButton>
      </div>
    </GlassPanel>
  );
};
