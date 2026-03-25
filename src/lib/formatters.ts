/**
 * Format a date string into a relative time string.
 * e.g. "just now", "2 min ago", "3h ago", "5d ago"
 */
export function formatRelativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/**
 * Format cents into a dollar string.
 * $10 (no decimals if round), $10.50 otherwise.
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100;
  if (dollars === Math.floor(dollars)) return `$${dollars}`;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Format a GB number as a string: "5GB", "20GB"
 */
export function formatBytes(gb: number): string {
  return `${gb}GB`;
}
