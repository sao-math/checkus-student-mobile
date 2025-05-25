
import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import RegisterRoleSelection from "./RegisterRoleSelection";
import RegisterFormFields from "./RegisterFormFields";
import RegisterFooter from "./RegisterFooter";

const RegisterForm = (props: any) => {
  const {
    formData,
    loading,
    setLoading,
    error,
    setError,
    schoolOpen,
    setSchoolOpen,
    fieldErrors,
    setFieldErrors,
    handleRoleChange,
    handleSchoolSelect,
    handleSelectChange,
    validate,
  } = props;

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");

    // In a real app, you'd register the user
    // For now, simply simulate a successful registration
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <RegisterRoleSelection 
          role={formData.role} 
          onChange={handleRoleChange} 
        />

        <RegisterFormFields 
          formData={formData}
          fieldErrors={fieldErrors}
          schoolOpen={schoolOpen}
          setSchoolOpen={setSchoolOpen}
          handleSchoolSelect={handleSchoolSelect}
          handleSelectChange={handleSelectChange}
          {...props}
        />
      </CardContent>

      <RegisterFooter loading={loading} />
    </form>
  );
};

export default RegisterForm;
