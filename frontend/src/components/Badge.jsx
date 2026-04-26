import { cn } from '@/utils';

const variants = {
  default: 'bg-surface-sunken text-text-secondary',
  primary: 'bg-primary-50 text-primary-600',
  accent: 'bg-accent-50 text-accent-700',
  success: 'bg-success-50 text-success-700',
  danger: 'bg-danger-50 text-danger-700',
  warning: 'bg-warning-50 text-warning-700',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-[11px]',
  lg: 'px-2.5 py-1 text-[12px]',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap leading-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'danger' && 'bg-danger-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'accent' && 'bg-accent-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'default' && 'bg-text-tertiary',
          )}
        />
      )}
      {children}
    </span>
  );
}
