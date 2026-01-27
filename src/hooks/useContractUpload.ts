import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { contractService, getErrorMessage } from '../services';
import type { ContractMetadata } from '@contract-leakage/shared-types';

interface AnalysisSummary {
  totalClausesExtracted: number;
  totalFindings: number;
  findingsBySeverity: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
  };
  processingTimeSeconds: number;
}

// Processing stages with typical durations (in seconds)
export type ProcessingStage =
  | 'idle'
  | 'uploading'
  | 'upload_complete'
  | 'extracting_text'
  | 'extracting_clauses'
  | 'rules_detection'
  | 'ai_detection'
  | 'complete'
  | 'error';

interface StageInfo {
  label: string;
  description: string;
  estimatedDuration: number; // seconds
  progressStart: number; // 0-100
  progressEnd: number; // 0-100
}

const STAGE_INFO: Record<ProcessingStage, StageInfo> = {
  idle: { label: 'Ready', description: 'Waiting to start', estimatedDuration: 0, progressStart: 0, progressEnd: 0 },
  uploading: { label: 'Uploading', description: 'Sending file to server...', estimatedDuration: 5, progressStart: 0, progressEnd: 15 },
  upload_complete: { label: 'Upload Complete', description: 'File uploaded successfully', estimatedDuration: 1, progressStart: 15, progressEnd: 20 },
  extracting_text: { label: 'Extracting Text', description: 'OCR and text extraction...', estimatedDuration: 10, progressStart: 20, progressEnd: 35 },
  extracting_clauses: { label: 'Extracting Clauses', description: 'NLP clause segmentation...', estimatedDuration: 15, progressStart: 35, progressEnd: 55 },
  rules_detection: { label: 'Rules Analysis', description: 'Applying leakage detection rules...', estimatedDuration: 10, progressStart: 55, progressEnd: 75 },
  ai_detection: { label: 'AI Analysis', description: 'GPT-5.2 powered detection with RAG...', estimatedDuration: 45, progressStart: 75, progressEnd: 98 },
  complete: { label: 'Complete', description: 'Analysis finished', estimatedDuration: 0, progressStart: 100, progressEnd: 100 },
  error: { label: 'Error', description: 'Processing failed', estimatedDuration: 0, progressStart: 0, progressEnd: 0 },
};

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  analyzeProgress: number;
  error: string | null;
  contractId: string | null;
  analysisSummary: AnalysisSummary | null;
  currentStage: ProcessingStage;
  elapsedTime: number; // seconds - actual elapsed time
}

interface UseContractUploadOptions {
  onUploadComplete?: (contractId: string) => void;
  onAnalyzeComplete?: (contractId: string) => void;
  autoAnalyze?: boolean;
}

/**
 * Hook for managing contract upload and analysis workflow
 */
