import { ClauseType } from '@contract-leakage/shared-types';
import {
  DollarSign,
  Calendar,
  RefreshCw,
  XCircle,
  Shield,
  FileCheck,
  AlertTriangle,
  Target,
  TrendingDown,
  Percent,
  BarChart,
  Settings,
  FileText,
} from 'lucide-react';
import clsx from 'clsx';

interface ClauseTypeBadgeProps {
  clauseType: ClauseType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const clauseTypeIcons = {
  [ClauseType.PRICING]: DollarSign,
  [ClauseType.PAYMENT_TERMS]: Calendar,
  [ClauseType.RENEWAL]: RefreshCw,
  [ClauseType.TERMINATION]: XCircle,
  [ClauseType.LIABILITY]: Shield,
  [ClauseType.INDEMNIFICATION]: FileCheck,
  [ClauseType.WARRANTY]: AlertTriangle,
  [ClauseType.SLA]: Target,
  [ClauseType.PENALTY]: TrendingDown,
  [ClauseType.DISCOUNT]: Percent,
  [ClauseType.VOLUME_COMMITMENT]: BarChart,
  [ClauseType.PRICE_ADJUSTMENT]: Settings,
  [ClauseType.OTHER]: FileText,
};

const clauseTypeColors = {
  [ClauseType.PRICING]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ClauseType.PAYMENT_TERMS]: 'bg-green-100 text-green-800 border-green-200',
  [ClauseType.RENEWAL]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ClauseType.TERMINATION]: 'bg-red-100 text-red-800 border-red-200',
  [ClauseType.LIABILITY]: 'bg-orange-100 text-orange-800 border-orange-200',
  [ClauseType.INDEMNIFICATION]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ClauseType.WARRANTY]: 'bg-pink-100 text-pink-800 border-pink-200',
  [ClauseType.SLA]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [ClauseType.PENALTY]: 'bg-red-100 text-red-800 border-red-200',
  [ClauseType.DISCOUNT]: 'bg-green-100 text-green-800 border-green-200',
  [ClauseType.VOLUME_COMMITMENT]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ClauseType.PRICE_ADJUSTMENT]: 'bg-purple-100 text-purple-800 border-purple-200',
  [ClauseType.OTHER]: 'bg-gray-100 text-gray-800 border-gray-200',
};

const clauseTypeLabels = {
  [ClauseType.PRICING]: 'Pricing',
  [ClauseType.PAYMENT_TERMS]: 'Payment Terms',
  [ClauseType.RENEWAL]: 'Renewal',
  [ClauseType.TERMINATION]: 'Termination',
  [ClauseType.LIABILITY]: 'Liability',
  [ClauseType.INDEMNIFICATION]: 'Indemnification',
  [ClauseType.WARRANTY]: 'Warranty',
  [ClauseType.SLA]: 'SLA',
  [ClauseType.PENALTY]: 'Penalty',
  [ClauseType.DISCOUNT]: 'Discount',
  [ClauseType.VOLUME_COMMITMENT]: 'Volume Commitment',
  [ClauseType.PRICE_ADJUSTMENT]: 'Price Adjustment',
  [ClauseType.OTHER]: 'Other',
};

const clauseTypeSizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

export default function ClauseTypeBadge({
  clauseType,
  showIcon = false,
  size = 'md',
  className,
}: ClauseTypeBadgeProps) {
  const Icon = clauseTypeIcons[clauseType];

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border',
        clauseTypeColors[clauseType],
        clauseTypeSizes[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} className="mr-1.5" />}
      {clauseTypeLabels[clauseType]}
    </span>
  );
}
