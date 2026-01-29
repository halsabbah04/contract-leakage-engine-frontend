import { useState, useMemo, useEffect, useRef } from 'react';
import { FileText, AlertCircle, LayoutList, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import ClauseCard from './ClauseCard';
import ClausesFilterBar from './ClausesFilterBar';
import clsx from 'clsx';
import type { Clause, ClauseType } from '@contract-leakage/shared-types';

interface ClausesListProps {
  clauses: Clause[];
  highlightClauseIds?: string[];
}

type ViewMode = 'list' | 'grouped';

const clauseTypeLabels: Record<string, string> = {
  pricing: 'Pricing Clauses',
  payment: 'Payment Clauses',
  payment_terms: 'Payment Terms',
  renewal: 'Renewal Clauses',
  auto_renewal: 'Auto Renewal',
  termination: 'Termination Clauses',
  service_level: 'Service Level',
  liability: 'Liability Clauses',
  indemnification: 'Indemnification',
  confidentiality: 'Confidentiality',
  intellectual_property: 'Intellectual Property',
  dispute_resolution: 'Dispute Resolution',
  force_majeure: 'Force Majeure',
  warranty: 'Warranty Clauses',
  delivery: 'Delivery Clauses',
  sla: 'SLA Clauses',
  penalty: 'Penalty Clauses',
  penalties: 'Penalties',
  discount: 'Discount Clauses',
  discounts: 'Discounts',
  volume_commitment: 'Volume Commitment',
  price_adjustment: 'Price Adjustment',
  exclusivity: 'Exclusivity',
  other: 'Other Clauses',
};

const clauseTypeColors: Record<string, string> = {
  pricing: 'bg-green-100 text-green-800 border-green-200',
  payment: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  payment_terms: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  renewal: 'bg-blue-100 text-blue-800 border-blue-200',
  auto_renewal: 'bg-blue-100 text-blue-800 border-blue-200',
  termination: 'bg-red-100 text-red-800 border-red-200',
  service_level: 'bg-purple-100 text-purple-800 border-purple-200',
  liability: 'bg-orange-100 text-orange-800 border-orange-200',
  indemnification: 'bg-amber-100 text-amber-800 border-amber-200',
  confidentiality: 'bg-gray-100 text-gray-800 border-gray-200',
  intellectual_property: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  dispute_resolution: 'bg-pink-100 text-pink-800 border-pink-200',
  force_majeure: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  warranty: 'bg-teal-100 text-teal-800 border-teal-200',
  delivery: 'bg-sky-100 text-sky-800 border-sky-200',
  sla: 'bg-violet-100 text-violet-800 border-violet-200',
  penalty: 'bg-rose-100 text-rose-800 border-rose-200',
  penalties: 'bg-rose-100 text-rose-800 border-rose-200',
  discount: 'bg-lime-100 text-lime-800 border-lime-200',
  discounts: 'bg-lime-100 text-lime-800 border-lime-200',
  volume_commitment: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  price_adjustment: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  exclusivity: 'bg-stone-100 text-stone-800 border-stone-200',
  other: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function ClausesList({ clauses, highlightClauseIds = [] }: ClausesListProps) {
  const [selectedType, setSelectedType] = useState<ClauseType | 'all'>('all');
  const [showRiskyOnly, setShowRiskyOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'type' | 'confidence' | 'section'>('type');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const firstHighlightedRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);

  // Auto-scroll to first highlighted clause
  useEffect(() => {
    if (highlightClauseIds.length > 0 && firstHighlightedRef.current && !hasScrolledRef.current) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        firstHighlightedRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        hasScrolledRef.current = true;
      }, 100);
    }
  }, [highlightClauseIds]);

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
      // Always put highlighted clauses first when there are highlighted IDs
      if (highlightClauseIds.length > 0) {
        const aHighlighted = highlightClauseIds.includes(a.id);
        const bHighlighted = highlightClauseIds.includes(b.id);
        if (aHighlighted && !bHighlighted) return -1;
        if (!aHighlighted && bHighlighted) return 1;
      }

      switch (sortBy) {
        case 'type':
          return a.clause_type.localeCompare(b.clause_type);
        case 'confidence':
          return (b.confidence_score ?? 0) - (a.confidence_score ?? 0);
        case 'section':
          if (!a.section_number) return 1;
          if (!b.section_number) return -1;
          return a.section_number.localeCompare(b.section_number);
        default:
          return 0;
      }
    });

    return sorted;
  }, [clauses, selectedType, showRiskyOnly, searchQuery, sortBy, highlightClauseIds]);

  // Group clauses by type
  const groupedClauses = useMemo(() => {
    const groups: Record<string, Clause[]> = {};

    for (const clause of filteredAndSortedClauses) {
      const type = clause.clause_type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(clause);
    }

    // Sort groups by count (descending)
    const sortedEntries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    return sortedEntries;
  }, [filteredAndSortedClauses]);

  const toggleGroup = (type: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(groupedClauses.map(([type]) => type)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

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

      {/* View Mode Toggle & Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              <LayoutList size={16} className="mr-1.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('grouped')}
              className={clsx(
                'flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                viewMode === 'grouped'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              <Layers size={16} className="mr-1.5" />
              Grouped
            </button>
          </div>

          {/* Expand/Collapse All - only show in grouped view */}
          {viewMode === 'grouped' && (
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-sm text-primary hover:underline"
              >
                Expand All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-sm text-primary hover:underline"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedClauses.length} of {clauses.length} clauses
        {viewMode === 'grouped' && ` in ${groupedClauses.length} groups`}
      </div>

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

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredAndSortedClauses.map((clause, index) => {
            const isHighlighted = highlightClauseIds.includes(clause.id);
            const isFirstHighlighted = isHighlighted &&
              filteredAndSortedClauses.findIndex(c => highlightClauseIds.includes(c.id)) === index;

            return (
              <div
                key={clause.id}
                ref={isFirstHighlighted ? firstHighlightedRef : undefined}
              >
                <ClauseCard
                  clause={clause}
                  highlighted={isHighlighted}
                  searchQuery={searchQuery}
                />
              </div>
            );
          })}
        </div>
      ) : (
        /* Grouped View */
        <div className="space-y-3">
          {groupedClauses.map(([type, typeClauses]) => {
            const isExpanded = expandedGroups.has(type);
            const colorClass = clauseTypeColors[type] || clauseTypeColors.other;
            const label = clauseTypeLabels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
            const riskyCount = typeClauses.filter(c => c.risk_signals && c.risk_signals.length > 0).length;
            const highlightedCount = typeClauses.filter(c => highlightClauseIds.includes(c.id)).length;

            return (
              <div key={type} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(type)}
                  className={clsx(
                    'w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors',
                    isExpanded && 'border-b border-gray-200'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {isExpanded ? (
                      <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                    <span className={clsx('px-3 py-1 rounded-full text-sm font-medium border', colorClass)}>
                      {label}
                    </span>
                    <span className="text-sm text-gray-500">
                      {typeClauses.length} clause{typeClauses.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* Show summary stats */}
                    {highlightedCount > 0 && (
                      <span className="text-primary font-medium">
                        {highlightedCount} highlighted
                      </span>
                    )}
                    {riskyCount > 0 && (
                      <span className="text-orange-600 font-medium">
                        {riskyCount} with risks
                      </span>
                    )}
                  </div>
                </button>

                {/* Group Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4 bg-gray-50">
                    {typeClauses.map((clause, index) => {
                      const isHighlighted = highlightClauseIds.includes(clause.id);
                      const isFirstHighlighted = isHighlighted &&
                        filteredAndSortedClauses.findIndex(c => highlightClauseIds.includes(c.id)) ===
                        filteredAndSortedClauses.findIndex(c => c.id === clause.id);

                      return (
                        <div
                          key={clause.id}
                          ref={isFirstHighlighted && index === 0 ? firstHighlightedRef : undefined}
                        >
                          <ClauseCard
                            clause={clause}
                            highlighted={isHighlighted}
                            searchQuery={searchQuery}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