export function useContractUpload(options: UseContractUploadOptions = {}) {
  const { onUploadComplete, onAnalyzeComplete, autoAnalyze = true } = options;
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    isAnalyzing: false,
    analyzeProgress: 0,
    error: null,
    contractId: null,
    analysisSummary: null,
    currentStage: 'idle',
    elapsedTime: 0,
  });

  // Timer effect for elapsed time
  useEffect(() => {
    if (state.isUploading || state.isAnalyzing) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setState(prev => ({ ...prev, elapsedTime: elapsed }));
        }
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isUploading, state.isAnalyzing]);

  // Update progress based on current stage and elapsed time
  const updateProgressForStage = (stage: ProcessingStage, stageElapsedTime: number) => {
    const info = STAGE_INFO[stage];
    const stageProgress = Math.min(stageElapsedTime / info.estimatedDuration, 1);
    const progress = info.progressStart + (info.progressEnd - info.progressStart) * stageProgress;
    return Math.min(Math.round(progress), info.progressEnd);
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      contractName,
      uploadedBy,
      metadata,
    }: {
      file: File;
      contractName: string;
      uploadedBy: string;
      metadata?: ContractMetadata;
    }) => {
      startTimeRef.current = Date.now();
      setState((prev) => ({
        ...prev,
        isUploading: true,
        uploadProgress: 0,
        error: null,
        currentStage: 'uploading',
        elapsedTime: 0,
      }));

      // Progress based on time elapsed in upload stage
      const progressInterval = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const progress = updateProgressForStage('uploading', elapsed);
          setState((prev) => ({
            ...prev,
            uploadProgress: Math.min(progress, 14), // Cap at stage end - 1
          }));
        }
      }, 500);

      try {
        const response = await contractService.uploadContract(
          file,
          contractName,
          uploadedBy,
          metadata as Record<string, unknown> | undefined
        );

        clearInterval(progressInterval);
        setState((prev) => ({
          ...prev,
          uploadProgress: STAGE_INFO.upload_complete.progressEnd,
          currentStage: 'upload_complete',
        }));

        return response;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: (data) => {
      setState((prev) => ({
        ...prev,
        isUploading: false,
        contractId: data.contract_id,
      }));

      onUploadComplete?.(data.contract_id);

      // Auto-trigger analysis if enabled
      if (autoAnalyze) {
        analyzeMutation.mutate(data.contract_id);
      }
    },
    onError: (error) => {
      startTimeRef.current = null;
      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: getErrorMessage(error),
        currentStage: 'error',
      }));
    },
  });

  // Analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: async (contractId: string) => {
      const analysisStartTime = Date.now();

      setState((prev) => ({
        ...prev,
        isAnalyzing: true,
        analyzeProgress: STAGE_INFO.upload_complete.progressEnd,
        error: null,
        currentStage: 'extracting_text',
      }));

      // Simulate stage progression based on time
      // Average times: text extraction (10s), clause extraction (15s), rules (10s), AI (45s)
      const progressInterval = setInterval(() => {
        const elapsed = (Date.now() - analysisStartTime) / 1000;

        let stage: ProcessingStage;
        let stageElapsed: number;

        if (elapsed < 10) {
          stage = 'extracting_text';
          stageElapsed = elapsed;
        } else if (elapsed < 25) {
          stage = 'extracting_clauses';
          stageElapsed = elapsed - 10;
        } else if (elapsed < 35) {
          stage = 'rules_detection';
          stageElapsed = elapsed - 25;
        } else {
          stage = 'ai_detection';
          stageElapsed = elapsed - 35;
        }

        const progress = updateProgressForStage(stage, stageElapsed);

        setState((prev) => ({
          ...prev,
          analyzeProgress: Math.min(progress, 97), // Cap at 97% until complete
          currentStage: stage,
        }));
      }, 1000);

      try {
        const response = await contractService.analyzeContract(contractId);

        clearInterval(progressInterval);
        setState((prev) => ({
          ...prev,
          analyzeProgress: 100,
          currentStage: 'complete',
        }));

        return response;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: (data, contractId) => {
      startTimeRef.current = null;
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        analysisSummary: {
          totalClausesExtracted: data.total_clauses_extracted,
          totalFindings: data.total_findings,
          findingsBySeverity: data.findings_by_severity,
          processingTimeSeconds: data.processing_time_seconds,
        },
      }));

      onAnalyzeComplete?.(contractId);

      // Navigate to contract detail page after successful analysis
      setTimeout(() => {
        navigate(`/contract/${contractId}`);
      }, 1500);
    },
    onError: (error) => {
      startTimeRef.current = null;
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        analyzeProgress: 0,
        error: getErrorMessage(error),
        currentStage: 'error',
      }));
    },
  });

  const reset = () => {
    startTimeRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState({
      isUploading: false,
      uploadProgress: 0,
      isAnalyzing: false,
      analyzeProgress: 0,
      error: null,
      contractId: null,
      analysisSummary: null,
      currentStage: 'idle',
      elapsedTime: 0,
    });
  };

  return {
    // State
    isUploading: state.isUploading,
    uploadProgress: state.uploadProgress,
    isAnalyzing: state.isAnalyzing,
    analyzeProgress: state.analyzeProgress,
    error: state.error,
    contractId: state.contractId,
    analysisSummary: state.analysisSummary,
    isProcessing: state.isUploading || state.isAnalyzing,

    // Progress state - only elapsed time is accurate, stages are approximate
    currentStage: state.currentStage,
    stageInfo: STAGE_INFO[state.currentStage],
    elapsedTime: state.elapsedTime,

    // Actions
    uploadContract: uploadMutation.mutate,
    analyzeContract: analyzeMutation.mutate,
    reset,
  };
}

// Export stage info for use in components
export { STAGE_INFO };
export type { StageInfo };
