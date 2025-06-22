import axiosInstance from '@/lib/axios';
import { School } from '@/types/api';

export interface SchoolResponse {
  id: number;
  name: string;
}

export const schoolApi = {
  /**
   * Fetch all schools from the database
   * @returns Promise<SchoolResponse[]>
   */
  getSchools: async (): Promise<SchoolResponse[]> => {
    console.log('🌐 schoolApi: getSchools 호출됨');
    try {
      console.log('📤 schoolApi: GET /schools 요청 보내는 중...');
      const response = await axiosInstance.get('/schools');
      console.log('📥 schoolApi: 응답 받음:', response);
      console.log('📋 schoolApi: 응답 데이터:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('💥 schoolApi: 요청 실패:', error);
      if (error.response) {
        console.error('📄 schoolApi: 응답 상태:', error.response.status);
        console.error('📄 schoolApi: 응답 데이터:', error.response.data);
      }
      throw error;
    }
  }
}; 