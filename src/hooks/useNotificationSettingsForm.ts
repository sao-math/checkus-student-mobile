import { useGroupedNotificationSettings, useUpdateNotificationSettingGroup, useCreateNotificationSetting } from './useApi';
import type { NotificationSettingGroup } from '@/types/api';

/**
 * 알림 설정 폼 관리 훅
 * - 알림 설정 데이터 로딩
 * - 설정 토글 처리
 * - 설정 생성/업데이트 로직
 * 
 * @returns 알림 설정 폼에 필요한 데이터와 함수들
 */
export const useNotificationSettingsForm = () => {
  const { data: groupedSettings, isLoading } = useGroupedNotificationSettings();
  const updateSettingGroup = useUpdateNotificationSettingGroup();
  const createSetting = useCreateNotificationSetting();

  /**
   * 채널 토글 처리
   * @param settingGroup - 설정 그룹
   * @param channel - 채널 타입 ('kakao' | 'discord')
   * @param isEnabled - 활성화 여부
   */
  const handleChannelToggle = async (
    settingGroup: NotificationSettingGroup, 
    channel: 'kakao' | 'discord', 
    isEnabled: boolean
  ) => {
    console.log(`🔄 Toggle clicked - Channel: ${channel}, New value: ${isEnabled}`);
    console.log(`📊 Current setting:`, settingGroup.deliveryMethods[channel]);
    
    const existingSetting = settingGroup.deliveryMethods[channel];
    
    if (existingSetting && existingSetting.changeable === false) {
      console.log(`🚫 Setting is not changeable - Channel: ${channel}`);
      return;
    }
    
    try {
      if (existingSetting) {
        console.log(`✏️ Updating existing setting - ID: ${existingSetting.id}, enabled: ${isEnabled}`);
        // Update existing setting
        await updateSettingGroup.mutateAsync({
          notificationTypeId: settingGroup.notificationType.id,
          deliveryMethod: channel,
          setting: { enabled: isEnabled }
        });
      } else {
        console.log(`➕ Creating new setting - enabled: ${isEnabled}`);
        // Create new setting - backend will get userId from JWT token
        await createSetting.mutateAsync({
          notificationTypeId: settingGroup.notificationType.id,
          deliveryMethod: channel,
          setting: {
            enabled: isEnabled
            // advanceMinutes는 그룹 레벨에서만 관리됨
          }
        });
      }
    } catch (error) {
      console.error(`❌ Error toggling ${channel} for ${settingGroup.notificationType.description}:`, error);
    }
  };

  return {
    // 데이터
    groupedSettings,
    
    // 상태
    isLoading,
    isUpdating: updateSettingGroup.isPending,
    isCreating: createSetting.isPending,
    
    // 함수
    handleChannelToggle,
  };
}; 