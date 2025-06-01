import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  UserRound, 
  Bell, 
  LogOut,
  ChevronRight,
  Settings
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import authService from "@/services/auth";

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast({
        title: "로그아웃 되었습니다",
        description: "다음에 또 만나요!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "로그아웃 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  const userRole = user.roles[0]?.toLowerCase() || 'student';
  const isParent = userRole === 'guardian';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">내 계정</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <UserRound className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="font-medium text-lg">{user.name}</div>
                <div className="text-sm text-gray-500">{user.username}</div>
                <div className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full inline-block mt-1">
                  {userRole === 'student' ? '학생' : userRole === 'guardian' ? '학부모' : userRole}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-500">계정 설정</div>
          
          <Card>
            <CardContent className="p-0">
              <Link 
                to={isParent ? "/profile-edit?role=parent" : "/profile-edit"} 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <UserRound className="h-5 w-5 text-gray-500" />
                  <span>프로필 정보</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              
              <Separator />
              
              <Link 
                to="/notification-settings" 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span>알림 설정</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
              
              <Separator />
              
              {!isParent && (
                <Link 
                  to="/parent-connection" 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span>학부모 연결</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Button 
          variant="outline"
          className="w-full mt-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          로그아웃
        </Button>
      </div>
    </div>
  );
};

export default Account;
