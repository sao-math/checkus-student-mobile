import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// List of endpoints that do NOT require authentication
const PUBLIC_ENDPOINTS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/register/student',
  '/auth/register/parent',
  '/auth/check-username',
  '/auth/check-phone',
  '/schools', // Allow public access to school list
];

console.log('🌐 axios: API_URL 설정됨:', API_URL);
console.log('🔓 axios: PUBLIC_ENDPOINTS:', PUBLIC_ENDPOINTS);

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 전송을 위해 필요
});

// Import auth service with dynamic import to avoid circular dependency
let authService: any = null;
const getAuthService = async () => {
  if (!authService) {
    const { default: auth } = await import('../services/auth');
    authService = auth;
  }
  return authService;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log('📤 axios request interceptor: 요청 설정:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    
    // Skip token check for public endpoints
    if (config.url && PUBLIC_ENDPOINTS.some(url => config.url.startsWith(url))) {
      console.log('🔓 axios: 공개 엔드포인트로 인증 건너뜀:', config.url);
      return config;
    }
    
    console.log('🔒 axios: 인증이 필요한 엔드포인트, 토큰 확인 중...');
    
    try {
      // Get access token from memory via auth service
      const auth = await getAuthService();
      const token = auth.getAccessToken();
      
      if (token) {
        console.log('✅ axios: 토큰 발견, Authorization 헤더 추가');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('⚠️ axios: 메모리에 액세스 토큰이 없음');
      }
    } catch (error) {
      console.error('❌ axios request interceptor: 에러:', error);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ axios request interceptor: 에러:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 axios response interceptor: 응답 성공:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('📥 axios response interceptor: 응답 에러:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const originalRequest = error.config;

    // Don't retry login, refresh, or public endpoints
    if (originalRequest.url === '/auth/login' || 
        originalRequest.url === '/auth/refresh' ||
        PUBLIC_ENDPOINTS.some(url => originalRequest.url.startsWith(url))) {
      console.log('🚫 axios: 재시도하지 않는 엔드포인트:', originalRequest.url);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 axios: 401 에러, 쿠키를 사용한 토큰 갱신 시도');
      originalRequest._retry = true;
      
      try {
        console.log('🔄 axios: 토큰 갱신 시도 중...');
        
        // Try to refresh token using cookie-based refresh
        const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {}, {
          withCredentials: true // 쿠키의 리프레시 토큰 사용
        });
        
        const { accessToken: newAccessToken } = refreshResponse.data.data;
        
        // Update access token in memory via auth service
        const auth = await getAuthService();
        auth.setAccessToken(newAccessToken);
        
        console.log('✅ axios: 토큰 갱신 성공, 원래 요청 재시도');
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ axios: 토큰 갱신 실패, 로그인 페이지로 이동');
        
        // Clear access token from memory
        const auth = await getAuthService();
        auth.clearAccessToken();
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 