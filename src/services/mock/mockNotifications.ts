
import { NotificationType, NotificationSetting } from '@/types/api';

export const mockNotificationTypes: NotificationType[] = [
  { id: '1', name: 'STUDY_START_10MIN_BEFORE', description: '공부 시작 10분 전 알림' },
  { id: '2', name: 'STUDY_START_TIME', description: '공부 시작 시간 알림' },
  { id: '3', name: 'STUDY_ROOM_ENTRY', description: '스터디룸 입장 알림' },
  { id: '4', name: 'NO_ATTENDANCE_ALERT', description: '미접속 알림' },
  { id: '5', name: 'DAILY_TASKS_MORNING', description: '오늘의 할일 알림 (아침)' },
  { id: '6', name: 'INCOMPLETE_TASKS_MORNING', description: '전날 미완료 할일 알림 (아침)' },
  { id: '7', name: 'INCOMPLETE_TASKS_EVENING', description: '전날 미완료 할일 알림 (저녁)' }
];

export const mockNotificationSettings: NotificationSetting[] = [
  { id: '1', userId: 'user123', notificationTypeId: '1', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 10, notificationType: mockNotificationTypes[0] },
  { id: '2', userId: 'user123', notificationTypeId: '2', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[1] },
  { id: '3', userId: 'user123', notificationTypeId: '3', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[2] },
  { id: '4', userId: 'user123', notificationTypeId: '4', isEnabled: false, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[3] },
  { id: '5', userId: 'user123', notificationTypeId: '5', isEnabled: true, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[4] },
  { id: '6', userId: 'user123', notificationTypeId: '6', isEnabled: false, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[5] },
  { id: '7', userId: 'user123', notificationTypeId: '7', isEnabled: false, deliveryMethod: 'push', advanceMinutes: 0, notificationType: mockNotificationTypes[6] }
];
