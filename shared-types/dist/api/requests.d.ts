import { ContractMetadata } from '../models/contract';
import { OverrideAction, Severity } from '../enums';
/**
 * API Request Types for Contract Leakage Engine
 */
export interface UploadContractRequest {
    contract_name: string;
    uploaded_by: string;
    file: File | Blob;
    metadata?: ContractMetadata;
}
export interface AnalyzeContractRequest {
    contract_id: string;
}
export interface GetClausesRequest {
    contract_id: string;
    clause_type?: string;
    limit?: number;
    offset?: number;
}
export interface GetFindingsRequest {
    contract_id: string;
    severity?: string;
    category?: string;
    limit?: number;
    offset?: number;
}
export interface ExportReportRequest {
    contract_id: string;
    format?: 'pdf' | 'excel';
    include_clauses?: boolean;
}
export interface CreateOverrideRequest {
    finding_id: string;
    action: OverrideAction;
    user_email: string;
    previous_value?: string | Severity;
    new_value?: string | Severity;
    notes?: string;
    reason?: string;
}
export interface GetOverridesRequest {
    contract_id: string;
    finding_id?: string;
}
//# sourceMappingURL=requests.d.ts.map