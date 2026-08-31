import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

/* ==========================================================================
   1. GLASS PANEL — Floating translucent frosted glass slab
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
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'relative rounded-[36px] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 overflow-hidden',
        theme === 'dark'
          ? 'bg-[#17233B]/75 border border-white/[0.18] shadow-[0_30px_90px_rgba(0,0,0,0.55),inset_0_1px_1px_rgba(255,255,255,0.25)]'
          : 'bg-white/70 border border-white/80 shadow-[0_20px_70px_rgba(30,58,138,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-900',
        glowEdge && theme === 'dark' && 'after:absolute after:bottom-0 after:right-0 after:w-40 after:h-40 after:bg-cyan-400/20 after:blur-3xl after:pointer-events-none',
        glowEdge && theme === 'light' && 'after:absolute after:bottom-0 after:right-0 after:w-40 after:h-40 after:bg-blue-400/15 after:blur-3xl after:pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   2. GLASS CARD — Floating surface matching Image 2's cards
   ========================================================================== */
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={cn(
        'rounded-[28px] p-6 transition-all duration-300 backdrop-blur-xl',
        theme === 'dark'
          ? 'bg-[#1D2E4D]/80 border border-white/[0.15] shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] text-slate-100'
          : 'bg-white/75 border border-white/90 shadow-[0_15px_40px_rgba(37,99,235,0.08),inset_0_1px_1px_rgba(255,255,255,0.95)] text-slate-900',
        hoverEffect && 'hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(0,0,0,0.45),0_0_20px_rgba(59,130,246,0.2)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/* ==========================================================================
   3. EXECUTION DIAL GAUGE — Semi-circular radial progress arc matching Image 2
   ========================================================================== */
interface ExecutionDialGaugeProps {
  progress: number; // 0 to 100
  title?: string;
  subtitle?: string;
  size?: number;
}

export const ExecutionDialGauge: React.FC<ExecutionDialGaugeProps> = ({
  progress,
  title = 'Progress',
  subtitle = 'Track Record',
  size = 200,
}) => {
  const { theme } = useTheme();
  const radius = (size - 30) / 2;
  const circumference = Math.PI * radius; // Semi-circle arc
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <svg width={size} height={size / 1.5} className="overflow-visible">
        {/* Background Arc Ticks */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)'}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(180 ${size / 2} ${size / 2})`}
        />
        {/* Active Animated Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#blueCyanGradient)"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(180 ${size / 2} ${size / 2})`}
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="blueCyanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#42DFF5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Label */}
      <div className="absolute top-[32%] text-center">
        <span className={cn('text-3xl font-extrabold tracking-tight', theme === 'dark' ? 'text-white' : 'text-slate-900')}>
          {Math.round(progress)}%
        </span>
        <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-cyan-400 mt-0.5">
          {title}
        </p>
      </div>
    </div>
  );
};

/* ==========================================================================
   4. TACTILE BUTTON — Large rounded pill button (9999px)
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
  const { theme } = useTheme();

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-extrabold tracking-tight transition-all duration-250 select-none rounded-full cursor-pointer',
        'active:translate-y-0.5 active:scale-[0.98]',
        // Primary Blue Pill
        variant === 'primary' &&
          'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white border border-blue-400/50 shadow-[0_12px_30px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_18px_40px_rgba(59,130,246,0.7),0_0_25px_rgba(66,223,245,0.6)] hover:-translate-y-0.5',
        // Light White Pill
        variant === 'light' &&
          'bg-gradient-to-b from-white to-slate-200 text-slate-950 border border-white shadow-[0_12px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.9)] hover:from-white hover:to-slate-100 hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:-translate-y-0.5',
        // Translucent Glass Pill
        variant === 'glass' &&
          (theme === 'dark'
            ? 'bg-white/[0.12] text-slate-100 border border-white/20 backdrop-blur-md hover:bg-white/[0.2] hover:border-white/30'
            : 'bg-slate-900/10 text-slate-800 border border-slate-900/15 backdrop-blur-md hover:bg-slate-900/15'),
        // Danger Pill
        variant === 'danger' &&
          'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30',
        // Sizes
        size === 'sm' && 'px-4 py-1.5 text-xs',
        size === 'md' && 'px-6 py-3 text-xs',
        size === 'lg' && 'px-8 py-4 text-sm',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

/* ==========================================================================
   5. TACTILE ICON BUTTON — Round tactile icon control with cyan activity ring
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
  const { theme } = useTheme();

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer select-none',
        theme === 'dark'
          ? 'bg-slate-800/80 text-slate-300 border border-white/15 backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.4)] hover:text-white'
          : 'bg-slate-200 text-slate-700 border border-slate-300 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:text-slate-900',
        'hover:scale-105 active:scale-95',
        size === 'sm' && 'w-9 h-9 text-xs',
        size === 'md' && 'w-11 h-11 text-sm',
        size === 'lg' && 'w-14 h-14 text-base',
        activeRing &&
          activeColor === 'cyan' &&
          'border-cyan-400 text-cyan-300 shadow-[0_0_25px_rgba(66,223,245,0.7)] animate-pulse',
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
   6. THEME TOGGLE PILL CONTROL — Physical 3D glass light/dark theme switcher
   ========================================================================== */
export const ThemeTogglePill: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center gap-2 p-1.5 rounded-full cursor-pointer select-none transition-all duration-300 border',
        theme === 'dark'
          ? 'bg-[#17233B]/90 border-white/20 text-slate-200 shadow-inner'
          : 'bg-white/80 border-slate-300 text-slate-800 shadow-inner',
        className
      )}
      title="Toggle Light / Dark Mode"
    >
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300',
          theme === 'light'
            ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.5)]'
            : 'text-slate-400 hover:text-slate-200'
        )}
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </div>
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300',
          theme === 'dark'
            ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.5)]'
            : 'text-slate-500 hover:text-slate-800'
        )}
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </div>
    </div>
  );
};

