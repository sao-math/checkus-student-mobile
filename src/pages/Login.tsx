
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import InputWithLabel from "@/components/ui/input-with-label";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // In a real app, you'd validate and authenticate
    // For demonstration purposes, direct to different pages based on username
    setTimeout(() => {
      setLoading(false);
      
      // Mock login logic - in a real app, this would be based on actual user role
      if (formData.username.startsWith("parent")) {
        navigate("/student-selection"); // Parent users go to student selection
      } else {
        navigate("/dashboard"); // Student users go directly to dashboard
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">CheckUS</h1>
          <p className="text-sm text-gray-600 mt-1">학습 관리를 위한 최고의 파트너</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded">
                  {error}
                </div>
              )}

              <InputWithLabel
                id="username"
                name="username"
                label="아이디"
                placeholder="student_user"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <InputWithLabel
                id="password"
                name="password"
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              
              <p className="text-xs text-gray-500 mt-1">
                * 테스트: 학부모 로그인은 "parent"로 시작하는 아이디를 입력하세요
              </p>
            </CardContent>

            <CardFooter className="flex-col gap-3">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "로그인 중..." : "로그인"}
              </Button>

              <div className="text-sm text-center mt-2">
                계정이 없으신가요?{" "}
                <Link to="/register" className="text-primary font-medium">
                  회원가입
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
