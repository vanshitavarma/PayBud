import { forwardRef } from 'react';
import { cn } from '@/utils';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    id,
    type = 'text',
    className,
    containerClassName,
    ...props
  },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={cn(
          'w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-[14px] text-text-primary',
          'placeholder:text-text-tertiary',
          'transition-colors duration-150',
          'focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-200',
          error && 'border-danger-400 focus:border-danger-500 focus:ring-danger-200',
          'disabled:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-[12px] text-danger-500 mt-0.5">{error}</p>
      )}
      {hint && !error && (
        <p className="text-[12px] text-text-tertiary mt-0.5">{hint}</p>
      )}
    </div>
  );
});

export default Input;
