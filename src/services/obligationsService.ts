import apiClient from './api';
import type {
  Obligation,
  ObligationSummary,
  GetObligationsResponse,
  RunAgentsResponse,
  RunAgentsRequest,
} from '@contract-leakage/shared-types';

/**
 * Obligations Service - Handles obligation retrieval and agent execution
 */

export const obligationsService = {
  /**
   * Get all obligations for a contract with optional filters
   */
  async getObligations(
    contractId: string,
    options?: {
      type?: string;
      status?: string;
      responsible?: 'our' | 'counterparty';
      include_summary?: boolean;
    }
  ): Promise<GetObligationsResponse> {
    const response = await apiClient.get<GetObligationsResponse>(
      `/obligations/${contractId}`,
      { params: options }
    );

    return response.data;
  },

  /**
   * Get obligations grouped by type
   */
  async getObligationsByType(
    contractId: string
  ): Promise<Record<string, Obligation[]>> {
    const response = await this.getObligations(contractId);

    const grouped: Record<string, Obligation[]> = {};

    response.obligations.forEach((obligation) => {
      const type = obligation.obligation_type;
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(obligation);
    });

    return grouped;
  },

  /**
   * Get obligations grouped by status
   */
  async getObligationsByStatus(
    contractId: string
  ): Promise<Record<string, Obligation[]>> {
    const response = await this.getObligations(contractId);

    const grouped: Record<string, Obligation[]> = {};

    response.obligations.forEach((obligation) => {
      const status = obligation.status;
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(obligation);
    });

    return grouped;
  },

  /**
   * Get our obligations (where we are responsible)
   */
  async getOurObligations(contractId: string): Promise<Obligation[]> {
    const response = await this.getObligations(contractId, { responsible: 'our' });
    return response.obligations;
  },

  /**
   * Get counterparty obligations (where they are responsible)
   */
  async getCounterpartyObligations(contractId: string): Promise<Obligation[]> {
    const response = await this.getObligations(contractId, { responsible: 'counterparty' });
    return response.obligations;
  },

  /**
   * Get obligation summary for a contract
   */
  async getObligationSummary(contractId: string): Promise<ObligationSummary> {
    const response = await this.getObligations(contractId, { include_summary: true });
    return response.summary!;
  },

  /**
   * Get overdue obligations
   */
  async getOverdueObligations(contractId: string): Promise<Obligation[]> {
    const response = await this.getObligations(contractId, { status: 'overdue' });
    return response.obligations;
  },

  /**
   * Get obligations due soon (within 30 days)
   */
  async getDueSoonObligations(contractId: string): Promise<Obligation[]> {
    const response = await this.getObligations(contractId, { status: 'due_soon' });
    return response.obligations;
  },

  /**
   * Run AI agents for a contract (including obligation extraction)
   */
  async runAgents(
    contractId: string,
    options?: RunAgentsRequest
  ): Promise<RunAgentsResponse> {
    const response = await apiClient.post<RunAgentsResponse>(
      `/run_agents/${contractId}`,
      options
    );

    return response.data;
  },

  /**
   * Run only the obligation extraction agent
   */
  async extractObligations(contractId: string): Promise<RunAgentsResponse> {
    return this.runAgents(contractId, { agents: ['obligation'] });
  },

  /**
   * Get payment obligations total
   */
  async getPaymentObligationsTotal(
    contractId: string
  ): Promise<{ our: number; their: number; total: number; currency: string }> {
    const summary = await this.getObligationSummary(contractId);

    return {
      our: summary.our_payment_obligations,
      their: summary.their_payment_obligations,
      total: summary.total_payment_obligations,
      currency: 'USD', // Default, could be enhanced to get from obligations
    };
  },

  /**
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(
    contractId: string,
    limit: number = 5
  ): Promise<Obligation[]> {
    const response = await this.getObligations(contractId);

    // Filter to upcoming/due_soon and sort by due date
    const upcoming = response.obligations
      .filter(
        (obl) =>
          obl.due_date &&
          (obl.status === 'upcoming' || obl.status === 'due_soon')
      )
      .sort((a, b) => {
        const dateA = new Date(a.due_date!).getTime();
        const dateB = new Date(b.due_date!).getTime();
        return dateA - dateB;
      })
      .slice(0, limit);

    return upcoming;
  },
};
