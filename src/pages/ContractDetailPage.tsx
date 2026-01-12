import { useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function ContractDetailPage() {
  const { contractId } = useParams<{ contractId: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contract Details</h1>
          <p className="text-gray-600 mt-1">Contract ID: {contractId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-primary" size={24} />
              <h2 className="text-xl font-semibold">Contract Information</h2>
            </div>
            <p className="text-gray-500">Component will be built in subsequent tasks</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-compact">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <p className="text-sm text-gray-500">Statistics dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
