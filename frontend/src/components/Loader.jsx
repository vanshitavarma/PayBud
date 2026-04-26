import { cn } from '@/utils';

/**
 * Spinning loader indicator.
 */
export function Loader({ size = 'md', className }) {
  const sizes = {
    sm: 'w-4 h-4 border-[2px]',
    md: 'w-6 h-6 border-[2.5px]',
    lg: 'w-10 h-10 border-[3px]',
  };

  return (
    <div
      className={cn(
        'rounded-full border-surface-sunken border-t-accent-500',
        sizes[size],
        className
      )}
      style={{ animation: 'spin 0.7s linear infinite' }}
      role="status"
      aria-label="Loading"
    />
  );
}

/**
 * Full-page centered loader.
 */
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader size="lg" />
        <p className="text-[13px] text-text-tertiary">Loading…</p>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for content loading states.
 */
export function Skeleton({
  width,
  height = '16px',
  rounded = 'md',
  className,
}) {
  const roundedMap = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={cn(
        'bg-surface-sunken',
        roundedMap[rounded],
        className
      )}
      style={{
        width,
        height,
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
  );
}

/**
 * Pre-built skeleton for a typical card.
 */
export function CardSkeleton() {
  return (
    <div className="bg-surface-raised rounded-xl border border-border p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width="40px" height="40px" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="14px" />
          <Skeleton width="35%" height="12px" />
        </div>
      </div>
      <Skeleton width="100%" height="12px" />
      <Skeleton width="80%" height="12px" />
    </div>
  );
}

/**
 * Skeleton for a list item row.
 */
export function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton width="32px" height="32px" rounded="full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton width="45%" height="13px" />
        <Skeleton width="25%" height="11px" />
      </div>
      <Skeleton width="60px" height="13px" />
    </div>
  );
}
