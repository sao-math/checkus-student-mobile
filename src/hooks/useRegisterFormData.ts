
import { useState } from "react";
import { RegisterFormData, RegisterFormErrors } from "../types/registerTypes";
import { usePasswordValidation } from "./usePasswordValidation";

export const useRegisterFormData = (initialRole: string = "student") => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: initialRole,
    gender: "",
    school: "",
    grade: "",
  });
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { passwordStrength, passwordsMatch, isPasswordValid } = 
    usePasswordValidation(formData.password, formData.confirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // 숫자가 아닌 문자 제거
      const digitsOnly = value.replace(/\D/g, '');
      
      // 전화번호 형식으로 포맷팅
      let formattedValue = '';
      if (digitsOnly.length <= 3) {
        formattedValue = digitsOnly;
      } else if (digitsOnly.length <= 7) {
        formattedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
      } else {
        formattedValue = `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 7)}-${digitsOnly.slice(7, 11)}`;
      }
      
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };
  
  const handleSchoolSelect = (school: string) => {
    setFormData((prev) => ({ ...prev, school }));
  };

  const validate = () => {
    const errors: RegisterFormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "이름을 입력해주세요";
    }

    if (!formData.username.trim()) {
      errors.username = "아이디를 입력해주세요";
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "전화번호를 입력해주세요";
    }

    if (!formData.password) {
      errors.password = "비밀번호를 입력해주세요";
    } else if (formData.password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다";
    } else if (!passwordStrength.hasLetter || !passwordStrength.hasNumber || !passwordStrength.hasSpecial) {
      errors.password = "비밀번호는 문자, 숫자, 특수문자를 모두 포함해야 합니다";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }

    if (formData.role === "student") {
      if (!formData.gender) {
        errors.gender = "성별을 선택해주세요";
      }
      
      if (!formData.school) {
        errors.school = "학교를 입력해주세요";
      }
      
      if (!formData.grade) {
        errors.grade = "학년을 선택해주세요";
      }
    }

    return errors;
  };

  return {
    formData,
    setFormData,
    error,
    setError,
    fieldErrors,
    setFieldErrors,
    passwordStrength,
    passwordsMatch,
    handleChange,
    handleSelectChange,
    handleRoleChange,
    handleSchoolSelect,
    validate,
    isPasswordValid,
  };
};
