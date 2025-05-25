
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface RegisterFooterProps {
  loading: boolean;
}

const RegisterFooter: React.FC<RegisterFooterProps> = ({ loading }) => {
  return (
    <CardFooter className="flex-col gap-3">
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "가입 중..." : "회원가입"}
      </Button>

      <div className="text-sm text-center mt-2">
        이미 계정이 있으신가요?{" "}
        <Link to="/login" className="text-primary font-medium">
          로그인
        </Link>
      </div>
    </CardFooter>
  );
};

export default RegisterFooter;
