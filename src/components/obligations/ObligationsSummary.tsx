import {
  Calendar,
  AlertTriangle,
  AlertCircle,
  DollarSign,
  User,
  Clock,
} from 'lucide-react';
import type { ObligationSummary } from '@contract-leakage/shared-types';
import { formatCurrency, formatDate } from '@utils/format';
import clsx from 'clsx';

interface ObligationsSummaryProps {
  summary: ObligationSummary;
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBgColor: string;
  highlight?: boolean;
}

function SummaryCard({ title, value, subtitle, icon, bgColor, iconBgColor, highlight }: SummaryCardProps) {
  return (
    <div
      className={clsx(
        'p-5 rounded-lg border transition-all duration-200',
        bgColor,
        highlight && 'ring-2 ring-offset-2 ring-yellow-400'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('p-2 rounded-lg', iconBgColor)}>{icon}</div>
      </div>
    </div>
  );
}

export default function ObligationsSummary({ summary }: ObligationsSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Obligations"
          value={summary.total_obligations}
          icon={<Calendar size={20} className="text-primary" />}
          bgColor="bg-white border-gray-200"
          iconBgColor="bg-blue-100"
        />

        <SummaryCard
          title="Overdue"
          value={summary.overdue_count}
          subtitle={summary.overdue_count > 0 ? 'Requires attention' : 'All on track'}
          icon={<AlertCircle size={20} className="text-red-600" />}
          bgColor={summary.overdue_count > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}
          iconBgColor={summary.overdue_count > 0 ? 'bg-red-100' : 'bg-gray-100'}
          highlight={summary.overdue_count > 0}
        />

        <SummaryCard
          title="Due Soon"
          value={summary.due_soon_count}
          subtitle="Within 30 days"
          icon={<AlertTriangle size={20} className="text-yellow-600" />}
          bgColor={summary.due_soon_count > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}
          iconBgColor={summary.due_soon_count > 0 ? 'bg-yellow-100' : 'bg-gray-100'}
        />

        <SummaryCard
          title="Upcoming"
          value={summary.upcoming_count}
          subtitle="More than 30 days away"
          icon={<Clock size={20} className="text-blue-600" />}
          bgColor="bg-white border-gray-200"
          iconBgColor="bg-blue-100"
        />
      </div>

      {/* Financial Summary */}
      {summary.total_payment_obligations > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign size={24} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Payment Obligations Summary</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/60 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Payment Obligations</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {formatCurrency(summary.total_payment_obligations)}
              </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Our Payments</p>
              <p className="text-xl font-bold text-red-600 mt-1">
                {formatCurrency(summary.our_payment_obligations)}
              </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Counterparty Payments</p>
              <p className="text-xl font-bold text-green-600 mt-1">
                {formatCurrency(summary.their_payment_obligations)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Action */}
      {summary.next_due_date && summary.next_obligation_title && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Next Upcoming Deadline</p>
              <p className="text-lg font-semibold text-gray-900">{summary.next_obligation_title}</p>
              <p className="text-sm text-gray-600">
                Due: {formatDate(summary.next_due_date, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Distribution by Type */}
      {Object.keys(summary.by_type).length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Obligations by Type</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(summary.by_type).map(([type, count]) => (
              <div key={type} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace(/_/g, ' ')}
                </span>
                <span className="text-xs font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Distribution by Responsible Party */}
      {Object.keys(summary.by_responsible_party).length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <User size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-800">Obligations by Responsible Party</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(summary.by_responsible_party).map(([party, count]) => (
              <div key={party} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{party}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(count / summary.total_obligations) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
