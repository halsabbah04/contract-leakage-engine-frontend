import { AlertTriangle, AlertCircle, Info, CheckCircle, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface SeverityBadgeProps {
  severity: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Use lowercase keys to match backend response
const severityIcons: Record<string, LucideIcon> = {
  critical: AlertCircle,
  high: AlertTriangle,
  medium: Info,
  low: CheckCircle,
  info: Info,
};

const severityColors: Record<string, string> = {
  critical: 'bg-red-600 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-400 text-gray-900',
  low: 'bg-green-500 text-white',
  info: 'bg-blue-500 text-white',
};

const severitySizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

// Default fallbacks
const DEFAULT_ICON = Info;
const DEFAULT_COLOR = 'bg-gray-500 text-white';

export default function SeverityBadge({
  severity,
  showIcon = false,
  size = 'md',
  className,
}: SeverityBadgeProps) {
  const normalizedSeverity = severity?.toLowerCase() || 'medium';
  const Icon = severityIcons[normalizedSeverity] || DEFAULT_ICON;
  const colorClass = severityColors[normalizedSeverity] || DEFAULT_COLOR;
  const displayText = severity?.toUpperCase() || 'MEDIUM';

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        colorClass,
        severitySizes[size],
        className
      )}
    >
      {showIcon && Icon && <Icon size={iconSizes[size]} className="mr-1.5" />}
      {displayText}
    </span>
  );
}
