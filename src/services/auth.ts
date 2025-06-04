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

const authService = {
  async login(request: LoginRequest): Promise<ResponseBase<LoginResponse>> {
    const response = await axiosInstance.post<ResponseBase<LoginResponse>>('/auth/login', request);
    return response.data;
  },

  async registerStudent(request: StudentRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/register/student', request);
    return response.data;
  },

  async registerGuardian(request: GuardianRegisterRequest): Promise<ResponseBase<RegisterResponse>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/register/guardian', request);
    return response.data;
  },

  async refreshToken(): Promise<ResponseBase<{ accessToken: string }>> {
    const response = await axiosInstance.post<ResponseBase<{ accessToken: string }>>('/auth/refresh');
    return response.data;
  },

  async logout(): Promise<ResponseBase<null>> {
    const response = await axiosInstance.post<ResponseBase<null>>('/auth/logout');
    return response.data;
  },

  async getCurrentUser(): Promise<ResponseBase<UserInfo>> {
    const response = await axiosInstance.get<ResponseBase<UserInfo>>('/users/me');
    return response.data;
  },

  async checkUsername(username: string): Promise<ResponseBase<boolean>> {
    const response = await axiosInstance.get<ResponseBase<boolean>>(`/auth/check-username?username=${username}`);
    return response.data;
  },

  async checkPhoneNumber(phoneNumber: string): Promise<ResponseBase<boolean>> {
    const response = await axiosInstance.get<ResponseBase<boolean>>(`/auth/check-phone?phoneNumber=${phoneNumber}`);
    return response.data;
  },

  async updateProfile(request: UpdateProfileRequest): Promise<ResponseBase<UserInfo>> {
    const response = await axiosInstance.put<ResponseBase<UserInfo>>('/users/profile', request);
    return response.data;
  }
};

export default authService; 