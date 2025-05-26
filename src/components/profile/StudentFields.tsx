
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, School } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StudentFieldsProps {
  formData: {
    gender?: string;
    school?: string;
    grade?: string;
    status?: string;
  };
  handleSelectChange: (name: string, value: string) => void;
  schools: string[];
  schoolOpen: boolean;
  setSchoolOpen: (open: boolean) => void;
  handleSchoolSelect: (school: string) => void;
  readOnly?: boolean;
}

const StudentFields: React.FC<StudentFieldsProps> = ({
  formData,
  handleSelectChange,
  schools,
  schoolOpen,
  setSchoolOpen,
  handleSchoolSelect,
  readOnly = false,
}) => {
  // 읽기 전용일 때 값을 한국어로 변환하는 함수들
  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "MALE": return "남자";
      case "FEMALE": return "여자";
      case "OTHER": return "기타";
      default: return gender || "";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "INQUIRY": return "문의";
      case "COUNSELING_SCHEDULED": return "상담예약";
      case "ENROLLED": return "재원";
      case "WAITING": return "대기";
      case "WITHDRAWN": return "퇴원";
      case "UNREGISTERED": return "미등록";
      default: return status || "";
    }
  };

  const getGradeLabel = (grade?: string) => {
    switch (grade) {
      case "중1": return "중학교 1학년";
      case "중2": return "중학교 2학년";
      case "중3": return "중학교 3학년";
      case "고1": return "고등학교 1학년";
      case "고2": return "고등학교 2학년";
      case "고3": return "고등학교 3학년";
      case "재수": return "재수생";
      case "N수": return "N수생";
      default: return grade || "";
    }
  };

  if (readOnly) {
    return (
      <>
        <div className="space-y-2">
          <Label htmlFor="gender">성별</Label>
          <div className="bg-gray-100 p-2 rounded-md text-gray-700">
            {getGenderLabel(formData.gender)}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">상태</Label>
          <div className="bg-gray-100 p-2 rounded-md text-gray-700">
            {getStatusLabel(formData.status)}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="school">학교</Label>
          <div className="bg-gray-100 p-2 rounded-md text-gray-700">
            {formData.school || ""}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="grade">학년</Label>
          <div className="bg-gray-100 p-2 rounded-md text-gray-700">
            {getGradeLabel(formData.grade)}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="gender">성별</Label>
        <Select 
          value={formData.gender} 
          onValueChange={(value) => handleSelectChange("gender", value)}
        >
          <SelectTrigger id="gender">
            <SelectValue placeholder="성별 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MALE">남자</SelectItem>
            <SelectItem value="FEMALE">여자</SelectItem>
            <SelectItem value="OTHER">기타</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">상태</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INQUIRY">문의</SelectItem>
            <SelectItem value="COUNSELING_SCHEDULED">상담예약</SelectItem>
            <SelectItem value="ENROLLED">재원</SelectItem>
            <SelectItem value="WAITING">대기</SelectItem>
            <SelectItem value="WITHDRAWN">퇴원</SelectItem>
            <SelectItem value="UNREGISTERED">미등록</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="school">학교</Label>
        <Popover open={schoolOpen} onOpenChange={setSchoolOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={schoolOpen}
              className="w-full justify-between"
            >
              {formData.school || "학교 검색"}
              <School className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="학교 검색..." />
              <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {schools.map((school) => (
                    <CommandItem
                      key={school}
                      value={school}
                      onSelect={() => handleSchoolSelect(school)}
                    >
                      {school}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          formData.school === school ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="grade">학년</Label>
        <Select 
          value={formData.grade} 
          onValueChange={(value) => handleSelectChange("grade", value)}
        >
          <SelectTrigger id="grade">
            <SelectValue placeholder="학년 선택" />
          </SelectTrigger>
          <SelectContent>
            {/* 중학교 */}
            <SelectItem value="중1">중학교 1학년</SelectItem>
            <SelectItem value="중2">중학교 2학년</SelectItem>
            <SelectItem value="중3">중학교 3학년</SelectItem>
            
            {/* 고등학교 */}
            <SelectItem value="고1">고등학교 1학년</SelectItem>
            <SelectItem value="고2">고등학교 2학년</SelectItem>
            <SelectItem value="고3">고등학교 3학년</SelectItem>
            
            {/* 기타 */}
            <SelectItem value="재수">재수생</SelectItem>
            <SelectItem value="N수">N수생</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default StudentFields;
