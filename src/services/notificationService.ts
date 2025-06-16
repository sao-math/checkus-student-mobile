import { NotificationSettings, NotificationType, NotificationSetting, NotificationSettingGroup, ResponseBase } from '@/types/api';
import axiosInstance from '@/lib/axios';

// DTO interface matching backend structure
interface NotificationSettingUpdateDto {
  enabled: boolean;
  advanceMinutes?: number;
}

export class NotificationService {
  // Helper method to map frontend delivery methods to backend delivery methods
  private mapDeliveryMethod(deliveryMethod: string): string {
    const mapping: { [key: string]: string } = {
      'kakao': 'alimtalk',
      'discord': 'discord'
    };
    return mapping[deliveryMethod] || deliveryMethod;
  }

  // Helper method to map backend delivery methods to frontend delivery methods
  private unmapDeliveryMethod(deliveryMethod: string): string {
    const mapping: { [key: string]: string } = {
      'alimtalk': 'kakao',
      'discord': 'discord'
    };
    return mapping[deliveryMethod] || deliveryMethod;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    const response = await axiosInstance.get<ResponseBase<NotificationSettings>>('/notifications/settings');
    return response.data.data!;
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    const response = await axiosInstance.put<ResponseBase<NotificationSettings>>('/notifications/settings', settings);
    return response.data.data!;
  }

  async getNotificationTypes(): Promise<NotificationType[]> {
    const response = await axiosInstance.get<ResponseBase<NotificationType[]>>('/notifications/types');
    return response.data.data!;
  }

  async getDetailedNotificationSettings(): Promise<NotificationSetting[]> {
    const response = await axiosInstance.get<ResponseBase<NotificationSetting[]>>('/notifications/settings/detailed');
    return response.data.data!;
  }

  async updateNotificationSetting(settingId: string, setting: Partial<NotificationSetting>): Promise<{ success: boolean }> {
    const response = await axiosInstance.put<ResponseBase<{ success: boolean }>>(`/notifications/settings/${settingId}`, setting);
    return response.data.data!;
  }

  // New methods for grouped notification settings
  async getGroupedNotificationSettings(): Promise<NotificationSettingGroup[]> {
    const response = await axiosInstance.get<ResponseBase<NotificationSettingGroup[]>>('/notifications/settings/grouped');
    const backendData = response.data.data!;
    
    // Transform backend data to frontend format
    return backendData.map(group => ({
      ...group,
      deliveryMethods: Object.fromEntries(
        Object.entries(group.deliveryMethods).map(([key, value]) => [
          this.unmapDeliveryMethod(key),
          {
            ...value,
            deliveryMethod: this.unmapDeliveryMethod(value.deliveryMethod)
          }
        ])
      )
    }));
  }

  async updateNotificationSettingGroup(
    notificationTypeId: string, 
    deliveryMethod: string, 
    setting: Partial<NotificationSetting>
  ): Promise<{ success: boolean }> {
    // Map frontend delivery method to backend format
    const backendDeliveryMethod = this.mapDeliveryMethod(deliveryMethod);
    
    // Create DTO matching backend structure
    const updateDto: NotificationSettingUpdateDto = {
      enabled: setting.isEnabled || false,
      advanceMinutes: setting.advanceMinutes
    };

    const response = await axiosInstance.put<ResponseBase<string>>(
      `/notifications/settings/grouped/${notificationTypeId}/${backendDeliveryMethod}`, 
      updateDto
    );
    return { success: response.data.success };
  }

  async createNotificationSetting(
    notificationTypeId: string,
    deliveryMethod: string,
    setting: Partial<NotificationSetting>
  ): Promise<NotificationSetting> {
    // Map frontend delivery method to backend format
    const backendDeliveryMethod = this.mapDeliveryMethod(deliveryMethod);
    
    // Create DTO matching backend structure
    const createDto: NotificationSettingUpdateDto = {
      enabled: setting.isEnabled || false,
      advanceMinutes: setting.advanceMinutes
    };

    const response = await axiosInstance.post<ResponseBase<NotificationSetting>>(
      `/notifications/settings/grouped/${notificationTypeId}/${backendDeliveryMethod}`,
      createDto
    );
    return response.data.data!;
  }
}
