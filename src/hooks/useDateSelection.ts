import { useState } from 'react';

/**
 * 날짜 선택 관리 훅
 * - 선택된 날짜 상태 관리
 * - 캘린더 뷰 상태 관리
 * 
 * @param initialDate - 초기 날짜 (기본값: 오늘)
 * @returns 날짜 선택에 필요한 상태와 함수들
 */
export const useDateSelection = (initialDate: Date = new Date()) => {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (view: "month" | "week") => {
    setCalendarView(view);
  };

  return {
    // 상태
    selectedDate,
    calendarView,
    
    // 함수
    handleDateSelect,
    handleViewChange,
    setSelectedDate,
    setCalendarView,
  };
}; 