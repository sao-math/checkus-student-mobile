import React from "react";
import { useNavigate } from "react-router-dom";
import { CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import RegisterRoleSelection from "./RegisterRoleSelection";
import RegisterFormFields from "./RegisterFormFields";
import RegisterFooter from "./RegisterFooter";
import authService from "@/services/auth";

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      if (formData.role === "student") {
        // Prepare payload for StudentRegisterRequest
        const payload = {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          discordId: formData.discordId || undefined,
          schoolName: formData.school,
          grade: parseInt(formData.grade) || 1,
          gender: formData.gender,
        };
        const response = await authService.registerStudent(payload);
        if (response.success) {
          navigate("/login", {
            state: {
              message: "회원가입이 완료되었습니다. 로그인해주세요.",
              from: "registration",
            },
          });
        } else {
          setError(response.message || "회원가입에 실패했습니다.");
        }
      } else {
        // For other roles, just simulate
        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 1000);
        return;
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
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
