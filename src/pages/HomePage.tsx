import { Link } from 'react-router-dom';
import { Upload, FileSearch, AlertTriangle, BarChart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Welcome to Contract Leakage Engine</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          AI-powered analysis to identify commercial leakage and revenue risks in your contracts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload size={32} className="text-primary" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Upload Contract</h3>
          <p className="text-gray-600 text-sm mb-4">
            Upload PDF, Word, or text contracts for analysis
          </p>
          <Link to="/upload" className="btn btn-primary">
            Get Started
          </Link>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <FileSearch size={32} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
          <p className="text-gray-600 text-sm">
            GPT 5.2 powered detection with RAG for comprehensive analysis
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-orange-100 rounded-full">
              <AlertTriangle size={32} className="text-orange-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Leakage Detection</h3>
          <p className="text-gray-600 text-sm">
            Identify pricing, payment, renewal, and compliance risks
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <BarChart size={32} className="text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Professional Reports</h3>
          <p className="text-gray-600 text-sm">
            Export PDF and Excel reports with executive summaries
          </p>
        </div>
      </div>

      <div className="card bg-primary-light text-white mt-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Key Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Dual detection: Rule-based + AI-powered analysis</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>RAG architecture with Azure AI Search for semantic clause retrieval</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Severity classification: Critical, High, Medium, Low</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Financial impact estimation for each finding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Explainable AI with confidence scores and traceability</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Leakage Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Pricing',
                'Payment Terms',
                'Renewal',
                'Termination',
                'Liability',
                'SLA',
                'Discounts',
                'Volume Commitments',
              ].map((category) => (
                <div key={category} className="bg-white/20 rounded px-3 py-2 text-sm">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
