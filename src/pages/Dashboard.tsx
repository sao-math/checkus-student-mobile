
import React, { useState } from "react";
import Header from "@/components/header";
import CalendarView from "@/components/ui/calendar-view";
import TaskList from "@/components/ui/task-list";
import TaskModal from "@/components/ui/task-modal";
import { useTasks, useStudyTimes, useTaskComplete, useTaskUncomplete } from "@/hooks/useApi";
import { Task, StudyTimeWithActuals } from "@/types/api";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  // API 훅 사용 - 새로운 타입 적용
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: studyTimes = [], isLoading: studyTimesLoading } = useStudyTimes();
  const taskCompleteMutation = useTaskComplete();
  const taskUncompleteMutation = useTaskUncomplete();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

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
        onClose={() => setIsTaskModalOpen(false)}
        onConfirmComplete={handleConfirmComplete}
      />
    </div>
  );
};

export default Dashboard;
