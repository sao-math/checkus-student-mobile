import React from "react";
import Header from "@/components/header";
import CalendarView from "@/components/ui/calendar-view";
import TaskList from "@/components/ui/task-list";
import TaskModal from "@/components/ui/task-modal";
import { DashboardLoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTaskManagement } from "@/hooks/useTaskManagement";
import { useDateSelection } from "@/hooks/useDateSelection";

const Dashboard = () => {
  // 날짜 선택 관리
  const { selectedDate, calendarView, handleDateSelect, setCalendarView } = useDateSelection();
  
  // 대시보드 데이터 관리
  const { tasks, studyTimes, isLoading } = useDashboardData(selectedDate);
  
  // 할일 관리
  const {
    selectedTask,
    isTaskModalOpen,
    handleTaskClick,
    handleTaskComplete,
    handleConfirmComplete,
    handleStudyTimeClick,
    closeModal,
  } = useTaskManagement(tasks);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DashboardLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">내 학습 일정</h1>
        
        {/* 토큰 관리 디버그 섹션 - Hidden for production */}
        {/* 
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
        */}
        
        <CalendarView 
          onSelectDate={handleDateSelect} 
          selectedDate={selectedDate}
          view={calendarView}
          setView={setCalendarView}
          className="mb-6"
        />
        
        <TaskList 
          date={selectedDate}
          studyTimes={studyTimes}
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskComplete={handleTaskComplete}
          onStudyTimeClick={handleStudyTimeClick}
        />
      </div>

      <TaskModal
        task={selectedTask}
        open={isTaskModalOpen}
        onClose={closeModal}
        onConfirmComplete={handleConfirmComplete}
      />
    </div>
  );
};

export default Dashboard;
