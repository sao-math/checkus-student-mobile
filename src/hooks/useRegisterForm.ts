import { useState } from "react";
import { useRegisterFormData } from "./useRegisterFormData";

export const useRegisterForm = (initialRole: string = "student") => {
  const [loading, setLoading] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    formData,
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
  } = useRegisterFormData(initialRole);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    formData,
    loading,
    setLoading,
    error,
    setError,
    schoolOpen,
    setSchoolOpen,
    showPassword,
    showConfirmPassword,
    fieldErrors,
    setFieldErrors,
    passwordStrength,
    passwordsMatch,
    handleChange,
    handleSelectChange,
    handleRoleChange,
    handleSchoolSelect,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    validate,
    isPasswordValid,
  };
};
