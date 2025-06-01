import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { StudentRegisterRequest } from '../types/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from 'axios';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) || 1 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseInt(value) : value
    }));
  };

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

      // Register the student
      const response = await authService.registerStudent(formData);
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
          // If error data contains field-specific errors
          const fieldErrors = Object.values(errorData.data).join(', ');
          setError(fieldErrors);
        } else if (errorData.message) {
          // If error has a message field
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">사용자명</Label>
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
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="8자 이상, 영문대소문자+숫자+특수문자 포함"
                value={formData.password}
                onChange={handleChange}
              />
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
                onChange={handleChange}
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

            <div className="space-y-2">
              <Label htmlFor="schoolName">학교</Label>
              <Input
                id="schoolName"
                name="schoolName"
                type="text"
                required
                placeholder="학교명"
                value={formData.schoolName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">학년</Label>
              <Select
                value={formData.grade.toString()}
                onValueChange={(value) => handleSelectChange('grade', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3].map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      {grade}학년
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
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">남성</SelectItem>
                  <SelectItem value="FEMALE">여성</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
