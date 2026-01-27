import { Contract } from '../models/contract';
import { Clause } from '../models/clause';
import { LeakageFinding } from '../models/finding';
import { UserOverride, OverrideSummary } from '../models/override';
/**
 * API Response Types for Contract Leakage Engine
 */
export interface ApiErrorResponse {
    error: string;
    details?: string;
    status_code: number;
}
export interface UploadContractResponse {
    message: string;
    contract_id: string;
    contract_name: string;
    file_path: string;
    status: string;
}
export interface AnalyzeContractResponse {
    message: string;
    contract_id: string;
    session_id: string;
    total_clauses_extracted: number;
    total_findings: number;
    findings_by_severity: {
        CRITICAL: number;
        HIGH: number;
        MEDIUM: number;
        LOW: number;
    };
    processing_time_seconds: number;
}
export interface ListContractsResponse {
    contracts: Contract[];
    total_count: number;
}
export interface GetContractResponse {
    contract: Contract;
}
export interface GetClausesResponse {
    contract_id: string;
    clauses: Clause[];
    total_count: number;
    limit?: number;
    offset?: number;
}
export interface GetFindingsResponse {
    contract_id: string;
    findings: LeakageFinding[];
    total_count: number;
    summary: {
        total_findings: number;
        by_severity: {
            CRITICAL: number;
            HIGH: number;
            MEDIUM: number;
            LOW: number;
        };
        by_category: Record<string, number>;
        total_estimated_impact?: {
            amount: number;
            currency: string;
        };
    };
    limit?: number;
    offset?: number;
}
export interface ExportReportResponse {
}
export interface PaginatedResponse<T> {
    data: T[];
    total_count: number;
    limit: number;
    offset: number;
    has_more: boolean;
}
export interface SuccessResponse {
    message: string;
    success: boolean;
}
export interface CreateOverrideResponse {
    override_id: string;
    finding_id: string;
    success: boolean;
    message: string;
}
export interface GetOverridesResponse {
    contract_id: string;
    overrides: UserOverride[];
    total_count: number;
}
export interface GetOverrideSummaryResponse {
    contract_id: string;
    summary: OverrideSummary;
}
//# sourceMappingURL=responses.d.ts.map