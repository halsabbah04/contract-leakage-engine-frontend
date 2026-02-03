/**
 * Enums matching Python Pydantic models
 */
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["UPLOADED"] = "uploaded";
    ContractStatus["EXTRACTING_TEXT"] = "extracting_text";
    ContractStatus["TEXT_EXTRACTED"] = "text_extracted";
    ContractStatus["EXTRACTING_CLAUSES"] = "extracting_clauses";
    ContractStatus["CLAUSES_EXTRACTED"] = "clauses_extracted";
    ContractStatus["ANALYZING"] = "analyzing";
    ContractStatus["ANALYZED"] = "analyzed";
    ContractStatus["FAILED"] = "failed";
})(ContractStatus || (ContractStatus = {}));
export var ClauseType;
(function (ClauseType) {
    ClauseType["PRICING"] = "pricing";
    ClauseType["PAYMENT"] = "payment";
    ClauseType["PAYMENT_TERMS"] = "payment_terms";
    ClauseType["RENEWAL"] = "renewal";
    ClauseType["AUTO_RENEWAL"] = "auto_renewal";
    ClauseType["TERMINATION"] = "termination";
    ClauseType["SERVICE_LEVEL"] = "service_level";
    ClauseType["LIABILITY"] = "liability";
    ClauseType["INDEMNIFICATION"] = "indemnification";
    ClauseType["CONFIDENTIALITY"] = "confidentiality";
    ClauseType["INTELLECTUAL_PROPERTY"] = "intellectual_property";
    ClauseType["DISPUTE_RESOLUTION"] = "dispute_resolution";
    ClauseType["FORCE_MAJEURE"] = "force_majeure";
    ClauseType["WARRANTY"] = "warranty";
    ClauseType["DELIVERY"] = "delivery";
    ClauseType["SLA"] = "sla";
    ClauseType["PENALTY"] = "penalty";
    ClauseType["PENALTIES"] = "penalties";
    ClauseType["DISCOUNT"] = "discount";
    ClauseType["DISCOUNTS"] = "discounts";
    ClauseType["VOLUME_COMMITMENT"] = "volume_commitment";
    ClauseType["PRICE_ADJUSTMENT"] = "price_adjustment";
    ClauseType["EXCLUSIVITY"] = "exclusivity";
    ClauseType["OTHER"] = "other";
})(ClauseType || (ClauseType = {}));
export var Severity;
(function (Severity) {
    Severity["LOW"] = "low";
    Severity["MEDIUM"] = "medium";
    Severity["HIGH"] = "high";
    Severity["CRITICAL"] = "critical";
    Severity["INFO"] = "info";
})(Severity || (Severity = {}));
export var LeakageCategory;
(function (LeakageCategory) {
    LeakageCategory["PRICING"] = "pricing";
    LeakageCategory["RENEWAL"] = "renewal";
    LeakageCategory["TERMINATION"] = "termination";
    LeakageCategory["SERVICE_CREDIT"] = "service_credit";
    LeakageCategory["VOLUME_DISCOUNT"] = "volume_discount";
    LeakageCategory["PENALTY"] = "penalty";
    LeakageCategory["AUTO_RENEWAL"] = "auto_renewal";
    LeakageCategory["LIABILITY_CAP"] = "liability_cap";
    LeakageCategory["PAYMENT_TERMS"] = "payment_terms";
    LeakageCategory["DELIVERY"] = "delivery";
    LeakageCategory["COMPLIANCE"] = "compliance";
    LeakageCategory["OTHER"] = "other";
})(LeakageCategory || (LeakageCategory = {}));
export var DetectionMethod;
(function (DetectionMethod) {
    DetectionMethod["RULE"] = "rule";
    DetectionMethod["AI"] = "ai";
    DetectionMethod["HYBRID"] = "hybrid";
})(DetectionMethod || (DetectionMethod = {}));
export var SessionStatus;
(function (SessionStatus) {
    SessionStatus["IN_PROGRESS"] = "in_progress";
    SessionStatus["COMPLETED"] = "completed";
    SessionStatus["FAILED"] = "failed";
})(SessionStatus || (SessionStatus = {}));
export var FindingStatus;
(function (FindingStatus) {
    FindingStatus["PENDING"] = "pending";
    FindingStatus["ACCEPTED"] = "accepted";
    FindingStatus["REJECTED"] = "rejected";
    FindingStatus["FALSE_POSITIVE"] = "false_positive";
    FindingStatus["RESOLVED"] = "resolved";
})(FindingStatus || (FindingStatus = {}));
export var OverrideAction;
(function (OverrideAction) {
    OverrideAction["CHANGE_SEVERITY"] = "change_severity";
    OverrideAction["MARK_FALSE_POSITIVE"] = "mark_false_positive";
    OverrideAction["ADD_NOTE"] = "add_note";
    OverrideAction["ACCEPT"] = "accept";
    OverrideAction["REJECT"] = "reject";
    OverrideAction["RESOLVE"] = "resolve";
})(OverrideAction || (OverrideAction = {}));
// Obligation-related enums
export var ObligationType;
(function (ObligationType) {
    ObligationType["PAYMENT"] = "payment";
    ObligationType["DELIVERY"] = "delivery";
    ObligationType["NOTICE"] = "notice";
    ObligationType["REPORTING"] = "reporting";
    ObligationType["COMPLIANCE"] = "compliance";
    ObligationType["PERFORMANCE"] = "performance";
    ObligationType["RENEWAL"] = "renewal";
    ObligationType["TERMINATION"] = "termination";
    ObligationType["INSURANCE"] = "insurance";
    ObligationType["AUDIT"] = "audit";
    ObligationType["CONFIDENTIALITY"] = "confidentiality";
    ObligationType["OTHER"] = "other";
})(ObligationType || (ObligationType = {}));
export var ObligationStatus;
(function (ObligationStatus) {
    ObligationStatus["UPCOMING"] = "upcoming";
    ObligationStatus["DUE_SOON"] = "due_soon";
    ObligationStatus["OVERDUE"] = "overdue";
    ObligationStatus["COMPLETED"] = "completed";
    ObligationStatus["WAIVED"] = "waived";
    ObligationStatus["NOT_APPLICABLE"] = "not_applicable";
})(ObligationStatus || (ObligationStatus = {}));
export var ObligationPriority;
(function (ObligationPriority) {
    ObligationPriority["CRITICAL"] = "critical";
    ObligationPriority["HIGH"] = "high";
    ObligationPriority["MEDIUM"] = "medium";
    ObligationPriority["LOW"] = "low";
})(ObligationPriority || (ObligationPriority = {}));
export var RecurrencePattern;
(function (RecurrencePattern) {
    RecurrencePattern["NONE"] = "none";
    RecurrencePattern["DAILY"] = "daily";
    RecurrencePattern["WEEKLY"] = "weekly";
    RecurrencePattern["MONTHLY"] = "monthly";
    RecurrencePattern["QUARTERLY"] = "quarterly";
    RecurrencePattern["SEMI_ANNUALLY"] = "semi_annually";
    RecurrencePattern["ANNUALLY"] = "annually";
    RecurrencePattern["CUSTOM"] = "custom";
})(RecurrencePattern || (RecurrencePattern = {}));
// Agent-related enums
export var AgentType;
(function (AgentType) {
    AgentType["OBLIGATION"] = "obligation";
    AgentType["PARTY_INTELLIGENCE"] = "party_intelligence";
    AgentType["BENCHMARK"] = "benchmark";
    AgentType["COMPLIANCE"] = "compliance";
    AgentType["CONTRACT_COMPARISON"] = "contract_comparison";
    AgentType["RISK_FORECAST"] = "risk_forecast";
    AgentType["NEGOTIATION"] = "negotiation";
})(AgentType || (AgentType = {}));
export var AgentStatus;
(function (AgentStatus) {
    AgentStatus["PENDING"] = "pending";
    AgentStatus["RUNNING"] = "running";
    AgentStatus["COMPLETED"] = "completed";
    AgentStatus["FAILED"] = "failed";
    AgentStatus["PARTIAL"] = "partial";
})(AgentStatus || (AgentStatus = {}));
