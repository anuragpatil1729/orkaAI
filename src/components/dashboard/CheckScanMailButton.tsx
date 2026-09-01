import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmailTaskItem } from '../../../server/storage/emailTaskStore';
import { fetchWithAuth } from '../../utils/api';

interface CheckScanMailButtonProps {
  onScanComplete: (newTasks: EmailTaskItem[], allTasks: EmailTaskItem[]) => void;
}

export const CheckScanMailButton: React.FC<CheckScanMailButtonProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleScanMail = async () => {
    setIsScanning(true);
    setScanMessage('Scanning inbox...');
    try {
      const res = await fetchWithAuth('/api/mail/scan', { method: 'POST' });
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
    <div className="p-3.5 rounded-lg bg-background-card border border-border-subtle flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <Mail className="w-4 h-4 text-text-muted" />
        <div>
          <h3 className="text-xs font-semibold text-text-primary">
            Check & Scan Workspace Mail
          </h3>
          <p className="text-[11px] text-text-muted">
            {scanMessage || 'Scan Gmail inbox for actionable requests and repository tasks.'}
          </p>
        </div>
      </div>

      <Button
        onClick={handleScanMail}
        isLoading={isScanning}
        variant="secondary"
        size="sm"
        className="shrink-0"
      >
        <span>Scan Inbox</span>
      </Button>
    </div>
  );
};
