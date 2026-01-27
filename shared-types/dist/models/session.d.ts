/**
 * Finding Override interface matching Python FindingOverride model
 */
export interface FindingOverride {
    finding_id: string;
    action: string;
    reason?: string;
    modified_impact?: number;
    modified_assumptions?: Record<string, any>;
    timestamp: string;
}
/**
 * Export record for tracking export history
 */
export interface ExportRecord {
    format: string;
    uri?: string;
    timestamp: string;
}
/**
 * Analysis Session interface matching Python AnalysisSession model
 *
 * Cosmos DB Container: analysis_sessions
 * Partition Key: contract_id
 */
export interface AnalysisSession {
    id: string;
    type: 'session';
    contract_id: string;
    user_role?: string;
    user_id?: string;
    overrides: FindingOverride[];
    custom_inflation_rate?: number;
    custom_assumptions: Record<string, any>;
    created_at: string;
    last_activity_at: string;
    session_duration_seconds?: number;
    exports: ExportRecord[];
    partition_key: string;
}
import { SessionStatus } from '../enums';
/**
 * @deprecated Use AnalysisSession instead - this was from an older design
 */
export interface LegacyAnalysisSession {
    id: string;
    contract_id: string;
    session_id: string;
    status: SessionStatus;
    start_time: string;
    end_time?: string;
    total_findings: number;
    findings_by_severity: FindingsBySeverity;
    processing_steps: ProcessingStep[];
    error_message?: string;
    created_at: string;
}
/**
 * @deprecated Part of legacy session design
 */
export interface FindingsBySeverity {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
}
/**
 * @deprecated Part of legacy session design
 */
export interface ProcessingStep {
    step_name: string;
    status: string;
    start_time: string;
    end_time?: string;
    duration_seconds?: number;
    error_message?: string;
    metadata?: Record<string, any>;
}
//# sourceMappingURL=session.d.ts.map