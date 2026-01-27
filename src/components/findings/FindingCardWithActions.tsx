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
import { LeakageFinding, DetectionMethod, Severity } from '@contract-leakage/shared-types';
import SeverityBadge from '../common/SeverityBadge';
import FindingActionsMenu from './FindingActionsMenu';
import ChangeSeverityModal from './ChangeSeverityModal';
import AddNoteModal from './AddNoteModal';
import ConfirmActionModal from './ConfirmActionModal';
import { formatCurrency, formatConfidence, formatCategory } from '../../utils/format';
import { overridesService } from '../../services';
import clsx from 'clsx';

interface FindingCardWithActionsProps {
  finding: LeakageFinding;
  contractId: string;
  userEmail: string;
  defaultExpanded?: boolean;
  onViewClauses?: (clauseIds: string[]) => void;
  onOverrideCreated?: () => void;
}

// Helper to get clause IDs (supports both old and new property names)
function getClauseIds(finding: LeakageFinding): string[] {
  return finding.clause_ids || finding.affected_clause_ids || [];
}

// Helper to get confidence (supports both old and new property names)
function getConfidence(finding: LeakageFinding): number {
  return finding.confidence ?? finding.confidence_score ?? 0;
}

// Helper to get category (supports both old and new property names)
function getCategory(finding: LeakageFinding): string {
  return finding.leakage_category || finding.category || 'unknown';
}

// Helper to get finding ID (supports both old and new property names)
function getFindingId(finding: LeakageFinding): string {
  return finding.id || finding.finding_id || 'unknown';
}

// Helper to get financial impact value (returns null if no meaningful impact)
function getFinancialImpact(finding: LeakageFinding): { amount: number; currency: string; method?: string } | null {
  // Check new format first - only return if value > 0
  if (finding.estimated_impact?.value != null && finding.estimated_impact.value > 0) {
    return {
      amount: finding.estimated_impact.value,
      currency: finding.estimated_impact.currency || 'USD',
      method: finding.estimated_impact.calculation_method || undefined,
    };
  }
  // Fall back to legacy format - only return if amount > 0
  if (finding.estimated_financial_impact?.amount != null && finding.estimated_financial_impact.amount > 0) {
    return {
      amount: finding.estimated_financial_impact.amount,
      currency: finding.estimated_financial_impact.currency || 'USD',
      method: finding.estimated_financial_impact.calculation_method,
    };
  }
  // Return null if no financial impact was calculated (contract value not available)
  return null;
}

// Helper to format assumptions object as list
function getAssumptionsList(finding: LeakageFinding): string[] {
  const assumptions = finding.assumptions;
  if (!assumptions) return [];
  if (Array.isArray(assumptions)) {
    return assumptions as unknown as string[];
  }
  const list: string[] = [];
  if (assumptions.inflation_rate != null) {
    list.push(`Inflation rate: ${(assumptions.inflation_rate * 100).toFixed(1)}%`);
  }
  if (assumptions.remaining_years != null) {
    list.push(`Remaining years: ${assumptions.remaining_years}`);
  }
  if (assumptions.annual_volume != null) {
    list.push(`Annual volume: ${assumptions.annual_volume.toLocaleString()}`);
  }
  if (assumptions.probability != null) {
    list.push(`Probability: ${(assumptions.probability * 100).toFixed(0)}%`);
  }
  return list;
}

