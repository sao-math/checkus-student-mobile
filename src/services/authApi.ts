import axiosInstance from '../lib/axios';
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
 * 인증 관련 API 호출 전용 모듈
 * HTTP 요청/응답 처리만 담당하고, 토큰 관리는 tokenManager에서 처리
 */
export const authApi = {
  /**
   * 사용자 로그인
   */
  async login(request: LoginRequest): Promise<ResponseBase<LoginResponse>> {
    const response = await axiosInstance.post<ResponseBase<LoginResponse>>('/auth/login', request);
    return response.data;
  },

  /**
   * 학생 회원가입
   */
  async registerStudent(request: StudentRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/register/student', request);
    return response.data;
  },

  /**
   * 학부모 회원가입
   */
  async registerGuardian(request: GuardianRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/register/guardian', request);
    return response.data;
  },

  /**
   * 토큰 갱신 (리프레시 토큰은 쿠키에서 자동 전송)
   */
  async refreshToken(): Promise<ResponseBase<{ accessToken: string }>> {
    console.log('Attempting to refresh token using cookie...');
    const response = await axiosInstance.post<ResponseBase<{ accessToken: string }>>('/auth/refresh');
    console.log('Token refresh API response received');
    return response.data;
  },

  /**
   * 사용자 로그아웃
   */
  async logout(): Promise<ResponseBase<null>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/logout');
    return response.data;
  },

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser(): Promise<ResponseBase<UserInfo>> {
    const response = await axiosInstance.get<ResponseBase<UserInfo>>('/users/me');
    return response.data;
  },

  /**
   * 사용자명 중복 확인
   */
  async checkUsername(username: string): Promise<ResponseBase<boolean>> {
    const response = await axiosInstance.get<ResponseBase<boolean>>(`/auth/check-username?username=${username}`);
    return response.data;
  },

  /**
   * 전화번호 중복 확인
   */
  async checkPhoneNumber(phoneNumber: string): Promise<ResponseBase<boolean>> {
    const response = await axiosInstance.get<ResponseBase<boolean>>(`/auth/check-phone?phoneNumber=${phoneNumber}`);
    return response.data;
  },

  /**
   * 사용자 프로필 업데이트
   */
  async updateProfile(request: UpdateProfileRequest): Promise<ResponseBase<UserInfo>> {
    const response = await axiosInstance.put<ResponseBase<UserInfo>>('/users/profile', request);
    return response.data;
  },
}; 