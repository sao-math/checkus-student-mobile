
import { User } from '@/types/api';

export class UserService {
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

  async getUserProfile() {
    return this.request<User>('/user/profile');
  }

  async updateUserProfile(data: Partial<User>) {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}
