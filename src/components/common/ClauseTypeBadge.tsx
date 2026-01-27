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
  Lock,
  Lightbulb,
  Scale,
  Cloud,
  Truck,
  Star,
  LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

interface ClauseTypeBadgeProps {
  clauseType: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Use string keys for flexibility with any clause type from backend
const clauseTypeIcons: Record<string, LucideIcon> = {
  pricing: DollarSign,
  payment: Calendar,
  payment_terms: Calendar,
  renewal: RefreshCw,
  auto_renewal: RefreshCw,
  termination: XCircle,
  service_level: Target,
  liability: Shield,
  indemnification: FileCheck,
  confidentiality: Lock,
  intellectual_property: Lightbulb,
  dispute_resolution: Scale,
  force_majeure: Cloud,
  warranty: AlertTriangle,
  delivery: Truck,
  sla: Target,
  penalty: TrendingDown,
  penalties: TrendingDown,
  discount: Percent,
  discounts: Percent,
  volume_commitment: BarChart,
  price_adjustment: Settings,
  exclusivity: Star,
  other: FileText,
};

const clauseTypeColors: Record<string, string> = {
  pricing: 'bg-blue-100 text-blue-800 border-blue-200',
  payment: 'bg-green-100 text-green-800 border-green-200',
  payment_terms: 'bg-green-100 text-green-800 border-green-200',
  renewal: 'bg-purple-100 text-purple-800 border-purple-200',
  auto_renewal: 'bg-purple-100 text-purple-800 border-purple-200',
  termination: 'bg-red-100 text-red-800 border-red-200',
  service_level: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  liability: 'bg-orange-100 text-orange-800 border-orange-200',
  indemnification: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confidentiality: 'bg-slate-100 text-slate-800 border-slate-200',
  intellectual_property: 'bg-amber-100 text-amber-800 border-amber-200',
  dispute_resolution: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  force_majeure: 'bg-gray-100 text-gray-800 border-gray-200',
  warranty: 'bg-pink-100 text-pink-800 border-pink-200',
  delivery: 'bg-teal-100 text-teal-800 border-teal-200',
  sla: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  penalty: 'bg-red-100 text-red-800 border-red-200',
  penalties: 'bg-red-100 text-red-800 border-red-200',
  discount: 'bg-green-100 text-green-800 border-green-200',
  discounts: 'bg-green-100 text-green-800 border-green-200',
  volume_commitment: 'bg-blue-100 text-blue-800 border-blue-200',
  price_adjustment: 'bg-purple-100 text-purple-800 border-purple-200',
  exclusivity: 'bg-violet-100 text-violet-800 border-violet-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const clauseTypeLabels: Record<string, string> = {
  pricing: 'Pricing',
  payment: 'Payment',
  payment_terms: 'Payment Terms',
  renewal: 'Renewal',
  auto_renewal: 'Auto Renewal',
  termination: 'Termination',
  service_level: 'Service Level',
  liability: 'Liability',
  indemnification: 'Indemnification',
  confidentiality: 'Confidentiality',
  intellectual_property: 'Intellectual Property',
  dispute_resolution: 'Dispute Resolution',
  force_majeure: 'Force Majeure',
  warranty: 'Warranty',
  delivery: 'Delivery',
  sla: 'SLA',
  penalty: 'Penalty',
  penalties: 'Penalties',
  discount: 'Discount',
  discounts: 'Discounts',
  volume_commitment: 'Volume Commitment',
  price_adjustment: 'Price Adjustment',
  exclusivity: 'Exclusivity',
  other: 'Other',
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

// Default fallbacks for unknown clause types
const DEFAULT_COLOR = 'bg-gray-100 text-gray-800 border-gray-200';
const DEFAULT_ICON = FileText;

// Helper to format unknown clause types as labels
function formatClauseTypeLabel(clauseType: string): string {
  return clauseType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ClauseTypeBadge({
  clauseType,
  showIcon = false,
  size = 'md',
  className,
}: ClauseTypeBadgeProps) {
  const normalizedType = clauseType?.toLowerCase() || 'other';
  const Icon = clauseTypeIcons[normalizedType] || DEFAULT_ICON;
  const color = clauseTypeColors[normalizedType] || DEFAULT_COLOR;
  const label = clauseTypeLabels[normalizedType] || formatClauseTypeLabel(normalizedType);

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium border',
        color,
        clauseTypeSizes[size],
        className
      )}
    >
      {showIcon && Icon && <Icon size={iconSizes[size]} className="mr-1.5" />}
      {label}
    </span>
  );
}
