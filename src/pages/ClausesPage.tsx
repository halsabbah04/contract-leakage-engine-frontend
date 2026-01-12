import { useParams } from 'react-router-dom';
import { List } from 'lucide-react';

export default function ClausesPage() {
  const { contractId } = useParams<{ contractId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Extracted Clauses</h1>
        <p className="text-gray-600 mt-1">Contract ID: {contractId}</p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <List className="text-primary" size={24} />
          <h2 className="text-xl font-semibold">Clause Viewer</h2>
        </div>
        <p className="text-gray-500">
          Clause viewer with highlighting will be implemented in Task 17
        </p>
      </div>
    </div>
  );
}
