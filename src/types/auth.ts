export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  name: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface StudentProfile {
  status: string;
  school: {
    id: number;
    name: string;
  };
  grade: number;
  gender: string;
}

export interface UserInfo {
  id: number;
  username: string;
  name: string;
  phoneNumber: string | null;
  discordId: string | null;
  roles: string[];
  createdAt: string | null;
  studentProfile?: StudentProfile;
}

export interface StudentRegisterRequest {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  discordId?: string;
  schoolName: string;
  grade: number;
  gender: string;
}

export interface GuardianRegisterRequest {
  username: string;
  password: string;
  name: string;
  phoneNumber: string;
  discordId?: string;
}

export interface RegisterResponse {
  userId: number;
  username: string;
  message: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface UserInfoResponse {
  id: number;
  username: string;
  name: string;
  phoneNumber: string | null;
  discordId: string | null;
  roles: string[];
  createdAt: string | null;
  studentProfile?: StudentProfile;
}

export interface ResponseBase<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

export interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
  discordId?: string;
  gender?: string;
  school?: string;
  grade?: string;
  status?: string;
} 