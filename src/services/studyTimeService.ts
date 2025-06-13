import axiosInstance from '../lib/axios';
import { StudyTimeWithActuals, AssignedStudyTime, ActualStudyTime, Activity, ResponseBase, TimelineSegment } from '@/types/api';

export class StudyTimeService {
  
  // 학생의 배정된 공부 시간 조회
  async getAssignedStudyTimes(studentId: number, startDate: string, endDate: string): Promise<ResponseBase<AssignedStudyTime[]>> {
    const response = await axiosInstance.get<ResponseBase<AssignedStudyTime[]>>(
      `/study-time/assigned/student/${studentId}`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
    return response.data;
  }

  // 학생의 실제 공부 시간 조회
  async getActualStudyTimes(studentId: number, startDate: string, endDate: string): Promise<ResponseBase<ActualStudyTime[]>> {
    const response = await axiosInstance.get<ResponseBase<ActualStudyTime[]>>(
      `/study-time/actual/student/${studentId}`,
      {
        params: {
          startDate,
          endDate
        }
      }
    );
    return response.data;
  }

  // 공부 배정 가능한 활동 목록 조회
  async getStudyAssignableActivities(): Promise<ResponseBase<Activity[]>> {
    const response = await axiosInstance.get<ResponseBase<Activity[]>>('/study-time/activities');
    return response.data;
  }

  // 곧 시작할 공부 시간 조회 (선택적)
  async getUpcomingStudyTimes(): Promise<ResponseBase<AssignedStudyTime[]>> {
    const response = await axiosInstance.get<ResponseBase<AssignedStudyTime[]>>('/study-time/upcoming');
    return response.data;
  }

  // 타임라인 계산 헬퍼 함수
  private calculateTimeline(assigned: AssignedStudyTime, actuals: ActualStudyTime[]): TimelineSegment[] {
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
  }

  // 배정된 공부 시간과 실제 공부 시간을 결합하여 UI용 데이터 생성
  async getStudyTimes(studentId: number, startDate?: string, endDate?: string): Promise<StudyTimeWithActuals[]> {
    // 기본값: 현재 날짜 기준 7일 전후
    const today = new Date();
    const defaultStartDate = startDate || new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const [assignedResponse, actualResponse] = await Promise.all([
      this.getAssignedStudyTimes(studentId, defaultStartDate, defaultEndDate),
      this.getActualStudyTimes(studentId, defaultStartDate, defaultEndDate)
    ]);

    if (!assignedResponse.success || !actualResponse.success) {
      throw new Error('Failed to fetch study times');
    }

    const assignedStudyTimes = assignedResponse.data || [];
    const actualStudyTimes = actualResponse.data || [];

    return assignedStudyTimes.map(assigned => {
      const actuals = actualStudyTimes.filter(actual => actual.assignedStudyTimeId === assigned.id);
      
      const totalConnectedMinutes = actuals.reduce((total, actual) => {
        const duration = new Date(actual.endTime).getTime() - new Date(actual.startTime).getTime();
        return total + Math.round(duration / (1000 * 60));
      }, 0);
      
      const assignedDuration = new Date(assigned.endTime).getTime() - new Date(assigned.startTime).getTime();
      const assignedMinutes = Math.round(assignedDuration / (1000 * 60));
      
      const progressPercent = assignedMinutes > 0 ? Math.round((totalConnectedMinutes / assignedMinutes) * 100) : 0;
      
      const now = new Date().getTime();
      const isActive = now >= new Date(assigned.startTime).getTime() && now <= new Date(assigned.endTime).getTime();
      
      const timeline = this.calculateTimeline(assigned, actuals);
      
      return {
        assigned,
        actuals,
        totalConnectedMinutes,
        progressPercent: Math.min(progressPercent, 100),
        timeline,
        isActive
      };
    });
  }

  async getCalendar() {
    // TODO: Implement calendar events if needed
    return { events: [] };
  }
}
