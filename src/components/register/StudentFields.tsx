import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, School, Loader2, AlertCircle, Building2 } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSchools } from "@/hooks/useSchools";

interface StudentFieldsProps {
  formData: {
    gender: string;
    school: string;
    grade: string;
  };
  schoolOpen: boolean;
  setSchoolOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectChange: (name: string, value: string) => void;
  handleSchoolSelect: (school: string) => void;
  fieldErrors: Record<string, string>;
}

const StudentFields: React.FC<StudentFieldsProps> = ({
  formData,
  schoolOpen,
  setSchoolOpen,
  handleSelectChange,
  handleSchoolSelect,
  fieldErrors,
}) => {
  console.log('🎯 StudentFields: 컴포넌트가 렌더링되었습니다');
  
  const { schools, isLoading, error, refetch } = useSchools();
  
  console.log('📚 StudentFields: useSchools 결과 - schools:', schools, 'isLoading:', isLoading, 'error:', error);

  const handleSchoolPopoverOpen = (open: boolean) => {
    console.log('🔍 StudentFields: 학교 선택 팝오버 열림/닫힘:', open);
    setSchoolOpen(open);
  };

  const handleSchoolSelectAndClose = (school: string) => {
    console.log('🏫 StudentFields: 학교 선택됨:', school);
    handleSchoolSelect(school);
    setSchoolOpen(false);
  };

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
        <Popover open={schoolOpen} onOpenChange={handleSchoolPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={schoolOpen}
              className="w-full justify-between"
              disabled={isLoading}
              onClick={() => console.log('🖱️ StudentFields: 학교 선택 버튼 클릭됨')}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="ml-2">학교 목록 불러오는 중...</span>
                </>
              ) : (
                <>
                  {formData.school || "학교 검색"}
                  <School className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="학교명을 입력하세요..." />
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    학교 목록을 불러오는 중...
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center p-4 space-y-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">{error}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('🔄 StudentFields: 다시 시도 버튼 클릭됨');
                        refetch();
                      }}
                      className="text-xs"
                    >
                      다시 시도
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 space-y-3">
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">검색 결과가 없습니다</p>
                      <p className="text-xs text-gray-500">다른 키워드로 검색해보시거나,</p>
                      <p className="text-xs text-gray-500">아래 옵션을 선택해주세요</p>
                    </div>
                    
                    <div className="border rounded-lg">
                      <div 
                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          console.log('🏫 StudentFields: 학교 없음 선택됨');
                          handleSchoolSelectAndClose("학교 없음");
                        }}
                      >
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">학교 없음</p>
                          <p className="text-xs text-gray-500">해당하는 학교가 목록에 없어요</p>
                        </div>
                        <Check
                          className={cn(
                            "h-4 w-4 text-blue-500",
                            formData.school === "학교 없음" ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {schools.map((school) => (
                    <CommandItem
                      key={school.id}
                      value={school.name}
                      onSelect={() => handleSchoolSelectAndClose(school.name)}
                    >
                      {school.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          formData.school === school.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                  {/* 없음 옵션을 항상 표시 */}
                  {!isLoading && schools.length > 0 && (
                    <>
                      <div className="px-2 py-1">
                        <div className="border-t border-gray-200"></div>
                      </div>
                      <CommandItem
                        value="학교 없음"
                        onSelect={() => handleSchoolSelectAndClose("학교 없음")}
                        className="text-gray-600"
                      >
                        학교 없음
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            formData.school === "학교 없음" ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    </>
                  )}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {fieldErrors.school && (
          <p className="text-xs text-red-500">{fieldErrors.school}</p>
        )}
        {error && !schoolOpen && (
          <p className="text-xs text-orange-500 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            학교 목록을 불러오지 못했습니다. 직접 입력하거나 다시 시도해주세요.
          </p>
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
