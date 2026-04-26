import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '@/store/uiSlice';
import { cn } from '@/utils';

const typeStyles = {
  success: 'border-l-success-500 bg-success-50 text-success-800',
  error: 'border-l-danger-500 bg-danger-50 text-danger-800',
  warning: 'border-l-warning-500 bg-warning-50 text-warning-800',
  info: 'border-l-accent-500 bg-accent-50 text-accent-800',
};

const typeIcons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  ),
};

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, toast.duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-lg border-l-[3px] shadow-[var(--shadow-md)]',
        'text-[13px] leading-snug',
        typeStyles[toast.type],
      )}
      style={{
        animation: exiting
          ? 'toast-out 200ms ease-in forwards'
          : 'toast-in 250ms ease-out',
      }}
    >
      <span className="mt-0.5 shrink-0">{typeIcons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => {
          setExiting(true);
          setTimeout(() => onDismiss(toast.id), 200);
        }}
        className="shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Dismiss"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.ui.toasts);
  const dispatch = useDispatch();

  const handleDismiss = (id) => dispatch(removeToast(id));

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-[380px] w-full pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
}

/**
 * Standalone alert component (inline, not floating).
 */
export function Alert({ type = 'info', children, className, onDismiss }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-2.5 px-4 py-3 rounded-lg border-l-[3px]',
        'text-[13px] leading-snug',
        typeStyles[type],
        className
      )}
    >
      <span className="mt-0.5 shrink-0">{typeIcons[type]}</span>
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 mt-0.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
