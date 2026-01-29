import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { Obligation } from '@contract-leakage/shared-types';
import { formatCurrency, formatDate, formatConfidence, formatCategory } from '@utils/format';
import clsx from 'clsx';

interface ObligationCardProps {
  obligation: Obligation;
  defaultExpanded?: boolean;
  onViewClauses?: (clauseIds: string[]) => void;
}

// Get status badge styles
function getStatusStyles(status: string): { bg: string; text: string; icon: React.ReactNode } {
  switch (status) {
    case 'overdue':
      return {
        bg: 'bg-red-100',
        text: 'text-red-700',
        icon: <AlertCircle size={14} className="text-red-600" />,
      };
    case 'due_soon':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        icon: <AlertTriangle size={14} className="text-yellow-600" />,
      };
    case 'upcoming':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        icon: <Clock size={14} className="text-blue-600" />,
      };
    case 'completed':
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: <CheckCircle size={14} className="text-green-600" />,
      };
    case 'waived':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: <CheckCircle size={14} className="text-gray-500" />,
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        icon: <Clock size={14} className="text-gray-500" />,
      };
  }
}

// Get priority badge styles
function getPriorityStyles(priority: string): { bg: string; text: string } {
  switch (priority) {
    case 'critical':
      return { bg: 'bg-red-500', text: 'text-white' };
    case 'high':
      return { bg: 'bg-orange-500', text: 'text-white' };
    case 'medium':
      return { bg: 'bg-yellow-400', text: 'text-gray-900' };
    case 'low':
      return { bg: 'bg-green-500', text: 'text-white' };
    default:
      return { bg: 'bg-gray-400', text: 'text-white' };
  }
}

// Get obligation type icon
function getTypeIcon(type: string): React.ReactNode {
  switch (type) {
    case 'payment':
      return <DollarSign size={16} className="text-green-600" />;
    case 'delivery':
      return <FileText size={16} className="text-blue-600" />;
    case 'notice':
      return <AlertCircle size={16} className="text-yellow-600" />;
    case 'reporting':
      return <FileText size={16} className="text-purple-600" />;
    case 'compliance':
      return <CheckCircle size={16} className="text-indigo-600" />;
    case 'renewal':
      return <RefreshCw size={16} className="text-teal-600" />;
    default:
      return <FileText size={16} className="text-gray-600" />;
  }
}

// Format status for display
function formatStatus(status: string): string {
  switch (status) {
    case 'due_soon':
      return 'Due Soon';
    case 'not_applicable':
      return 'N/A';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Format recurrence pattern
function formatRecurrence(pattern: string): string {
  switch (pattern) {
    case 'semi_annually':
      return 'Semi-Annually';
    case 'none':
      return 'One-time';
    default:
      return pattern.charAt(0).toUpperCase() + pattern.slice(1);
  }
}

// Calculate days until due date
function getDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const due = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function ObligationCard({
  obligation,
  defaultExpanded = false,
  onViewClauses,
}: ObligationCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const statusStyles = getStatusStyles(obligation.status);
  const priorityStyles = getPriorityStyles(obligation.priority);
  const daysUntilDue = getDaysUntilDue(obligation.due_date || null);

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          {/* Badges Row */}
          <div className="flex items-center flex-wrap gap-2 mb-2">
            {/* Status Badge */}
            <span
              className={clsx(
                'inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full font-medium',
                statusStyles.bg,
                statusStyles.text
              )}
            >
              {statusStyles.icon}
              <span>{formatStatus(obligation.status)}</span>
            </span>

            {/* Priority Badge */}
            <span
              className={clsx(
                'text-xs px-2 py-1 rounded-full font-medium',
                priorityStyles.bg,
                priorityStyles.text
              )}
            >
              {obligation.priority.toUpperCase()}
            </span>

            {/* Type Badge */}
            <span className="inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
              {getTypeIcon(obligation.obligation_type)}
              <span>{formatCategory(obligation.obligation_type)}</span>
            </span>

            {/* Recurring Badge */}
            {obligation.is_recurring && (
              <span className="inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                <RefreshCw size={12} />
                <span>{formatRecurrence(obligation.recurrence_pattern)}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{obligation.title}</h3>

          {/* Key Info */}
          <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
            {/* Due Date */}
            {obligation.due_date && (
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>
                  {formatDate(obligation.due_date, 'MMM d, yyyy')}
                  {daysUntilDue !== null && (
                    <span
                      className={clsx(
                        'ml-1',
                        daysUntilDue < 0
                          ? 'text-red-600 font-medium'
                          : daysUntilDue <= 30
                          ? 'text-yellow-600 font-medium'
                          : 'text-gray-500'
                      )}
                    >
                      ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`})
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Amount */}
            {obligation.amount && (
              <div className="flex items-center space-x-1">
                <DollarSign size={14} />
                <span className="font-medium text-green-700">
                  {formatCurrency(obligation.amount, obligation.currency)}
                </span>
              </div>
            )}

            {/* Responsible Party */}
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>
                {obligation.responsible_party.party_name}
                {obligation.responsible_party.is_our_organization && (
                  <span className="ml-1 text-xs text-primary">(Our responsibility)</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Icon */}
        <button className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-500" />
          ) : (
            <ChevronDown size={20} className="text-gray-500" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 space-y-6 pt-6 border-t border-gray-200">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2">Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{obligation.description}</p>
          </div>

          {/* Original Text (if available) */}
          {obligation.extracted_text && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Source Text</h4>
              <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded border border-gray-200">
                "{obligation.extracted_text}"
              </p>
            </div>
          )}

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dates */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Key Dates</h4>
              <div className="space-y-2 text-sm">
                {obligation.effective_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective:</span>
                    <span className="font-medium">{formatDate(obligation.effective_date, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {obligation.due_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due:</span>
                    <span className="font-medium">{formatDate(obligation.due_date, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {obligation.end_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">End:</span>
                    <span className="font-medium">{formatDate(obligation.end_date, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {obligation.is_recurring && obligation.next_occurrence && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Occurrence:</span>
                    <span className="font-medium">{formatDate(obligation.next_occurrence, 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Responsibility */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Responsibility</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Party:</span>
                  <span className="font-medium">{obligation.responsible_party.party_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium">{formatCategory(obligation.responsible_party.party_role)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Our Organization:</span>
                  <span className="font-medium">
                    {obligation.responsible_party.is_our_organization ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {obligation.notes && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Notes</h4>
              <p className="text-sm text-gray-600">{obligation.notes}</p>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>ID: {obligation.id}</span>
              <span>{formatConfidence(obligation.extraction_confidence)} confidence</span>
              {obligation.extracted_at && (
                <span>Extracted: {formatDate(obligation.extracted_at, 'MMM d, yyyy')}</span>
              )}
            </div>

            {onViewClauses && obligation.clause_ids.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClauses(obligation.clause_ids);
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                View Source Clauses ({obligation.clause_ids.length}) →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
