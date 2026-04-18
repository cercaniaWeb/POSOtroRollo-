import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:     "bg-primary text-primary-foreground shadow-neu-sm",
    secondary:   "bg-surface text-foreground shadow-neu-sm",
    destructive: "bg-danger text-danger-foreground shadow-neu-sm",
    success:     "bg-success text-success-foreground shadow-neu-sm",
    outline:     "bg-surface text-foreground-muted shadow-neu-inset",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export default Badge;
