import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft, MessageCircle, Bot } from "lucide-react";
import { useGroupedNotificationSettings, useUpdateNotificationSettingGroup, useCreateNotificationSetting } from "@/hooks/useApi";
import type { NotificationSettingGroup } from "@/types/api";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { data: groupedSettings, isLoading } = useGroupedNotificationSettings();
  const updateSettingGroup = useUpdateNotificationSettingGroup();
  const createSetting = useCreateNotificationSetting();

  // 디버깅용 - 원시 데이터 출력
  console.log('🔍 Raw groupedSettings data:', groupedSettings);

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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-md mx-auto p-4">
          <div className="text-center py-8">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-md mx-auto p-4">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">알림 설정</h1>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-6">
              {groupedSettings?.map((settingGroup) => {
                // 실제 값 사용 (|| false 제거하여 실제 false 값도 제대로 표시)
                const hasKakao = settingGroup.deliveryMethods.kakao?.enabled ?? false;
                const hasDiscord = settingGroup.deliveryMethods.discord?.enabled ?? false;
                
                const kakaoChangeable = settingGroup.deliveryMethods.kakao?.changeable !== false;
                const discordChangeable = settingGroup.deliveryMethods.discord?.changeable !== false;
                
                // 카카오톡/디스코드 설정이 존재하는지 확인
                const hasKakaoSetting = !!settingGroup.deliveryMethods.kakao;
                const hasDiscordSetting = !!settingGroup.deliveryMethods.discord;

                console.log(`📋 ${settingGroup.notificationType.description}:`, { 
                  hasKakao, hasDiscord, kakaoChangeable, discordChangeable,
                  hasKakaoSetting, hasDiscordSetting,
                  kakaoSetting: settingGroup.deliveryMethods.kakao,
                  discordSetting: settingGroup.deliveryMethods.discord
                });

                return (
                  <div key={settingGroup.notificationType.id} className="space-y-3">
                    <div className="font-medium text-gray-900">
                      {settingGroup.notificationType.description}
                    </div>
                    
                    <div className="ml-4 space-y-3">
                      {/* KakaoTalk Settings - 설정이 존재하면 보여줌 */}
                      {hasKakaoSetting && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-yellow-500" />
                            <Label className={`text-sm ${!kakaoChangeable ? 'text-gray-500' : ''}`}>
                              카카오톡 알림
                              {!kakaoChangeable && <span className="text-xs text-gray-400 ml-1">(변경불가)</span>}
                            </Label>
                          </div>
                          <Switch
                            checked={hasKakao}
                            disabled={!kakaoChangeable}
                            onCheckedChange={(checked) => {
                              if (kakaoChangeable) {
                                console.log(`🟡 Kakao toggle: ${hasKakao} -> ${checked}`);
                                handleChannelToggle(settingGroup, 'kakao', checked);
                              }
                            }}
                            className={!kakaoChangeable ? 'opacity-50 cursor-not-allowed' : ''}
                          />
                        </div>
                      )}
                      
                      {/* Discord Settings - 설정이 존재하면 보여줌 */}
                      {hasDiscordSetting && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4 text-indigo-500" />
                            <Label className={`text-sm ${!discordChangeable ? 'text-gray-500' : ''}`}>
                              디스코드 알림
                              {!discordChangeable && <span className="text-xs text-gray-400 ml-1">(변경불가)</span>}
                            </Label>
                          </div>
                          <Switch
                            checked={hasDiscord}
                            disabled={!discordChangeable}
                            onCheckedChange={(checked) => {
                              if (discordChangeable) {
                                console.log(`🟣 Discord toggle: ${hasDiscord} -> ${checked}`);
                                handleChannelToggle(settingGroup, 'discord', checked);
                              }
                            }}
                            className={!discordChangeable ? 'opacity-50 cursor-not-allowed' : ''}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">알림 설정 안내</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• 각 알림 유형별로 카카오톡과 디스코드를 독립적으로 설정할 수 있습니다.</p>
                <p>• <strong>공부시작 알림</strong>: 학습 시작 전과 시작 시간에 알림을 받을 수 있습니다.</p>
                <p>• <strong>미입장 알림</strong>: 예정된 시간에 스터디룸 입장이 확인되지 않을 때 발송되는 중요한 알림입니다.</p>
                <p>• <strong>입장 완료 알림</strong>: 스터디룸 입장이 성공적으로 완료되었을 때 확인 알림을 받습니다.</p>
                <p>• <strong>학습 알림</strong>: 오늘의 과제와 미완료 과제에 대한 정보를 받을 수 있습니다.</p>
                <p>• <span className="text-gray-600">(변경불가)</span> 표시된 알림은 학습 관리상 필수이므로 변경할 수 없습니다.</p>
                <p>• 카카오톡 알림을 받으려면 휴대폰 번호가 등록되어 있어야 합니다.</p>
                <p>• 디스코드 알림을 받으려면 디스코드 ID가 등록되어 있어야 합니다.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
