import { cn } from '@/utils';

export default function Card({
  children,
  className,
  hoverable = false,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    compact: 'px-3 py-3',
    default: 'px-5 py-4',
    relaxed: 'px-6 py-5',
  };

  return (
    <div
      className={cn(
        'bg-surface-raised rounded-xl border border-border',
        'shadow-[var(--shadow-card)]',
        hoverable && 'transition-all duration-300 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-[1px]',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Optional sub-components for structured card layouts.
 */
Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn('mb-3', className)}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className }) {
  return <div className={cn(className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }) {
  return (
    <div
      className={cn(
        'mt-4 pt-3 border-t border-border flex items-center gap-2',
        className
      )}
    >
      {children}
    </div>
  );
};
