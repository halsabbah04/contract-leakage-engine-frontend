import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import kpmgLogo from '../../assets/images/kpmg-logo-new.png';

export default function Header() {
  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4 hover:opacity-90 transition-opacity">
            <img
              src={kpmgLogo}
              alt="KPMG Logo"
              className="h-16 w-auto"
            />
            <div className="h-12 w-px bg-white/30" />
            <div>
              <h1 className="text-xl font-bold text-white">Contract Leakage Engine</h1>
              <p className="text-xs text-blue-200">AI-Powered Commercial Leakage Analysis</p>
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
