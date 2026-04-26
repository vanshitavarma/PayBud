/**
 * Relative time string (e.g. "2 hours ago", "yesterday").
 */
export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;

  return formatDate(dateStr);
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr, options = {}) {
  const date = new Date(dateStr);
  const defaults = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', { ...defaults, ...options });
}

/**
 * Format date with time.
 */
export function formatDateTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get a short month-day label (e.g., "Mar 31").
 */
export function shortDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}
