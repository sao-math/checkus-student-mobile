
import { GuardianRequest, ConnectedStudent } from '@/types/api';

export class GuardianService {
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

  async sendGuardianRequest(studentId: string) {
    return this.request<{ success: boolean; requestId: string }>('/guardian-connect/request', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });
  }

  async getGuardianRequests() {
    return this.request<GuardianRequest[]>('/guardian-connect/requests');
  }

  async approveGuardianRequest(requestId: string) {
    return this.request<{ success: boolean }>(`/guardian-connect/requests/${requestId}/approve`, {
      method: 'PUT',
    });
  }

  async rejectGuardianRequest(requestId: string) {
    return this.request<{ success: boolean }>(`/guardian-connect/requests/${requestId}/reject`, {
      method: 'PUT',
    });
  }

  async cancelGuardianRequest(requestId: string) {
    return this.request<{ success: boolean }>(`/guardian-connect/requests/${requestId}`, {
      method: 'DELETE',
    });
  }

  async getConnectedStudents() {
    return this.request<ConnectedStudent[]>('/guardian-connect/students');
  }

  async getStudentId() {
    return this.request<{ studentId: string }>('/student/id');
  }
}
