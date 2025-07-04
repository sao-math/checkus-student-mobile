import { authUtils } from './authUtils';
import { tokenManager } from './tokenManager';
import {
  LoginRequest,
  LoginResponse,
  StudentRegisterRequest,
  RegisterResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  LogoutRequest,
  UserInfoResponse,
  ResponseBase,
  UserInfo,
  GuardianRegisterRequest,
  UpdateProfileRequest
} from '../types/auth';

/**
 * 리팩토링된 인증 서비스
 * 기존 인터페이스를 유지하면서 내부적으로 분리된 모듈들을 사용
 * - tokenManager: 토큰 관리
 * - authApi: HTTP 요청
 * - authUtils: 고수준 인증 로직
 */
const authService = {
  // === 인증 플로우 메서드 ===
  
  async login(request: LoginRequest): Promise<ResponseBase<LoginResponse>> {
    return authUtils.login(request);
  },

  async registerStudent(request: StudentRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    return authUtils.registerStudent(request);
  },

  async registerGuardian(request: GuardianRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    return authUtils.registerGuardian(request);
  },

  async refreshToken(): Promise<ResponseBase<{ accessToken: string }>> {
    return authUtils.refreshToken();
  },

  async logout(): Promise<ResponseBase<null>> {
    return authUtils.logout();
  },

  async getCurrentUser(): Promise<ResponseBase<UserInfo>> {
    return authUtils.getCurrentUser();
  },

  async checkUsername(username: string): Promise<ResponseBase<boolean>> {
    return authUtils.checkUsername(username);
  },

  async checkPhoneNumber(phoneNumber: string): Promise<ResponseBase<boolean>> {
    return authUtils.checkPhoneNumber(phoneNumber);
  },

  async updateProfile(request: UpdateProfileRequest): Promise<ResponseBase<UserInfo>> {
    return authUtils.updateProfile(request);
  },

  // === 토큰 관리 메서드 (기존 호환성 유지) ===
  
  isAuthenticated(): boolean {
    return authUtils.isAuthenticated();
  },

  getAccessToken(): string | null {
    return authUtils.getAccessToken();
  },

  setAccessToken(newAccessToken: string): void {
    tokenManager.setAccessToken(newAccessToken);
  },

  clearAccessToken(): void {
    tokenManager.clearAccessToken();
  },

  isTokenExpired(token: string): boolean {
    return tokenManager.isTokenExpired(token);
  },

  // === 고수준 유틸리티 메서드 ===
  
  async ensureValidToken(): Promise<void> {
    return authUtils.ensureValidToken();
  },

  async initializeFromRefreshToken(): Promise<boolean> {
    return authUtils.initializeFromRefreshToken();
  },

  debugTokenStatus(): void {
    authUtils.debugTokenStatus();
  }
};

export default authService; 