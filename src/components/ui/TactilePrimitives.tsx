import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';

export const GlassPanel: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <Card className={`p-4 ${className}`}>{children}</Card>
);

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void; hoverable?: boolean }> = ({ children, className = '', onClick, hoverable = false }) => (
  <Card onClick={onClick} hoverEffect={hoverable} className={className}>
    {children}
  </Card>
);

export const TactileButton: React.FC<any> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', className = '' }) => {
  const mappedVariant = variant === 'light' ? 'secondary' : variant === 'dark' ? 'outline' : 'primary';
  return (
    <Button type={type} onClick={onClick} disabled={disabled} variant={mappedVariant} className={className}>
      {children}
    </Button>
  );
};

export const TactileToggle: React.FC<{ checked: boolean; onChange: (val: boolean) => void; label?: string }> = ({ checked, onChange, label }) => (
  <div onClick={() => onChange(!checked)} className="flex items-center gap-2 cursor-pointer select-none">
    <div className={`w-7 h-4 rounded-full p-0.5 border ${checked ? 'bg-text-primary border-text-primary' : 'bg-background-elevated border-border-subtle'}`}>
      <div className={`w-2.5 h-2.5 rounded-full bg-background-card transition-transform ${checked ? 'translate-x-3' : 'translate-x-0'}`} />
    </div>
    {label && <span className="text-xs text-text-secondary">{label}</span>}
  </div>
);

export const AIActivityIndicator: React.FC<any> = ({ label }) => (
  <div className="flex items-center gap-1.5 font-mono text-xs text-text-secondary">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    {label && <span>{label}</span>}
  </div>
);

export const StatusIndicator: React.FC<{ status: string; text?: string }> = ({ status, text }) => (
  <Badge variant={status === 'connected' || status === 'completed' ? 'success' : 'neutral'}>
    {text || status}
  </Badge>
);
