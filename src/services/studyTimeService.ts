import axiosInstance from '../lib/axios';
import { StudyTimeWithActuals, AssignedStudyTime, ActualStudyTime, Activity, ResponseBase, TimelineSegment } from '@/types/api';

/**
 * 리팩토링된 공부시간 서비스
 * 불필요한 메서드 제거 및 핵심 기능에 집중
 */
export class StudyTimeService {
  
  /**
   * 학생의 배정된 공부 시간 조회
   */
  async getAssignedStudyTimes(studentId: number, startDate: string, endDate: string): Promise<ResponseBase<AssignedStudyTime[]>> {
    const response = await axiosInstance.get<ResponseBase<AssignedStudyTime[]>>(
      `/study-time/assigned/student/${studentId}`,
      {
        params: { startDate, endDate }
      }
    );
    return response.data;
  }

  /**
   * 학생의 실제 공부 시간 조회
   */
  async getActualStudyTimes(studentId: number, startDate: string, endDate: string): Promise<ResponseBase<ActualStudyTime[]>> {
    try {
      const response = await axiosInstance.get<ResponseBase<ActualStudyTime[]>>(
        `/study-time/actual/student/${studentId}`,
        {
          params: { startDate, endDate }
        }
      );
      
      console.log('실제 공부 시간 API 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('실제 공부 시간 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 타임라인 계산 (private 헬퍼 메서드)
   */
  private calculateTimeline(assigned: AssignedStudyTime, actuals: ActualStudyTime[]): TimelineSegment[] {
    const assignedStart = new Date(assigned.startTime).getTime();
    const assignedEnd = new Date(assigned.endTime).getTime();
    const totalDuration = assignedEnd - assignedStart;
    
    // 실제 공부 시간 세그먼트 계산
    const timeline: TimelineSegment[] = actuals
      .filter(actual => actual.endTime) // 진행 중인 세션 제외
      .map(actual => {
        const actualStart = new Date(actual.startTime).getTime();
        const actualEnd = new Date(actual.endTime!).getTime();
        
        const clampedStart = Math.max(actualStart, assignedStart);
        const clampedEnd = Math.min(actualEnd, assignedEnd);
        
        if (clampedStart < clampedEnd) {
          const startPercent = ((clampedStart - assignedStart) / totalDuration) * 100;
          const endPercent = ((clampedEnd - assignedStart) / totalDuration) * 100;
          
          return {
            start: Math.round(startPercent),
            end: Math.round(endPercent),
            status: "connected" as const,
            source: actual.source
          };
        }
        return null;
      })
      .filter(Boolean) as TimelineSegment[];
    
    // 연결되지 않은 구간 추가
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

  /**
   * 실제 연결 시간 계산 (private 헬퍼 메서드)
   */
  private calculateConnectedMinutes(actuals: ActualStudyTime[]): number {
    return actuals.reduce((total, actual) => {
      if (!actual.endTime) {
        console.log('진행 중인 세션 건너뜀:', actual);
        return total;
      }
      
      const duration = new Date(actual.endTime).getTime() - new Date(actual.startTime).getTime();
      const minutes = Math.round(duration / (1000 * 60));
      console.log('실제 접속 시간 계산:', { actual, duration, minutes });
      return total + minutes;
    }, 0);
  }

  /**
   * 배정된 공부 시간과 실제 공부 시간을 결합하여 UI용 데이터 생성
   * (핵심 메서드 - 실제로 useApi.ts에서 사용됨)
   */
  async getStudyTimes(studentId: number, startDate?: string, endDate?: string): Promise<StudyTimeWithActuals[]> {
    // 기본값: 현재 날짜 기준 7일 전후
    const today = new Date();
    const defaultStartDate = startDate || new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const defaultEndDate = endDate || new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    console.log('공부 시간 조회 시작:', { studentId, startDate: defaultStartDate, endDate: defaultEndDate });

    try {
      const [assignedResponse, actualResponse] = await Promise.all([
        this.getAssignedStudyTimes(studentId, defaultStartDate, defaultEndDate),
        this.getActualStudyTimes(studentId, defaultStartDate, defaultEndDate)
      ]);

      if (!assignedResponse.success || !actualResponse.success) {
        console.error('API 응답 실패:', { assignedResponse, actualResponse });
        throw new Error('Failed to fetch study times');
      }

      const assignedStudyTimes = assignedResponse.data || [];
      const actualStudyTimes = actualResponse.data || [];

      console.log('API 데이터 수신:', { 
        assignedCount: assignedStudyTimes.length, 
        actualCount: actualStudyTimes.length
      });

      // 배정된 시간별로 실제 시간 매핑
      return assignedStudyTimes.map(assigned => {
        const actuals = actualStudyTimes.filter(actual => actual.assignedStudyTimeId === assigned.id);
        
        const totalConnectedMinutes = this.calculateConnectedMinutes(actuals);
        
        const assignedDuration = new Date(assigned.endTime).getTime() - new Date(assigned.startTime).getTime();
        const assignedMinutes = Math.round(assignedDuration / (1000 * 60));
        
        const progressPercent = assignedMinutes > 0 ? Math.round((totalConnectedMinutes / assignedMinutes) * 100) : 0;
        
        console.log('진행률 계산:', {
          assignedId: assigned.id,
          totalConnectedMinutes,
          assignedMinutes,
          progressPercent,
          actualsCount: actuals.length
        });
        
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
    } catch (error) {
      console.error('공부 시간 조회 중 오류:', error);
      throw error;
    }
  }

  async getCalendar() {
    // TODO: Implement calendar events if needed
    return { events: [] };
  }
}
