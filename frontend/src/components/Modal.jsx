import { useEffect, useRef } from 'react';
import { cn } from '@/utils';

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  maxWidth = 'sm',
}) {
  const dialogRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const widths = {
    xs: 'max-w-[340px]',
    sm: 'max-w-[420px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[640px]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary-900/30"
        style={{ animation: 'modal-backdrop-in 150ms ease-out' }}
        onClick={onClose}
        aria-hidden
      />

      {/* Content */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative w-full bg-surface-raised rounded-xl shadow-[var(--shadow-lg)]',
          'border border-border',
          widths[maxWidth],
          className
        )}
        style={{ animation: 'modal-content-in 200ms ease-out' }}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 pt-4 pb-2">
            <h3 className="text-[16px] font-semibold text-text-primary">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-text-tertiary hover:text-text-primary transition-colors p-1 rounded-md hover:bg-surface-sunken cursor-pointer"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-3">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 pb-4 pt-2 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
