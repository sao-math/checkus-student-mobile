import React, { useState } from "react";
import Header from "@/components/header";
import CalendarView from "@/components/ui/calendar-view";
import TaskList, { Task, StudyTime } from "@/components/ui/task-list";
import TaskModal from "@/components/ui/task-modal";
import { useToast } from "@/components/ui/use-toast";
import { TimelineSegment } from "@/components/ui/progress";

// Mock data - in a real app, this would come from an API based on the schema
const mockTasks: Task[] = [
  {
    id: "1",
    title: "수학 숙제 완료하기",
    description: "교과서 37-38페이지 연습문제 풀기",
    teacher: "김선생님",
    resourceType: "link",
    resourceUrl: "https://example.com/math",
    isCompleted: false,
    dueTime: "오후 6:00",
  },
  {
    id: "2",
    title: "영어 단어 시험 준비",
    description: "Unit 5-6 단어 암기하기",
    teacher: "이선생님",
    resourceType: "link",
    resourceUrl: "https://example.com/english",
    isCompleted: false,
    dueTime: "오후 8:00",
  },
  {
    id: "3",
    title: "과학 실험 보고서",
    description: "물의 상태 변화 실험 결과 정리",
    teacher: "박선생님",
    resourceType: "video",
    resourceUrl: "https://example.com/science-video",
    videoWatchTime: 15,
    isCompleted: true,
  },
];

// Sample timeline segments for each study time (5-minute intervals)
const generateMockTimelineSegments = (active: boolean): TimelineSegment[] => {
  const segments: TimelineSegment[] = [];
  
  // Create 12 segments (60 minutes total, 5 minutes per segment)
  for (let i = 0; i < 12; i++) {
    // Determine segment status - just connected or not-connected
    const status = active && (i % 3 === 0 || i > 8) ? "connected" : "not-connected";
    
    segments.push({
      start: i * (100 / 12),
      end: (i + 1) * (100 / 12),
      status: status
    });
  }
  
  return segments;
};

// Calculate total connected minutes based on timeline segments
const calculateConnectedMinutes = (segments: TimelineSegment[]): number => {
  // Each segment represents 5 minutes
  const minutesPerSegment = 5;
  
  // Count connected segments
  return segments.filter(segment => segment.status === "connected").length * minutesPerSegment;
};

const mockStudyTimes: StudyTime[] = [
  {
    id: "1",
    subject: "수학",
    startTime: "오전 9:00",
    endTime: "오전 10:30",
    isActive: false,
    progressPercent: 0,
    timeline: generateMockTimelineSegments(false),
    totalConnectedMinutes: 0
  },
  {
    id: "2",
    subject: "영어",
    startTime: "오전 11:00",
    endTime: "오후 12:30",
    isActive: true,
    progressPercent: 75,
    timeline: generateMockTimelineSegments(true),
    totalConnectedMinutes: 25 // 5 segments * 5 minutes
  },
  {
    id: "3",
    subject: "과학",
    startTime: "오후 2:00",
    endTime: "오후 3:30",
    isActive: false,
    progressPercent: 0,
    timeline: generateMockTimelineSegments(false),
    totalConnectedMinutes: 0
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskComplete = (taskId: string, isCompleted: boolean) => {
    if (isCompleted) {
      handleTaskClick(tasks.find(task => task.id === taskId)!);
    } else {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, isCompleted: false } : task
        )
      );
      toast({
        title: "할일 상태 변경됨",
        description: "할일이 미완료로 변경되었습니다.",
      });
    }
  };

  const handleConfirmComplete = (taskId: string, photoFile?: File) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, isCompleted: true } : task
      )
    );
    
    toast({
      title: "할일 완료!",
      description: "인증 사진이 업로드되었습니다.",
    });
  };

  const handleStudyTimeClick = (studyTime: StudyTime) => {
    // In a real app, this would open Discord or another study platform
    toast({
      title: "스터디룸 연결",
      description: `${studyTime.subject} 스터디룸에 연결합니다.`,
    });
  };

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
          studyTimes={mockStudyTimes}
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
