import React from 'react';

export interface BadgeProps {
  variant?: 'easy' | 'medium' | 'hard' | 'priority1' | 'priority2' | 'priority3' | 'teal' | 'slate' | 'amber';
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  children,
  className = '',
  size = 'xs',
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded';

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
  };

  const variantClasses = {
    easy: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium',
    medium: 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold',
    hard: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold',
    priority1: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold',
    priority2: 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-700 font-medium',
    priority3: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 font-medium',
    teal: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};
