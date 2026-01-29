import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Loader, RefreshCw } from 'lucide-react';
import ObligationsSummary from '../components/obligations/ObligationsSummary';
import ObligationsList from '../components/obligations/ObligationsList';
import { useObligations } from '../hooks/useObligations';

export default function ObligationsPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();

  const { obligations, summary, isLoading, error, refetch } = useObligations(contractId || '');

  const handleViewClauses = (clauseIds: string[]) => {
    navigate(`/contract/${contractId}/clauses`, {
      state: { highlightClauseIds: clauseIds },
    });
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
          <p className="text-gray-600">Loading obligations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <div className="text-red-600 mb-4">
          <p className="font-semibold">Error loading obligations</p>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar size={32} className="text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Contract Obligations</h1>
              <p className="text-gray-600 mt-1">
                AI-extracted contractual obligations and deadlines
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* No obligations found */}
      {obligations.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Obligations Found
          </h3>
          <p className="text-gray-600 mb-2">
            Obligations are automatically extracted during contract analysis.
          </p>
          <p className="text-sm text-gray-500">
            If this contract was analyzed before the obligation extraction feature was added,
            try re-analyzing the contract from the contract list page.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      {summary && obligations.length > 0 && <ObligationsSummary summary={summary} />}

      {/* Obligations List */}
      {obligations.length > 0 && (
        <ObligationsList
          obligations={obligations}
          contractId={contractId}
          onViewClauses={handleViewClauses}
        />
      )}
    </div>
  );
}
