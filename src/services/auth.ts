import api from '../lib/axios';
import {
  LoginRequest,
  LoginResponse,
  StudentRegisterRequest,
  RegisterResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
  LogoutRequest,
  UserInfoResponse,
  ResponseBase
} from '../types/auth';

const authService = {
  async login(request: LoginRequest): Promise<ResponseBase<LoginResponse>> {
    const response = await api.post<ResponseBase<LoginResponse>>('/auth/login', request);
    return response.data;
  },

  async registerStudent(request: StudentRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    const response = await api.post<ResponseBase<RegisterResponse>>('/auth/register/student', request);
    return response.data;
  },

  async refreshToken(request: TokenRefreshRequest): Promise<ResponseBase<TokenRefreshResponse>> {
    const response = await api.post<ResponseBase<TokenRefreshResponse>>('/auth/refresh', request);
    return response.data;
  },

  async logout(request: LogoutRequest): Promise<ResponseBase<string>> {
    const response = await api.post<ResponseBase<string>>('/auth/logout', request);
    return response.data;
  },

  async getCurrentUser(): Promise<ResponseBase<UserInfoResponse>> {
    const response = await api.get<ResponseBase<UserInfoResponse>>('/auth/me');
    return response.data;
  },

  async checkUsername(username: string): Promise<ResponseBase<boolean>> {
    const response = await api.get<ResponseBase<boolean>>('/auth/check-username', {
      params: { username }
    });
    return response.data;
  },

  async checkPhoneNumber(phoneNumber: string): Promise<ResponseBase<boolean>> {
    const response = await api.get<ResponseBase<boolean>>('/auth/check-phone', {
      params: { phoneNumber }
    });
    return response.data;
  }
};

export default authService; 