
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, School } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StudentFieldsProps {
  formData: {
    gender: string;
    school: string;
    grade: string;
  };
  schools: string[];
  schoolOpen: boolean;
  setSchoolOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectChange: (name: string, value: string) => void;
  handleSchoolSelect: (school: string) => void;
  fieldErrors: Record<string, string>;
}

const StudentFields: React.FC<StudentFieldsProps> = ({
  formData,
  schools,
  schoolOpen,
  setSchoolOpen,
  handleSelectChange,
  handleSchoolSelect,
  fieldErrors,
}) => {
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
        {fieldErrors.gender && (
          <p className="text-xs text-red-500">{fieldErrors.gender}</p>
        )}
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
        {fieldErrors.school && (
          <p className="text-xs text-red-500">{fieldErrors.school}</p>
        )}
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
        {fieldErrors.grade && (
          <p className="text-xs text-red-500">{fieldErrors.grade}</p>
        )}
      </div>
    </>
  );
};

export default StudentFields;
