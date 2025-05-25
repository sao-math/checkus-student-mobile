
import React from "react";
import { Check } from "lucide-react";

interface PasswordConfirmationProps {
  passwordsMatch: boolean;
  confirmPassword: string;
}

const PasswordConfirmation: React.FC<PasswordConfirmationProps> = ({
  passwordsMatch,
  confirmPassword,
}) => {
  if (!confirmPassword) return null;
  
  return (
    <div className={`text-xs flex items-center gap-1 mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
      {passwordsMatch ? (
        <>
          <Check className="h-3 w-3" /> 비밀번호가 일치합니다
        </>
      ) : (
        <>
          <span className="text-red-500">비밀번호가 일치하지 않습니다</span>
        </>
      )}
    </div>
  );
};

export default PasswordConfirmation;
