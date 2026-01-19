import { AlertTriangle, DollarSign, BarChart3, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@utils/format';
import clsx from 'clsx';

interface FindingsSummaryProps {
  summary: {
    total_findings: number;
    by_severity: {
      CRITICAL: number;
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
    by_category: Record<string, number>;
    total_estimated_impact?: {
      amount: number;
      currency: string;
    };
  };
}

export default function FindingsSummary({ summary }: FindingsSummaryProps) {
  const { total_findings, by_severity, total_estimated_impact } = summary;

  const criticalPercentage = total_findings > 0
    ? (by_severity.CRITICAL / total_findings) * 100
    : 0;

  const highPercentage = total_findings > 0
    ? (by_severity.HIGH / total_findings) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Findings */}
      <div className="card-compact">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Findings</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{total_findings}</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <BarChart3 size={24} className="text-primary" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Critical + High</span>
            <span className={clsx(
              'font-semibold',
              (by_severity.CRITICAL + by_severity.HIGH) > 0 ? 'text-error' : 'text-gray-700'
            )}>
              {by_severity.CRITICAL + by_severity.HIGH}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      <div className="card-compact bg-severity-critical-light border-severity-critical">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Critical Issues</p>
            <p className="text-3xl font-bold text-severity-critical mt-2">
              {by_severity.CRITICAL}
            </p>
          </div>
          <div className="p-3 bg-severity-critical/20 rounded-full">
            <AlertTriangle size={24} className="text-severity-critical" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-severity-critical/30">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">% of Total</span>
            <span className="font-semibold text-severity-critical">
              {formatPercentage(criticalPercentage / 100)}
            </span>
          </div>
        </div>
      </div>

      {/* High Priority */}
      <div className="card-compact bg-severity-high-light border-severity-high">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">High Priority</p>
            <p className="text-3xl font-bold text-severity-high mt-2">
              {by_severity.HIGH}
            </p>
          </div>
          <div className="p-3 bg-severity-high/20 rounded-full">
            <TrendingUp size={24} className="text-severity-high" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-severity-high/30">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">% of Total</span>
            <span className="font-semibold text-severity-high">
              {formatPercentage(highPercentage / 100)}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Impact */}
      <div className="card-compact bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Estimated Impact</p>
            {total_estimated_impact && total_estimated_impact.amount > 0 ? (
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(total_estimated_impact.amount, total_estimated_impact.currency, {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                })}
              </p>
            ) : (
              <p className="text-3xl font-bold text-gray-400 mt-2">—</p>
            )}
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <DollarSign size={24} className="text-primary" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="text-xs text-gray-600">
            {total_estimated_impact && total_estimated_impact.amount > 0 ? (
              <span>Potential revenue leakage</span>
            ) : (
              <span>No impact calculated</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
