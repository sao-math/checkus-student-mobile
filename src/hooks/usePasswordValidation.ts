
import { useState, useEffect } from "react";
import { PasswordStrength } from "../types/registerTypes";

export const usePasswordValidation = (password: string, confirmPassword: string) => {
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasLetter: false,
    hasNumber: false,
    hasSpecial: false,
  });
  
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // 비밀번호 강도 검사
  useEffect(() => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasLetter: /[a-zA-Z가-힣]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // 비밀번호 일치 여부 검사
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true); // 사용자가 확인 비밀번호를 입력하기 전까지는 오류 표시 안 함
    }
  }, [password, confirmPassword]);

  const isPasswordValid = () => {
    const { hasMinLength, hasLetter, hasNumber, hasSpecial } = passwordStrength;
    return hasMinLength && hasLetter && hasNumber && hasSpecial;
  };

  return {
    passwordStrength,
    passwordsMatch,
    isPasswordValid,
  };
};
