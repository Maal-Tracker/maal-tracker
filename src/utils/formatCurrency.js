// Small reusable currency formatter
const SYMBOLS = {
  USD: { symbol: '$', position: 'prefix' },
  EUR: { symbol: '€', position: 'prefix' },
  SOS: { symbol: 'Sh', position: 'prefix' }
};

export function getCurrencySymbol(code = 'USD') {
  return SYMBOLS[code]?.symbol || '$';
}

export function formatCurrency(amount, code = 'USD', opts = {}) {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = opts;
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits });
  const meta = SYMBOLS[code] || SYMBOLS['USD'];
  if (meta.position === 'prefix') return `${meta.symbol}${formatted}`;
  return `${formatted}${meta.symbol}`;
}

export const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'SOS'];
