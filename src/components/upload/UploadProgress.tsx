import { Upload, FileSearch, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  analyzeProgress: number;
  error: string | null;
  contractName?: string;
}

export default function UploadProgress({
  isUploading,
  uploadProgress,
  isAnalyzing,
  analyzeProgress,
  error,
  contractName,
}: UploadProgressProps) {
  const isComplete = !isUploading && !isAnalyzing && uploadProgress === 100 && analyzeProgress === 100;
  const isProcessing = isUploading || isAnalyzing;

  if (!isProcessing && !isComplete && !error) {
    return null;
  }

  return (
    <div className="card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {error ? 'Processing Failed' : isComplete ? 'Analysis Complete!' : 'Processing Contract'}
          </h3>
          {error ? (
            <AlertCircle size={24} className="text-error" />
          ) : isComplete ? (
            <CheckCircle size={24} className="text-success" />
          ) : (
            <div className="spinner"></div>
          )}
        </div>

        {contractName && (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Contract:</span> {contractName}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-error-light border border-error rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} className="text-error flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-error mb-1">Error</p>
                <p className="text-sm text-gray-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={clsx(
                  'p-2 rounded-full transition-colors',
                  uploadProgress === 100
                    ? 'bg-success text-white'
                    : isUploading
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {uploadProgress === 100 ? (
                  <CheckCircle size={20} />
                ) : (
                  <Upload size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {uploadProgress === 100 ? 'Upload Complete' : 'Uploading Contract'}
                </p>
                <p className="text-xs text-gray-500">
                  {uploadProgress === 100
                    ? 'File uploaded successfully'
                    : 'Sending file to server...'}
                </p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-600">{uploadProgress}%</span>
          </div>

          {/* Upload Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-300 ease-out',
                uploadProgress === 100 ? 'bg-success' : 'bg-primary'
              )}
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>

        {/* Analysis Progress */}
        {(isAnalyzing || analyzeProgress > 0) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={clsx(
                    'p-2 rounded-full transition-colors',
                    analyzeProgress === 100
                      ? 'bg-success text-white'
                      : isAnalyzing
                      ? 'bg-primary text-white animate-pulse'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {analyzeProgress === 100 ? (
                    <CheckCircle size={20} />
                  ) : (
                    <FileSearch size={20} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {analyzeProgress === 100
                      ? 'Analysis Complete'
                      : 'AI-Powered Analysis'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {analyzeProgress === 100
                      ? 'Leakage detection finished'
                      : 'Extracting clauses and detecting leakage...'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-600">{analyzeProgress}%</span>
            </div>

            {/* Analysis Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={clsx(
                  'h-full transition-all duration-300 ease-out',
                  analyzeProgress === 100 ? 'bg-success' : 'bg-primary'
                )}
                style={{ width: `${analyzeProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing Steps Info */}
        {isAnalyzing && analyzeProgress < 100 && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Processing:</span> GPT 5.2 is analyzing contract clauses
              with RAG-powered semantic search for comprehensive leakage detection
            </p>
          </div>
        )}

        {/* Success Message */}
        {isComplete && !error && (
          <div className="p-4 bg-success-light border border-success rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success mb-1">Success!</p>
                <p className="text-sm text-gray-700">
                  Contract analyzed successfully. Redirecting to results...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
