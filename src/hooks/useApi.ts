import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { NotificationSetting } from '@/types/api';
import { useMutationWithToast } from './useMutationWithToast';
import { useSimpleQuery } from './useSimpleQuery';

// ===== 대시보드 데이터 훅 =====
export const useTasks = () => {
  return useSimpleQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.getTasks(),
  });
};

export const useStudyTimes = (studentId?: number, startDate?: string, endDate?: string) => {
  return useSimpleQuery({
    queryKey: ['study-times', studentId, startDate, endDate],
    queryFn: () => {
      if (!studentId) {
        throw new Error('Student ID is required');
      }
      return apiClient.getStudyTimes(studentId, startDate, endDate);
    },
    enabled: !!studentId,
  });
};

// ===== 할일 관련 훅 =====
export const useTaskComplete = () => {
  return useMutationWithToast({
    mutationFn: ({ id, photoFile }: { id: string; photoFile?: File }) =>
      apiClient.completeTask(id, photoFile),
    successMessage: "할일 완료!",
    errorMessage: "할일 완료 처리 중 오류가 발생했습니다.",
    invalidateKeys: [['tasks']],
  });
};

export const useTaskUncomplete = () => {
  return useMutationWithToast({
    mutationFn: (id: string) => apiClient.uncompleteTask(id),
    successMessage: "할일 완료 취소",
    errorMessage: "할일 취소 처리 중 오류가 발생했습니다.",
    invalidateKeys: [['tasks']],
  });
};

// ===== 학부모 연결 관련 훅 =====
export const useGuardianRequests = () => {
  return useSimpleQuery({
    queryKey: ['guardian-requests'],
    queryFn: () => apiClient.getGuardianRequests(),
  });
};

export const useSendGuardianRequest = () => {
  return useMutationWithToast({
    mutationFn: (studentId: string) => apiClient.sendGuardianRequest(studentId),
    successMessage: "연결 요청 전송 완료",
    errorMessage: "연결 요청 전송 중 오류가 발생했습니다.",
  });
};

export const useApproveGuardianRequest = () => {
  return useMutationWithToast({
    mutationFn: (requestId: string) => apiClient.approveGuardianRequest(requestId),
    successMessage: "요청 승인됨",
    errorMessage: "요청 승인 중 오류가 발생했습니다.",
    invalidateKeys: [['guardian-requests']],
  });
};

export const useRejectGuardianRequest = () => {
  return useMutationWithToast({
    mutationFn: (requestId: string) => apiClient.rejectGuardianRequest(requestId),
    successMessage: "요청 거절됨",
    errorMessage: "요청 거절 중 오류가 발생했습니다.",
    invalidateKeys: [['guardian-requests']],
  });
};

// ===== 학생 관련 훅 =====
export const useStudentId = () => {
  return useSimpleQuery({
    queryKey: ['student-id'],
    queryFn: () => apiClient.getStudentId(),
  });
};

export const useConnectedStudents = () => {
  return useSimpleQuery({
    queryKey: ['connected-students'],
    queryFn: () => apiClient.getConnectedStudents(),
  });
};

// ===== 학교 관련 훅 =====
export const useSchools = () => {
  return useSimpleQuery({
    queryKey: ['schools'],
    queryFn: () => apiClient.getSchools(),
  });
};

export const useSearchSchools = (query: string) => {
  return useSimpleQuery({
    queryKey: ['schools', 'search', query],
    queryFn: () => apiClient.searchSchools(query),
    enabled: query.length > 0,
  });
};

// ===== 알림 설정 훅 =====
export const useNotificationSettings = () => {
  return useSimpleQuery({
    queryKey: ['notification-settings'],
    queryFn: () => apiClient.getNotificationSettings(),
  });
};

export const useUpdateNotificationSettings = () => {
  return useMutationWithToast({
    mutationFn: (settings: any) => apiClient.updateNotificationSettings(settings),
    successMessage: "설정 저장됨",
    errorMessage: "설정 저장 중 오류가 발생했습니다.",
    invalidateKeys: [['notification-settings']],
  });
};

export const useNotificationTypes = () => {
  return useSimpleQuery({
    queryKey: ['notification-types'],
    queryFn: () => apiClient.getNotificationTypes(),
  });
};

export const useDetailedNotificationSettings = () => {
  return useSimpleQuery({
    queryKey: ['detailed-notification-settings'],
    queryFn: () => apiClient.getDetailedNotificationSettings(),
  });
};

export const useGroupedNotificationSettings = () => {
  return useSimpleQuery({
    queryKey: ['grouped-notification-settings'],
    queryFn: () => apiClient.getGroupedNotificationSettings(),
  });
};

export const useUpdateNotificationSetting = () => {
  return useMutationWithToast({
    mutationFn: ({ settingId, setting }: { settingId: string; setting: Partial<NotificationSetting> }) =>
      apiClient.updateNotificationSetting(settingId, setting),
    successMessage: "설정 저장됨",
    errorMessage: "설정 저장 중 오류가 발생했습니다.",
    invalidateKeys: [['detailed-notification-settings']],
  });
};

// ===== 특수 알림 설정 훅 (다중 쿼리 무효화) =====
export const useUpdateNotificationSettingGroup = () => {
  return useMutationWithToast({
    mutationFn: ({ 
      notificationTypeId, 
      deliveryMethod, 
      setting 
    }: { 
      notificationTypeId: string; 
      deliveryMethod: string; 
      setting: Partial<NotificationSetting> 
    }) => 
      apiClient.updateNotificationSettingGroup(notificationTypeId, deliveryMethod, setting),
    invalidateKeys: [
      ['grouped-notification-settings'],
      ['detailed-notification-settings']
    ],
  });
};

export const useCreateNotificationSetting = () => {
  return useMutationWithToast({
    mutationFn: ({ 
      notificationTypeId, 
      deliveryMethod, 
      setting 
    }: { 
      notificationTypeId: string; 
      deliveryMethod: string; 
      setting: Partial<NotificationSetting> 
    }) => 
      apiClient.createNotificationSetting(notificationTypeId, deliveryMethod, setting),
    invalidateKeys: [
      ['grouped-notification-settings'],
      ['detailed-notification-settings']
    ],
  });
};
