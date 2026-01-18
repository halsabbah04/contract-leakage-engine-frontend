import { useState, useMemo } from 'react';
import { AlertCircle, Download } from 'lucide-react';
import { LeakageFinding, Severity, LeakageCategory } from '@contract-leakage/shared-types';
import FindingCard from './FindingCard';
import FindingCardWithActions from './FindingCardWithActions';
import FindingsFilterBar from './FindingsFilterBar';

interface FindingsListProps {
  findings: LeakageFinding[];
  contractId?: string;
  userEmail?: string | null;
  onViewClauses?: (clauseIds: string[]) => void;
  onExportReport?: () => void;
  onOverrideCreated?: () => void;
}

const SEVERITY_ORDER = {
  [Severity.CRITICAL]: 4,
  [Severity.HIGH]: 3,
  [Severity.MEDIUM]: 2,
  [Severity.LOW]: 1,
};

export default function FindingsList({
  findings,
  contractId,
  userEmail,
  onViewClauses,
  onExportReport,
  onOverrideCreated,
}: FindingsListProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<LeakageCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'severity' | 'category' | 'impact'>('severity');

  // Filter and sort findings
  const filteredAndSortedFindings = useMemo(() => {
    let filtered = findings;

    // Apply severity filter
    if (selectedSeverity !== 'all') {
      filtered = filtered.filter((f) => f.severity === selectedSeverity);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          return SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];

        case 'category':
          return a.category.localeCompare(b.category);

        case 'impact':
          const aImpact = a.estimated_financial_impact?.amount || 0;
          const bImpact = b.estimated_financial_impact?.amount || 0;
          return bImpact - aImpact;

        default:
          return 0;
      }
    });

    return sorted;
  }, [findings, selectedSeverity, selectedCategory, sortBy]);

  if (findings.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <AlertCircle size={48} className="text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Findings</h3>
        <p className="text-gray-600">
          Great news! No commercial leakage was detected in this contract.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leakage Findings</h2>
          <p className="text-sm text-gray-600 mt-1">
            Detailed analysis of detected commercial leakage risks
          </p>
        </div>
        {onExportReport && (
          <button
            onClick={onExportReport}
            className="btn btn-primary shadow-primary flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <FindingsFilterBar
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={findings.length}
        filteredCount={filteredAndSortedFindings.length}
      />

      {/* Findings Cards */}
      {filteredAndSortedFindings.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedFindings.map((finding) =>
            contractId && userEmail ? (
              <FindingCardWithActions
                key={finding.id}
                finding={finding}
                contractId={contractId}
                userEmail={userEmail}
                onViewClauses={onViewClauses}
                onOverrideCreated={onOverrideCreated}
              />
            ) : (
              <FindingCard
                key={finding.id}
                finding={finding}
                onViewClauses={onViewClauses}
              />
            )
          )}
        </div>
      ) : (
        <div className="card text-center py-12">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No matches found</h3>
          <p className="text-gray-600">
            Try adjusting your filters to see more findings
          </p>
        </div>
      )}
    </div>
  );
}
