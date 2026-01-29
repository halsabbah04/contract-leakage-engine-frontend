import { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
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

  // Filter obligations
  let filteredObligations = obligations.filter((obl) => {
    if (filterType !== 'all' && obl.obligation_type !== filterType) return false;
    if (filterStatus !== 'all' && obl.status !== filterStatus) return false;
    if (filterResponsible === 'our' && !obl.responsible_party.is_our_organization) return false;
    if (filterResponsible === 'counterparty' && obl.responsible_party.is_our_organization) return false;
    return true;
  });

  // Sort obligations
  filteredObligations = [...filteredObligations].sort((a, b) => {
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

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = sortDirection === 'asc' ? SortAsc : SortDesc;

  return (
    <div className="space-y-4">
      {/* Filters and Sort Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-4">
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

          {/* Sort Buttons */}
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
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredObligations.length} of {obligations.length} obligations
      </div>

      {/* Obligations List */}
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
      ) : (
        <div className="space-y-4">
          {filteredObligations.map((obligation) => (
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
}
