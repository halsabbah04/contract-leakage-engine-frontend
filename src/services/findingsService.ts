import apiClient from './api';
import type {
  GetFindingsResponse,
  LeakageFinding,
} from '@contract-leakage/shared-types';

/**
 * Findings Service - Handles leakage findings retrieval
 */

export const findingsService = {
  /**
   * Get all findings for a contract with optional filters
   */
  async getFindings(
    contractId: string,
    options?: {
      severity?: string;
      category?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<GetFindingsResponse> {
    const response = await apiClient.get<GetFindingsResponse>(
      `/get_findings/${contractId}`,
      { params: options }
    );

    return response.data;
  },

  /**
   * Get findings grouped by severity
   */
  async getFindingsBySeverity(
    contractId: string
  ): Promise<Record<string, LeakageFinding[]>> {
    const response = await this.getFindings(contractId);

    // Group findings by severity
    const grouped: Record<string, LeakageFinding[]> = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: [],
    };

    response.findings.forEach((finding) => {
      grouped[finding.severity].push(finding);
    });

    return grouped;
  },

  /**
   * Get findings grouped by category
   */
  async getFindingsByCategory(
    contractId: string
  ): Promise<Record<string, LeakageFinding[]>> {
    const response = await this.getFindings(contractId);

    // Group findings by category
    const grouped: Record<string, LeakageFinding[]> = {};

    response.findings.forEach((finding) => {
      if (!grouped[finding.leakage_category]) {
        grouped[finding.leakage_category] = [];
      }
      grouped[finding.leakage_category].push(finding);
    });

    return grouped;
  },

  /**
   * Get total estimated financial impact
   */
  async getTotalFinancialImpact(contractId: string): Promise<{
    amount: number;
    currency: string;
  }> {
    const response = await this.getFindings(contractId);

    return (
      response.summary.total_estimated_impact || {
        amount: 0,
        currency: 'USD',
      }
    );
  },
};
