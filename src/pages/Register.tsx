import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';
import { StudentRegisterRequest } from '../types/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { School, Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AxiosError } from 'axios';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState('student');
  const [schoolOpen, setSchoolOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });
  const [formData, setFormData] = useState<StudentRegisterRequest>({
    username: '',
    password: '',
    name: '',
    phoneNumber: '',
    discordId: '',
    schoolName: '',
    grade: 1,
    gender: 'MALE'
  });

  const gradeOptions = [
    // { value: '1', label: '초1' },
    // { value: '2', label: '초2' },
    // { value: '3', label: '초3' },
    // { value: '4', label: '초4' },
    // { value: '5', label: '초5' },
    // { value: '6', label: '초6' },
    { value: '7', label: '중학교 1학년' },
    { value: '8', label: '중학교 2학년' },
    { value: '9', label: '중학교 3학년' },
    { value: '10', label: '고등학교 1학년' },
    { value: '11', label: '고등학교 2학년' },
    { value: '12', label: '고등학교 3학년' },
    { value: '13', label: 'N수생' }
  ];

  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'grade' ? parseInt(value) || 1 : value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) : value
    }));
  };

  const handleSchoolSelect = (school: string) => {
    setFormData(prev => ({
      ...prev,
      schoolName: school
    }));
    setSchoolOpen(false);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // If empty, return just '010'
    if (numbers.length === 0) return '010';
    
    // Format the number with hyphens
    let formatted = '010';
    const remainingNumbers = numbers.slice(3); // Skip the first 3 digits (010)
    
    if (remainingNumbers.length > 0) {
      formatted += '-' + remainingNumbers.slice(0, 4);
      if (remainingNumbers.length > 4) {
        formatted += '-' + remainingNumbers.slice(4, 8);
      }
    }
    return formatted;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // If user is deleting and we're about to delete the '010' prefix, prevent it
    if (input.length < formData.phoneNumber.length && input.length <= 3) {
      return;
    }

    // Format the number
    const formattedNumber = formatPhoneNumber(input);
    setFormData(prev => ({
      ...prev,
      phoneNumber: formattedNumber
    }));
  };

  // Initialize phone number with '010' when component mounts
  useEffect(() => {
    if (!formData.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: '010'
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check username availability
      const usernameCheck = await authService.checkUsername(formData.username);
      if (!usernameCheck.success || !usernameCheck.data) {
        throw new Error('이미 사용 중인 사용자명입니다.');
      }

      // Check phone number availability
      const phoneCheck = await authService.checkPhoneNumber(formData.phoneNumber);
      if (!phoneCheck.success || !phoneCheck.data) {
        throw new Error('이미 등록된 전화번호입니다.');
      }

      // Register based on role
      let response;
      if (role === 'student') {
        response = await authService.registerStudent(formData);
      } else {
        // For guardian, we only need basic info
        const guardianData = {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          discordId: formData.discordId
        };
        response = await authService.registerGuardian(guardianData);
      }

      if (response.success) {
        navigate('/login', { 
          state: { 
            message: '회원가입이 완료되었습니다. 로그인해주세요.',
            from: 'registration'
          } 
        });
      } else {
        throw new Error(response.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const errorData = err.response.data;
        if (errorData.data && typeof errorData.data === 'object') {
          const fieldErrors = Object.values(errorData.data).join(', ');
          setError(fieldErrors);
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError('회원가입에 실패했습니다.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('회원가입에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch = formData.password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">CheckUS</h1>
          <p className="text-sm text-gray-600 mt-1">학습 관리를 위한 최고의 파트너</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>회원가입</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <RadioGroup
                defaultValue="student"
                value={role}
                onValueChange={setRole}
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

              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="4-20자, 영문자/숫자/언더바만 가능"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="8자 이상, 영문대소문자+숫자+특수문자 포함"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      "pr-10",
                      !passwordStrength.hasMinLength && formData.password && "border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-500 mb-1">비밀번호는 다음 조건을 만족해야 합니다:</p>
                    <div className="grid grid-cols-2 gap-1">
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"
                      )}>
                        {passwordStrength.hasMinLength ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 8자 이상
                      </div>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        passwordStrength.hasUppercase ? "text-green-600" : "text-gray-500"
                      )}>
                        {passwordStrength.hasUppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 영문 대문자 포함
                      </div>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        passwordStrength.hasLowercase ? "text-green-600" : "text-gray-500"
                      )}>
                        {passwordStrength.hasLowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 영문 소문자 포함
                      </div>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"
                      )}>
                        {passwordStrength.hasNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 숫자 포함
                      </div>
                      <div className={cn(
                        "text-xs flex items-center gap-1",
                        passwordStrength.hasSpecial ? "text-green-600" : "text-gray-500"
                      )}>
                        {passwordStrength.hasSpecial ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} 특수문자 포함
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="비밀번호를 한 번 더 입력해주세요"
                    value={confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      "pr-10",
                      confirmPassword && !passwordsMatch && "border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className={cn(
                    "text-xs flex items-center gap-1 mt-1",
                    passwordsMatch ? "text-green-600" : "text-red-500"
                  )}>
                    {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {passwordsMatch ? "비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">전화번호</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="010-0000-0000"
                  value={formData.phoneNumber}
                  onChange={handlePhoneNumberChange}
                  maxLength={13} // 010-0000-0000 format
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discordId">디스코드 ID (선택)</Label>
                <Input
                  id="discordId"
                  name="discordId"
                  type="text"
                  placeholder="username#1234"
                  value={formData.discordId}
                  onChange={handleChange}
                />
              </div>

              {role === 'student' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">학교</Label>
                    <Popover open={schoolOpen} onOpenChange={setSchoolOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={schoolOpen}
                          className="w-full justify-between"
                        >
                          {formData.schoolName || "학교 검색"}
                          <School className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="학교 검색..." />
                          <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              <CommandItem 
                                value="서울고등학교"
                                onSelect={() => handleSchoolSelect("서울고등학교")}
                              >
                                서울고등학교
                              </CommandItem>
                              <CommandItem 
                                value="서울중학교"
                                onSelect={() => handleSchoolSelect("서울중학교")}
                              >
                                서울중학교
                              </CommandItem>
                            </CommandList>
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade">학년</Label>
                    <Select
                      value={formData.grade.toString()}
                      onValueChange={(value) => handleSelectChange('grade', value)}
                    >
                      <SelectTrigger id="grade">
                        <SelectValue placeholder="학년 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">성별</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange('gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="성별 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">남성</SelectItem>
                        <SelectItem value="FEMALE">여성</SelectItem>
                        <SelectItem value="OTHER">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-3">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded w-full">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !Object.values(passwordStrength).every(Boolean) || !passwordsMatch}
              >
                {isLoading ? '처리 중...' : '회원가입'}
              </Button>

              <div className="text-sm text-center mt-2">
                이미 계정이 있으신가요?{" "}
                <Link to="/login" className="text-primary font-medium">
                  로그인
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
