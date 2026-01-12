import apiClient from './api';
import type {
  GetClausesResponse,
  Clause,
  ClauseType,
} from '@contract-leakage/shared-types';

/**
 * Clauses Service - Handles extracted clause retrieval
 */

export const clausesService = {
  /**
   * Get all clauses for a contract with optional filters
   */
  async getClauses(
    contractId: string,
    options?: {
      clause_type?: ClauseType;
      limit?: number;
      offset?: number;
    }
  ): Promise<GetClausesResponse> {
    const response = await apiClient.get<GetClausesResponse>(
      `/get_clauses/${contractId}`,
      { params: options }
    );

    return response.data;
  },

  /**
   * Get clauses grouped by type
   */
  async getClausesByType(
    contractId: string
  ): Promise<Record<ClauseType, Clause[]>> {
    const response = await this.getClauses(contractId);

    // Group clauses by type
    const grouped = {} as Record<ClauseType, Clause[]>;

    response.clauses.forEach((clause) => {
      if (!grouped[clause.clause_type]) {
        grouped[clause.clause_type] = [];
      }
      grouped[clause.clause_type].push(clause);
    });

    return grouped;
  },

  /**
   * Get clauses with risk signals
   */
  async getRiskyClauses(contractId: string): Promise<Clause[]> {
    const response = await this.getClauses(contractId);

    return response.clauses.filter(
      (clause) => clause.risk_signals && clause.risk_signals.length > 0
    );
  },

  /**
   * Search clauses by text
   */
  async searchClauses(
    contractId: string,
    searchText: string
  ): Promise<Clause[]> {
    const response = await this.getClauses(contractId);

    const lowerSearch = searchText.toLowerCase();

    return response.clauses.filter(
      (clause) =>
        clause.original_text.toLowerCase().includes(lowerSearch) ||
        clause.normalized_summary.toLowerCase().includes(lowerSearch) ||
        clause.section_number?.toLowerCase().includes(lowerSearch)
    );
  },
};
