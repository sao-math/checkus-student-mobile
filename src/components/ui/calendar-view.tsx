import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
  className?: string;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onSelectDate,
  selectedDate,
  className,
  view,
  setView,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 오늘 날짜를 한 번만 계산
  const today = new Date();
  const todayString = today.toDateString();

  // Generate days for the current month
  const generateDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Get days from previous month to fill the first week
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({
        date,
        isCurrentMonth: false,
      });
    }
    
    // Get days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
      });
    }
    
    // Get days from next month to fill the last week
    const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  // Generate days for the current week
  const generateWeekDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const weekStart = new Date(currentDate);
    const day = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - day);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      });
    }
    
    return days;
  };

  const days = useMemo(() => {
    return view === "month" ? generateDays() : generateWeekDays();
  }, [view, currentDate]);
  
  const handleDateClick = useCallback((day: CalendarDay) => {
    onSelectDate(day.date);
    
    // 다른 달의 날짜를 클릭한 경우, currentDate도 해당 월로 업데이트
    if (!day.isCurrentMonth) {
      setCurrentDate(new Date(day.date.getFullYear(), day.date.getMonth(), 1));
    }
  }, [onSelectDate]);

  const handlePrevious = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  }, [view]);

  const handleNext = useCallback(() => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth(), 1);
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  }, [view]);

  // 오늘로 이동하는 핸들러
  const handleGoToday = useCallback(() => {
    const today = new Date();
    onSelectDate(today);
    
    if (view === "month") {
      // 월 뷰: 해당 월의 1일로 설정
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    } else {
      // 주 뷰: 오늘이 포함된 주의 시작일(일요일)로 설정
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      setCurrentDate(weekStart);
    }
  }, [onSelectDate, view]);

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("ko-KR", { year: 'numeric', month: 'long' });
  };

  const formatWeek = (date: Date) => {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    weekStart.setDate(weekStart.getDate() - day);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return `${weekStart.toLocaleDateString("ko-KR", { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString("ko-KR", { month: 'short', day: 'numeric' })}`;
  };

  // selectedDate가 변경될 때 currentDate 동기화
  useEffect(() => {
    // 선택된 날짜의 월이 현재 표시하는 월과 다르면 달력을 해당 월로 이동
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    setCurrentDate(prevDate => {
      if (selectedMonth !== prevDate.getMonth() || selectedYear !== prevDate.getFullYear()) {
        return new Date(selectedYear, selectedMonth, 1);
      }
      return prevDate;
    });
  }, [selectedDate]); // currentDate 의존성 제거

  return (
    <div className={cn("calendar-container", className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={cn(view === "month" ? "bg-primary text-primary-foreground" : "")}
            onClick={() => setView("month")}
          >
            월
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={cn(view === "week" ? "bg-primary text-primary-foreground" : "")}
            onClick={() => setView("week")}
          >
            주
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGoToday}
          >
            오늘
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {view === "month" ? formatMonthYear(currentDate) : formatWeek(currentDate)}
          </span>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-7 gap-1 text-center">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="text-xs font-medium text-gray-500 py-1">{day}</div>
          ))}
          {days.map((day, index) => {
            const isSelected = selectedDate.toDateString() === day.date.toDateString();
            const isToday = todayString === day.date.toDateString();
            return (
              <div 
                key={index} 
                className={cn(
                  "calendar-day", 
                  "bg-white hover:bg-gray-50",
                  !day.isCurrentMonth && "text-gray-400",
                  isToday && "ring-2 ring-primary/20",
                  isSelected && "!bg-primary !text-white border-2 border-primary"
                )}
                onClick={() => handleDateClick(day)}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      )}

      {view === "week" && (
        <div className="flex justify-between">
          {days.map((day, index) => {
            const isSelected = selectedDate.toDateString() === day.date.toDateString();
            const isToday = todayString === day.date.toDateString();
            return (
              <div 
                key={index}
                className="flex flex-col items-center"
              >
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {["일", "월", "화", "수", "목", "금", "토"][day.date.getDay()]}
                </div>
                <div 
                  className={cn(
                    "calendar-day", 
                    "bg-white hover:bg-gray-50",
                    isToday && "ring-2 ring-primary/20",
                    isSelected && "!bg-primary !text-white border-2 border-primary"
                  )}
                  onClick={() => handleDateClick(day)}
                >
                  {day.date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* 개발 중 안내 */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            📅 할일 관리 기능은 현재 개발 중입니다
          </p>
          <p className="text-xs text-gray-400 mt-1">
            곧 완수율에 따른 색상 표시 기능이 추가될 예정입니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
