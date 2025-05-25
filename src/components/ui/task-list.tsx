
import React from "react";
import { Clock, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Progress, TimelineSegment } from "@/components/ui/progress";

export interface Task {
  id: string;
  title: string;
  description: string;
  teacher: string;
  resourceType: "link" | "video";
  resourceUrl?: string;
  videoWatchTime?: number;
  isCompleted: boolean;
  dueTime?: string;
}

export interface StudyTime {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  progressPercent: number;
  // New field for timeline visualization
  timeline?: TimelineSegment[];
  // New field to show total connected time in minutes
  totalConnectedMinutes?: number;
}

interface TaskListProps {
  date: Date;
  studyTimes: StudyTime[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskComplete: (taskId: string, isCompleted: boolean) => void;
  onStudyTimeClick: (studyTime: StudyTime) => void;
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
            {studyTimes.map((time) => (
              <div 
                key={time.id}
                className={cn(
                  "p-3 bg-white rounded-lg border shadow-sm cursor-pointer hover:bg-gray-50",
                  time.isActive && "border-primary"
                )}
                onClick={() => onStudyTimeClick(time)}
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">{time.subject}</div>
                  <div className="text-sm text-gray-600">
                    {time.startTime} - {time.endTime}
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
                    {time.totalConnectedMinutes !== undefined && (
                      <span className="text-primary font-medium">총 {time.totalConnectedMinutes}분 접속</span>
                    )}
                  </div>
                  
                  {time.timeline ? (
                    <Progress segments={time.timeline} className="h-2" />
                  ) : (
                    <Progress value={time.progressPercent} className="h-2" />
                  )}
                  
                  {time.timeline && (
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{time.startTime}</span>
                      <span>{time.endTime}</span>
                    </div>
                  )}
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
                  task.isCompleted ? "task-complete" : ""
                )}
              >
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="font-medium">{task.title}</div>
                  {task.dueTime && (
                    <div className="text-xs text-gray-500">{task.dueTime}까지</div>
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
