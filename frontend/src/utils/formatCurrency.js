/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} currency - ISO 4217 code, default 'INR'
 * @param {string} locale - BCP 47 tag, default 'en-IN'
 */
export function formatCurrency(amount, currency = 'INR', locale = 'en-IN') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Compact currency for large amounts (e.g. ₹1.2K).
 */
export function formatCurrencyCompact(amount, currency = 'INR', locale = 'en-IN') {
  if (Math.abs(amount) >= 100000) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return formatCurrency(amount, currency, locale);
}
