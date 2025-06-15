import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  completionRate: number; // 0-100
  hasTask: boolean; // 할일이 있는지 여부
  isFuture: boolean; // 미래 날짜인지 여부
}

interface CalendarViewProps {
  onSelectDate: (date: Date) => void;
  className?: string;
  view: "month" | "week";
  setView: (view: "month" | "week") => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  onSelectDate,
  className,
  view,
  setView,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 날짜별 색상과 텍스트 색상을 결정하는 함수
  const getDayStyle = (day: CalendarDay) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(day.date);
    dayDate.setHours(0, 0, 0, 0);
    
    // 미래 날짜인 경우
    if (dayDate > today) {
      return {
        backgroundColor: '#f3f4f6', // gray-100
        color: '#9ca3af' // gray-400
      };
    }
    
    // 할일이 없는 경우
    if (!day.hasTask) {
      return {
        backgroundColor: '#e5e7eb', // gray-200  
        color: '#6b7280' // gray-500
      };
    }
    
    // 할일이 있는 경우 - 완수율에 따른 그라데이션
    const hue = (day.completionRate / 100) * 120; // 0%: 빨강(0도), 100%: 초록(120도)
    const saturation = 50;
    const lightness = 85;
    
    return {
      backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      color: day.completionRate > 50 ? "#166534" : "#991b1b" // green-800 : red-800
    };
  };

  const generateMockData = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayDate = new Date(date);
    dayDate.setHours(0, 0, 0, 0);
    
    const isFuture = dayDate > today;
    const day = date.getDate();
    
    // Mock 로직: 날짜에 따라 할일 유무와 완수율 결정
    const hasTask = day % 4 !== 0; // 4의 배수 날짜는 할일 없음
    const completionRate = hasTask ? (day * 3) % 100 : 0;
    
    return { hasTask, completionRate, isFuture };
  };

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
      const mockData = generateMockData(date);
      days.push({
        date,
        isCurrentMonth: false,
        ...mockData,
      });
    }
    
    // Get days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const mockData = generateMockData(date);
      days.push({
        date,
        isCurrentMonth: true,
        ...mockData,
      });
    }
    
    // Get days from next month to fill the last week
    const lastDayOfWeek = new Date(year, month, daysInMonth).getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const date = new Date(year, month + 1, i);
      const mockData = generateMockData(date);
      days.push({
        date,
        isCurrentMonth: false,
        ...mockData,
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
      const mockData = generateMockData(date);
      days.push({
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        ...mockData,
      });
    }
    
    return days;
  };

  const days = view === "month" ? generateDays() : generateWeekDays();
  
  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onSelectDate(day.date);
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

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
            return (
              <div 
                key={index} 
                className={cn(
                  "calendar-day", 
                  !day.isCurrentMonth && "text-gray-400",
                  isSelected && "!bg-primary !text-white border-2 border-primary"
                )}
                style={!isSelected ? getDayStyle(day) : undefined}
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
          {days.map((day, index) => (
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
                  selectedDate.toDateString() === day.date.toDateString() && "!bg-primary !text-white border-2 border-primary"
                )}
                style={selectedDate.toDateString() !== day.date.toDateString() ? getDayStyle(day) : undefined}
                onClick={() => handleDateClick(day)}
              >
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 색상 범례 */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: '#f3f4f6' }}
            />
            <span className="text-gray-600">미래</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: '#e5e7eb' }}
            />
            <span className="text-gray-600">할일 없음</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: 'hsl(0, 50%, 85%)' }}
            />
            <span className="text-gray-600">미완수</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: 'hsl(60, 50%, 85%)' }}
            />
            <span className="text-gray-600">일부완수</span>
          </div>
          <div className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: 'hsl(120, 50%, 85%)' }}
            />
            <span className="text-gray-600">완수</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
