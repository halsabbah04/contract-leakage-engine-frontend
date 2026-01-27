import { ClauseType } from '../enums';
/**
 * Clause interface matching Python Clause model
 */
export interface Clause {
    id: string;
    type?: 'clause';
    contract_id: string;
    clause_type: ClauseType | string;
    clause_subtype?: string | null;
    section_number?: string | null;
    page_number?: number | null;
    start_position?: number | null;
    end_position?: number | null;
    original_text: string;
    normalized_summary: string;
    entities: ExtractedEntities;
    risk_signals: string[];
    extraction_confidence?: number | null;
    confidence_score?: number | null;
    embedding?: number[];
    extracted_at?: string;
    created_at?: string;
    partition_key?: string;
}
/**
 * ExtractedEntities interface matching Python ExtractedEntities model
 * Note: Backend extracts amounts and currency separately, not as monetary_values
 */
export interface ExtractedEntities {
    currency?: string | null;
    rates?: number[];
    dates?: string[];
    percentages?: number[];
    amounts?: number[];
    parties?: string[];
    durations?: string[];
    monetary_values?: MonetaryValue[];
    obligations?: string[];
    conditions?: string[];
    deadlines?: string[];
}
/**
 * @deprecated Backend extracts amounts and currency separately.
 * Use entities.amounts and entities.currency instead.
 */
export interface MonetaryValue {
    amount: number;
    currency: string;
    context?: string;
}
//# sourceMappingURL=clause.d.ts.map