export default function FindingCardWithActions({
  finding,
  contractId,
  userEmail,
  defaultExpanded = false,
  onViewClauses,
  onOverrideCreated,
}: FindingCardWithActionsProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Modal states
  const [showChangeSeverity, setShowChangeSeverity] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showFalsePositive, setShowFalsePositive] = useState(false);
  const [showResolve, setShowResolve] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get normalized values
  const clauseIds = getClauseIds(finding);
  const confidence = getConfidence(finding);
  const category = getCategory(finding);
  const findingId = getFindingId(finding);
  const financialImpact = getFinancialImpact(finding);
  const assumptionsList = getAssumptionsList(finding);

  const detectionBadgeColor =
    finding.detection_method === DetectionMethod.AI || finding.detection_method === 'ai'
      ? 'bg-purple-100 text-purple-700'
      : finding.detection_method === DetectionMethod.RULE || finding.detection_method === 'rule'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-green-100 text-green-700';

  // Handle severity change
  const handleChangeSeverity = async (newSeverity: Severity, reason: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.changeSeverity(
        contractId,
        findingId,
        userEmail,
        finding.severity as Severity,
        newSeverity,
        reason
      );
      setShowChangeSeverity(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle add note
  const handleAddNote = async (note: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.addNote(contractId, findingId, userEmail, note);
      setShowAddNote(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle accept
  const handleAccept = async (notes?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.acceptFinding(contractId, findingId, userEmail, notes);
      setShowAccept(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reject
  const handleReject = async (reason?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.rejectFinding(contractId, findingId, userEmail, reason);
      setShowReject(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle false positive
  const handleFalsePositive = async (reason?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.markAsFalsePositive(contractId, findingId, userEmail, reason);
      setShowFalsePositive(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle resolve
  const handleResolve = async (notes?: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await overridesService.resolveFinding(contractId, findingId, userEmail, notes);
      setShowResolve(false);
      onOverrideCreated?.();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="card hover:shadow-card-hover transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-3 mb-2">
              <SeverityBadge severity={finding.severity} showIcon size="md" />
              <span className={clsx('text-xs px-2 py-1 rounded-full font-medium', detectionBadgeColor)}>
                {finding.detection_method}
              </span>
              <span className="text-xs text-gray-500">
                {formatConfidence(confidence)} confidence
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-1">{finding.risk_type}</h3>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Tag size={14} />
                <span>{formatCategory(category)}</span>
              </div>
              {clauseIds.length > 0 && (
                <div className="flex items-center space-x-1">
                  <FileText size={14} />
                  <span>{clauseIds.length} clause(s)</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center space-x-2 ml-4">
            <FindingActionsMenu
              finding={finding}
              onAccept={() => setShowAccept(true)}
              onReject={() => setShowReject(true)}
              onMarkFalsePositive={() => setShowFalsePositive(true)}
              onChangeSeverity={() => setShowChangeSeverity(true)}
              onAddNote={() => setShowAddNote(true)}
              onResolve={() => setShowResolve(true)}
            />
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isExpanded ? (
                <ChevronUp size={20} className="text-gray-500" />
              ) : (
                <ChevronDown size={20} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-error-light border border-error rounded-lg">
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-6 pt-6 border-t border-gray-200">
            {/* Explanation */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                <Shield size={16} className="text-primary" />
                <span>What's the Risk?</span>
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">{finding.explanation}</p>
            </div>

            {/* Recommended Action */}
            {finding.recommended_action && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Lightbulb size={16} className="text-warning" />
                  <span>Recommended Action</span>
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{finding.recommended_action}</p>
              </div>
            )}

            {/* Financial Impact */}
            {financialImpact && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <DollarSign size={16} className="text-warning" />
                  <span>Estimated Financial Impact</span>
                </h4>
                <p className="text-2xl font-bold text-warning mb-2">
                  {formatCurrency(financialImpact.amount, financialImpact.currency)}
                </p>
                {financialImpact.method && (
                  <p className="text-xs text-gray-600 mb-1">
                    Method: {financialImpact.method}
                  </p>
                )}
              </div>
            )}

            {/* Assumptions */}
            {assumptionsList.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                  <Target size={16} className="text-gray-600" />
                  <span>Assumptions</span>
                </h4>
                <ul className="space-y-1">
                  {assumptionsList.map((assumption, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="mt-1">•</span>
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Finding ID: {findingId}</span>
                {finding.rule_id && <span>Rule: {finding.rule_id}</span>}
              </div>
            </div>

            {/* View Clauses Button */}
            {clauseIds.length > 0 && onViewClauses && (
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewClauses(clauseIds);
                  }}
                  className="text-sm text-primary hover:underline flex items-center space-x-1"
                >
                  <FileText size={14} />
                  <span>View Affected Clauses →</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ChangeSeverityModal
        isOpen={showChangeSeverity}
        onClose={() => setShowChangeSeverity(false)}
        currentSeverity={finding.severity as Severity}
        onSubmit={handleChangeSeverity}
        isSubmitting={isSubmitting}
      />

      <AddNoteModal
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        onSubmit={handleAddNote}
        isSubmitting={isSubmitting}
      />

      <ConfirmActionModal
        isOpen={showAccept}
        onClose={() => setShowAccept(false)}
        onConfirm={handleAccept}
        isSubmitting={isSubmitting}
        action="accept"
        title="Accept Finding"
        description="Are you sure you want to accept this finding? This indicates you acknowledge the risk and plan to take action."
        requireReason={false}
      />

      <ConfirmActionModal
        isOpen={showReject}
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
        isSubmitting={isSubmitting}
        action="reject"
        title="Reject Finding"
        description="Are you sure you want to reject this finding? Please provide a reason for the rejection."
        requireReason={true}
      />

      <ConfirmActionModal
        isOpen={showFalsePositive}
        onClose={() => setShowFalsePositive(false)}
        onConfirm={handleFalsePositive}
        isSubmitting={isSubmitting}
        action="false_positive"
        title="Mark as False Positive"
        description="Are you sure this is a false positive? This indicates the AI incorrectly identified this as a risk."
        requireReason={true}
      />

      <ConfirmActionModal
        isOpen={showResolve}
        onClose={() => setShowResolve(false)}
        onConfirm={handleResolve}
        isSubmitting={isSubmitting}
        action="resolve"
        title="Mark as Resolved"
        description="Are you sure this finding has been resolved? This indicates the risk has been addressed."
        requireReason={false}
      />
    </>
  );
}