/* ==========================================================================
   7. TACTILE TOGGLE SWITCH — Physical 3D toggle switch with raised thumb
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
  const { theme } = useTheme();

  return (
    <label className={cn('inline-flex items-center gap-3 cursor-pointer select-none', className)}>
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-14 h-8 rounded-full p-1 transition-all duration-300 border shadow-inner',
          checked
            ? 'bg-blue-600 border-blue-400/60 shadow-[0_0_18px_rgba(59,130,246,0.6)]'
            : theme === 'dark'
            ? 'bg-slate-800/90 border-white/10'
            : 'bg-slate-300 border-slate-400'
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
      {label && <span className={cn('text-xs font-semibold', theme === 'dark' ? 'text-slate-300' : 'text-slate-700')}>{label}</span>}
    </label>
  );
};

/* ==========================================================================
   8. GLASS INPUT & TEXTAREA — Custom dark/light glass inputs
   ========================================================================== */
export const GlassInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const { theme } = useTheme();

  return (
    <input
      ref={ref}
      className={cn(
        'w-full px-5 py-3.5 rounded-2xl font-medium text-xs outline-none transition-all duration-200',
        theme === 'dark'
          ? 'bg-black/60 border border-white/20 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(66,223,245,0.4)]'
          : 'bg-white/80 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
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
  const { theme } = useTheme();

  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full p-5 rounded-2xl font-medium text-xs outline-none transition-all duration-200 resize-none leading-relaxed',
        theme === 'dark'
          ? 'bg-black/60 border border-white/20 text-slate-100 placeholder:text-slate-400 focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(66,223,245,0.4)]'
          : 'bg-white/80 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
        className
      )}
      {...props}
    />
  );
});
GlassTextarea.displayName = 'GlassTextarea';

/* ==========================================================================
   9. STATUS PILL — Restrained status badge
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
    styleClasses = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_12px_rgba(52,211,153,0.3)]';
    defaultText = status === 'connected' ? 'CONNECTED' : '✓ VERIFIED';
  } else if (status === 'running') {
    styleClasses = 'bg-blue-500/25 text-blue-300 border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse';
    defaultText = 'RUNNING';
  } else if (status === 'waiting_approval') {
    styleClasses = 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-bounce';
    defaultText = 'APPROVAL REQUIRED';
  } else if (status === 'failed' || status === 'disconnected') {
    styleClasses = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    defaultText = status === 'disconnected' ? 'OFFLINE' : 'FAILED';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider',
        styleClasses,
        className
      )}
    >
      {text || defaultText}
    </span>
  );
};

/* ==========================================================================
   10. AI INDICATOR — Cyan pulse energy dot
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
          'relative inline-flex rounded-full bg-cyan-400 shadow-[0_0_12px_#42DFF5]',
          size === 'sm' && 'w-2 h-2',
          size === 'md' && 'w-3 h-3'
        )}
      />
    </div>
  );
};
