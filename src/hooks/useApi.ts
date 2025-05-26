import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { NotificationSetting } from '@/types/api';

// 대시보드 데이터 훅
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.getTasks(),
  });
};

// 수정된 스터디 타임 훅 - 새로운 타입 사용
export const useStudyTimes = () => {
  return useQuery({
    queryKey: ['study-times'],
    queryFn: () => apiClient.getStudyTimes(),
  });
};

// 할일 완료/취소 훅
export const useTaskComplete = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, photoFile }: { id: string; photoFile?: File }) =>
      apiClient.completeTask(id, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "할일 완료!",
        description: "할일이 완료 처리되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "할일 완료 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useTaskUncomplete = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => apiClient.uncompleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "할일 완료 취소",
        description: "할일이 미완료 상태로 변경되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "할일 취소 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

// 학부모 연결 관련 훅
export const useGuardianRequests = () => {
  return useQuery({
    queryKey: ['guardian-requests'],
    queryFn: () => apiClient.getGuardianRequests(),
  });
};

export const useSendGuardianRequest = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (studentId: string) => apiClient.sendGuardianRequest(studentId),
    onSuccess: () => {
      toast({
        title: "연결 요청 전송 완료",
        description: "학생이 요청을 승인하면 목록에 추가됩니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "연결 요청 전송 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useApproveGuardianRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (requestId: string) => apiClient.approveGuardianRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardian-requests'] });
      toast({
        title: "요청 승인됨",
        description: "이제 해당 사용자가 귀하의 학습 정보를 볼 수 있습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "요청 승인 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

export const useRejectGuardianRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (requestId: string) => apiClient.rejectGuardianRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guardian-requests'] });
      toast({
        title: "요청 거절됨",
        description: "연결 요청이 거절되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "요청 거절 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

// 학생 ID 조회 훅
export const useStudentId = () => {
  return useQuery({
    queryKey: ['student-id'],
    queryFn: () => apiClient.getStudentId(),
  });
};

// 연결된 학생 목록 훅 - 올바른 타입 사용
export const useConnectedStudents = () => {
  return useQuery({
    queryKey: ['connected-students'],
    queryFn: () => apiClient.getConnectedStudents(),
  });
};

// 학교 검색 훅
export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: () => apiClient.getSchools(),
  });
};

export const useSearchSchools = (query: string) => {
  return useQuery({
    queryKey: ['schools', 'search', query],
    queryFn: () => apiClient.searchSchools(query),
    enabled: query.length > 0,
  });
};

// 알림 설정 훅
export const useNotificationSettings = () => {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => apiClient.getNotificationSettings(),
  });
};

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (settings: any) => apiClient.updateNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: "설정 저장됨",
        description: "알림 설정이 성공적으로 저장되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "설정 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};

// 새로운 알림 관련 훅들
export const useNotificationTypes = () => {
  return useQuery({
    queryKey: ['notification-types'],
    queryFn: () => apiClient.getNotificationTypes(),
  });
};

export const useDetailedNotificationSettings = () => {
  return useQuery({
    queryKey: ['detailed-notification-settings'],
    queryFn: () => apiClient.getDetailedNotificationSettings(),
  });
};

export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ settingId, setting }: { settingId: string; setting: Partial<NotificationSetting> }) =>
      apiClient.updateNotificationSetting(settingId, setting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailed-notification-settings'] });
      toast({
        title: "설정 저장됨",
        description: "알림 설정이 성공적으로 저장되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류 발생",
        description: "설정 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });
};
