import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 rounded-lg border border-border-subtle bg-background-card text-center flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="w-8 h-8 rounded-md bg-background-elevated flex items-center justify-center text-text-muted">
        <Icon className="w-4 h-4" />
      </div>
      <div className="max-w-xs space-y-0.5">
        <h3 className="text-xs font-semibold text-text-primary">{title}</h3>
        <p className="text-[11px] text-text-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-1">
          <Button onClick={onAction} variant="secondary" size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
