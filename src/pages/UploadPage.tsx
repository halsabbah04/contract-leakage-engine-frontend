import { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import FileUpload from '@components/upload/FileUpload';
import ContractMetadataForm from '@components/upload/ContractMetadataForm';
import UploadProgress from '@components/upload/UploadProgress';
import { useContractUpload } from '../hooks/useContractUpload';
import type { ContractMetadata } from '@contract-leakage/shared-types';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<'upload' | 'metadata' | 'processing'>('upload');

  const {
    isUploading,
    uploadProgress,
    isAnalyzing,
    analyzeProgress,
    error,
    contractId,
    isProcessing,
    uploadContract,
    reset,
    // Progress state
    currentStage,
    stageInfo,
    elapsedTime,
  } = useContractUpload({
    autoAnalyze: true,
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-advance to metadata form
    setStep('metadata');
  };

  const handleMetadataSubmit = (data: {
    contractName: string;
    uploadedBy: string;
    metadata: ContractMetadata;
  }) => {
    if (!selectedFile) return;

    setStep('processing');
    uploadContract({
      file: selectedFile,
      contractName: data.contractName,
      uploadedBy: data.uploadedBy,
      metadata: data.metadata,
    });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setStep('upload');
    reset();
  };

  // Get default contract name from file
  const defaultContractName = selectedFile
    ? selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    : '';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2 flex items-center space-x-3">
          <Upload size={32} className="text-primary" />
          <span>Upload Contract</span>
        </h1>
        <p className="text-gray-600">
          Upload a contract document for AI-powered clause extraction and leakage analysis
        </p>
      </div>

      {/* Progress Steps Indicator */}
      {!error && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step === 'upload'
                    ? 'border-primary bg-primary text-white'
                    : selectedFile
                    ? 'border-success bg-success text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <span className="text-sm font-semibold">1</span>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">Upload File</span>
            </div>

            <div className={`flex-1 h-1 mx-4 ${selectedFile ? 'bg-success' : 'bg-gray-200'}`} />

            {/* Step 2 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step === 'metadata'
                    ? 'border-primary bg-primary text-white'
                    : step === 'processing'
                    ? 'border-success bg-success text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <span className="text-sm font-semibold">2</span>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">Enter Details</span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 ${step === 'processing' ? 'bg-success' : 'bg-gray-200'}`}
            />

            {/* Step 3 */}
            <div className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step === 'processing'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                <span className="text-sm font-semibold">3</span>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">Process</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 1: File Upload */}
      {step === 'upload' && (
        <div className="card">
          <FileUpload onFileSelect={handleFileSelect} disabled={isProcessing} />
        </div>
      )}

      {/* Step 2: Metadata Form */}
      {step === 'metadata' && selectedFile && (
        <div className="space-y-6">
          {/* Selected File Info */}
          <div className="card-compact bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Selected File</p>
                <p className="text-sm text-gray-600 mt-1">{selectedFile.name}</p>
              </div>
              <button
                onClick={handleReset}
                className="text-sm text-primary hover:underline"
                disabled={isProcessing}
              >
                Change File
              </button>
            </div>
          </div>

          {/* Metadata Form */}
          <div className="card">
            <ContractMetadataForm
              onSubmit={handleMetadataSubmit}
              disabled={isProcessing}
              defaultContractName={defaultContractName}
            />
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 'processing' && (
        <div className="space-y-6">
          <UploadProgress
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            isAnalyzing={isAnalyzing}
            analyzeProgress={analyzeProgress}
            error={error}
            contractName={defaultContractName}
            contractId={contractId}
            currentStage={currentStage}
            stageInfo={stageInfo}
            elapsedTime={elapsedTime}
          />

          {error && (
            <div className="flex justify-center">
              <button onClick={handleReset} className="btn btn-primary">
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      {step === 'upload' && (
        <div className="mt-8 card-compact bg-blue-50 border-blue-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">What happens next?</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your contract will be uploaded securely to Azure Blob Storage</li>
            <li>• GPT 5.2 will extract clauses using NLP and entity recognition</li>
            <li>• RAG-powered semantic search will retrieve relevant clauses for analysis</li>
            <li>• AI will detect commercial leakage across 10+ categories</li>
            <li>• You'll see detailed findings with severity ratings and financial impact</li>
          </ul>
        </div>
      )}
    </div>
  );
}
