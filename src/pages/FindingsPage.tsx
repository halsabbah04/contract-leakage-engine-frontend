import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader } from 'lucide-react';
import FindingsSummary from '@components/findings/FindingsSummary';
import FindingsList from '@components/findings/FindingsList';
import { useFindings } from '../hooks/useFindings';
import { contractService } from '../services';

export default function FindingsPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();

  const { findings, summary, isLoading, error } = useFindings(contractId || '');

  const handleViewClauses = (clauseIds: string[]) => {
    // Navigate to clauses page with highlighted clauses
    navigate(`/contract/${contractId}/clauses`, {
      state: { highlightClauseIds: clauseIds },
    });
  };

  const handleExportReport = async () => {
    if (!contractId) return;

    try {
      await contractService.downloadReport(contractId, 'pdf', false);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  if (!contractId) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Invalid contract ID</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading findings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="font-semibold">Error loading findings</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
        <Link to={`/contract/${contractId}`} className="btn btn-primary">
          Back to Contract
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/contract/${contractId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Contract
        </Link>
        <div className="flex items-center space-x-3">
          <FileText size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Leakage Findings</h1>
            <p className="text-gray-600 mt-1">
              AI-powered commercial leakage analysis results
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && <FindingsSummary summary={summary} />}

      {/* Findings List */}
      <FindingsList
        findings={findings}
        onViewClauses={handleViewClauses}
        onExportReport={handleExportReport}
      />
    </div>
  );
}
