
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NotificationSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useState({
    all: true,
    studyBefore10min: true,
    studyStartTime: true,
    studyRoomEntry: true,
    missedConnection: false,
    morningTasks: true,
    previousDayTasksMorning: false,
    previousDayTasksEvening: false,
  });

  const handleToggleChange = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      // If toggling the 'all' switch
      if (key === 'all') {
        const newValue = !prev.all;
        return {
          all: newValue,
          studyBefore10min: newValue,
          studyStartTime: newValue,
          studyRoomEntry: newValue,
          missedConnection: newValue,
          morningTasks: newValue,
          previousDayTasksMorning: newValue,
          previousDayTasksEvening: newValue,
        };
      }
      
      // If toggling any specific notification
      const newValue = { ...prev, [key]: !prev[key] };
      
      // Check if all specific notifications are enabled
      const allEnabled = 
        newValue.studyBefore10min &&
        newValue.studyStartTime &&
        newValue.studyRoomEntry &&
        newValue.missedConnection &&
        newValue.morningTasks &&
        newValue.previousDayTasksMorning &&
        newValue.previousDayTasksEvening;
      
      // Update the 'all' toggle based on specific toggles
      return { ...newValue, all: allEnabled };
    });
  };

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "알림 설정이 성공적으로 업데이트되었습니다.",
    });
  };

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
                checked={notifications.all}
                onCheckedChange={() => handleToggleChange('all')}
              />
            </div>
            
            <div className="h-px bg-gray-100" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="study-before-10min" className="cursor-pointer">
                  공부 시작 시간 10분 전
                </Label>
                <Switch
                  id="study-before-10min"
                  checked={notifications.studyBefore10min}
                  onCheckedChange={() => handleToggleChange('studyBefore10min')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="study-start-time" className="cursor-pointer">
                  공부 시작 시간
                </Label>
                <Switch
                  id="study-start-time"
                  checked={notifications.studyStartTime}
                  onCheckedChange={() => handleToggleChange('studyStartTime')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="study-room-entry" className="cursor-pointer">
                  스터디룸 입장 알림
                </Label>
                <Switch
                  id="study-room-entry"
                  checked={notifications.studyRoomEntry}
                  onCheckedChange={() => handleToggleChange('studyRoomEntry')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="missed-connection" className="cursor-pointer">
                  미접속 알림
                </Label>
                <Switch
                  id="missed-connection"
                  checked={notifications.missedConnection}
                  onCheckedChange={() => handleToggleChange('missedConnection')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="morning-tasks" className="cursor-pointer">
                  오늘의 할일 알림 (아침)
                </Label>
                <Switch
                  id="morning-tasks"
                  checked={notifications.morningTasks}
                  onCheckedChange={() => handleToggleChange('morningTasks')}
                />
              </div>
              
              <div className="flex flex-col space-y-4 border-t pt-4 mt-2">
                <Label className="text-sm text-gray-600">
                  전날 미완료 할일 알림
                </Label>
                
                <div className="flex items-center justify-between ml-4">
                  <Label htmlFor="previous-tasks-morning" className="cursor-pointer">
                    아침
                  </Label>
                  <Switch
                    id="previous-tasks-morning"
                    checked={notifications.previousDayTasksMorning}
                    onCheckedChange={() => handleToggleChange('previousDayTasksMorning')}
                  />
                </div>
                
                <div className="flex items-center justify-between ml-4">
                  <Label htmlFor="previous-tasks-evening" className="cursor-pointer">
                    저녁
                  </Label>
                  <Switch
                    id="previous-tasks-evening"
                    checked={notifications.previousDayTasksEvening}
                    onCheckedChange={() => handleToggleChange('previousDayTasksEvening')}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button className="w-full" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
