import apiClient from './api';
import type {
  Contract,
  UploadContractResponse,
  AnalyzeContractResponse,
  GetContractResponse,
  ListContractsResponse,
} from '@contract-leakage/shared-types';

/**
 * Contract Service - Handles contract upload and management
 */

export const contractService = {
  /**
   * List all contracts
   */
  async listContracts(): Promise<ListContractsResponse> {
    const response = await apiClient.get<ListContractsResponse>('/list_contracts');
    return response.data;
  },

  /**
   * Upload a new contract file
   */
  async uploadContract(
    file: File,
    contractName: string,
    uploadedBy: string,
    metadata?: Record<string, unknown>
  ): Promise<UploadContractResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contract_name', contractName);
    formData.append('uploaded_by', uploadedBy);

    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post<UploadContractResponse>(
      '/upload_contract',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },

  /**
   * Trigger contract analysis (clauses + findings)
   */
  async analyzeContract(contractId: string): Promise<AnalyzeContractResponse> {
    const response = await apiClient.post<AnalyzeContractResponse>(
      `/analyze_contract/${contractId}`,
      {}
    );

    return response.data;
  },

  /**
   * Get contract details by ID
   */
  async getContract(contractId: string): Promise<Contract> {
    const response = await apiClient.get<GetContractResponse>(
      `/get_contract/${contractId}`
    );

    return response.data.contract;
  },

  /**
   * Export contract report (PDF or Excel)
   */
  async exportReport(
    contractId: string,
    format: 'pdf' | 'excel' = 'pdf',
    includeClauses: boolean = false
  ): Promise<Blob> {
    const response = await apiClient.get(
      `/export_report/${contractId}`,
      {
        params: {
          format,
          include_clauses: includeClauses,
        },
        responseType: 'blob',
      }
    );

    return response.data;
  },

  /**
   * Helper to download exported report
   */
  async downloadReport(
    contractId: string,
    format: 'pdf' | 'excel' = 'pdf',
    includeClauses: boolean = false
  ): Promise<void> {
    const blob = await this.exportReport(contractId, format, includeClauses);

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from response or use default
    const extension = format === 'pdf' ? 'pdf' : 'xlsx';
    link.download = `Contract_Report_${contractId}_${new Date().toISOString().split('T')[0]}.${extension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Cleanup
    window.URL.revokeObjectURL(url);
  },

  /**
   * Get document URL for viewing the original contract
   */
  async getDocumentUrl(
    contractId: string,
    expiryHours: number = 1
  ): Promise<{ document_url: string; filename: string; content_type: string }> {
    const response = await apiClient.get<{
      contract_id: string;
      document_url: string;
      filename: string;
      content_type: string;
      expires_in_hours: number;
    }>(`/get_document/${contractId}`, {
      params: { expiry_hours: expiryHours },
    });

    return response.data;
  },

  /**
   * Open the original contract document in a new tab
   */
  async viewDocument(contractId: string): Promise<void> {
    const { document_url } = await this.getDocumentUrl(contractId);
    window.open(document_url, '_blank');
  },
};
