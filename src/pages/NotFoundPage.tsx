import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-error-light rounded-full">
            <AlertCircle size={64} className="text-error" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-600 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 btn btn-primary shadow-primary"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
