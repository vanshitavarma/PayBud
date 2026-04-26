import { forwardRef } from 'react';
import { cn } from '@/utils';

const Textarea = forwardRef(function Textarea(
  { label, error, hint, id, rows = 3, className, containerClassName, ...props },
  ref
) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[13px] font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-[14px] text-text-primary',
          'placeholder:text-text-tertiary resize-y',
          'transition-colors duration-150',
          'focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-200',
          error && 'border-danger-400 focus:border-danger-500 focus:ring-danger-200',
          'disabled:bg-surface-sunken disabled:opacity-60 disabled:cursor-not-allowed',
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

export default Textarea;
