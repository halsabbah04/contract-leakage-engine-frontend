import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  AlertTriangle,
  FileSearch,
  Download,
  Calendar,
  Building,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Globe,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { contractService } from '../services';
import { useFindings } from '../hooks/useFindings';
import { useClauses } from '../hooks/useClauses';
import type { Contract } from '@contract-leakage/shared-types';
import { useState } from 'react';
import DocumentViewerModal from '../components/common/DocumentViewerModal';

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
      return <CheckCircle size={16} className="text-green-600" />;
    case 'analyzing':
    case 'extracting_clauses':
    case 'extracting_text':
      return <Loader2 size={16} className="text-blue-600 animate-spin" />;
    case 'uploaded':
    case 'text_extracted':
    case 'clauses_extracted':
      return <Clock size={16} className="text-yellow-600" />;
    case 'failed':
      return <XCircle size={16} className="text-red-600" />;
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

function formatCurrency(amount?: number, currency?: string): string {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const [isExporting, setIsExporting] = useState<'pdf' | 'excel' | null>(null);

  // Document viewer modal state
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentFilename, setDocumentFilename] = useState('');
  const [documentContentType, setDocumentContentType] = useState('');
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  // Fetch contract details
  const {
    data: contract,
    isLoading: contractLoading,
    error: contractError,
    refetch: refetchContract,
  } = useQuery<Contract>({
    queryKey: ['contract', contractId],
    queryFn: () => contractService.getContract(contractId!),
    enabled: !!contractId,
  });

  // Fetch findings summary
  const { summary, totalCount: findingsCount, isLoading: findingsLoading } = useFindings(
    contractId || ''
  );

  // Fetch clauses summary
  const { totalCount: clausesCount, isLoading: clausesLoading } = useClauses(contractId || '');

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!contractId) return;
    setIsExporting(format);
    try {
      await contractService.downloadReport(contractId, format, false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleViewDocument = async () => {
    if (!contractId) return;

    // Open modal and start loading
    setDocumentModalOpen(true);
    setDocumentLoading(true);
    setDocumentError(null);
    setDocumentUrl(null);

    try {
      const { document_url, filename, content_type } = await contractService.getDocumentUrl(contractId);
      setDocumentUrl(document_url);
      setDocumentFilename(filename);
      setDocumentContentType(content_type);
    } catch (error) {
      console.error('Failed to load document:', error);
      setDocumentError(error instanceof Error ? error.message : 'Failed to load document');
    } finally {
      setDocumentLoading(false);
    }
  };

  const handleCloseDocumentModal = () => {
    setDocumentModalOpen(false);
    setDocumentUrl(null);
    setDocumentError(null);
  };

  if (contractLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (contractError || !contract) {
    return (
      <div className="card text-center py-12">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Contract Not Found</h2>
        <p className="text-gray-600 mb-4">
          The contract you're looking for could not be loaded.
        </p>
        <button onClick={() => refetchContract()} className="btn btn-primary">
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
          <h1 className="text-3xl font-bold">{contract.contract_name}</h1>
          <p className="text-gray-600 mt-1">Contract ID: {contract.contract_id}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleViewDocument}
            disabled={documentLoading}
            className="btn btn-primary flex items-center"
          >
            {documentLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Eye size={16} className="mr-2" />
            )}
            View Document
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting !== null || contract.status !== 'analyzed'}
            className="btn btn-secondary flex items-center"
          >
            {isExporting === 'pdf' ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting !== null || contract.status !== 'analyzed'}
            className="btn btn-secondary flex items-center"
          >
            {isExporting === 'excel' ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            Export Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contract Information Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileText className="text-primary" size={24} />
                <h2 className="text-xl font-semibold">Contract Information</h2>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(
                  contract.status
                )}`}
              >
                {getStatusIcon(contract.status)}
                <span className="ml-1">{getStatusLabel(contract.status)}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Source</label>
                  <p className="font-medium capitalize">{contract.source || 'Upload'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Upload Date</label>
                  <p className="font-medium flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {formatDate(contract.upload_date || contract.created_at)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">File Type</label>
                  <p className="font-medium uppercase">
                    {contract.file_type || 'PDF'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Language</label>
                  <p className="font-medium flex items-center">
                    <Globe size={16} className="mr-2 text-gray-400" />
                    {contract.language?.toUpperCase() || 'EN'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {contract.counterparty && (
                  <div>
                    <label className="text-sm text-gray-500">Counterparty</label>
                    <p className="font-medium flex items-center">
                      <Building size={16} className="mr-2 text-gray-400" />
                      {contract.counterparty}
                    </p>
                  </div>
                )}
                {contract.contract_value_estimate && (
                  <div>
                    <label className="text-sm text-gray-500">Estimated Value</label>
                    <p className="font-medium flex items-center">
                      <DollarSign size={16} className="mr-2 text-gray-400" />
                      {formatCurrency(contract.contract_value_estimate)}
                    </p>
                  </div>
                )}
                {(contract.start_date || contract.end_date) && (
                  <div>
                    <label className="text-sm text-gray-500">Contract Period</label>
                    <p className="font-medium">
                      {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                    </p>
                  </div>
                )}
                {contract.processing_duration_seconds && (
                  <div>
                    <label className="text-sm text-gray-500">Processing Time</label>
                    <p className="font-medium">
                      {contract.processing_duration_seconds.toFixed(1)}s
                    </p>
                  </div>
                )}
              </div>
            </div>

            {contract.error_message && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {contract.error_message}
                </p>
              </div>
            )}
          </div>

          {/* Findings Summary Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="text-orange-500" size={24} />
                <h2 className="text-xl font-semibold">Leakage Findings</h2>
              </div>
              <Link
                to={`/contract/${contractId}/findings`}
                className="text-primary hover:underline text-sm font-medium"
              >
                View All Findings →
              </Link>
            </div>

            {findingsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : findingsCount === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No leakage findings detected</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Severity breakdown */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {summary?.by_severity?.CRITICAL || 0}
                    </p>
                    <p className="text-sm text-red-700">Critical</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {summary?.by_severity?.HIGH || 0}
                    </p>
                    <p className="text-sm text-orange-700">High</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {summary?.by_severity?.MEDIUM || 0}
                    </p>
                    <p className="text-sm text-yellow-700">Medium</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {summary?.by_severity?.LOW || 0}
                    </p>
                    <p className="text-sm text-green-700">Low</p>
                  </div>
                </div>

                {/* Total estimated impact */}
                {summary?.total_estimated_impact && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Total Estimated Impact</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(
                        summary.total_estimated_impact.amount,
                        summary.total_estimated_impact.currency
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Clauses Summary Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FileSearch className="text-blue-500" size={24} />
                <h2 className="text-xl font-semibold">Extracted Clauses</h2>
              </div>
              <Link
                to={`/contract/${contractId}/clauses`}
                className="text-primary hover:underline text-sm font-medium"
              >
                View All Clauses →
              </Link>
            </div>

            {clausesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            ) : clausesCount === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileSearch size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No clauses extracted yet</p>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <p className="text-4xl font-bold text-blue-600">{clausesCount}</p>
                <p className="text-blue-700">Clauses Extracted</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <div className="card-compact">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                    contract.status
                  )}`}
                >
                  {getStatusLabel(contract.status)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Findings</span>
                <span className="font-semibold">{findingsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Clauses</span>
                <span className="font-semibold">{clausesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm">{formatDate(contract.updated_at)}</span>
              </div>
            </div>
          </div>

          {/* Risk Profile Card */}
          <div className="card-compact">
            <div className="flex items-center space-x-2 mb-4">
              <ShieldAlert size={18} className="text-primary" />
              <h3 className="font-semibold">Risk Profile</h3>
            </div>
            {findingsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Risk Level Indicator */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Overall Risk</span>
                    <span className={`text-sm font-semibold ${
                      (summary?.by_severity?.CRITICAL || 0) > 0 ? 'text-red-600' :
                      (summary?.by_severity?.HIGH || 0) > 0 ? 'text-orange-600' :
                      (summary?.by_severity?.MEDIUM || 0) > 0 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {(summary?.by_severity?.CRITICAL || 0) > 0 ? 'Critical' :
                       (summary?.by_severity?.HIGH || 0) > 0 ? 'High' :
                       (summary?.by_severity?.MEDIUM || 0) > 0 ? 'Medium' :
                       findingsCount > 0 ? 'Low' : 'Minimal'}
                    </span>
                  </div>
                  {/* Risk Bar */}
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                    {(summary?.by_severity?.CRITICAL || 0) > 0 && (
                      <div
                        className="bg-red-500 h-full"
                        style={{ width: `${((summary?.by_severity?.CRITICAL || 0) / Math.max(findingsCount, 1)) * 100}%` }}
                      />
                    )}
                    {(summary?.by_severity?.HIGH || 0) > 0 && (
                      <div
                        className="bg-orange-500 h-full"
                        style={{ width: `${((summary?.by_severity?.HIGH || 0) / Math.max(findingsCount, 1)) * 100}%` }}
                      />
                    )}
                    {(summary?.by_severity?.MEDIUM || 0) > 0 && (
                      <div
                        className="bg-yellow-500 h-full"
                        style={{ width: `${((summary?.by_severity?.MEDIUM || 0) / Math.max(findingsCount, 1)) * 100}%` }}
                      />
                    )}
                    {(summary?.by_severity?.LOW || 0) > 0 && (
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: `${((summary?.by_severity?.LOW || 0) / Math.max(findingsCount, 1)) * 100}%` }}
                      />
                    )}
                    {findingsCount === 0 && (
                      <div className="bg-green-500 h-full w-full" />
                    )}
                  </div>
                </div>

                {/* Risk Score */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Risk Score</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-2xl font-bold text-gray-800">
                        {Math.min(100, Math.round(
                          ((summary?.by_severity?.CRITICAL || 0) * 40 +
                           (summary?.by_severity?.HIGH || 0) * 25 +
                           (summary?.by_severity?.MEDIUM || 0) * 10 +
                           (summary?.by_severity?.LOW || 0) * 3)
                        ))}
                      </span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Based on {findingsCount} finding{findingsCount !== 1 ? 's' : ''} detected
                  </p>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Trend</span>
                  <div className="flex items-center space-x-1">
                    {findingsCount === 0 ? (
                      <>
                        <TrendingDown size={14} className="text-green-500" />
                        <span className="text-green-600">No issues</span>
                      </>
                    ) : (summary?.by_severity?.CRITICAL || 0) > 0 || (summary?.by_severity?.HIGH || 0) > 2 ? (
                      <>
                        <TrendingUp size={14} className="text-red-500" />
                        <span className="text-red-600">Needs attention</span>
                      </>
                    ) : (
                      <>
                        <Minus size={14} className="text-yellow-500" />
                        <span className="text-yellow-600">Monitor</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Findings Preview */}
          {findingsCount > 0 && (
            <div className="card-compact">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Top Findings</h3>
                <Link
                  to={`/contract/${contractId}/findings`}
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  View all
                  <ArrowRight size={12} className="ml-1" />
                </Link>
              </div>
              <div className="space-y-3">
                {/* Show top 3 findings by severity */}
                {[
                  ...(summary?.by_severity?.CRITICAL ? Array(Math.min(summary.by_severity.CRITICAL, 2)).fill('CRITICAL') : []),
                  ...(summary?.by_severity?.HIGH ? Array(Math.min(summary.by_severity.HIGH, 2)).fill('HIGH') : []),
                  ...(summary?.by_severity?.MEDIUM ? Array(Math.min(summary.by_severity.MEDIUM, 1)).fill('MEDIUM') : []),
                ].slice(0, 3).map((severity, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-l-4 ${
                      severity === 'CRITICAL' ? 'bg-red-50 border-red-500' :
                      severity === 'HIGH' ? 'bg-orange-50 border-orange-500' :
                      'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                          severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {severity}
                        </span>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {severity === 'CRITICAL' ? 'Critical risk requiring immediate review' :
                           severity === 'HIGH' ? 'High priority issue identified' :
                           'Medium risk item to address'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {findingsCount === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No findings to display
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Critical Findings Alert */}
          {(summary?.by_severity?.CRITICAL || 0) > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-red-800">Critical Findings</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This contract has {summary?.by_severity?.CRITICAL} critical finding(s) that
                    require immediate attention.
                  </p>
                  <Link
                    to={`/contract/${contractId}/findings?severity=CRITICAL`}
                    className="text-sm text-red-800 font-medium hover:underline mt-2 inline-block"
                  >
                    Review Critical Findings →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={documentModalOpen}
        onClose={handleCloseDocumentModal}
        documentUrl={documentUrl}
        filename={documentFilename}
        contentType={documentContentType}
        isLoading={documentLoading}
        error={documentError}
      />
    </div>
  );
}
