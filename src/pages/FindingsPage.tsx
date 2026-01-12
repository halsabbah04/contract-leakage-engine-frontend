import { useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function FindingsPage() {
  const { contractId } = useParams<{ contractId: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leakage Findings</h1>
        <p className="text-gray-600 mt-1">Contract ID: {contractId}</p>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="text-severity-high" size={24} />
          <h2 className="text-xl font-semibold">Findings Analysis</h2>
        </div>
        <p className="text-gray-500">
          Findings list and detail views will be implemented in Task 16
        </p>
      </div>
    </div>
  );
}
