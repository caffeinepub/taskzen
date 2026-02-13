import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  children: ReactNode;
  size?: 'default' | 'lg';
  className?: string;
  onClick?: () => void;
}

export default function PrimaryButton({ 
  children, 
  size = 'default', 
  className,
  onClick 
}: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'shadow-soft hover:shadow-soft-lg',
        size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base',
        className
      )}
    >
      {children}
    </button>
  );
}
