import { 
  Task, 
  StudyTimeWithActuals, 
  GuardianRequest, 
  School, 
  NotificationSettings, 
  NotificationSetting, 
  NotificationType, 
  ConnectedStudent 
} from '@/types/api';
import { TaskService } from './taskService';
import { StudyTimeService } from './studyTimeService';
import { GuardianService } from './guardianService';
import { NotificationService } from './notificationService';
import { SchoolService } from './schoolService';
import { MockResponseHandler } from './mockResponseHandler';

/**
 * 리팩토링된 API 클라이언트
 * 실제로 사용되는 메서드들만 제공하여 중복을 제거하고 간결성을 향상
 */
class ApiClient {
  private mockResponseHandler: MockResponseHandler;
  private taskService: TaskService;
  private studyTimeService: StudyTimeService;
  private guardianService: GuardianService;
  private notificationService: NotificationService;
  private schoolService: SchoolService;

  constructor() {
    this.mockResponseHandler = new MockResponseHandler();
    this.taskService = new TaskService(this.mockResponseHandler);
    this.studyTimeService = new StudyTimeService();
    this.guardianService = new GuardianService(this.mockResponseHandler);
    this.notificationService = new NotificationService();
    this.schoolService = new SchoolService(this.mockResponseHandler);
  }

  // ===== 할일 관리 =====
  
  async getTasks() {
    return this.taskService.getTasks();
  }

  async completeTask(id: string, photoFile?: File) {
    return this.taskService.completeTask(id, photoFile);
  }

  async uncompleteTask(id: string) {
    return this.taskService.uncompleteTask(id);
  }

  // ===== 공부 시간 관리 =====
  
  async getStudyTimes(studentId: number, startDate?: string, endDate?: string) {
    return this.studyTimeService.getStudyTimes(studentId, startDate, endDate);
  }

  // ===== 학부모 연결 관리 =====
  
  async sendGuardianRequest(studentId: string) {
    return this.guardianService.sendGuardianRequest(studentId);
  }

  async getGuardianRequests() {
    return this.guardianService.getGuardianRequests();
  }

  async approveGuardianRequest(requestId: string) {
    return this.guardianService.approveGuardianRequest(requestId);
  }

  async rejectGuardianRequest(requestId: string) {
    return this.guardianService.rejectGuardianRequest(requestId);
  }

  async getConnectedStudents() {
    return this.guardianService.getConnectedStudents();
  }

  async getStudentId() {
    return this.guardianService.getStudentId();
  }

  // ===== 학교 관리 =====
  
  async getSchools() {
    return this.schoolService.getSchools();
  }

  async searchSchools(query: string) {
    return this.schoolService.searchSchools(query);
  }

  // ===== 알림 설정 관리 =====
  
  async getNotificationSettings() {
    return this.notificationService.getNotificationSettings();
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    return this.notificationService.updateNotificationSettings(settings);
  }

  async getNotificationTypes() {
    return this.notificationService.getNotificationTypes();
  }

  async getDetailedNotificationSettings() {
    return this.notificationService.getDetailedNotificationSettings();
  }

  async updateNotificationSetting(settingId: string, setting: Partial<NotificationSetting>) {
    return this.notificationService.updateNotificationSetting(settingId, setting);
  }

  async getGroupedNotificationSettings() {
    return this.notificationService.getGroupedNotificationSettings();
  }

  async updateNotificationSettingGroup(
    notificationTypeId: string, 
    deliveryMethod: string, 
    setting: Partial<NotificationSetting>
  ) {
    return this.notificationService.updateNotificationSettingGroup(notificationTypeId, deliveryMethod, setting);
  }

  async createNotificationSetting(
    notificationTypeId: string,
    deliveryMethod: string,
    setting: Partial<NotificationSetting>
  ) {
    return this.notificationService.createNotificationSetting(notificationTypeId, deliveryMethod, setting);
  }
}

export const apiClient = new ApiClient();
