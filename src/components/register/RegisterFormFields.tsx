import React from "react";
import InputWithLabel from "@/components/ui/input-with-label";
import StudentFields from "@/components/register/StudentFields";
import PasswordRequirements from "@/components/register/PasswordRequirements";
import PasswordConfirmation from "@/components/register/PasswordConfirmation";

interface RegisterFormFieldsProps {
  formData: {
    name: string;
    username: string;
    password: string;
    confirmPassword: string;
    phoneNumber: string;
    role: string;
    gender: string;
    school: string;
    grade: string;
  };
  fieldErrors: Record<string, string>;
  passwordStrength: {
    hasMinLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  passwordsMatch: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  schoolOpen: boolean;
  setSchoolOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSchoolSelect: (school: string) => void;
  togglePasswordVisibility: () => void;
  toggleConfirmPasswordVisibility: () => void;
}

const RegisterFormFields: React.FC<RegisterFormFieldsProps> = ({
  formData,
  fieldErrors,
  passwordStrength,
  passwordsMatch,
  schoolOpen,
  setSchoolOpen,
  handleChange,
  handleSelectChange,
  handleSchoolSelect,
}) => {
  return (
    <>
      <InputWithLabel
        id="name"
        name="name"
        label="이름"
        placeholder="홍길동"
        value={formData.name}
        onChange={handleChange}
        error={fieldErrors.name}
        required
      />

      <InputWithLabel
        id="username"
        name="username"
        label="아이디"
        placeholder="student_user"
        value={formData.username}
        onChange={handleChange}
        error={fieldErrors.username}
        required
      />

      <InputWithLabel
        id="phoneNumber"
        name="phoneNumber"
        label="전화번호"
        placeholder="010-1234-5678"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={fieldErrors.phoneNumber}
        required
      />

      <InputWithLabel
        id="password"
        name="password"
        label="비밀번호"
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={handleChange}
        error={fieldErrors.password}
        showPasswordToggle={true}
      />
      
      {!fieldErrors.password && (
        <PasswordRequirements passwordStrength={passwordStrength} />
      )}

      <InputWithLabel
        id="confirmPassword"
        name="confirmPassword"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호 확인"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={fieldErrors.confirmPassword}
        showPasswordToggle={true}
      />
      
      <PasswordConfirmation 
        passwordsMatch={passwordsMatch} 
        confirmPassword={formData.confirmPassword} 
      />

      {formData.role === "student" && (
        <StudentFields
          formData={formData}
          schoolOpen={schoolOpen}
          setSchoolOpen={setSchoolOpen}
          handleSelectChange={handleSelectChange}
          handleSchoolSelect={handleSchoolSelect}
          fieldErrors={fieldErrors}
        />
      )}
    </>
  );
};

export default RegisterFormFields;
