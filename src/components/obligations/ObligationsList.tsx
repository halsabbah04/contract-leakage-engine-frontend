import { useState, useMemo } from 'react';
import { Filter, SortAsc, SortDesc, LayoutList, Layers, ChevronDown, ChevronRight } from 'lucide-react';
import type { Obligation } from '@contract-leakage/shared-types';
import ObligationCard from './ObligationCard';
import clsx from 'clsx';

interface ObligationsListProps {
  obligations: Obligation[];
  contractId: string;
  onViewClauses?: (clauseIds: string[]) => void;
}

type SortField = 'due_date' | 'priority' | 'type' | 'status';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'list' | 'grouped';

type FilterType = 'all' | 'payment' | 'delivery' | 'notice' | 'reporting' | 'compliance' | 'performance' | 'renewal' | 'other';
type FilterStatus = 'all' | 'overdue' | 'due_soon' | 'upcoming' | 'completed';
type FilterResponsible = 'all' | 'our' | 'counterparty';

const priorityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const statusOrder: Record<string, number> = {
  overdue: 0,
  due_soon: 1,
  upcoming: 2,
  completed: 3,
  waived: 4,
  not_applicable: 5,
};

const typeLabels: Record<string, string> = {
  payment: 'Payment Obligations',
  delivery: 'Delivery Obligations',
  notice: 'Notice Requirements',
  reporting: 'Reporting Obligations',
  compliance: 'Compliance Requirements',
  performance: 'Performance Obligations',
  renewal: 'Renewal Obligations',
  termination: 'Termination Obligations',
  insurance: 'Insurance Requirements',
  audit: 'Audit Obligations',
  confidentiality: 'Confidentiality Obligations',
  other: 'Other Obligations',
};

const typeColors: Record<string, string> = {
  payment: 'bg-green-100 text-green-800 border-green-200',
  delivery: 'bg-blue-100 text-blue-800 border-blue-200',
  notice: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reporting: 'bg-purple-100 text-purple-800 border-purple-200',
  compliance: 'bg-red-100 text-red-800 border-red-200',
  performance: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  renewal: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  termination: 'bg-orange-100 text-orange-800 border-orange-200',
  insurance: 'bg-teal-100 text-teal-800 border-teal-200',
  audit: 'bg-pink-100 text-pink-800 border-pink-200',
  confidentiality: 'bg-gray-100 text-gray-800 border-gray-200',
  other: 'bg-slate-100 text-slate-800 border-slate-200',
};

export default function ObligationsList({
  obligations,
  contractId: _contractId,
  onViewClauses,
}: ObligationsListProps) {
  const [sortField, setSortField] = useState<SortField>('due_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterResponsible, setFilterResponsible] = useState<FilterResponsible>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grouped');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Filter obligations
  const filteredObligations = useMemo(() => {
    let filtered = obligations.filter((obl) => {
      if (filterType !== 'all' && obl.obligation_type !== filterType) return false;
      if (filterStatus !== 'all' && obl.status !== filterStatus) return false;
      if (filterResponsible === 'our' && !obl.responsible_party.is_our_organization) return false;
      if (filterResponsible === 'counterparty' && obl.responsible_party.is_our_organization) return false;
      return true;
    });

    // Sort obligations
    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'due_date':
          if (!a.due_date && !b.due_date) comparison = 0;
          else if (!a.due_date) comparison = 1;
          else if (!b.due_date) comparison = -1;
          else comparison = new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
          break;
        case 'priority':
          comparison = (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99);
          break;
        case 'type':
          comparison = a.obligation_type.localeCompare(b.obligation_type);
          break;
        case 'status':
          comparison = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [obligations, filterType, filterStatus, filterResponsible, sortField, sortDirection]);

  // Group obligations by type
  const groupedObligations = useMemo(() => {
    const groups: Record<string, Obligation[]> = {};

    for (const obl of filteredObligations) {
      const type = obl.obligation_type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(obl);
    }

    // Sort groups by count (descending)
    const sortedEntries = Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    return sortedEntries;
  }, [filteredObligations]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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
    setExpandedGroups(new Set(groupedObligations.map(([type]) => type)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const SortIcon = sortDirection === 'asc' ? SortAsc : SortDesc;

  return (
    <div className="space-y-4">
      {/* Filters and Sort Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* Divider */}
          <div className="h-6 border-l border-gray-300" />

          {/* Filter Icon */}
          <div className="flex items-center text-gray-500">
            <Filter size={16} className="mr-1" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="delivery">Delivery</option>
              <option value="notice">Notice</option>
              <option value="reporting">Reporting</option>
              <option value="compliance">Compliance</option>
              <option value="performance">Performance</option>
              <option value="renewal">Renewal</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Statuses</option>
              <option value="overdue">Overdue</option>
              <option value="due_soon">Due Soon</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Responsible Party Filter */}
          <div>
            <select
              value={filterResponsible}
              onChange={(e) => setFilterResponsible(e.target.value as FilterResponsible)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Parties</option>
              <option value="our">Our Obligations</option>
              <option value="counterparty">Counterparty</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-6 border-l border-gray-300" />

          {/* Sort Buttons - only show in list view */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              {(['due_date', 'priority', 'status', 'type'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleSort(field)}
                  className={clsx(
                    'text-sm px-2 py-1 rounded-md transition-colors',
                    sortField === field
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {field === 'due_date'
                    ? 'Due Date'
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field && <SortIcon size={12} className="inline ml-1" />}
                </button>
              ))}
            </div>
          )}

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

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredObligations.length} of {obligations.length} obligations
        {viewMode === 'grouped' && ` in ${groupedObligations.length} groups`}
      </div>

      {/* Empty State */}
      {filteredObligations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No obligations found matching your filters.</p>
          <button
            onClick={() => {
              setFilterType('all');
              setFilterStatus('all');
              setFilterResponsible('all');
            }}
            className="text-primary hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="space-y-4">
          {filteredObligations.map((obligation) => (
            <ObligationCard
              key={obligation.id}
              obligation={obligation}
              onViewClauses={onViewClauses}
            />
          ))}
        </div>
      ) : (
        /* Grouped View */
        <div className="space-y-3">
          {groupedObligations.map(([type, typeObligations]) => {
            const isExpanded = expandedGroups.has(type);
            const colorClass = typeColors[type] || typeColors.other;
            const label = typeLabels[type] || type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

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
                      {typeObligations.length} obligation{typeObligations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {/* Show status summary */}
                    {typeObligations.filter(o => o.status === 'overdue').length > 0 && (
                      <span className="text-red-600 font-medium">
                        {typeObligations.filter(o => o.status === 'overdue').length} overdue
                      </span>
                    )}
                    {typeObligations.filter(o => o.status === 'due_soon').length > 0 && (
                      <span className="text-yellow-600 font-medium">
                        {typeObligations.filter(o => o.status === 'due_soon').length} due soon
                      </span>
                    )}
                  </div>
                </button>

                {/* Group Content */}
                {isExpanded && (
                  <div className="p-4 space-y-4 bg-gray-50">
                    {typeObligations.map((obligation) => (
                      <ObligationCard
                        key={obligation.id}
                        obligation={obligation}
                        onViewClauses={onViewClauses}
                      />
                    ))}
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
