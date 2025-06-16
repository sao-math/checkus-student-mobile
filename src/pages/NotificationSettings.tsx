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

  const handleChannelToggle = async (
    settingGroup: NotificationSettingGroup, 
    channel: 'kakao' | 'discord', 
    isEnabled: boolean
  ) => {
    const existingSetting = settingGroup.deliveryMethods[channel];
    
    if (existingSetting) {
      // Update existing setting
      await updateSettingGroup.mutateAsync({
        notificationTypeId: settingGroup.notificationType.id,
        deliveryMethod: channel,
        setting: { isEnabled }
      });
    } else {
      // Create new setting - backend will get userId from JWT token
      await createSetting.mutateAsync({
        notificationTypeId: settingGroup.notificationType.id,
        deliveryMethod: channel,
        setting: {
          isEnabled,
          advanceMinutes: settingGroup.advanceMinutes || 0
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
                const hasKakao = settingGroup.deliveryMethods.kakao?.isEnabled || false;
                const hasDiscord = settingGroup.deliveryMethods.discord?.isEnabled || false;

                return (
                  <div key={settingGroup.notificationType.id} className="space-y-3">
                    <div className="font-medium text-gray-900">
                      {settingGroup.notificationType.description}
                    </div>
                    
                    <div className="ml-4 space-y-3">
                      {/* KakaoTalk Settings */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-yellow-500" />
                          <Label className="text-sm">카카오톡 알림</Label>
                        </div>
                        <Switch
                          checked={hasKakao}
                          onCheckedChange={(checked) => 
                            handleChannelToggle(settingGroup, 'kakao', checked)
                          }
                        />
                      </div>
                      
                      {/* Discord Settings */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-indigo-500" />
                          <Label className="text-sm">디스코드 알림</Label>
                        </div>
                        <Switch
                          checked={hasDiscord}
                          onCheckedChange={(checked) => 
                            handleChannelToggle(settingGroup, 'discord', checked)
                          }
                        />
                      </div>
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
