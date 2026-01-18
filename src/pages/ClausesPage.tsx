import { useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader } from 'lucide-react';
import { useClauses } from '../hooks/useClauses';
import ClausesList from '../components/clauses/ClausesList';

export default function ClausesPage() {
  const { contractId } = useParams<{ contractId: string }>();
  const location = useLocation();

  // Get highlighted clause IDs from navigation state (passed from FindingsPage)
  const highlightClauseIds = (location.state as { highlightClauseIds?: string[] })?.highlightClauseIds || [];

  // Fetch clauses
  const { clauses, totalCount, isLoading, error } = useClauses(contractId || '');

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading clauses...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <Link
          to={`/contract/${contractId}`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Contract
        </Link>

        <div className="card border-error bg-error-light">
          <h3 className="text-lg font-semibold text-error mb-2">Error Loading Clauses</h3>
          <p className="text-gray-700">{(error as Error).message}</p>
        </div>
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
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
              <FileText size={32} className="text-primary" />
              <span>Extracted Clauses</span>
            </h1>
            <p className="text-gray-600">
              AI-extracted clauses with entity recognition and risk signal detection
            </p>
          </div>

          {/* Total Count Badge */}
          {totalCount > 0 && (
            <div className="text-right">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-lg">
                <span className="text-sm text-gray-600">Total Clauses</span>
                <span className="ml-2 text-2xl font-bold text-primary">{totalCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clauses List with Filtering */}
      <ClausesList clauses={clauses} highlightClauseIds={highlightClauseIds} />
    </div>
  );
}
