import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants = {
    primary:     "bg-primary text-primary-foreground shadow-neu-glow active:shadow-neu-inset",
    destructive: "bg-danger text-danger-foreground shadow-neu-glow-danger active:shadow-neu-inset",
    success:     "bg-success text-success-foreground shadow-neu-glow-success active:shadow-neu-inset",
    outline:     "bg-surface text-foreground shadow-neu active:shadow-neu-inset",
    secondary:   "bg-surface text-foreground shadow-neu active:shadow-neu-inset",
    ghost:       "bg-surface text-foreground-muted shadow-neu-sm active:shadow-neu-inset",
    link:        "text-primary underline-offset-4 hover:underline shadow-none",
  };

  const sizes = {
    default: "h-10 px-5 py-2 text-sm",
    sm:      "h-9  px-4 py-1.5 text-xs",
    lg:      "h-12 px-8 text-base",
    icon:    "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-bold transition-all duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-95 hover:-translate-y-0.5",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export default Button;
