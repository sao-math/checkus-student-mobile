import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

interface MutationWithToastOptions<TData = unknown, TError = unknown, TVariables = void> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
  invalidateKeys?: (string | (string | number)[])[];
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  mutationOptions?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn' | 'onSuccess' | 'onError'>;
}

/**
 * Toast 메시지와 쿼리 무효화를 자동 처리하는 공통 mutation 훅
 * 
 * @example
 * const useTaskComplete = () => {
 *   return useMutationWithToast({
 *     mutationFn: apiClient.completeTask,
 *     successMessage: "할일 완료!",
 *     errorMessage: "할일 완료 처리 중 오류가 발생했습니다.",
 *     invalidateKeys: [['tasks']]
 *   });
 * };
 */
export const useMutationWithToast = <TData = unknown, TError = unknown, TVariables = void>({
  mutationFn,
  successMessage,
  errorMessage,
  invalidateKeys = [],
  onSuccess,
  onError,
  mutationOptions,
}: MutationWithToastOptions<TData, TError, TVariables>) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // 쿼리 무효화
      invalidateKeys.forEach(key => {
        if (Array.isArray(key)) {
          queryClient.invalidateQueries({ queryKey: key });
        } else {
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      });

      // 성공 토스트
      if (successMessage) {
        const message = typeof successMessage === 'function' 
          ? successMessage(data) 
          : successMessage;
        
        toast({
          title: message,
          description: "작업이 성공적으로 완료되었습니다.",
        });
      }

      // 사용자 정의 onSuccess 콜백
      onSuccess?.(data, variables);
    },
    onError: (error, variables, context) => {
      // 에러 토스트
      if (errorMessage) {
        const message = typeof errorMessage === 'function' 
          ? errorMessage(error) 
          : errorMessage;
        
        toast({
          title: "오류 발생",
          description: message,
          variant: "destructive",
        });
      }

      // 사용자 정의 onError 콜백
      onError?.(error, variables);
    },
    ...mutationOptions,
  });
}; 