import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import { contractService } from '../services';
import type { Contract, ListContractsResponse } from '@contract-leakage/shared-types';
import { useState, useMemo } from 'react';

function getStatusColor(status: string): string {
  switch (status) {
    case 'analyzed':
      return 'bg-green-100 text-green-800';
    case 'analyzing':
    case 'extracting_clauses':
    case 'extracting_text':
      return 'bg-blue-100 text-blue-800';
    case 'uploaded':
    case 'text_extracted':
    case 'clauses_extracted':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'analyzed':
      return <CheckCircle size={14} className="text-green-600" />;
    case 'analyzing':
    case 'extracting_clauses':
    case 'extracting_text':
      return <Loader2 size={14} className="text-blue-600 animate-spin" />;
    case 'uploaded':
    case 'text_extracted':
    case 'clauses_extracted':
      return <Clock size={14} className="text-yellow-600" />;
    case 'failed':
      return <XCircle size={14} className="text-red-600" />;
    default:
      return null;
  }
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    uploaded: 'Uploaded',
    extracting_text: 'Extracting Text',
    text_extracted: 'Text Extracted',
    extracting_clauses: 'Extracting Clauses',
    clauses_extracted: 'Clauses Extracted',
    analyzing: 'Analyzing',
    analyzed: 'Analyzed',
    failed: 'Failed',
  };
  return labels[status] || status;
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
}

type StatusFilter = 'all' | 'analyzed' | 'processing' | 'failed';

export default function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<ListContractsResponse>({
    queryKey: ['contracts'],
    queryFn: () => contractService.listContracts(),
  });

  const filteredContracts = useMemo(() => {
    if (!data?.contracts) return [];

    return data.contracts.filter((contract) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        contract.contract_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.contract_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contract.counterparty?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'analyzed') {
        matchesStatus = contract.status === 'analyzed';
      } else if (statusFilter === 'processing') {
        matchesStatus = ['uploaded', 'extracting_text', 'text_extracted', 'extracting_clauses', 'clauses_extracted', 'analyzing'].includes(contract.status);
      } else if (statusFilter === 'failed') {
        matchesStatus = contract.status === 'failed';
      }

      return matchesSearch && matchesStatus;
    });
  }, [data?.contracts, searchQuery, statusFilter]);

  // Sort by most recent first
  const sortedContracts = useMemo(() => {
    return [...filteredContracts].sort((a, b) => {
      const dateA = new Date(a.updated_at || a.created_at).getTime();
      const dateB = new Date(b.updated_at || b.created_at).getTime();
      return dateB - dateA;
    });
  }, [filteredContracts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Failed to Load Contracts</h2>
        <p className="text-gray-600 mb-4">
          Could not load the contract list. Please try again.
        </p>
        <button onClick={() => refetch()} className="btn btn-primary">
          <RefreshCw size={16} className="mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload History</h1>
          <p className="text-gray-600 mt-1">
            {data?.total_count || 0} contracts uploaded
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => refetch()} className="btn btn-secondary">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <Link to="/upload" className="btn btn-primary">
            <FileText size={16} className="mr-2" />
            Upload New
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or counterparty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="analyzed">Analyzed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      {sortedContracts.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {data?.contracts?.length === 0 ? 'No Contracts Yet' : 'No Matching Contracts'}
          </h3>
          <p className="text-gray-500 mb-4">
            {data?.contracts?.length === 0
              ? 'Upload your first contract to get started with analysis.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {data?.contracts?.length === 0 && (
            <Link to="/upload" className="btn btn-primary">
              Upload Contract
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedContracts.map((contract) => (
            <ContractCard key={contract.contract_id} contract={contract} />
          ))}
        </div>
      )}
    </div>
  );
}

function ContractCard({ contract }: { contract: Contract }) {
  const isProcessing = ['uploaded', 'extracting_text', 'text_extracted', 'extracting_clauses', 'clauses_extracted', 'analyzing'].includes(contract.status);

  return (
    <Link
      to={`/contract/${contract.contract_id}`}
      className="card block hover:shadow-lg transition-shadow group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${isProcessing ? 'bg-blue-100' : contract.status === 'analyzed' ? 'bg-green-100' : contract.status === 'failed' ? 'bg-red-100' : 'bg-gray-100'}`}>
            <FileText
              size={24}
              className={isProcessing ? 'text-blue-600' : contract.status === 'analyzed' ? 'text-green-600' : contract.status === 'failed' ? 'text-red-600' : 'text-gray-600'}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {contract.contract_name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(
                  contract.status
                )}`}
              >
                {getStatusIcon(contract.status)}
                <span className="ml-1">{getStatusLabel(contract.status)}</span>
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                {formatDate(contract.upload_date || contract.created_at)}
              </span>
              {contract.counterparty && (
                <span className="truncate max-w-[200px]">
                  Counterparty: {contract.counterparty}
                </span>
              )}
              {contract.language && (
                <span className="uppercase text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {contract.language}
                </span>
              )}
              {contract.file_type && (
                <span className="uppercase text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {contract.file_type}
                </span>
              )}
            </div>

            {contract.error_message && (
              <div className="mt-2 flex items-center text-sm text-red-600">
                <AlertTriangle size={14} className="mr-1" />
                <span className="truncate">{contract.error_message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={24}
          className="text-gray-400 group-hover:text-primary transition-colors flex-shrink-0 ml-4"
        />
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-blue-600">
            <Loader2 size={14} className="animate-spin mr-2" />
            Processing in progress...
          </div>
        </div>
      )}
    </Link>
  );
}
