import { useState, useEffect } from 'react';
import { schoolApi, SchoolResponse } from '@/services/schoolApi';

export const useSchools = () => {
  const [schools, setSchools] = useState<SchoolResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async () => {
    console.log('🔍 useSchools: fetchSchools 함수가 호출되었습니다');
    try {
      setIsLoading(true);
      setError(null);
      console.log('📡 useSchools: API 요청을 시작합니다...');
      const schoolData = await schoolApi.getSchools();
      console.log('✅ useSchools: API 요청 성공, 받은 데이터:', schoolData);
      setSchools(schoolData);
    } catch (err) {
      console.error('❌ useSchools: API 요청 실패:', err);
      setError('Failed to load schools. Please try again.');
      // Fallback to empty array if API fails
      setSchools([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('🚀 useSchools: useEffect가 실행되었습니다 (컴포넌트 마운트)');
    fetchSchools();
  }, []);

  console.log('📊 useSchools: 현재 상태 - schools:', schools.length, 'loading:', isLoading, 'error:', error);

  return {
    schools,
    isLoading,
    error,
    refetch: fetchSchools
  };
}; 