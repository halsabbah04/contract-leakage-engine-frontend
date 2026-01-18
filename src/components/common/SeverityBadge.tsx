import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Severity } from '@contract-leakage/shared-types';
import { getSeverityBadgeClasses } from '@utils/format';
import clsx from 'clsx';

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const severityIcons = {
  [Severity.CRITICAL]: AlertCircle,
  [Severity.HIGH]: AlertTriangle,
  [Severity.MEDIUM]: Info,
  [Severity.LOW]: CheckCircle,
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

export default function SeverityBadge({
  severity,
  showIcon = false,
  size = 'md',
  className,
}: SeverityBadgeProps) {
  const Icon = severityIcons[severity];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        getSeverityBadgeClasses(severity),
        severitySizes[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} className="mr-1.5" />}
      {severity}
    </span>
  );
}
