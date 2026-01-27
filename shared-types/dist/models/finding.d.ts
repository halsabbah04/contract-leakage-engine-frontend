import { Severity, LeakageCategory, DetectionMethod } from '../enums';
/**
 * Estimated financial impact
 */
export interface EstimatedImpact {
    currency: string;
    value?: number | null;
    value_min?: number | null;
    value_max?: number | null;
    confidence?: number | null;
    calculation_method?: string | null;
}
/**
 * Assumptions used in impact calculation
 */
export interface Assumptions {
    inflation_rate?: number | null;
    remaining_years?: number | null;
    annual_volume?: number | null;
    probability?: number | null;
    custom_parameters?: Record<string, unknown>;
}
/**
 * Leakage Finding interface matching Python LeakageFinding model
 */
export interface LeakageFinding {
    id: string;
    type: 'finding';
    contract_id: string;
    clause_ids: string[];
    leakage_category: LeakageCategory | string;
    risk_type: string;
    detection_method: DetectionMethod | string;
    rule_id?: string | null;
    severity: Severity | string;
    confidence: number;
    explanation: string;
    business_impact_summary?: string | null;
    recommended_action?: string | null;
    assumptions?: Assumptions;
    estimated_impact?: EstimatedImpact;
    user_dismissed?: boolean;
    user_notes?: string | null;
    detected_at: string;
    partition_key: string;
    finding_id?: string;
    affected_clause_ids?: string[];
    category?: LeakageCategory | string;
    confidence_score?: number;
    estimated_financial_impact?: FinancialImpact;
    created_at?: string;
}
/**
 * @deprecated Use EstimatedImpact instead
 */
export interface FinancialImpact {
    amount: number;
    currency: string;
    calculation_method?: string;
    notes?: string;
}
//# sourceMappingURL=finding.d.ts.map