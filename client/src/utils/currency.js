export const formatCurrencyLKR = (value = 0) => {
  const amount = Number(value || 0);
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    maximumFractionDigits: 0,
  }).format(amount);
};
