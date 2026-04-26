/**
 * Merge class names, filtering out falsy values.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Extract initials from a full name (max 2 chars).
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Truncate a string with ellipsis.
 */
export function truncate(str, maxLen = 40) {
  if (!str || str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}

/**
 * Debounce a function.
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/**
 * Generate a deterministic color from a string (for avatars).
 */
export function stringToColor(str) {
  if (!str) return '#6B6966';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#1E3A5F', '#2E86AB', '#4a8c5c', '#b84c42', '#d49a3e',
    '#7a5195', '#3d7a4e', '#9e3f37', '#277495', '#83332d',
  ];
  return colors[Math.abs(hash) % colors.length];
}
