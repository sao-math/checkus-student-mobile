import { Activity, AssignedStudyTime, ActualStudyTime, StudyTimeWithActuals, TimelineSegment } from '@/types/api';

export const mockActivities: Activity[] = [
  {
    id: 1,
    name: "수학 문제 풀이",
    isStudyAssignable: true
  },
  {
    id: 2,
    name: "영어 단어 암기",
    isStudyAssignable: true
  }
];

export const mockAssignedStudyTimes: AssignedStudyTime[] = [
  {
    id: 1,
    studentId: 123,
    title: "수학 공부",
    activityId: 1,
    activityName: "수학 문제 풀이",
    startTime: "2025-05-25T09:00:00Z",
    endTime: "2025-05-25T10:30:00Z",
    assignedBy: 1,
    assignedByName: "김선생",
    activity: mockActivities[0]
  },
  {
    id: 2, 
    studentId: 123,
    title: "영어 학습",
    activityId: 2,
    activityName: "영어 단어 암기",
    startTime: "2025-05-25T11:00:00Z",
    endTime: "2025-05-25T12:30:00Z",
    assignedBy: 2,
    assignedByName: "이선생",
    activity: mockActivities[1]
  }
];

export const mockActualStudyTimes: ActualStudyTime[] = [
  {
    id: 1,
    studentId: 123, 
    assignedStudyTimeId: 1,
    startTime: "2025-05-25T09:05:00Z",
    endTime: "2025-05-25T09:20:00Z",
    source: "discord"
  },
  {
    id: 2,
    studentId: 123,
    assignedStudyTimeId: 1, 
    startTime: "2025-05-25T09:25:00Z",
    endTime: "2025-05-25T09:45:00Z",
    source: "discord"
  },
  {
    id: 3,
    studentId: 123,
    assignedStudyTimeId: 2,
    startTime: "2025-05-25T11:10:00Z", 
    endTime: "2025-05-25T12:15:00Z",
    source: "zoom"
  }
];

const calculateTimeline = (assigned: AssignedStudyTime, actuals: ActualStudyTime[]): TimelineSegment[] => {
  const assignedStart = new Date(assigned.startTime).getTime();
  const assignedEnd = new Date(assigned.endTime).getTime();
  const totalDuration = assignedEnd - assignedStart;
  
  const timeline: TimelineSegment[] = [];
  
  actuals.forEach(actual => {
    const actualStart = new Date(actual.startTime).getTime();
    const actualEnd = new Date(actual.endTime).getTime();
    
    const clampedStart = Math.max(actualStart, assignedStart);
    const clampedEnd = Math.min(actualEnd, assignedEnd);
    
    if (clampedStart < clampedEnd) {
      const startPercent = ((clampedStart - assignedStart) / totalDuration) * 100;
      const endPercent = ((clampedEnd - assignedStart) / totalDuration) * 100;
      
      timeline.push({
        start: Math.round(startPercent),
        end: Math.round(endPercent),
        status: "connected",
        source: actual.source
      });
    }
  });
  
  timeline.sort((a, b) => a.start - b.start);
  
  const fullTimeline: TimelineSegment[] = [];
  let currentPos = 0;
  
  timeline.forEach(segment => {
    if (currentPos < segment.start) {
      fullTimeline.push({
        start: currentPos,
        end: segment.start,
        status: "not-connected"
      });
    }
    fullTimeline.push(segment);
    currentPos = segment.end;
  });
  
  if (currentPos < 100) {
    fullTimeline.push({
      start: currentPos,
      end: 100,
      status: "not-connected"
    });
  }
  
  return fullTimeline;
};

export const generateStudyTimesWithActuals = (): StudyTimeWithActuals[] => {
  return mockAssignedStudyTimes.map(assigned => {
    const actuals = mockActualStudyTimes.filter(actual => actual.assignedStudyTimeId === assigned.id);
    
    const totalConnectedMinutes = actuals.reduce((total, actual) => {
      const duration = new Date(actual.endTime).getTime() - new Date(actual.startTime).getTime();
      return total + Math.round(duration / (1000 * 60));
    }, 0);
    
    const assignedDuration = new Date(assigned.endTime).getTime() - new Date(assigned.startTime).getTime();
    const assignedMinutes = Math.round(assignedDuration / (1000 * 60));
    
    const progressPercent = assignedMinutes > 0 ? Math.round((totalConnectedMinutes / assignedMinutes) * 100) : 0;
    
    const now = new Date().getTime();
    const isActive = now >= new Date(assigned.startTime).getTime() && now <= new Date(assigned.endTime).getTime();
    
    const timeline = calculateTimeline(assigned, actuals);
    
    return {
      assigned,
      actuals,
      totalConnectedMinutes,
      progressPercent: Math.min(progressPercent, 100),
      timeline,
      isActive
    };
  });
};
