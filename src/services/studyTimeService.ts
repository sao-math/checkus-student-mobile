
import { StudyTimeWithActuals } from '@/types/api';

export class StudyTimeService {
  private mockResponseHandler: any;

  constructor(mockResponseHandler: any) {
    this.mockResponseHandler = mockResponseHandler;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockResponseHandler.getMockResponse(endpoint, options) as T);
      }, 500);
    });
  }

  async getStudyTimes() {
    return this.request<StudyTimeWithActuals[]>('/dashboard/study-times');
  }

  async getCalendar() {
    return this.request<any>('/dashboard/calendar');
  }
}
