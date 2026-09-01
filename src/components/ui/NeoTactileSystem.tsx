import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';
import { Badge } from './Badge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn('rounded-lg bg-background-card border border-border-subtle p-5', className)} {...props}>
      {children}
    </div>
  );
};

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div className={cn('rounded-lg bg-background-card border border-border-subtle p-5 transition-colors', hoverEffect && 'hover:border-border-strong', className)} {...props}>
      {children}
    </div>
  );
};

export const ExecutionDialGauge: React.FC<{ progress: number; title?: string; size?: number }> = ({ progress }) => {
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
      <div className="w-16 h-1.5 rounded-full bg-background-elevated overflow-hidden border border-border-subtle">
        <div className="h-full bg-text-primary transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <span className="font-semibold">{Math.round(progress)}%</span>
    </div>
  );
};

export const TactileButton: React.FC<any> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const mappedVariant = variant === 'light' || variant === 'glass' ? 'secondary' : variant === 'danger' ? 'danger' : 'primary';
  return (
    <Button variant={mappedVariant} size={size} className={className} {...props}>
      {children}
    </Button>
  );
};

export const TactileIconButton: React.FC<any> = ({ icon, size = 'md', className, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-border-subtle bg-background-card hover:bg-background-elevated text-text-secondary hover:text-text-primary transition-colors cursor-pointer',
        size === 'sm' && 'w-7 h-7 text-xs',
        size === 'md' && 'w-8 h-8 text-xs',
        size === 'lg' && 'w-9 h-9 text-sm',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

export const ThemeTogglePill: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border-subtle bg-background-card hover:bg-background-elevated text-xs font-medium text-text-secondary transition-colors cursor-pointer',
        className
      )}
      title="Toggle Light / Dark Mode"
    >
      {theme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
      <span className="capitalize text-text-primary text-[11px]">{theme}</span>
    </button>
  );
};

export const TactileToggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; className?: string; label?: string }> = ({ checked, onChange, className, label }) => {
  return (
    <label className={cn('inline-flex items-center gap-2 cursor-pointer select-none', className)}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-7 h-4 rounded-full p-0.5 transition-colors border',
          checked ? 'bg-text-primary border-text-primary' : 'bg-background-elevated border-border-subtle'
        )}
      >
        <div className={cn('w-2.5 h-2.5 rounded-full bg-background-card transition-transform', checked ? 'translate-x-3' : 'translate-x-0')} />
      </div>
      {label && <span className="text-xs text-text-secondary font-medium">{label}</span>}
    </label>
  );
};

export const GlassInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn('w-full px-3 py-1.5 rounded-md bg-background-surface border border-border-subtle text-text-primary placeholder:text-text-muted text-xs font-medium outline-none transition-colors focus:border-border-strong', className)}
      {...props}
    />
  );
});
GlassInput.displayName = 'GlassInput';

export const GlassTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn('w-full p-3 rounded-md bg-background-surface border border-border-subtle text-text-primary placeholder:text-text-muted text-xs font-medium outline-none transition-colors resize-none focus:border-border-strong', className)}
      {...props}
    />
  );
});
GlassTextarea.displayName = 'GlassTextarea';

export const StatusPill: React.FC<{ status: string; text?: string; className?: string }> = ({ status, text, className }) => {
  const mapVariant = {
    completed: 'success',
    connected: 'success',
    running: 'info',
    waiting_approval: 'warning',
    pending: 'neutral',
    failed: 'error',
    disconnected: 'error',
  } as any;

  return (
    <Badge variant={mapVariant[status] || 'neutral'} className={className}>
      {text || status}
    </Badge>
  );
};

export const AIIndicator: React.FC<{ active?: boolean; size?: 'sm' | 'md' }> = ({ active = true }) => {
  return (
    <span className="relative flex h-2 w-2">
      {active && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
    </span>
  );
};
