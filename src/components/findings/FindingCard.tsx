import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Shield,
  DollarSign,
  Lightbulb,
  Tag,
  Target,
} from 'lucide-react';
import { LeakageFinding, DetectionMethod } from '@contract-leakage/shared-types';
import SeverityBadge from '@components/common/SeverityBadge';
import { formatCurrency, formatConfidence, formatCategory } from '@utils/format';
import clsx from 'clsx';

interface FindingCardProps {
  finding: LeakageFinding;
  defaultExpanded?: boolean;
  onViewClauses?: (clauseIds: string[]) => void;
}

export default function FindingCard({
  finding,
  defaultExpanded = false,
  onViewClauses,
}: FindingCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const detectionBadgeColor =
    finding.detection_method === DetectionMethod.AI
      ? 'bg-purple-100 text-purple-700'
      : finding.detection_method === DetectionMethod.RULE
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700';

  return (
    <div className="card hover:shadow-card-hover transition-all duration-200">
      {/* Header */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <SeverityBadge severity={finding.severity} showIcon size="md" />
            <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', detectionBadgeColor)}>
              {finding.detection_method}
            </span>
            <span className="text-xs text-gray-500">
              {formatConfidence(finding.confidence_score)} confidence
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-1">{finding.risk_type}</h3>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Tag size={14} />
              <span>{formatCategory(finding.category)}</span>
            </div>
            {finding.affected_clause_ids.length > 0 && (
              <div className="flex items-center space-x-1">
                <FileText size={14} />
                <span>{finding.affected_clause_ids.length} clause(s)</span>
              </div>
            )}
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
          {/* Explanation */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-blue-100 rounded">
                <Shield size={16} className="text-primary" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Explanation</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{finding.explanation}</p>
          </div>

          {/* Recommended Action */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1.5 bg-green-100 rounded">
                <Lightbulb size={16} className="text-green-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-800">Recommended Action</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{finding.recommended_action}</p>
          </div>

          {/* Financial Impact */}
          {finding.estimated_financial_impact && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 bg-yellow-100 rounded">
                  <DollarSign size={16} className="text-yellow-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Financial Impact</h4>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Estimated Impact:</span>
                  <span className="text-lg font-bold text-yellow-900">
                    {formatCurrency(
                      finding.estimated_financial_impact.amount,
                      finding.estimated_financial_impact.currency
                    )}
                  </span>
                </div>
                {finding.estimated_financial_impact.calculation_method && (
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Method:</strong> {finding.estimated_financial_impact.calculation_method}
                  </p>
                )}
                {finding.estimated_financial_impact.notes && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Notes:</strong> {finding.estimated_financial_impact.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Assumptions */}
          {finding.assumptions && finding.assumptions.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="p-1.5 bg-gray-100 rounded">
                  <Target size={16} className="text-gray-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-800">Assumptions</h4>
              </div>
              <ul className="space-y-1">
                {finding.assumptions.map((assumption, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{assumption}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Finding ID: {finding.finding_id}</span>
              {finding.rule_id && <span>Rule: {finding.rule_id}</span>}
            </div>

            {onViewClauses && finding.affected_clause_ids.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClauses(finding.affected_clause_ids);
                }}
                className="text-sm text-primary hover:underline font-medium"
              >
                View Affected Clauses →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
