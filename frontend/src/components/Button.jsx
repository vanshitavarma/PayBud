import { cn } from '@/utils';

const variants = {
  primary:
    'bg-primary-500 text-white shadow-sm hover:shadow-md hover:bg-primary-600 hover:-translate-y-[1px] active:scale-[0.98] active:bg-primary-700',
  secondary:
    'bg-surface-raised text-primary-500 border border-border hover:shadow-sm hover:border-primary-300 hover:bg-primary-50 active:scale-[0.98] active:bg-primary-100',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-sunken hover:text-text-primary active:scale-[0.98]',
  danger:
    'bg-danger-500 text-white shadow-sm hover:shadow-md hover:bg-danger-600 hover:-translate-y-[1px] active:scale-[0.98] active:bg-danger-700',
};

const sizes = {
  sm: 'px-3 py-1.5 text-[13px] rounded-md',
  md: 'px-4 py-2 text-[14px] rounded-lg',
  lg: 'px-5 py-2.5 text-[15px] rounded-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:active:scale-100 disabled:hover:shadow-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
