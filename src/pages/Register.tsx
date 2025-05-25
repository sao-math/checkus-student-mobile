
import React from "react";
import { Card } from "@/components/ui/card";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";

const Register = () => {
  const registerFormProps = useRegisterForm();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
      <div className="w-full max-w-md">
        <RegisterHeader />

        <Card>
          <RegisterForm {...registerFormProps} />
        </Card>
      </div>
    </div>
  );
};

export default Register;
