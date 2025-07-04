import { useQuery, UseQueryOptions } from '@tanstack/react-query';

interface SimpleQueryOptions<TData = unknown, TError = unknown> {
  queryKey: (string | number)[];
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  queryOptions?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn' | 'enabled'>;
}

/**
 * 단순한 API 쿼리를 위한 공통 훅
 * 
 * @example
 * const useTasks = () => {
 *   return useSimpleQuery({
 *     queryKey: ['tasks'],
 *     queryFn: () => apiClient.getTasks()
 *   });
 * };
 */
export const useSimpleQuery = <TData = unknown, TError = unknown>({
  queryKey,
  queryFn,
  enabled = true,
  queryOptions,
}: SimpleQueryOptions<TData, TError>) => {
  return useQuery({
    queryKey,
    queryFn,
    enabled,
    ...queryOptions,
  });
}; 