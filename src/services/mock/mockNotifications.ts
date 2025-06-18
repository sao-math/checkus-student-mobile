import { NotificationType, NotificationSetting, NotificationSettingGroup } from '@/types/api';

export const mockNotificationTypes: NotificationType[] = [
  { id: 'D0001', description: '공부시작 10분전 알림' },
  { id: 'D0002', description: '공부시작 알림' },
  { id: 'D0003', description: '미입장 알림' },
  { id: 'D0004', description: '스터디룸 입장 완료' },
  { id: 'S0001', description: '학습 알림(아침)' },
  { id: 'S0002', description: '학습 알림(저녁)' }
];

export const mockNotificationSettings: NotificationSetting[] = [
  { id: '1', enabled: true, changeable: true },
  { id: '2', enabled: true, changeable: true },
  { id: '3', enabled: false, changeable: true },
  { id: '4', enabled: true, changeable: true },
  { id: '5', enabled: true, changeable: true },
  { id: '6', enabled: false, changeable: true }
];

// Mock data for grouped notification settings supporting multiple delivery methods
export const mockGroupedNotificationSettings: NotificationSettingGroup[] = [
  {
    notificationType: mockNotificationTypes[0], // D0001 - 공부시작 10분전 알림
    advanceMinutes: 10,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (학생에게 필수)
      kakao: { id: 'D0001_k', enabled: true, changeable: false },
      // 디스코드 알림 - 변경불가 (학생에게 필수)
      discord: { id: 'D0001_d', enabled: true, changeable: false }
    }
  },
  {
    notificationType: mockNotificationTypes[1], // D0002 - 공부시작 알림
    advanceMinutes: 0,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (기본 비활성화)
      kakao: { id: 'D0002_k', enabled: false, changeable: false },
      // 디스코드 알림 - 변경불가 (기본 활성화)
      discord: { id: 'D0002_d', enabled: true, changeable: false }
    }
  },
  {
    notificationType: mockNotificationTypes[2], // D0003 - 미입장 알림
    advanceMinutes: 0,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (중요한 알림)
      kakao: { id: 'D0003_k', enabled: true, changeable: false },
      // 디스코드 알림 - 변경불가 (중요한 알림)
      discord: { id: 'D0003_d', enabled: true, changeable: false }
    }
  },
  {
    notificationType: mockNotificationTypes[3], // D0004 - 스터디룸 입장 완료
    advanceMinutes: 0,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (기본 비활성화)
      kakao: { id: 'D0004_k', enabled: false, changeable: false },
      // 디스코드 알림 - 변경불가 (기본 활성화)
      discord: { id: 'D0004_d', enabled: true, changeable: false }
    }
  },
  {
    notificationType: mockNotificationTypes[4], // S0001 - 학습 알림(아침)
    advanceMinutes: 0,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (중요한 학습 알림)
      kakao: { id: 'S0001_k', enabled: true, changeable: false },
      // 디스코드 알림 - 변경가능 (사용자 선택)
      discord: { id: 'S0001_d', enabled: true, changeable: true }
    }
  },
  {
    notificationType: mockNotificationTypes[5], // S0002 - 학습 알림(저녁)
    advanceMinutes: 0,
    deliveryMethods: {
      // 카카오톡 알림 - 변경불가 (중요한 학습 알림)
      kakao: { id: 'S0002_k', enabled: true, changeable: false },
      // 디스코드 알림 - 변경가능 (사용자 선택)
      discord: { id: 'S0002_d', enabled: false, changeable: true }
    }
  }
];
