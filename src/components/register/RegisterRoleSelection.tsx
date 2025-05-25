
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RegisterRoleSelectionProps {
  role: string;
  onChange: (value: string) => void;
}

const RegisterRoleSelection: React.FC<RegisterRoleSelectionProps> = ({ role, onChange }) => {
  return (
    <RadioGroup
      defaultValue="student"
      value={role}
      onValueChange={onChange}
      className="flex justify-around"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="student" id="student" />
        <Label htmlFor="student">학생</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="parent" id="parent" />
        <Label htmlFor="parent">학부모</Label>
      </div>
    </RadioGroup>
  );
};

export default RegisterRoleSelection;
