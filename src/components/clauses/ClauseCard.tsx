import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, Target, Calendar, DollarSign, Users, CheckSquare } from 'lucide-react';
import clsx from 'clsx';
import type { Clause } from '@contract-leakage/shared-types';
import ClauseTypeBadge from '../common/ClauseTypeBadge';

interface ClauseCardProps {
  clause: Clause;
  defaultExpanded?: boolean;
  highlighted?: boolean;
  searchQuery?: string;
}

export default function ClauseCard({
  clause,
  defaultExpanded = false,
  highlighted = false,
  searchQuery = '',
}: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Auto-expand if highlighted
  useEffect(() => {
    if (highlighted) {
      setIsExpanded(true);
    }
  }, [highlighted]);

  const hasRiskSignals = clause.risk_signals && clause.risk_signals.length > 0;
  const hasEntities = Object.values(clause.entities).some((arr) => arr && arr.length > 0);

  // Format confidence score as percentage
  const formatConfidence = (score: number | undefined | null): string => {
    if (score == null || isNaN(score)) {
      return 'N/A';
    }
    return `${Math.round(score * 100)}%`;
  };

  // Get confidence score (supports both old and new property names)
  const getConfidence = (): number | undefined => {
    // Check extraction_confidence (backend) first, then confidence_score (legacy)
    return (clause as any).extraction_confidence ?? (clause as any).confidence_score;
  };

  // Highlight search query in text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={clsx(
        'card transition-all duration-200',
        highlighted && 'border-2 border-primary bg-blue-50/50',
        hasRiskSignals && !highlighted && 'border-l-4 border-l-warning'
      )}
    >
      {/* Header - Always visible */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <ClauseTypeBadge clauseType={clause.clause_type} showIcon size="md" />
            {clause.section_number && (
              <span className="text-xs text-gray-500 font-mono">§ {clause.section_number}</span>
            )}
            <span className="text-xs text-gray-500">{formatConfidence(getConfidence())} confidence</span>
          </div>

          {/* Risk Signals Preview */}
          {hasRiskSignals && (
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">
                {clause.risk_signals.length} risk signal{clause.risk_signals.length !== 1 ? 's' : ''} detected
              </span>
            </div>
          )}

          {/* Normalized Summary Preview */}
          <p className="text-sm text-gray-700 line-clamp-2">
            {highlightText(clause.normalized_summary, searchQuery)}
          </p>
        </div>

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
          {/* Original Text */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
              <Target size={16} className="text-primary" />
              <span>Original Text</span>
            </h4>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {highlightText(clause.original_text, searchQuery)}
            </p>
          </div>

          {/* Risk Signals */}
          {hasRiskSignals && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <AlertTriangle size={16} className="text-warning" />
                <span>Risk Signals</span>
              </h4>
              <ul className="space-y-2">
                {clause.risk_signals.map((signal, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{signal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extracted Entities */}
          {hasEntities && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <CheckSquare size={16} className="text-primary" />
                <span>Extracted Entities</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dates */}
                {clause.entities.dates && clause.entities.dates.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar size={14} className="text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">Dates</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.dates.map((date, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {date}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Monetary Values - Backend uses amounts[] and currency separately */}
                {clause.entities.amounts && clause.entities.amounts.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign size={14} className="text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">Monetary Values</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.amounts.map((amount: number, idx: number) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {clause.entities.currency || 'USD'} {amount.toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Percentages - Backend returns numbers (e.g., 0.05 for 5%) */}
                {clause.entities.percentages && clause.entities.percentages.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-gray-700">📊 Percentages</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.percentages.map((pct: number, idx: number) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {typeof pct === 'number' ? `${(pct * 100).toFixed(1)}%` : pct}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Parties */}
                {clause.entities.parties && clause.entities.parties.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users size={14} className="text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">Parties</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.parties.map((party, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {party}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Obligations */}
                {clause.entities.obligations && clause.entities.obligations.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-gray-700">📋 Obligations</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.obligations.map((obligation, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {obligation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Conditions */}
                {clause.entities.conditions && clause.entities.conditions.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-gray-700">⚙️ Conditions</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.conditions.map((condition, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Deadlines */}
                {clause.entities.deadlines && clause.entities.deadlines.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-semibold text-gray-700">⏰ Deadlines</span>
                    </div>
                    <ul className="space-y-1">
                      {clause.entities.deadlines.map((deadline, idx) => (
                        <li key={idx} className="text-xs text-gray-600">
                          • {deadline}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Footer */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Clause ID: {clause.id}</span>
              <span>Extracted: {clause.created_at ? new Date(clause.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
