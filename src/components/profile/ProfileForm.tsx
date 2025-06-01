import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import BasicInfoFields from "./BasicInfoFields";
import StudentFields from "./StudentFields";
import GuardianFields from "./GuardianFields";

interface ProfileFormProps {
  onSubmit?: (formData: ProfileFormData) => Promise<void>;
  initialData?: ProfileFormData;
  readOnly?: boolean;
}

export interface ProfileFormData {
  // Basic user info
  name: string;
  username: string;
  phoneNumber: string;
  discordId?: string;
  role: string;
  // Student specific
  gender?: string;
  school?: string;
  grade?: string;
  status?: string;
  // Guardian specific
  studentRelationships?: {
    studentId: string;
    relationship: string;
    studentName: string;
  }[];
}

const ProfileForm: React.FC<ProfileFormProps> = ({ 
  onSubmit,
  initialData = {
    name: "홍길동",
    username: "student_user",
    phoneNumber: "010-1234-5678",
    discordId: "",
    role: "student",
    gender: "MALE",
    school: "OO중학교",
    grade: "2",
    status: "ENROLLED",
  },
  readOnly = false
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>(initialData);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 학생이나 학부모인 경우 읽기 전용으로 설정
  const isReadOnly = readOnly || formData.role === "student" || formData.role === "guardian";

  // Example school list - in a real app, this would come from an API
  const schools = [
    "OO중학교",
    "창덕여자중학교",
    "상봉중학교",
    "선덕중학교",
    "신답중학교",
    "용곡중학교",
    "중화중학교",
    "휘경중학교"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSchoolSelect = (school: string) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, school }));
    setSchoolOpen(false);
  };

  const handleRelationshipChange = (index: number, field: string, value: string) => {
    if (isReadOnly) return;
    if (formData.studentRelationships) {
      const updatedRelationships = [...formData.studentRelationships];
      updatedRelationships[index] = {
        ...updatedRelationships[index],
        [field]: value
      };
      
      setFormData(prev => ({
        ...prev,
        studentRelationships: updatedRelationships
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;
    
    setLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "프로필이 업데이트 되었습니다",
        description: "변경사항이 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "프로필 저장 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isReadOnly ? "내 정보 확인" : "내 정보 수정"}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <BasicInfoFields 
            formData={formData}
            handleChange={handleChange}
            fieldErrors={fieldErrors}
            readOnly={isReadOnly}
          />

          {formData.role === "student" && (
            <StudentFields
              formData={formData}
              handleSelectChange={handleSelectChange}
              schools={schools}
              schoolOpen={schoolOpen}
              setSchoolOpen={setSchoolOpen}
              handleSchoolSelect={handleSchoolSelect}
              readOnly={isReadOnly}
            />
          )}

          {formData.role === "guardian" && (
            <GuardianFields 
              studentRelationships={formData.studentRelationships || []}
              onRelationshipChange={handleRelationshipChange}
            />
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3">
          {!isReadOnly && (
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "저장 중..." : "저장하기"}
            </Button>
          )}
          {isReadOnly && (
            <div className="text-sm text-gray-500 text-center">
              {formData.role === "student" ? "학생" : "학부모"}은 프로필 정보를 수정할 수 없습니다
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
