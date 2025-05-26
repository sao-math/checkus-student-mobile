
import { School } from '@/types/api';

export class SchoolService {
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

  async getSchools() {
    return this.request<School[]>('/schools');
  }

  async searchSchools(query: string) {
    return this.request<School[]>(`/schools/search?query=${query}`);
  }
}
