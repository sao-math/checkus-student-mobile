import { RegisterData, LoginData, User, Task, StudyTimeWithActuals, GuardianRequest, School, NotificationSettings, NotificationSetting, NotificationType, ConnectedStudent } from '@/types/api';
import { MockResponseHandler } from './mockResponseHandler';
import { AuthService } from './authService';
import { UserService } from './userService';
import { SchoolService } from './schoolService';
import { TaskService } from './taskService';
import { StudyTimeService } from './studyTimeService';
import { GuardianService } from './guardianService';
import { NotificationService } from './notificationService';
import { FileService } from './fileService';

class ApiClient {
  private mockResponseHandler: MockResponseHandler;
  private authService: AuthService;
  private userService: UserService;
  private schoolService: SchoolService;
  private taskService: TaskService;
  private studyTimeService: StudyTimeService;
  private guardianService: GuardianService;
  private notificationService: NotificationService;
  private fileService: FileService;

  constructor() {
    this.mockResponseHandler = new MockResponseHandler();
    this.authService = new AuthService(this.mockResponseHandler);
    this.userService = new UserService(this.mockResponseHandler);
    this.schoolService = new SchoolService(this.mockResponseHandler);
    this.taskService = new TaskService(this.mockResponseHandler);
    this.studyTimeService = new StudyTimeService();
    this.guardianService = new GuardianService(this.mockResponseHandler);
    this.notificationService = new NotificationService(this.mockResponseHandler);
    this.fileService = new FileService(this.mockResponseHandler);
  }

  // Auth methods
  async register(data: RegisterData) {
    return this.authService.register(data);
  }

  async login(data: LoginData) {
    return this.authService.login(data);
  }

  async logout() {
    return this.authService.logout();
  }

  async checkUsername(username: string) {
    return this.authService.checkUsername(username);
  }

  async checkPhone(phoneNumber: string) {
    return this.authService.checkPhone(phoneNumber);
  }

  // User methods
  async getUserProfile() {
    return this.userService.getUserProfile();
  }

  async updateUserProfile(data: Partial<User>) {
    return this.userService.updateUserProfile(data);
  }

  // School methods
  async getSchools() {
    return this.schoolService.getSchools();
  }

  async searchSchools(query: string) {
    return this.schoolService.searchSchools(query);
  }

  // Task methods
  async getTasks() {
    return this.taskService.getTasks();
  }

  async completeTask(id: string, photoFile?: File) {
    return this.taskService.completeTask(id, photoFile);
  }

  async uncompleteTask(id: string) {
    return this.taskService.uncompleteTask(id);
  }

  // Study time methods
  async getStudyTimes(studentId: number, startDate?: string, endDate?: string) {
    return this.studyTimeService.getStudyTimes(studentId, startDate, endDate);
  }

  async getAssignedStudyTimes(studentId: number, startDate: string, endDate: string) {
    return this.studyTimeService.getAssignedStudyTimes(studentId, startDate, endDate);
  }

  async getActualStudyTimes(studentId: number, startDate: string, endDate: string) {
    return this.studyTimeService.getActualStudyTimes(studentId, startDate, endDate);
  }

  async getStudyAssignableActivities() {
    return this.studyTimeService.getStudyAssignableActivities();
  }

  async getUpcomingStudyTimes() {
    return this.studyTimeService.getUpcomingStudyTimes();
  }

  async getCalendar() {
    return this.studyTimeService.getCalendar();
  }

  // Guardian methods
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

  async cancelGuardianRequest(requestId: string) {
    return this.guardianService.cancelGuardianRequest(requestId);
  }

  async getConnectedStudents() {
    return this.guardianService.getConnectedStudents();
  }

  async getStudentId() {
    return this.guardianService.getStudentId();
  }

  // Notification methods
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

  // File methods
  async uploadFile(file: File) {
    return this.fileService.uploadFile(file);
  }
}

export const apiClient = new ApiClient();
