import React, { useState, useMemo } from "react";
import Header from "@/components/header";
import CalendarView from "@/components/ui/calendar-view";
import TaskList from "@/components/ui/task-list";
import TaskModal from "@/components/ui/task-modal";
import { useTasks, useStudyTimes, useTaskComplete, useTaskUncomplete } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { Task, StudyTimeWithActuals } from "@/types/api";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  // Auth 정보 가져오기
  const { user } = useAuth();

  // 선택된 날짜를 기준으로 조회 범위 계산
  const dateRange = useMemo(() => {
    // 현재 구현: 선택된 날짜 당일만 정확히 조회 (타임존 고려)
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);  // 당일 00:00:00
    
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);  // 당일 23:59:59
    
    // 로컬 시간대를 고려한 ISO 문자열 생성
    const formatLocalDateTime = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ms = String(date.getMilliseconds()).padStart(3, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
    };
    
    /* 
    TODO: 나중에 개선할 수 있는 날짜 범위 옵션들
    
    옵션 1: 캐싱을 위한 넓은 범위 조회 (현재 대신 사용하던 방식)
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 7);  // 7일 전
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 7);      // 7일 후
    
    옵션 2: 달력 뷰에 따른 동적 범위
    if (calendarView === 'month') {
      // 해당 월 전체
      startDate.setDate(1);
      endDate.setMonth(endDate.getMonth() + 1, 0);
    } else if (calendarView === 'week') {
      // 해당 주 전체  
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);
      endDate.setDate(startDate.getDate() + 6);
    }
    
    옵션 3: 더 큰 범위로 캐싱 효과 극대화
    startDate.setDate(startDate.getDate() - 30);  // 30일 전
    endDate.setDate(endDate.getDate() + 30);      // 30일 후
    
    옵션 4: 사용자 설정 가능한 범위
    const userPreferredRange = getUserPreference('dateRange') || 7;
    startDate.setDate(startDate.getDate() - userPreferredRange);
    endDate.setDate(endDate.getDate() + userPreferredRange);
    */
    
    return {
      startDate: formatLocalDateTime(startDate),
      endDate: formatLocalDateTime(endDate)
    };
  }, [selectedDate]);

  // API 훅 사용 - 선택된 날짜 기준으로 공부시간 조회
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  
  // Debug: 사용자 ID 로깅
  console.log('Dashboard - User:', user);
  console.log('Dashboard - User ID for API call:', user?.id);
  console.log('Dashboard - Date range:', dateRange);
  
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
    console.log('Study time clicked:', {
      assigned: studyTime.assigned,
      actuals: studyTime.actuals,
      progress: `${studyTime.progressPercent}%`,
      totalMinutes: studyTime.totalConnectedMinutes
    });
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
        
        <CalendarView 
          onSelectDate={handleDateSelect} 
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
