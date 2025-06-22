import { useState, useEffect } from "react";
import { RegisterFormData, RegisterFormErrors } from "../types/registerTypes";
import { usePasswordValidation } from "./usePasswordValidation";

export const useRegisterFormData = (initialRole: string = "student") => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "010",
    role: initialRole,
    gender: "",
    school: "",
    grade: "",
  });
  
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const { passwordStrength, passwordsMatch, isPasswordValid } = 
    usePasswordValidation(formData.password, formData.confirmPassword);

  // Initialize phone number with '010' when component mounts
  useEffect(() => {
    if (!formData.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: '010'
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phoneNumber') {
      // Remove all non-digit characters
      const numbers = value.replace(/\D/g, '');
      
      // If empty, return just '010'
      if (numbers.length === 0) {
        setFormData(prev => ({ ...prev, phoneNumber: '010' }));
        return;
      }
      
      // Format the number with hyphens
      let formatted = '010';
      const remainingNumbers = numbers.slice(3); // Skip the first 3 digits (010)
      
      if (remainingNumbers.length > 0) {
        formatted += '-' + remainingNumbers.slice(0, 4);
        if (remainingNumbers.length > 4) {
          formatted += '-' + remainingNumbers.slice(4, 8);
        }
      }
      
      setFormData((prev) => ({ ...prev, [name]: formatted }));
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
