import { NotificationType, NotificationSetting, NotificationSettingGroup } from '@/types/api';

export const mockNotificationTypes: NotificationType[] = [
  { id: 'D0001', name: 'STUDY_START_10MIN_BEFORE', description: '공부시작 10분전 알림' },
  { id: 'D0002', name: 'STUDY_START_TIME', description: '공부시작 알림' },
  { id: 'D0003', name: 'NO_ATTENDANCE_ALERT', description: '미입장 알림' },
  { id: 'D0004', name: 'STUDY_ROOM_ENTRY', description: '스터디룸 입장 완료' },
  { id: 'S0001', name: 'DAILY_TASKS_MORNING', description: '학습 알림(아침)' },
  { id: 'S0002', name: 'INCOMPLETE_TASKS_EVENING', description: '학습 알림(저녁)' }
];

export const mockNotificationSettings: NotificationSetting[] = [
  { id: '1', userId: 'user123', notificationTypeId: 'D0001', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 10, notificationType: mockNotificationTypes[0] },
  { id: '2', userId: 'user123', notificationTypeId: 'D0002', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[1] },
  { id: '3', userId: 'user123', notificationTypeId: 'D0003', isEnabled: false, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[2] },
  { id: '4', userId: 'user123', notificationTypeId: 'D0004', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[3] },
  { id: '5', userId: 'user123', notificationTypeId: 'S0001', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[4] },
  { id: '6', userId: 'user123', notificationTypeId: 'S0002', isEnabled: false, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[5] }
];

// Mock data for grouped notification settings supporting multiple delivery methods
export const mockGroupedNotificationSettings: NotificationSettingGroup[] = [
  {
    notificationType: mockNotificationTypes[0], // D0001 - 공부시작 10분전 알림
    isEnabled: true,
    advanceMinutes: 10,
    deliveryMethods: {
      kakao: { id: 'D0001_k', userId: 'user123', notificationTypeId: 'D0001', isEnabled: true, deliveryMethod: 'kakao', advanceMinutes: 10, notificationType: mockNotificationTypes[0] },
      discord: { id: 'D0001_d', userId: 'user123', notificationTypeId: 'D0001', isEnabled: false, deliveryMethod: 'discord', advanceMinutes: 10, notificationType: mockNotificationTypes[0] }
    }
  },
  {
    notificationType: mockNotificationTypes[1], // D0002 - 공부시작 알림
    isEnabled: true,
    advanceMinutes: 0,
    deliveryMethods: {
      kakao: { id: 'D0002_k', userId: 'user123', notificationTypeId: 'D0002', isEnabled: true, deliveryMethod: 'kakao', advanceMinutes: 0, notificationType: mockNotificationTypes[1] },
      discord: { id: 'D0002_d', userId: 'user123', notificationTypeId: 'D0002', isEnabled: true, deliveryMethod: 'discord', advanceMinutes: 0, notificationType: mockNotificationTypes[1] }
    }
  },
  {
    notificationType: mockNotificationTypes[2], // D0003 - 미입장 알림
    isEnabled: false,
    advanceMinutes: 0,
    deliveryMethods: {
      kakao: { id: 'D0003_k', userId: 'user123', notificationTypeId: 'D0003', isEnabled: false, deliveryMethod: 'kakao', advanceMinutes: 0, notificationType: mockNotificationTypes[2] },
      discord: { id: 'D0003_d', userId: 'user123', notificationTypeId: 'D0003', isEnabled: false, deliveryMethod: 'discord', advanceMinutes: 0, notificationType: mockNotificationTypes[2] }
    }
  },
  {
    notificationType: mockNotificationTypes[3], // D0004 - 스터디룸 입장 완료
    isEnabled: true,
    advanceMinutes: 0,
    deliveryMethods: {
      kakao: { id: 'D0004_k', userId: 'user123', notificationTypeId: 'D0004', isEnabled: false, deliveryMethod: 'kakao', advanceMinutes: 0, notificationType: mockNotificationTypes[3] },
      discord: { id: 'D0004_d', userId: 'user123', notificationTypeId: 'D0004', isEnabled: true, deliveryMethod: 'discord', advanceMinutes: 0, notificationType: mockNotificationTypes[3] }
    }
  },
  {
    notificationType: mockNotificationTypes[4], // S0001 - 학습 알림(아침)
    isEnabled: true,
    advanceMinutes: 0,
    deliveryMethods: {
      kakao: { id: 'S0001_k', userId: 'user123', notificationTypeId: 'S0001', isEnabled: true, deliveryMethod: 'kakao', advanceMinutes: 0, notificationType: mockNotificationTypes[4] },
      discord: { id: 'S0001_d', userId: 'user123', notificationTypeId: 'S0001', isEnabled: false, deliveryMethod: 'discord', advanceMinutes: 0, notificationType: mockNotificationTypes[4] }
    }
  },
  {
    notificationType: mockNotificationTypes[5], // S0002 - 학습 알림(저녁)
    isEnabled: false,
    advanceMinutes: 0,
    deliveryMethods: {
      kakao: { id: 'S0002_k', userId: 'user123', notificationTypeId: 'S0002', isEnabled: false, deliveryMethod: 'kakao', advanceMinutes: 0, notificationType: mockNotificationTypes[5] },
      discord: { id: 'S0002_d', userId: 'user123', notificationTypeId: 'S0002', isEnabled: false, deliveryMethod: 'discord', advanceMinutes: 0, notificationType: mockNotificationTypes[5] }
    }
  }
];
