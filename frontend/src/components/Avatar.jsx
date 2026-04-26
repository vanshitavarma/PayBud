import { cn, getInitials, stringToColor } from '@/utils';

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[12px]',
  md: 'w-10 h-10 text-[14px]',
  lg: 'w-12 h-12 text-[16px]',
  xl: 'w-16 h-16 text-[20px]',
};

export default function Avatar({
  src,
  name,
  size = 'md',
  className,
  ...props
}) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover shrink-0',
          sizeMap[size],
          className
        )}
        onError={(e) => {
          // Fallback to initials on image load failure
          e.target.style.display = 'none';
          e.target.nextSibling?.classList.remove('hidden');
        }}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center font-semibold text-white select-none',
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: bgColor }}
      title={name}
      {...props}
    >
      {initials}
    </div>
  );
}

/**
 * Stacked group of avatars.
 */
Avatar.Group = function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const visible = users.slice(0, max);
  const remainder = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar
          key={user.id || i}
          name={user.name}
          src={user.avatar}
          size={size}
          className="ring-2 ring-surface-raised"
        />
      ))}
      {remainder > 0 && (
        <div
          className={cn(
            'rounded-full shrink-0 flex items-center justify-center font-medium bg-surface-sunken text-text-secondary ring-2 ring-surface-raised',
            sizeMap[size],
          )}
        >
          +{remainder}
        </div>
      )}
    </div>
  );
};
