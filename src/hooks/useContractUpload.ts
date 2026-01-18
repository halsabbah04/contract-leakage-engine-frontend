import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { contractService, getErrorMessage } from '../services';
import type { ContractMetadata } from '@contract-leakage/shared-types';

interface UploadState {
  isUploading: boolean;
  uploadProgress: number;
  isAnalyzing: boolean;
  analyzeProgress: number;
  error: string | null;
  contractId: string | null;
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

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
    isAnalyzing: false,
    analyzeProgress: 0,
    error: null,
    contractId: null,
  });

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
      setState((prev) => ({ ...prev, isUploading: true, uploadProgress: 0, error: null }));

      // Simulate progress (since we don't have real upload progress from axios)
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          uploadProgress: Math.min(prev.uploadProgress + 10, 90),
        }));
      }, 300);

      try {
        const response = await contractService.uploadContract(
          file,
          contractName,
          uploadedBy,
          metadata
        );

        clearInterval(progressInterval);
        setState((prev) => ({ ...prev, uploadProgress: 100 }));

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
      setState((prev) => ({
        ...prev,
        isUploading: false,
        uploadProgress: 0,
        error: getErrorMessage(error),
      }));
    },
  });

  // Analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: async (contractId: string) => {
      setState((prev) => ({ ...prev, isAnalyzing: true, analyzeProgress: 0, error: null }));

      // Simulate progress for analysis
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          analyzeProgress: Math.min(prev.analyzeProgress + 5, 95),
        }));
      }, 500);

      try {
        const response = await contractService.analyzeContract(contractId);

        clearInterval(progressInterval);
        setState((prev) => ({ ...prev, analyzeProgress: 100 }));

        return response;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: (data, contractId) => {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
      }));

      onAnalyzeComplete?.(contractId);

      // Navigate to contract detail page after successful analysis
      setTimeout(() => {
        navigate(`/contract/${contractId}`);
      }, 1000);
    },
    onError: (error) => {
      setState((prev) => ({
        ...prev,
        isAnalyzing: false,
        analyzeProgress: 0,
        error: getErrorMessage(error),
      }));
    },
  });

  const reset = () => {
    setState({
      isUploading: false,
      uploadProgress: 0,
      isAnalyzing: false,
      analyzeProgress: 0,
      error: null,
      contractId: null,
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
    isProcessing: state.isUploading || state.isAnalyzing,

    // Actions
    uploadContract: uploadMutation.mutate,
    analyzeContract: analyzeMutation.mutate,
    reset,
  };
}
