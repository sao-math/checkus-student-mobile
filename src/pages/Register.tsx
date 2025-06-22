import React from 'react';
import { Card } from "@/components/ui/card";
import RegisterForm from "@/components/register/RegisterForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";

export const Register: React.FC = () => {
  const registerFormProps = useRegisterForm("student");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <Card className="w-full shadow-xl border-0 bg-white/95 backdrop-blur">
          <RegisterForm {...registerFormProps} />
        </Card>
      </div>
    </div>
  );
};
