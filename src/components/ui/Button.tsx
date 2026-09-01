import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, className, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-100 select-none cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-accent hover:bg-accent-hover text-background-card shadow-subtle border border-accent/20 active:scale-[0.99]',
      secondary: 'bg-background-elevated hover:bg-border-subtle text-text-primary border border-border-subtle active:scale-[0.99]',
      outline: 'bg-background-surface hover:bg-background-elevated border border-border-subtle text-text-primary active:scale-[0.99]',
      ghost: 'bg-transparent hover:bg-background-elevated text-text-secondary hover:text-text-primary active:scale-[0.99]',
      danger: 'bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 active:scale-[0.99]',
    };

    const sizes = {
      sm: 'px-2.5 py-1 text-xs gap-1.5',
      md: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
      lg: 'px-4 py-2 text-sm font-semibold gap-2',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
