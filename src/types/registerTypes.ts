export interface RegisterFormData {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: string;
  gender: string;
  school: string;
  grade: string;
}

export interface PasswordStrength {
  hasMinLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

// 인덱스 시그니처 추가
export interface RegisterFormErrors {
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  gender?: string;
  school?: string;
  grade?: string;
  // 인덱스 시그니처 추가
  [key: string]: string | undefined;
}

// 학교 목록 - 실제 앱에서는 API에서 가져올 수 있음
export const schools = [
  "OO중학교",
  "창덕여자중학교",
  "상봉중학교",
  "선덕중학교",
  "신답중학교",
  "용곡중학교",
  "중화중학교",
  "휘경중학교"
];
