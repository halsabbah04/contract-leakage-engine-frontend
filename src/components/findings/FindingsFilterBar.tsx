import { Filter, X } from 'lucide-react';
import { Severity, LeakageCategory } from '@contract-leakage/shared-types';
import { formatCategory } from '@utils/format';

interface FindingsFilterBarProps {
  selectedSeverity: Severity | 'all';
  onSeverityChange: (severity: Severity | 'all') => void;
  selectedCategory: LeakageCategory | 'all';
  onCategoryChange: (category: LeakageCategory | 'all') => void;
  sortBy: 'severity' | 'category' | 'impact';
  onSortChange: (sortBy: 'severity' | 'category' | 'impact') => void;
  totalCount: number;
  filteredCount: number;
}

const severityOptions: Array<Severity | 'all'> = [
  'all',
  Severity.CRITICAL,
  Severity.HIGH,
  Severity.MEDIUM,
  Severity.LOW,
];

const categoryOptions: Array<LeakageCategory | 'all'> = [
  'all',
  LeakageCategory.PRICING,
  LeakageCategory.PAYMENT,
  LeakageCategory.RENEWAL,
  LeakageCategory.TERMINATION,
  LeakageCategory.LIABILITY,
  LeakageCategory.SLA,
  LeakageCategory.DISCOUNTS,
  LeakageCategory.VOLUME,
];

export default function FindingsFilterBar({
  selectedSeverity,
  onSeverityChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount,
}: FindingsFilterBarProps) {
  const hasActiveFilters = selectedSeverity !== 'all' || selectedCategory !== 'all';

  const handleClearFilters = () => {
    onSeverityChange('all');
    onCategoryChange('all');
  };

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">Filter & Sort</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-gray-600 hover:text-primary flex items-center space-x-1"
          >
            <X size={14} />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity Filter */}
        <div>
          <label htmlFor="severity-filter" className="block text-xs font-medium text-gray-700 mb-2">
            Severity
          </label>
          <select
            id="severity-filter"
            value={selectedSeverity}
            onChange={(e) => onSeverityChange(e.target.value as Severity | 'all')}
            className="input text-sm"
          >
            {severityOptions.map((severity) => (
              <option key={severity} value={severity}>
                {severity === 'all' ? 'All Severities' : severity}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-xs font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as LeakageCategory | 'all')}
            className="input text-sm"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : formatCategory(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sort-by" className="block text-xs font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'severity' | 'category' | 'impact')}
            className="input text-sm"
          >
            <option value="severity">Severity (High to Low)</option>
            <option value="category">Category</option>
            <option value="impact">Financial Impact</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Showing <span className="font-semibold">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> findings
        </p>
      </div>
    </div>
  );
}
