import apiClient from './api';
import type {
  CreateOverrideRequest,
  CreateOverrideResponse,
  GetOverridesResponse,
  GetOverrideSummaryResponse,
  OverrideAction,
  Severity,
} from '@contract-leakage/shared-types';

/**
 * Overrides Service - Handles user override operations
 */

export const overridesService = {
  /**
   * Create a new user override for a finding
   */
  async createOverride(
    contractId: string,
    request: CreateOverrideRequest
  ): Promise<CreateOverrideResponse> {
    const response = await apiClient.post<CreateOverrideResponse>(
      `/overrides/${contractId}`,
      request
    );

    return response.data;
  },

  /**
   * Get all overrides for a contract
   */
  async getOverrides(
    contractId: string,
    findingId?: string
  ): Promise<GetOverridesResponse> {
    const response = await apiClient.get<GetOverridesResponse>(
      `/overrides/${contractId}`,
      { params: { finding_id: findingId } }
    );

    return response.data;
  },

  /**
   * Get override summary for a contract
   */
  async getOverrideSummary(contractId: string): Promise<GetOverrideSummaryResponse> {
    const response = await apiClient.get<GetOverrideSummaryResponse>(
      `/overrides/${contractId}/summary`
    );

    return response.data;
  },

  /**
   * Helper: Mark finding as false positive
   */
  async markAsFalsePositive(
    contractId: string,
    findingId: string,
    userEmail: string,
    reason?: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'mark_false_positive' as OverrideAction,
      user_email: userEmail,
      reason,
    });
  },

  /**
   * Helper: Change finding severity
   */
  async changeSeverity(
    contractId: string,
    findingId: string,
    userEmail: string,
    previousSeverity: Severity,
    newSeverity: Severity,
    reason?: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'change_severity' as OverrideAction,
      user_email: userEmail,
      previous_value: previousSeverity,
      new_value: newSeverity,
      reason,
    });
  },

  /**
   * Helper: Accept finding
   */
  async acceptFinding(
    contractId: string,
    findingId: string,
    userEmail: string,
    notes?: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'accept' as OverrideAction,
      user_email: userEmail,
      notes,
    });
  },

  /**
   * Helper: Reject finding
   */
  async rejectFinding(
    contractId: string,
    findingId: string,
    userEmail: string,
    reason?: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'reject' as OverrideAction,
      user_email: userEmail,
      reason,
    });
  },

  /**
   * Helper: Add note to finding
   */
  async addNote(
    contractId: string,
    findingId: string,
    userEmail: string,
    notes: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'add_note' as OverrideAction,
      user_email: userEmail,
      notes,
    });
  },

  /**
   * Helper: Mark finding as resolved
   */
  async resolveFinding(
    contractId: string,
    findingId: string,
    userEmail: string,
    notes?: string
  ): Promise<CreateOverrideResponse> {
    return this.createOverride(contractId, {
      finding_id: findingId,
      action: 'resolve' as OverrideAction,
      user_email: userEmail,
      notes,
    });
  },
};
