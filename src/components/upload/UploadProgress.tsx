import {
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  FileSearch,
  Scale,
  Brain,
} from 'lucide-react';
import clsx from 'clsx';
import type { ProcessingStage, StageInfo } from '../../hooks/useContractUpload';

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  analyzeProgress: number;
  error: string | null;
  contractName?: string;
  contractId?: string | null;
  currentStage: ProcessingStage;
  stageInfo: StageInfo;
  elapsedTime: number;
}

// Format seconds to mm:ss
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Stage icon component
function StageIcon({ stage, size = 18 }: { stage: string; size?: number }) {
  switch (stage) {
    case 'uploading':
      return <Upload size={size} />;
    case 'extracting_text':
      return <FileText size={size} />;
    case 'extracting_clauses':
      return <FileSearch size={size} />;
    case 'rules_detection':
      return <Scale size={size} />;
    case 'ai_detection':
      return <Brain size={size} />;
    default:
      return <CheckCircle size={size} />;
  }
}

// Processing stages for visual display
const VISUAL_STAGES: { key: ProcessingStage; label: string }[] = [
  { key: 'uploading', label: 'Upload' },
  { key: 'extracting_text', label: 'Extract' },
  { key: 'extracting_clauses', label: 'Clauses' },
  { key: 'rules_detection', label: 'Rules' },
  { key: 'ai_detection', label: 'AI' },
];

function getStageIndex(stage: ProcessingStage): number {
  const index = VISUAL_STAGES.findIndex(s => s.key === stage);
  if (stage === 'complete') return VISUAL_STAGES.length;
  if (stage === 'upload_complete') return 1;
  return index >= 0 ? index : 0;
}

export default function UploadProgress({
  isUploading,
  uploadProgress,
  isAnalyzing,
  analyzeProgress,
  error,
  contractName,
  contractId,
  currentStage,
  stageInfo,
  elapsedTime,
}: UploadProgressProps) {
  const isComplete = currentStage === 'complete';
  const isProcessing = isUploading || isAnalyzing;
  const totalProgress = isComplete ? 100 : Math.max(uploadProgress, analyzeProgress);
  const currentStageIndex = getStageIndex(currentStage);

  if (currentStage === 'idle' && !error) {
    return null;
  }

  return (
    <div className="card">
      <div className="space-y-6">
        {/* Header with Time Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {error ? 'Processing Failed' : isComplete ? 'Analysis Complete!' : 'Processing Contract'}
            </h3>
            {contractName && (
              <p className="text-sm text-gray-500 mt-1">{contractName}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {/* Time indicator - shows actual elapsed time only */}
            {isProcessing && (
              <div className="flex items-center space-x-1 text-sm text-gray-600" title="Elapsed time">
                <Clock size={16} />
                <span>{formatTime(elapsedTime)} elapsed</span>
              </div>
            )}
            {error ? (
              <AlertCircle size={24} className="text-error" />
            ) : isComplete ? (
              <CheckCircle size={24} className="text-success" />
            ) : (
              <div className="spinner"></div>
            )}
          </div>
        </div>

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

        {/* Stage Progress Indicators */}
        {!error && (
          <div className="relative flex items-center justify-between px-2">
            {VISUAL_STAGES.map((stage, index) => {
              const isActive = stage.key === currentStage;
              const isCompleted = currentStageIndex > index || isComplete;

              return (
                <div key={stage.key} className="relative flex flex-col items-center flex-1">
                  {/* Stage icon */}
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                      isCompleted
                        ? 'bg-success text-white'
                        : isActive
                        ? 'bg-primary text-white ring-4 ring-primary/20 animate-pulse'
                        : 'bg-gray-200 text-gray-400'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <StageIcon stage={stage.key} size={18} />
                    )}
                  </div>

                  {/* Stage label */}
                  <span
                    className={clsx(
                      'text-xs mt-2 font-medium transition-colors',
                      isCompleted
                        ? 'text-success'
                        : isActive
                        ? 'text-primary'
                        : 'text-gray-400'
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Progress connector lines (separate layer) */}
        {!error && (
          <div className="relative h-0.5 bg-gray-200 mx-7 -mt-[3.25rem] mb-8">
            <div
              className="absolute h-full bg-success transition-all duration-500 ease-out"
              style={{ width: `${Math.min((currentStageIndex / VISUAL_STAGES.length) * 100, 100)}%` }}
            />
          </div>
        )}

        {/* Main Progress Bar */}
        {!error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{stageInfo.label}</span>
              <span className="font-semibold text-primary">{totalProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={clsx(
                  'h-full transition-all duration-500 ease-out rounded-full',
                  isComplete ? 'bg-success' : 'bg-primary'
                )}
                style={{ width: `${totalProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">{stageInfo.description}</p>
          </div>
        )}

        {/* Success Message */}
        {isComplete && !error && (
          <div className="p-4 bg-success-light border border-success rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-success flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success mb-1">Analysis Complete!</p>
                <p className="text-sm text-gray-700">
                  Completed in {formatTime(elapsedTime)}. Redirecting to results...
                </p>
                {contractId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Contract ID: <span className="font-mono">{contractId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
