import React from 'react'
import { cn } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  /** Show the Antimatter pill-button arrow badge */
  withArrow?: boolean
}

const sizeStyles = {
  sm: 'px-4 py-2 text-sm gap-2',
  md: 'px-5 py-2.5 text-sm gap-2.5',
  lg: 'px-7 py-3.5 text-base gap-3',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  withArrow,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  if (variant === 'primary') {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[40px] transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          'btn-primary',
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : withArrow ? (
          <>
            <span>{children}</span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20">
              <ArrowRight size={14} />
            </span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }

  if (variant === 'outline') {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-[40px] transition-all duration-200',
          'btn-outline text-secondary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }

  const ghostStyles = {
    ghost: 'bg-transparent hover:bg-foreground/5 text-foreground/65 hover:text-foreground rounded-lg',
    secondary: 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80 hover:text-foreground border border-foreground/10 rounded-xl',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 rounded-xl',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        ghostStyles[variant as keyof typeof ghostStyles] ?? ghostStyles.ghost,
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}
