
export class FileService {
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

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.request<{ url: string; success: boolean }>('/files/upload', {
      method: 'POST',
      body: formData,
    });
  }
}
