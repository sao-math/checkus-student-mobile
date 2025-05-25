
import React from "react";
import { Check } from "lucide-react";

interface PasswordRequirementsProps {
  passwordStrength: {
    hasMinLength: boolean;
    hasLetter: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  passwordStrength,
}) => {
  const { hasMinLength, hasLetter, hasNumber, hasSpecial } = passwordStrength;
  
  return (
    <div className="mt-2 space-y-1">
      <p className="text-xs text-gray-500 mb-1">비밀번호는 다음 조건을 만족해야 합니다:</p>
      <div className="grid grid-cols-2 gap-1">
        <div className={`text-xs flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
          <Check className="h-3 w-3" /> 8자 이상
        </div>
        <div className={`text-xs flex items-center gap-1 ${hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
          <Check className="h-3 w-3" /> 문자 포함
        </div>
        <div className={`text-xs flex items-center gap-1 ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
          <Check className="h-3 w-3" /> 숫자 포함
        </div>
        <div className={`text-xs flex items-center gap-1 ${hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
          <Check className="h-3 w-3" /> 특수문자 포함
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
