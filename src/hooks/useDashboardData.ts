import { useMemo } from 'react';
import { useTasks, useStudyTimes } from './useApi';
import { useAuth } from '@/contexts/AuthContext';
import { formatLocalDateTimeToUtc } from '@/utils/dateUtils';

/**
 * 대시보드 데이터 관리 훅
 * - API 호출 통합
 * - 데이터 필터링
 * - 로딩 상태 관리
 * 
 * @param selectedDate - 선택된 날짜
 * @returns 대시보드에 필요한 모든 데이터와 상태
 */
export const useDashboardData = (selectedDate: Date) => {
  const { user } = useAuth();

  // 선택된 날짜를 기준으로 조회 범위 계산
  const dateRange = useMemo(() => {
    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);
    
    return {
      startDate: formatLocalDateTimeToUtc(startDate),
      endDate: formatLocalDateTimeToUtc(endDate)
    };
  }, [selectedDate]);

  // API 호출
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: studyTimes = [], isLoading: studyTimesLoading } = useStudyTimes(
    user?.id, 
    dateRange.startDate, 
    dateRange.endDate
  );

  // 로컬 날짜 형식으로 비교하는 헬퍼 함수
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 선택된 날짜에 해당하는 데이터 필터링
  const filteredTasks = useMemo(() => {
    const selectedDateStr = formatLocalDate(selectedDate);
    return tasks.filter(task => task.dueDate === selectedDateStr);
  }, [tasks, selectedDate]);

  const filteredStudyTimes = studyTimes; // API가 이미 선택된 날짜만 반환

  return {
    // 데이터
    tasks: filteredTasks,
    studyTimes: filteredStudyTimes,
    
    // 상태
    isLoading: tasksLoading || studyTimesLoading,
    
    // 메타데이터
    dateRange,
    selectedDateStr: formatLocalDate(selectedDate),
  };
}; 