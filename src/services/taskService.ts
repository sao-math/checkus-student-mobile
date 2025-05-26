
import { Task } from '@/types/api';

export class TaskService {
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

  async getTasks() {
    return this.request<Task[]>('/dashboard/tasks');
  }

  async completeTask(id: string, photoFile?: File) {
    const formData = new FormData();
    if (photoFile) {
      formData.append('photo', photoFile);
    }
    return this.request<{ success: boolean }>(`/tasks/${id}/complete`, {
      method: 'PUT',
      body: photoFile ? formData : undefined,
    });
  }

  async uncompleteTask(id: string) {
    return this.request<{ success: boolean }>(`/tasks/${id}/uncomplete`, {
      method: 'PUT',
    });
  }
}
