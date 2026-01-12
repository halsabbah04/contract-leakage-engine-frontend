import { Link } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <FileText size={32} />
            <div>
              <h1 className="text-2xl font-bold text-white">Contract Leakage Engine</h1>
              <p className="text-sm text-blue-200">AI-Powered Commercial Leakage Analysis</p>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link
              to="/upload"
              className="flex items-center space-x-2 px-4 py-2 bg-white text-primary rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              <Upload size={18} />
              <span>Upload Contract</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
