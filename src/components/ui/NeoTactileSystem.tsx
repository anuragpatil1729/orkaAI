import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================================
   1. GLASS PANEL — Large translucent frosted glass slab with optional cyan edge glow
   ========================================================================== */
interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowEdge?: boolean;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  glowEdge = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-[36px] bg-white/[0.05] border border-white/[0.12]',
        'backdrop-blur-2xl backdrop-saturate-150 shadow-[0_30px_80px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.25)]',
        'transition-all duration-300 overflow-hidden',
        glowEdge && 'after:absolute after:bottom-0 after:right-0 after:w-32 after:h-32 after:bg-cyan-400/20 after:blur-2xl after:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   2. GLASS CARD — Secondary floating glass surface with rounded corners
   ========================================================================== */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'dark' | 'light' | 'bordered';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'dark',
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-[28px] transition-all duration-250',
        variant === 'dark' && 'bg-[#0E131B]/80 border border-white/[0.09] shadow-[0_15px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]',
        variant === 'light' && 'bg-slate-100/90 text-slate-900 border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
        variant === 'bordered' && 'bg-white/[0.03] border border-blue-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]',
        hoverEffect && 'hover:-translate-y-0.5 hover:shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.15)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   3. TACTILE BUTTON — Physical raised pill button with top highlight & compress
   ========================================================================== */
interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'light' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-extrabold tracking-tight transition-all duration-200 select-none rounded-full cursor-pointer',
        'active:translate-y-0.5 active:scale-[0.98]',
        // Variants
        variant === 'primary' &&
          'bg-gradient-to-b from-blue-500 to-blue-700 text-white border border-blue-400/40 shadow-[0_10px_25px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_15px_35px_rgba(59,130,246,0.7),0_0_20px_rgba(34,211,238,0.5)] hover:from-blue-400 hover:to-blue-600',
        variant === 'light' &&
          'bg-gradient-to-b from-white to-slate-200 text-slate-900 border border-white shadow-[0_10px_25px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)] hover:from-white hover:to-slate-100 hover:shadow-[0_12px_30px_rgba(0,0,0,0.45)]',
        variant === 'glass' &&
          'bg-white/[0.07] text-slate-200 border border-white/15 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:bg-white/[0.12] hover:border-white/30 hover:text-white',
        variant === 'danger' &&
          'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_8px_20px_rgba(244,63,94,0.25)] hover:bg-rose-500/30 hover:border-rose-400',
        // Sizes
        size === 'sm' && 'px-3.5 py-1.5 text-xs',
        size === 'md' && 'px-5 py-2.5 text-xs',
        size === 'lg' && 'px-7 py-3.5 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

/* ==========================================================================
   4. TACTILE ICON BUTTON — Round tactile icon control with cyan activity ring
   ========================================================================== */
interface TactileIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  activeRing?: boolean;
  activeColor?: 'cyan' | 'blue' | 'emerald';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TactileIconButton: React.FC<TactileIconButtonProps> = ({
  icon,
  activeRing = false,
  activeColor = 'cyan',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none',
        'bg-slate-800/80 text-slate-300 border border-white/15 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]',
        'hover:text-white hover:border-white/30 hover:scale-105 active:scale-95',
        size === 'sm' && 'w-9 h-9 text-xs',
        size === 'md' && 'w-11 h-11 text-sm',
        size === 'lg' && 'w-14 h-14 text-base',
        activeRing &&
          activeColor === 'cyan' &&
          'border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.7),inset_0_0_10px_rgba(34,211,238,0.4)] animate-pulse',
        activeRing &&
          activeColor === 'blue' &&
          'border-blue-400 text-blue-300 shadow-[0_0_25px_rgba(59,130,246,0.7)] animate-pulse',
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
};

/* ==========================================================================
   5. TACTILE TOGGLE SWITCH — Physical 3D toggle switch with raised thumb
   ========================================================================== */
interface TactileToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  label?: string;
}

export const TactileToggle: React.FC<TactileToggleProps> = ({
  checked,
  onChange,
  className,
  label,
}) => {
  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer select-none', className)}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-14 h-8 rounded-full p-1 transition-all duration-300 border shadow-inner',
          checked
            ? 'bg-blue-600 border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.6)]'
            : 'bg-slate-800/90 border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]'
        )}
      >
        <div
          className={cn(
            'w-6 h-6 rounded-full bg-gradient-to-b from-white to-slate-200 transition-all duration-300',
            'shadow-[0_4px_8px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.9)]',
            checked ? 'translate-x-6' : 'translate-x-0'
          )}
        />
      </div>
      {label && <span className="text-xs font-semibold text-slate-300">{label}</span>}
    </label>
  );
};

/* ==========================================================================
   6. GLASS INPUT & TEXTAREA — Custom dark glass inputs with blue/cyan border glow
   ========================================================================== */
export const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-slate-100 text-xs font-medium placeholder:text-slate-500',
        'outline-none transition-all duration-200',
        'focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] focus:bg-black/80',
        className
      )}
      {...props}
    />
  );
});
GlassInput.displayName = 'GlassInput';

export const GlassTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full p-4 rounded-2xl bg-black/60 border border-white/15 text-slate-100 text-xs font-medium placeholder:text-slate-500 leading-relaxed',
        'outline-none transition-all duration-200 resize-none',
        'focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] focus:bg-black/80',
        className
      )}
      {...props}
    />
  );
});
GlassTextarea.displayName = 'GlassTextarea';

/* ==========================================================================
   7. STATUS PILL — Restrained status badge
   ========================================================================== */
interface StatusPillProps {
  status: 'completed' | 'running' | 'waiting_approval' | 'failed' | 'pending' | 'connected' | 'disconnected';
  text?: string;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, text, className }) => {
  let styleClasses = 'bg-slate-800/80 text-slate-400 border-white/10';
  let defaultText = status.toUpperCase();

  if (status === 'completed' || status === 'connected') {
    styleClasses = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.25)]';
    defaultText = status === 'connected' ? 'CONNECTED' : '✓ VERIFIED';
  } else if (status === 'running') {
    styleClasses = 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.4)] animate-pulse';
    defaultText = 'RUNNING';
  } else if (status === 'waiting_approval') {
    styleClasses = 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(251,191,36,0.35)] animate-bounce';
    defaultText = 'APPROVAL REQUIRED';
  } else if (status === 'failed' || status === 'disconnected') {
    styleClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    defaultText = status === 'disconnected' ? 'OFFLINE' : 'FAILED';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider',
        styleClasses,
        className
      )}
    >
      {text || defaultText}
    </span>
  );
};

/* ==========================================================================
   8. AI INDICATOR — Cyan pulse energy dot
   ========================================================================== */
export const AIIndicator: React.FC<{ active?: boolean; size?: 'sm' | 'md' }> = ({
  active = true,
  size = 'md',
}) => {
  return (
    <div className="relative flex items-center justify-center">
      {active && (
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
      )}
      <span
        className={cn(
          'relative inline-flex rounded-full bg-cyan-400 shadow-[0_0_12px_#22D3EE]',
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3'
        )}
      />
    </div>
  );
};
