import { mockUser, mockUsers, mockConnectedStudents, mockStudentsWithProfile } from './mock/mockUsers';
import { mockTasks } from './mock/mockTasks';
import { mockNotificationTypes, mockNotificationSettings, mockGroupedNotificationSettings } from './mock/mockNotifications';
import { generateStudyTimesWithActuals } from './mock/mockStudyTimes';
import { mockGuardianRequests, mockSchools } from './mock/mockOther';

export class MockResponseHandler {
  getMockResponse(endpoint: string, options: RequestInit): any {
    console.log(`Mock API Call: ${options.method || 'GET'} ${endpoint}`);
    
    // 인증 관련
    if (endpoint === '/auth/register') return { success: true, user: mockUser };
    if (endpoint === '/auth/login') return { success: true, user: mockUser, token: 'mock-token' };
    if (endpoint === '/auth/logout') return { success: true };
    if (endpoint.startsWith('/auth/check-username/')) return { available: true };
    if (endpoint.startsWith('/auth/check-phone/')) return { available: true };

    // 사용자 관리
    if (endpoint === '/users/profile') return mockUser;

    // 학교 관련
    if (endpoint === '/schools') return mockSchools;
    if (endpoint.startsWith('/schools/search')) return mockSchools.slice(0, 2);

    // 대시보드/학습 관리
    if (endpoint === '/dashboard/tasks') return mockTasks;
    if (endpoint === '/dashboard/calendar') return { events: [] };

    // 할일 관리
    if (endpoint.includes('/tasks/') && endpoint.includes('/complete')) {
      return { success: true };
    }

    // 파일 업로드
    if (endpoint === '/files/upload') return { url: 'mock-file-url', success: true };

    // 학부모-학생 연결
    if (endpoint === '/guardian-connect/request') return { success: true, requestId: 'req_new' };
    if (endpoint === '/guardian-connect/requests') return mockGuardianRequests;
    if (endpoint.includes('/guardian-connect/requests/') && endpoint.includes('/approve')) {
      return { success: true };
    }
    if (endpoint.includes('/guardian-connect/requests/') && endpoint.includes('/reject')) {
      return { success: true };
    }
    if (endpoint === '/guardian-connect/students') return mockStudentsWithProfile;

    // 학생 ID
    if (endpoint === '/student/id') return { studentId: 'student_hong123' };

    // 알림 설정
    if (endpoint === '/notifications/types') return mockNotificationTypes;
    if (endpoint === '/notifications/settings/detailed') return mockNotificationSettings;
    if (endpoint === '/notifications/settings/grouped') return mockGroupedNotificationSettings;
    if (endpoint.includes('/notifications/settings/') && options.method === 'PUT') {
      return { success: true };
    }
    if (endpoint.includes('/notifications/settings/grouped/') && (options.method === 'PUT' || options.method === 'POST')) {
      return { success: true };
    }

    // 기존 알림 설정 (호환성)
    if (endpoint === '/notifications/settings') {
      return {
        taskReminders: true,
        studyTimeAlerts: true,
        guardianUpdates: false,
        emailNotifications: true
      };
    }

    return { success: true };
  }
}
