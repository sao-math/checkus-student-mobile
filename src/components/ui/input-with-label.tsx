
import React, { InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  className?: string;
  showPasswordToggle?: boolean;
}

const InputWithLabel: React.FC<InputWithLabelProps> = ({
  label,
  id,
  error,
  className,
  type,
  showPasswordToggle,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          {...props}
          className={cn(
            error && "border-red-500 focus:ring-red-500",
            "w-full rounded-md",
            isPassword && showPasswordToggle && "pr-10"
          )}
        />
        {isPassword && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputWithLabel;
