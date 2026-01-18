import { useQuery } from '@tanstack/react-query';
import { findingsService } from '../services';
import type { GetFindingsResponse, Severity } from '@contract-leakage/shared-types';

interface UseFindingsOptions {
  severity?: Severity;
  category?: string;
}

/**
 * Hook for fetching and managing findings data
 */
export function useFindings(contractId: string, options: UseFindingsOptions = {}) {
  const { severity, category } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<GetFindingsResponse>({
    queryKey: ['findings', contractId, severity, category],
    queryFn: () => findingsService.getFindings(contractId, {
      severity: severity,
      category: category,
    }),
    enabled: !!contractId,
  });

  return {
    findings: data?.findings || [],
    summary: data?.summary,
    totalCount: data?.total_count || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching findings grouped by severity
 */
export function useFindingsBySeverity(contractId: string) {
  return useQuery({
    queryKey: ['findings-by-severity', contractId],
    queryFn: () => findingsService.getFindingsBySeverity(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching findings grouped by category
 */
export function useFindingsByCategory(contractId: string) {
  return useQuery({
    queryKey: ['findings-by-category', contractId],
    queryFn: () => findingsService.getFindingsByCategory(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching total financial impact
 */
export function useTotalFinancialImpact(contractId: string) {
  return useQuery({
    queryKey: ['financial-impact', contractId],
    queryFn: () => findingsService.getTotalFinancialImpact(contractId),
    enabled: !!contractId,
  });
}
