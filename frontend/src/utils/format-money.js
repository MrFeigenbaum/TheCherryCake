/**
 * Format money with standard locale and currency code
 * @param {number|string} amount
 * @param {string} currencyCode
 * @returns {string}
 */
export function formatMoney(amount, currencyCode = 'UZS') {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(num) + ' ' + currencyCode;
}
