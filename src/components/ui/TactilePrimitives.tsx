import React from 'react';

// Level 1: Glass Panel
export const GlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`neo-glass-panel ${className}`}>{children}</div>
);

// Level 2: Elevated Glass Card
export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}> = ({ children, className = '', onClick, hoverable = true }) => (
  <div
    onClick={onClick}
    className={`neo-glass-card ${hoverable ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);

// Level 4: Primary Electric Blue or Tactile Light Button
export const TactileButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'light' | 'dark' | 'cyan';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}> = ({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  let baseClass = 'neo-button-primary px-5 py-2.5 text-sm flex items-center justify-center gap-2 select-none';
  if (variant === 'light') {
    baseClass = 'neo-button-light px-5 py-2.5 text-sm flex items-center justify-center gap-2 select-none';
  } else if (variant === 'dark') {
    baseClass =
      'bg-[#10151D] hover:bg-[#151D28] text-slate-200 border border-white/10 rounded-[18px] px-5 py-2.5 text-sm font-semibold shadow-inner flex items-center justify-center gap-2 select-none transition-all';
  } else if (variant === 'cyan') {
    baseClass =
      'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 rounded-[18px] px-5 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 select-none transition-all';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabled ? 'opacity-40 cursor-not-allowed transform-none' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Physical Toggle Switch
export const TactileToggle: React.FC<{
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  sublabel?: string;
}> = ({ checked, onChange, label, sublabel }) => (
  <div
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between cursor-pointer select-none group"
  >
    {(label || sublabel) && (
      <div className="flex flex-col">
        {label && <span className="text-sm font-semibold text-slate-200">{label}</span>}
        {sublabel && <span className="text-xs text-slate-400">{sublabel}</span>}
      </div>
    )}
    <div className={`neo-toggle-track ${checked ? 'active' : ''}`}>
      <div className="neo-toggle-knob" />
    </div>
  </div>
);

// Level 5: AI Activity Pulse Ring
export const AIActivityIndicator: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  label?: string;
}> = ({ size = 'md', active = true, label }) => {
  const sizeMap = {
    sm: 'w-2.5 h-2.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative flex items-center justify-center">
        {active && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
        )}
        <span className={`relative inline-flex rounded-full bg-cyan-400 ${sizeMap[size]} ${active ? 'shadow-[0_0_12px_#22D3EE]' : 'opacity-40'}`} />
      </div>
      {label && <span className="text-xs font-semibold text-cyan-300 font-mono tracking-wider">{label}</span>}
    </div>
  );
};

// Restrained Status Indicator
export const StatusIndicator: React.FC<{
  status: 'connected' | 'disconnected' | 'running' | 'waiting' | 'failed' | 'completed';
  text?: string;
}> = ({ status, text }) => {
  const configs = {
    connected: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400', label: text || 'CONNECTED' },
    disconnected: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400', label: text || 'DISCONNECTED' },
    running: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400 animate-pulse', label: text || 'RUNNING' },
    waiting: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', dot: 'bg-amber-400 animate-ping', label: text || 'APPROVAL REQUIRED' },
    failed: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-400', label: text || 'FAILED' },
    completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', dot: 'bg-emerald-400', label: text || 'VERIFIED & COMPLETED' },
  };

  const c = configs[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${c.bg} ${c.text} border ${c.border} text-xs font-medium tracking-wide`}>
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      <span>{c.label}</span>
    </div>
  );
};
