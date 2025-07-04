import { tokenManager } from './tokenManager';
import { authApi } from './authApi';
import {
  LoginRequest,
  LoginResponse,
  StudentRegisterRequest,
  RegisterResponse,
  GuardianRegisterRequest,
  UpdateProfileRequest,
  UserInfo,
  ResponseBase
} from '../types/auth';

/**
 * 인증 관련 고수준 유틸리티 모듈
 * tokenManager와 authApi를 조합하여 완전한 인증 플로우 제공
 */
export const authUtils = {
  /**
   * 로그인 (토큰 자동 저장)
   */
  async login(request: LoginRequest): Promise<ResponseBase<LoginResponse>> {
    const response = await authApi.login(request);
    
    if (response.success && response.data) {
      const { accessToken } = response.data;
      tokenManager.setAccessToken(accessToken);
      console.log('Login successful, access token stored in memory');
    }
    
    return response;
  },

  /**
   * 로그아웃 (토큰 자동 제거)
   */
  async logout(): Promise<ResponseBase<null>> {
    try {
      const response = await authApi.logout();
      return response;
    } finally {
      // API 호출 성공 여부와 관계없이 메모리의 액세스 토큰은 제거
      tokenManager.clearAccessToken();
      console.log('Logout completed, access token cleared from memory');
    }
  },

  /**
   * 토큰 갱신 (자동 저장/제거)
   */
  async refreshToken(): Promise<ResponseBase<{ accessToken: string }>> {
    try {
      const response = await authApi.refreshToken();
      
      if (response.success && response.data) {
        const { accessToken } = response.data;
        tokenManager.setAccessToken(accessToken);
        console.log('Token refresh successful');
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh failed, clearing access token');
      tokenManager.clearAccessToken();
      throw error;
    }
  },

  /**
   * 유효한 토큰 확보 (필요시 자동 갱신)
   */
  async ensureValidToken(): Promise<void> {
    const currentAccessToken = tokenManager.getAccessToken();
    
    if (!currentAccessToken) {
      console.log('No access token in memory, attempting refresh from cookie');
      await this.refreshToken();
      return;
    }
    
    if (tokenManager.isTokenExpired(currentAccessToken)) {
      console.log('Access token expired, refreshing from cookie');
      await this.refreshToken();
      return;
    }
    
    console.log('Access token is valid');
  },

  /**
   * 페이지 로드 시 초기화 (리프레시 토큰으로 액세스 토큰 복구)
   */
  async initializeFromRefreshToken(): Promise<boolean> {
    try {
      console.log('Initializing authentication from refresh token cookie...');
      const response = await this.refreshToken();
      return response.success;
    } catch (error) {
      console.log('Failed to initialize from refresh token:', error);
      return false;
    }
  },

  /**
   * 학생 회원가입
   */
  async registerStudent(request: StudentRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    return authApi.registerStudent(request);
  },

  /**
   * 학부모 회원가입
   */
  async registerGuardian(request: GuardianRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    return authApi.registerGuardian(request);
  },

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<ResponseBase<UserInfo>> {
    return authApi.getCurrentUser();
  },

  /**
   * 사용자명 중복 확인
   */
  async checkUsername(username: string): Promise<ResponseBase<boolean>> {
    return authApi.checkUsername(username);
  },

  /**
   * 전화번호 중복 확인
   */
  async checkPhoneNumber(phoneNumber: string): Promise<ResponseBase<boolean>> {
    return authApi.checkPhoneNumber(phoneNumber);
  },

  /**
   * 사용자 프로필 업데이트
   */
  async updateProfile(request: UpdateProfileRequest): Promise<ResponseBase<UserInfo>> {
    return authApi.updateProfile(request);
  },

  /**
   * 인증 상태 확인
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },

  /**
   * 현재 액세스 토큰 반환
   */
  getAccessToken(): string | null {
    return tokenManager.getAccessToken();
  },

  /**
   * 토큰 디버그 정보 출력
   */
  debugTokenStatus(): void {
    tokenManager.debugTokenStatus();
  }
}; 