import React, { useState } from "react";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";
import { useRegisterFormData } from "@/hooks/useRegisterFormData";

const Register: React.FC = () => {
  // Use the custom hook for form state and logic
  const {
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
  } = useRegisterFormData();

  // For school combobox popover
  const [schoolOpen, setSchoolOpen] = useState(false);
  // For loading state
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
      <div className="w-full max-w-md">
        <RegisterHeader />
        <RegisterForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          setError={setError}
          fieldErrors={fieldErrors}
          setFieldErrors={setFieldErrors}
          passwordStrength={passwordStrength}
          passwordsMatch={passwordsMatch}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleRoleChange={handleRoleChange}
          handleSchoolSelect={handleSchoolSelect}
          validate={validate}
          isPasswordValid={isPasswordValid}
          schoolOpen={schoolOpen}
          setSchoolOpen={setSchoolOpen}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};

export default Register;
