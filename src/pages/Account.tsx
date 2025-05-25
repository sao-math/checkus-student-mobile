
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

// For demonstration purposes, check URL for role
const isParent = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.search.includes('role=parent');
  }
  return false;
};

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userIsParent = isParent();

  const handleLogout = () => {
    // In a real app, you'd perform actual logout
    toast({
      title: "로그아웃 되었습니다",
      description: "다음에 또 만나요!",
    });
    
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

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
                <div className="font-medium text-lg">{userIsParent ? "김부모" : "홍길동"}</div>
                <div className="text-sm text-gray-500">{userIsParent ? "parent_user" : "student_user"}</div>
                <div className="text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full inline-block mt-1">
                  {userIsParent ? "학부모" : "학생"}
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
                to={userIsParent ? "/profile-edit?role=parent" : "/profile-edit"} 
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
              
              {!userIsParent && (
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
