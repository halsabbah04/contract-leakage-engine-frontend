import { Search, X, Filter } from 'lucide-react';
import { ClauseType } from '@contract-leakage/shared-types';

interface ClausesFilterBarProps {
  selectedType: ClauseType | 'all';
  onTypeChange: (type: ClauseType | 'all') => void;
  showRiskyOnly: boolean;
  onShowRiskyOnlyChange: (value: boolean) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'type' | 'confidence' | 'section';
  onSortChange: (sortBy: 'type' | 'confidence' | 'section') => void;
  totalCount: number;
  filteredCount: number;
}

const clauseTypeOptions: (ClauseType | 'all')[] = [
  'all',
  ClauseType.PRICING,
  ClauseType.PAYMENT_TERMS,
  ClauseType.RENEWAL,
  ClauseType.TERMINATION,
  ClauseType.LIABILITY,
  ClauseType.INDEMNIFICATION,
  ClauseType.WARRANTY,
  ClauseType.SLA,
  ClauseType.PENALTY,
  ClauseType.DISCOUNT,
  ClauseType.VOLUME_COMMITMENT,
  ClauseType.PRICE_ADJUSTMENT,
  ClauseType.OTHER,
];

const clauseTypeLabels: Record<ClauseType | 'all', string> = {
  all: 'All Types',
  [ClauseType.PRICING]: 'Pricing',
  [ClauseType.PAYMENT_TERMS]: 'Payment Terms',
  [ClauseType.RENEWAL]: 'Renewal',
  [ClauseType.TERMINATION]: 'Termination',
  [ClauseType.LIABILITY]: 'Liability',
  [ClauseType.INDEMNIFICATION]: 'Indemnification',
  [ClauseType.WARRANTY]: 'Warranty',
  [ClauseType.SLA]: 'SLA',
  [ClauseType.PENALTY]: 'Penalty',
  [ClauseType.DISCOUNT]: 'Discount',
  [ClauseType.VOLUME_COMMITMENT]: 'Volume Commitment',
  [ClauseType.PRICE_ADJUSTMENT]: 'Price Adjustment',
  [ClauseType.OTHER]: 'Other',
};

export default function ClausesFilterBar({
  selectedType,
  onTypeChange,
  showRiskyOnly,
  onShowRiskyOnlyChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: ClausesFilterBarProps) {
  const hasActiveFilters = selectedType !== 'all' || showRiskyOnly || searchQuery !== '';

  const handleClearAll = () => {
    onTypeChange('all');
    onShowRiskyOnlyChange(false);
    onSearchChange('');
  };

  return (
    <div className="card space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search clauses by text, section, or summary..."
          className="input pl-10 pr-10 w-full"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Clause Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Clause Type</label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as ClauseType | 'all')}
            className="input text-sm w-full"
          >
            {clauseTypeOptions.map((type) => (
              <option key={type} value={type}>
                {clauseTypeLabels[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'type' | 'confidence' | 'section')}
            className="input text-sm w-full"
          >
            <option value="type">Type (Alphabetical)</option>
            <option value="confidence">Confidence (High to Low)</option>
            <option value="section">Section Number</option>
          </select>
        </div>

        {/* Risky Clauses Only Checkbox */}
        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showRiskyOnly}
              onChange={(e) => onShowRiskyOnlyChange(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-700">Risky clauses only</span>
          </label>
        </div>

        {/* Clear All Button */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="btn btn-secondary text-sm w-full flex items-center justify-center space-x-2"
            >
              <X size={16} />
              <span>Clear all</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-600">
          Showing <span className="font-semibold">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> clauses
        </p>
        {hasActiveFilters && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Filter size={12} />
            <span>Filters active</span>
          </div>
        )}
      </div>
    </div>
  );
}
