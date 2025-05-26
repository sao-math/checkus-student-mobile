
import React from "react";
import InputWithLabel from "@/components/ui/input-with-label";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    username: string;
    phoneNumber: string;
    role: string;
    discordId?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
  readOnly?: boolean;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  handleChange,
  fieldErrors,
  readOnly = false,
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
        disabled={readOnly}
      />

      <InputWithLabel
        id="username"
        name="username"
        label="아이디"
        value={formData.username}
        onChange={handleChange}
        error={fieldErrors.username}
        disabled
      />

      <InputWithLabel
        id="phoneNumber"
        name="phoneNumber"
        label="전화번호"
        placeholder="010-1234-5678"
        value={formData.phoneNumber}
        onChange={handleChange}
        error={fieldErrors.phoneNumber}
        disabled={readOnly}
      />
      
      <InputWithLabel
        id="discordId"
        name="discordId"
        label="디스코드 아이디"
        placeholder="username#1234"
        value={formData.discordId || ""}
        onChange={handleChange}
        error={fieldErrors.discordId}
        disabled
      />
      
      <div className="space-y-2">
        <Label htmlFor="role">역할</Label>
        <div className="bg-gray-100 p-2 rounded-md text-gray-700">
          {formData.role === "student" ? "학생" : "학부모"}
        </div>
      </div>
    </>
  );
};

export default BasicInfoFields;
