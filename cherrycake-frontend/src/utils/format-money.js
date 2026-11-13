/**
 * Currency symbols mapping according to international ISO 4217 & project specifications
 */
export const CURRENCY_SYMBOLS = {
  UZS: "so'm",
  KZT: '₸',
  GEL: '₾',
  UAH: '₴',
  CNY: '¥',
  SEK: 'kr',
  EUR: '€',
  BYN: 'Br',
  AMD: '֏',
  RUB: '₽',
  USD: '$'
};

/**
 * Format money with standard locale and currency symbol/code
 * @param {number|string} amount
 * @param {string} currencyCode
 * @param {boolean} useSymbol
 * @returns {string}
 */
export function formatMoney(amount, currencyCode = 'UZS', useSymbol = true) {
  const num = Number(amount) || 0;
  const symbol = useSymbol && CURRENCY_SYMBOLS[currencyCode] ? CURRENCY_SYMBOLS[currencyCode] : currencyCode;
  const fractionDigits = ['UZS', 'KZT', 'AMD'].includes(currencyCode) ? 0 : 2;

  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: 2
  }).format(num);

  return `${formatted} ${symbol}`;
}

export default formatMoney;