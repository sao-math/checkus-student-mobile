import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

/**
 * 쿼리 무효화를 위한 유틸리티 훅
 * 
 * @example
 * const invalidateQueries = useInvalidateQueries();
 * 
 * // 단일 쿼리 무효화
 * invalidateQueries.single(['tasks']);
 * 
 * // 여러 쿼리 무효화
 * invalidateQueries.multiple([['tasks'], ['guardian-requests']]);
 * 
 * // 모든 tasks 관련 쿼리 무효화
 * invalidateQueries.pattern('tasks');
 */
export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();

  const invalidateSingle = useCallback((queryKey: (string | number)[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  const invalidateMultiple = useCallback((queryKeys: (string | number)[][]) => {
    queryKeys.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  const invalidatePattern = useCallback((pattern: string) => {
    queryClient.invalidateQueries({ 
      predicate: (query) => 
        query.queryKey.some(key => 
          typeof key === 'string' && key.includes(pattern)
        )
    });
  }, [queryClient]);

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  return {
    single: invalidateSingle,
    multiple: invalidateMultiple,
    pattern: invalidatePattern,
    all: invalidateAll,
  };
}; 