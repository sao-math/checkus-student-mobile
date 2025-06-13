// 서버 응답 기본 구조
export interface ResponseBase<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// API 요청/응답 타입 정의
export interface User {
  id: string;
  username: string;
  name: string;
  phoneNumber: string;
  discordId?: string;
  createdAt: string;
}

export interface StudentProfile {
  userId: string;
  status: string;
  schoolId: string;
  grade: number;
  gender: string;
}

export interface School {
  id: string;
  name: string;
}

// 학생 선택 페이지에서 사용할 연결된 학생 타입
export interface ConnectedStudent {
  id: string;
  username: string;
  name: string;
  phoneNumber: string;
  discordId?: string;
  createdAt: string;
  school: string;
  grade: string;
}

export interface StudentGuardian {
  studentId: string;
  guardianId: string;
  relationship: string;
}

// 실제 데이터베이스 스키마에 맞는 Activity 타입
export interface Activity {
  id: number;
  name: string;
  isStudyAssignable: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  teacher: string;
  resourceType: "link" | "video";
  resourceUrl?: string;
  videoWatchTime?: number;
  isCompleted: boolean;
  dueTime?: string;
  dueDate: string;
  completionPhoto?: string;
}

// 서버 DB 구조에 맞는 새로운 스터디 타임 타입들
export interface AssignedStudyTime {
  id: number;
  studentId: number;
  studentName?: string;
  title?: string;
  activityId: number;
  activityName?: string;
  isStudyAssignable?: boolean;
  startTime: string; // ISO timestamp
  endTime: string;   // ISO timestamp
  assignedBy: number;
  assignedByName?: string;
  activity?: Activity;
}

export interface ActualStudyTime {
  id: number;
  studentId: number;
  studentName?: string;
  assignedStudyTimeId: number;
  startTime: string; // ISO timestamp
  endTime: string;   // ISO timestamp
  source: string;    // "discord" | "zoom" | "manual" 등
}

// UI에서 사용할 통합된 스터디 타임 타입
export interface StudyTimeWithActuals {
  assigned: AssignedStudyTime;
  actuals: ActualStudyTime[];
  // 계산된 필드들
  totalConnectedMinutes: number;
  progressPercent: number;
  timeline: TimelineSegment[];
  isActive: boolean;
}

export interface TimelineSegment {
  start: number; // 0-100 percentage of the assigned time
  end: number;   // 0-100 percentage of the assigned time
  status: "connected" | "not-connected";
  source?: string; // 실제 공부시간의 source
}

export interface GuardianRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  relationshipType: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RegisterData {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: 'student' | 'parent' | 'teacher';
  school?: string;
  grade?: string;
  guardianName?: string;
  guardianPhone?: string;
  gender?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// 새로운 알림 타입 정의
export interface NotificationType {
  id: string;
  name: string;
  description: string;
}

export interface NotificationSetting {
  id: string;
  userId: string;
  notificationTypeId: string;
  isEnabled: boolean;
  deliveryMethod: 'push' | 'email' | 'sms' | 'discord' | 'kakao';
  advanceMinutes: number;
  notificationType?: NotificationType;
}

// 기존 NotificationSettings는 호환성을 위해 유지
export interface NotificationSettings {
  taskReminders: boolean;
  studyTimeAlerts: boolean;
  guardianUpdates: boolean;
  emailNotifications: boolean;
}
