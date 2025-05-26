
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";
import { useDetailedNotificationSettings, useUpdateNotificationSetting } from "@/hooks/useApi";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useDetailedNotificationSettings();
  const updateSetting = useUpdateNotificationSetting();

  const handleToggleChange = (settingId: string, isEnabled: boolean) => {
    updateSetting.mutate({
      settingId,
      setting: { isEnabled }
    });
  };

  const handleDeliveryMethodChange = (settingId: string, deliveryMethod: string) => {
    updateSetting.mutate({
      settingId,
      setting: { deliveryMethod: deliveryMethod as any }
    });
  };

  const handleAdvanceMinutesChange = (settingId: string, advanceMinutes: number) => {
    updateSetting.mutate({
      settingId,
      setting: { advanceMinutes }
    });
  };

  const handleToggleAll = () => {
    if (!settings) return;
    
    const allEnabled = settings.every(setting => setting.isEnabled);
    const newValue = !allEnabled;
    
    settings.forEach(setting => {
      updateSetting.mutate({
        settingId: setting.id,
        setting: { isEnabled: newValue }
      });
    });
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

  const allEnabled = settings?.every(setting => setting.isEnabled) || false;

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
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="all-notifications" className="font-medium">
                  모든 알림
                </Label>
                <p className="text-sm text-gray-500">
                  모든 알림을 한 번에 켜거나 끄기
                </p>
              </div>
              <Switch
                id="all-notifications"
                checked={allEnabled}
                onCheckedChange={handleToggleAll}
              />
            </div>
            
            <div className="h-px bg-gray-100" />
            
            <div className="space-y-6">
              {settings?.map((setting) => (
                <div key={setting.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="cursor-pointer font-medium">
                        {setting.notificationType?.description}
                      </Label>
                    </div>
                    <Switch
                      checked={setting.isEnabled}
                      onCheckedChange={(checked) => handleToggleChange(setting.id, checked)}
                    />
                  </div>
                  
                  {setting.isEnabled && (
                    <div className="ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-gray-600">전송 방법</Label>
                        <Select
                          value={setting.deliveryMethod}
                          onValueChange={(value) => handleDeliveryMethodChange(setting.id, value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="push">푸시 알림</SelectItem>
                            <SelectItem value="email">이메일</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="discord">디스코드</SelectItem>
                            <SelectItem value="kakao">카카오톡</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {(setting.notificationType?.name === 'STUDY_START_10MIN_BEFORE' || 
                        setting.notificationType?.name === 'STUDY_START_TIME') && (
                        <div className="space-y-2">
                          <Label className="text-sm text-gray-600">사전 알림 (분)</Label>
                          <Select
                            value={setting.advanceMinutes.toString()}
                            onValueChange={(value) => handleAdvanceMinutesChange(setting.id, parseInt(value))}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">즉시</SelectItem>
                              <SelectItem value="5">5분 전</SelectItem>
                              <SelectItem value="10">10분 전</SelectItem>
                              <SelectItem value="15">15분 전</SelectItem>
                              <SelectItem value="30">30분 전</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;
