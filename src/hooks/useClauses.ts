import { useQuery } from '@tanstack/react-query';
import { clausesService } from '../services';
import type {
  Clause,
  ClauseType,
  GetClausesResponse,
} from '@contract-leakage/shared-types';

interface UseClausesOptions {
  clause_type?: ClauseType;
  limit?: number;
  offset?: number;
}

/**
 * Hook for fetching clauses for a contract with optional filters
 */
export function useClauses(contractId: string, options: UseClausesOptions = {}) {
  const { clause_type, limit, offset } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<GetClausesResponse>({
    queryKey: ['clauses', contractId, clause_type, limit, offset],
    queryFn: () => clausesService.getClauses(contractId, {
      clause_type,
      limit,
      offset,
    }),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    clauses: data?.clauses || [],
    totalCount: data?.total_count || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching clauses grouped by type
 */
export function useClausesByType(contractId: string) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Record<ClauseType, Clause[]>>({
    queryKey: ['clauses-by-type', contractId],
    queryFn: () => clausesService.getClausesByType(contractId),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    clausesByType: data || ({} as Record<ClauseType, Clause[]>),
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching clauses with risk signals
 */
export function useRiskyClauses(contractId: string) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<Clause[]>({
    queryKey: ['risky-clauses', contractId],
    queryFn: () => clausesService.getRiskyClauses(contractId),
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    riskyClauses: data || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Get total count of risky clauses
 */
export function useRiskyClausesCount(contractId: string): number {
  const { riskyClauses } = useRiskyClauses(contractId);
  return riskyClauses.length;
}
