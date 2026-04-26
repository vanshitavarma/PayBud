import { forwardRef } from 'react';
import { cn } from '@/utils';

const Select = forwardRef(function Select(
  { label, error, id, options = [], placeholder, className, containerClassName, ...props },
  ref
) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[13px] font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-[14px] text-text-primary',
          'appearance-none',
          'transition-colors duration-150',
          'focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-200',
          error && 'border-danger-400 focus:border-danger-500 focus:ring-danger-200',
          'disabled:bg-surface-sunken disabled:opacity-60 disabled:cursor-not-allowed',
          'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B6966%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_10px_center] bg-no-repeat pr-9',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value;
          const display = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={value} value={value}>
              {display}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="text-[12px] text-danger-500 mt-0.5">{error}</p>
      )}
    </div>
  );
});

export default Select;
