import { ObligationType, ObligationStatus, ObligationPriority, RecurrencePattern } from '../enums';
/**
 * Party responsible for fulfilling an obligation
 */
export interface ResponsibleParty {
    party_name: string;
    party_role: string;
    is_our_organization: boolean;
}
/**
 * Contractual obligation extracted from a contract
 * Matches Python Obligation model
 */
export interface Obligation {
    id: string;
    type: 'obligation';
    contract_id: string;
    obligation_type: ObligationType | string;
    title: string;
    description: string;
    due_date?: string | null;
    effective_date?: string | null;
    end_date?: string | null;
    is_recurring: boolean;
    recurrence_pattern: RecurrencePattern | string;
    recurrence_end_date?: string | null;
    next_occurrence?: string | null;
    responsible_party: ResponsibleParty;
    amount?: number | null;
    currency: string;
    status: ObligationStatus | string;
    priority: ObligationPriority | string;
    clause_ids: string[];
    extracted_text?: string | null;
    reminder_days_before: number;
    notes?: string | null;
    extraction_confidence: number;
    extracted_at: string;
    updated_at?: string | null;
    partition_key: string;
}
/**
 * Summary of obligations for a contract
 */
export interface ObligationSummary {
    contract_id: string;
    total_obligations: number;
    by_type: Record<string, number>;
    by_status: Record<string, number>;
    by_responsible_party: Record<string, number>;
    upcoming_count: number;
    due_soon_count: number;
    overdue_count: number;
    total_payment_obligations: number;
    our_payment_obligations: number;
    their_payment_obligations: number;
    currency: string;
    our_organization_name?: string | null;
    counterparty_name?: string | null;
    next_due_date?: string | null;
    next_obligation_title?: string | null;
    extracted_at: string;
}
/**
 * Result of obligation extraction
 */
export interface ObligationExtractionResult {
    contract_id: string;
    obligations: Obligation[];
    summary: ObligationSummary;
    extraction_metadata: Record<string, unknown>;
}
/**
 * API response for getting obligations
 */
export interface GetObligationsResponse {
    contract_id: string;
    total: number;
    obligations: Obligation[];
    summary?: ObligationSummary;
}
/**
 * API response for running agents
 */
export interface RunAgentsResponse {
    contract_id: string;
    status: 'completed' | 'partial' | 'failed';
    duration_ms: number;
    agents: {
        total: number;
        successful: number;
        failed: number;
        partial: number;
    };
    agent_statuses: Record<string, string>;
    results: {
        obligations?: {
            total_extracted: number;
            by_type: Record<string, number>;
            by_status: Record<string, number>;
            due_soon_count: number;
            overdue_count: number;
        };
    };
    errors?: string[];
    warnings?: string[];
}
/**
 * Request body for running agents
 */
export interface RunAgentsRequest {
    agents?: string[];
    parallel?: boolean;
    timeout_seconds?: number;
}
//# sourceMappingURL=obligation.d.ts.map