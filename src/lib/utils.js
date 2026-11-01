import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Safely format currency. Returns fallback ('N/A') if amount is non-numeric or unavailable.
 */
export function formatCurrency(amount, currency = 'USD', fallback = 'N/A') {
  if (amount === null || amount === undefined || amount === '') return fallback;
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return fallback;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

/**
 * Safely format kWh readings. Returns fallback ('N/A') if amount is non-numeric or unavailable.
 */
export function formatKwh(amount, decimals = 1, fallback = 'N/A') {
  if (amount === null || amount === undefined || amount === '') return fallback;
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return fallback;
  return `${num.toFixed(decimals)} kWh`;
}

/**
 * Safely format a number with fixed decimals. Returns fallback ('N/A') if amount is non-numeric.
 */
export function formatNumber(amount, decimals = 1, fallback = 'N/A') {
  if (amount === null || amount === undefined || amount === '') return fallback;
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return fallback;
  return num.toFixed(decimals);
}

/**
 * Safely format a percentage. Returns fallback ('N/A') if amount is non-numeric.
 */
export function formatPercent(amount, decimals = 1, fallback = 'N/A') {
  if (amount === null || amount === undefined || amount === '') return fallback;
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return fallback;
  return `${num.toFixed(decimals)}%`;
}
