import { useState } from 'react';
import { Task, StudyTimeWithActuals } from '@/types/api';
import { useTaskComplete, useTaskUncomplete } from './useApi';

/**
 * 할일 관리 훅
 * - 할일 모달 상태 관리
 * - 할일 완료/취소 처리
 * - 스터디 타임 클릭 처리
 * 
 * @param tasks - 할일 목록
 * @returns 할일 관리에 필요한 상태와 함수들
 */
export const useTaskManagement = (tasks: Task[]) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const taskCompleteMutation = useTaskComplete();
  const taskUncompleteMutation = useTaskUncomplete();

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

  const handleStudyTimeClick = (studyTime: StudyTimeWithActuals) => {
    // 실제로는 Discord나 다른 스터디 플랫폼으로 연결
    // TODO: Discord 연결 로직 구현
    console.log('Study time clicked:', studyTime);
  };

  const closeModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  return {
    // 상태
    selectedTask,
    isTaskModalOpen,
    
    // 함수
    handleTaskClick,
    handleTaskComplete,
    handleConfirmComplete,
    handleStudyTimeClick,
    closeModal,
    
    // 뮤테이션 상태
    isCompleting: taskCompleteMutation.isPending,
    isUncompleting: taskUncompleteMutation.isPending,
  };
}; 