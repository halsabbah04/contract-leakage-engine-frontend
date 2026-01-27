import { format, formatDistance, parseISO } from 'date-fns';
import { Severity } from '@contract-leakage/shared-types';

/**
 * Formatting utilities inspired by KPMG ESG design system
 */

/**
 * Format date to localized string
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number,
  decimals: number = 1
): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format confidence score as percentage
 */
export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Get severity color (matches backend brand_constants.py)
 */
export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    [Severity.CRITICAL]: '#d32f2f',
    [Severity.HIGH]: '#f57c00',
    [Severity.MEDIUM]: '#fbc02d',
    [Severity.LOW]: '#388e3c',
    [Severity.INFO]: '#2196f3',
  };

  return colors[severity] || colors[Severity.LOW];
}

/**
 * Get severity badge classes for Tailwind
 */
export function getSeverityBadgeClasses(severity: Severity): string {
  const classes: Record<Severity, string> = {
    [Severity.CRITICAL]: 'bg-severity-critical text-white',
    [Severity.HIGH]: 'bg-severity-high text-white',
    [Severity.MEDIUM]: 'bg-severity-medium text-gray-900',
    [Severity.LOW]: 'bg-severity-low text-white',
    [Severity.INFO]: 'bg-blue-500 text-white',
  };

  return classes[severity] || classes[Severity.LOW];
}

/**
 * Get severity background classes (light) for Tailwind
 */
export function getSeverityBackgroundClasses(severity: Severity): string {
  const classes: Record<Severity, string> = {
    [Severity.CRITICAL]: 'bg-severity-critical-light',
    [Severity.HIGH]: 'bg-severity-high-light',
    [Severity.MEDIUM]: 'bg-severity-medium-light',
    [Severity.LOW]: 'bg-severity-low-light',
    [Severity.INFO]: 'bg-blue-100',
  };

  return classes[severity] || classes[Severity.LOW];
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Pluralize word based on count
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

/**
 * Format large numbers with compact notation
 */
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Convert clause type enum to readable label
 */
export function formatClauseType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert leakage category to readable label
 */
export function formatCategory(category: string | undefined | null): string {
  if (!category) {
    return 'Unknown';
  }
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
