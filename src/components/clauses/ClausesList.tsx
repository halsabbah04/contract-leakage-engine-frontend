import { useState, useMemo } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import ClauseCard from './ClauseCard';
import ClausesFilterBar from './ClausesFilterBar';
import type { Clause, ClauseType } from '@contract-leakage/shared-types';

interface ClausesListProps {
  clauses: Clause[];
  highlightClauseIds?: string[];
}

export default function ClausesList({ clauses, highlightClauseIds = [] }: ClausesListProps) {
  const [selectedType, setSelectedType] = useState<ClauseType | 'all'>('all');
  const [showRiskyOnly, setShowRiskyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'type' | 'confidence' | 'section'>('type');

  // Client-side filtering and sorting
  const filteredAndSortedClauses = useMemo(() => {
    let filtered = clauses;

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((c) => c.clause_type === selectedType);
    }

    // Filter by risky clauses only
    if (showRiskyOnly) {
      filtered = filtered.filter((c) => c.risk_signals && c.risk_signals.length > 0);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.original_text.toLowerCase().includes(lowerQuery) ||
          c.normalized_summary.toLowerCase().includes(lowerQuery) ||
          c.section_number?.toLowerCase().includes(lowerQuery) ||
          c.risk_signals?.some((signal) => signal.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'type':
          return a.clause_type.localeCompare(b.clause_type);
        case 'confidence':
          return b.confidence_score - a.confidence_score;
        case 'section':
          if (!a.section_number) return 1;
          if (!b.section_number) return -1;
          return a.section_number.localeCompare(b.section_number);
        default:
          return 0;
      }
    });

    return sorted;
  }, [clauses, selectedType, showRiskyOnly, searchQuery, sortBy]);

  // Empty state - no clauses
  if (clauses.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="flex justify-center mb-4">
          <FileText size={48} className="text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Clauses Found</h3>
        <p className="text-gray-500">
          No clauses have been extracted for this contract yet.
        </p>
      </div>
    );
  }

  // Empty state - no matches
  if (filteredAndSortedClauses.length === 0) {
    return (
      <div className="space-y-6">
        <ClausesFilterBar
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          showRiskyOnly={showRiskyOnly}
          onShowRiskyOnlyChange={setShowRiskyOnly}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={clauses.length}
          filteredCount={0}
        />

        <div className="card text-center py-12">
          <div className="flex justify-center mb-4">
            <AlertCircle size={48} className="text-warning" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Matching Clauses</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={() => {
              setSelectedType('all');
              setShowRiskyOnly(false);
              setSearchQuery('');
            }}
            className="btn btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <ClausesFilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        showRiskyOnly={showRiskyOnly}
        onShowRiskyOnlyChange={setShowRiskyOnly}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={clauses.length}
        filteredCount={filteredAndSortedClauses.length}
      />

      {/* Highlighted Clauses Notice */}
      {highlightClauseIds.length > 0 && (
        <div className="card-compact bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2">
            <AlertCircle size={16} className="text-primary" />
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{highlightClauseIds.length}</span> clause(s) highlighted
              from findings analysis
            </p>
          </div>
        </div>
      )}

      {/* Clauses Cards */}
      <div className="space-y-4">
        {filteredAndSortedClauses.map((clause) => (
          <ClauseCard
            key={clause.id}
            clause={clause}
            highlighted={highlightClauseIds.includes(clause.id)}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </div>
  );
}
