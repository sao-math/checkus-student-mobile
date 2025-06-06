
import { NotificationSettings, NotificationType, NotificationSetting } from '@/types/api';

export class NotificationService {
  private mockResponseHandler: any;

  constructor(mockResponseHandler: any) {
    this.mockResponseHandler = mockResponseHandler;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockResponseHandler.getMockResponse(endpoint, options) as T);
      }, 500);
    });
  }

  async getNotificationSettings() {
    return this.request<NotificationSettings>('/notifications/settings');
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    return this.request<NotificationSettings>('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getNotificationTypes() {
    return this.request<NotificationType[]>('/notifications/types');
  }

  async getDetailedNotificationSettings() {
    return this.request<NotificationSetting[]>('/notifications/settings/detailed');
  }

  async updateNotificationSetting(settingId: string, setting: Partial<NotificationSetting>) {
    return this.request<{ success: boolean }>(`/notifications/settings/${settingId}`, {
      method: 'PUT',
      body: JSON.stringify(setting),
    });
  }
}
