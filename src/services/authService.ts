
import { RegisterData, LoginData, User } from '@/types/api';

export class AuthService {
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

  async register(data: RegisterData) {
    return this.request<{ success: boolean; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginData) {
    return this.request<{ success: boolean; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  }

  async checkUsername(username: string) {
    return this.request<{ available: boolean }>(`/auth/check-username/${username}`);
  }

  async checkPhone(phoneNumber: string) {
    return this.request<{ available: boolean }>(`/auth/check-phone/${phoneNumber}`);
  }
}
