import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { obligationsService } from '../services';
import type {
  GetObligationsResponse,
  ObligationType,
  ObligationStatus,
  ObligationSummary,
  RunAgentsResponse,
} from '@contract-leakage/shared-types';

interface UseObligationsOptions {
  type?: ObligationType | string;
  status?: ObligationStatus | string;
  responsible?: 'our' | 'counterparty';
  includeSummary?: boolean;
}

/**
 * Hook for fetching and managing obligations data
 */
export function useObligations(contractId: string, options: UseObligationsOptions = {}) {
  const { type, status, responsible, includeSummary = true } = options;

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<GetObligationsResponse>({
    queryKey: ['obligations', contractId, type, status, responsible],
    queryFn: () => obligationsService.getObligations(contractId, {
      type: type,
      status: status,
      responsible: responsible,
      include_summary: includeSummary,
    }),
    enabled: !!contractId,
  });

  return {
    obligations: data?.obligations || [],
    summary: data?.summary,
    totalCount: data?.total || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching obligations grouped by type
 */
export function useObligationsByType(contractId: string) {
  return useQuery({
    queryKey: ['obligations-by-type', contractId],
    queryFn: () => obligationsService.getObligationsByType(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching obligations grouped by status
 */
export function useObligationsByStatus(contractId: string) {
  return useQuery({
    queryKey: ['obligations-by-status', contractId],
    queryFn: () => obligationsService.getObligationsByStatus(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching obligation summary
 */
export function useObligationSummary(contractId: string) {
  return useQuery<ObligationSummary>({
    queryKey: ['obligation-summary', contractId],
    queryFn: () => obligationsService.getObligationSummary(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching our obligations
 */
export function useOurObligations(contractId: string) {
  return useQuery({
    queryKey: ['our-obligations', contractId],
    queryFn: () => obligationsService.getOurObligations(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching counterparty obligations
 */
export function useCounterpartyObligations(contractId: string) {
  return useQuery({
    queryKey: ['counterparty-obligations', contractId],
    queryFn: () => obligationsService.getCounterpartyObligations(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching overdue obligations
 */
export function useOverdueObligations(contractId: string) {
  return useQuery({
    queryKey: ['overdue-obligations', contractId],
    queryFn: () => obligationsService.getOverdueObligations(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching obligations due soon
 */
export function useDueSoonObligations(contractId: string) {
  return useQuery({
    queryKey: ['due-soon-obligations', contractId],
    queryFn: () => obligationsService.getDueSoonObligations(contractId),
    enabled: !!contractId,
  });
}

/**
 * Hook for fetching upcoming deadlines
 */
export function useUpcomingDeadlines(contractId: string, limit: number = 5) {
  return useQuery({
    queryKey: ['upcoming-deadlines', contractId, limit],
    queryFn: () => obligationsService.getUpcomingDeadlines(contractId, limit),
    enabled: !!contractId,
  });
}

/**
 * Hook for running agents (including obligation extraction)
 */
export function useRunAgents(contractId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<RunAgentsResponse, Error, { agents?: string[] }>({
    mutationFn: (options) => obligationsService.runAgents(contractId, options),
    onSuccess: () => {
      // Invalidate obligations queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['obligations', contractId] });
      queryClient.invalidateQueries({ queryKey: ['obligations-by-type', contractId] });
      queryClient.invalidateQueries({ queryKey: ['obligations-by-status', contractId] });
      queryClient.invalidateQueries({ queryKey: ['obligation-summary', contractId] });
      queryClient.invalidateQueries({ queryKey: ['our-obligations', contractId] });
      queryClient.invalidateQueries({ queryKey: ['counterparty-obligations', contractId] });
      queryClient.invalidateQueries({ queryKey: ['overdue-obligations', contractId] });
      queryClient.invalidateQueries({ queryKey: ['due-soon-obligations', contractId] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-deadlines', contractId] });
    },
  });

  return {
    runAgents: mutation.mutate,
    runAgentsAsync: mutation.mutateAsync,
    isRunning: mutation.isPending,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for extracting obligations only
 */
export function useExtractObligations(contractId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation<RunAgentsResponse, Error>({
    mutationFn: () => obligationsService.extractObligations(contractId),
    onSuccess: () => {
      // Invalidate obligations queries
      queryClient.invalidateQueries({ queryKey: ['obligations'] });
      queryClient.invalidateQueries({ queryKey: ['obligation-summary', contractId] });
    },
  });

  return {
    extractObligations: mutation.mutate,
    extractObligationsAsync: mutation.mutateAsync,
    isExtracting: mutation.isPending,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
}

/**
 * Hook for fetching payment obligations total
 */
export function usePaymentObligationsTotal(contractId: string) {
  return useQuery({
    queryKey: ['payment-obligations-total', contractId],
    queryFn: () => obligationsService.getPaymentObligationsTotal(contractId),
    enabled: !!contractId,
  });
}
