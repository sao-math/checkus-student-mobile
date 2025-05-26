import React from "react";
import { Clock, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Task, StudyTimeWithActuals } from "@/types/api";

interface TaskListProps {
  date: Date;
  studyTimes: StudyTimeWithActuals[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (taskId: string, isCompleted: boolean) => void;
  onStudyTimeClick: (studyTime: StudyTimeWithActuals) => void;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  date,
  studyTimes,
  tasks,
  onTaskClick,
  onTaskComplete,
  onStudyTimeClick,
  className,
}) => {
  const formattedDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // 시간 포맷팅 함수
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-lg font-medium">{formattedDate}</div>

      {/* Study Times Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-secondary" />
          <h3 className="font-medium text-secondary">공부 시간</h3>
        </div>
        
        {studyTimes.length > 0 ? (
          <div className="space-y-2">
            {studyTimes.map((studyTime) => (
              <div 
                key={studyTime.assigned.id}
                className={cn(
                  "p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50",
                  studyTime.isActive && "border-primary"
                )}
                onClick={() => onStudyTimeClick(studyTime)}
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-medium">{studyTime.assigned.activity?.name || "공부 시간"}</div>
                  </div>
                  <div className="text-sm text-gray-600 text-right">
                    <div>{formatTime(studyTime.assigned.startTime)} - {formatTime(studyTime.assigned.endTime)}</div>
                    {studyTime.isActive && (
                      <div className="text-xs text-primary font-medium">진행 중</div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <div className="flex gap-3">
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-primary inline-block rounded-full mr-1"></span>
                        접속
                      </span>
                      <span className="flex items-center">
                        <span className="h-2 w-2 bg-gray-300 inline-block rounded-full mr-1"></span>
                        미접속
                      </span>
                    </div>
                    <span className="text-primary font-medium">
                      총 {studyTime.totalConnectedMinutes}분 접속 ({studyTime.progressPercent}%)
                    </span>
                  </div>
                  
                  <Progress segments={studyTime.timeline} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatTime(studyTime.assigned.startTime)}</span>
                    <span>{formatTime(studyTime.assigned.endTime)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
            등록된 공부 시간이 없습니다
          </div>
        )}
      </div>

      <Separator />

      {/* Tasks Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Book className="h-4 w-4 text-secondary" />
          <h3 className="font-medium text-secondary">할일 목록</h3>
        </div>
        
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className={cn(
                  "p-3 bg-white rounded-lg border shadow-sm flex justify-between items-center",
                  task.isCompleted ? "bg-green-50 border-green-200" : ""
                )}
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <div className={cn(
                    "font-medium",
                    task.isCompleted && "line-through text-gray-500"
                  )}>
                    {task.title}
                  </div>
                  {task.dueTime && (
                    <div className={cn(
                      "text-xs",
                      task.isCompleted ? "text-gray-400" : "text-gray-500"
                    )}>
                      {task.dueTime}까지
                    </div>
                  )}
                  {task.isCompleted && (
                    <div className="text-xs text-green-600 mt-1">
                      ✓ 완료됨
                    </div>
                  )}
                </div>
                <Checkbox 
                  checked={task.isCompleted} 
                  onCheckedChange={(checked) => onTaskComplete(task.id, !!checked)}
                  className="h-5 w-5"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 text-gray-500 bg-gray-50 rounded-lg">
            할일이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
