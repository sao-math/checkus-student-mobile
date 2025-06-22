import React, { useState, useMemo } from "react";
import Header from "@/components/header";
import CalendarView from "@/components/ui/calendar-view";
import TaskList from "@/components/ui/task-list";
import TaskModal from "@/components/ui/task-modal";
import { useTasks, useStudyTimes, useTaskComplete, useTaskUncomplete } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Task, StudyTimeWithActuals } from "@/types/api";
import { formatLocalDateTimeToUtc } from "@/utils/dateUtils";
import authService from "@/services/auth";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [showDebug, setShowDebug] = useState(false);

  // Auth 정보 가져오기
  const { user } = useAuth();

  // 디버그 핸들러들
  const handleDebugTokens = () => {
    authService.debugTokenStatus();
  };

  const handleTestRefresh = async () => {
    try {
      await authService.refreshToken();
      console.log('Manual refresh successful');
    } catch (error) {
      console.error('Manual refresh failed:', error);
    }
  };

  // 선택된 날짜를 기준으로 조회 범위 계산
  const dateRange = useMemo(() => {
    // 현재 구현: 선택된 날짜 당일만 정확히 조회 (타임존 고려)
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);  // 당일 00:00:00
    
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);  // 당일 23:59:59
    
    // 로컬 시간대를 고려한 UTC 변환
    return {
      startDate: formatLocalDateTimeToUtc(startDate),
      endDate: formatLocalDateTimeToUtc(endDate)
    };
  }, [selectedDate]);

  // API 훅 사용 - 선택된 날짜 기준으로 공부시간 조회
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  
  const { data: studyTimes = [], isLoading: studyTimesLoading } = useStudyTimes(
    user?.id, 
    dateRange.startDate, 
    dateRange.endDate
  );

  const taskCompleteMutation = useTaskComplete();
  const taskUncompleteMutation = useTaskUncomplete();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // 로컬 날짜 형식으로 비교하는 헬퍼 함수
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택된 날짜에 해당하는 공부시간 - 이중 필터링 제거 (API에서 이미 해당 날짜만 가져옴)
  const filteredStudyTimes = studyTimes; // API가 이미 선택된 날짜만 반환하므로 추가 필터링 불필요

  // 선택된 날짜에 해당하는 할일만 필터링
  const filteredTasks = useMemo(() => {
    const selectedDateStr = formatLocalDate(selectedDate);
    
    return tasks.filter(task => {
      return task.dueDate === selectedDateStr;
    });
  }, [tasks, selectedDate]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskComplete = (taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      // 완료 처리 - 모달 열기
      const task = tasks.find(task => task.id === taskId);
      if (task) {
        handleTaskClick(task);
      }
    } else {
      // 완료 취소 처리
      taskUncompleteMutation.mutate(taskId);
    }
  };

  const handleConfirmComplete = (taskId: string, photoFile?: File) => {
    taskCompleteMutation.mutate({ id: taskId, photoFile });
    setIsTaskModalOpen(false);
  };

  // 새로운 스터디 타임 클릭 핸들러
  const handleStudyTimeClick = (studyTime: StudyTimeWithActuals) => {
    // 실제로는 Discord나 다른 스터디 플랫폼으로 연결
    // TODO: Discord 연결 로직 구현
  };

  if (tasksLoading || studyTimesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-md mx-auto p-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">내 학습 일정</h1>
        
        {/* 토큰 관리 디버그 섹션 */}
        <div className="mb-4">
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="text-sm text-gray-500 underline"
          >
            {showDebug ? '디버그 숨기기' : '토큰 디버그 보기'}
          </button>
          
          {showDebug && (
            <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                새로운 토큰 관리 시스템:
                <br />• 액세스 토큰: 메모리 저장
                <br />• 리프레시 토큰: 쿠키 저장
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={handleDebugTokens}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded border"
                >
                  토큰 상태 확인 (콘솔)
                </button>
                <button
                  onClick={handleTestRefresh}
                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded border"
                >
                  수동 토큰 갱신 테스트
                </button>
              </div>
            </div>
          )}
        </div>
        
        <CalendarView 
          onSelectDate={handleDateSelect} 
          selectedDate={selectedDate}
          view={calendarView}
          setView={setCalendarView}
          className="mb-6"
        />
        
        <TaskList 
          date={selectedDate}
          studyTimes={filteredStudyTimes}
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTaskComplete={handleTaskComplete}
          onStudyTimeClick={handleStudyTimeClick}
        />
      </div>

      <TaskModal
        task={selectedTask}
        open={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onConfirmComplete={handleConfirmComplete}
      />
    </div>
  );
};

export default Dashboard;
