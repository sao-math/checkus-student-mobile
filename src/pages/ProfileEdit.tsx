import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import authService from "@/services/auth";
import { ProfileFormData } from "@/components/profile/ProfileForm";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<ProfileFormData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          const userRole = response.data.roles[0]?.toLowerCase() || 'student';
          setUserData({
            name: response.data.name,
            username: response.data.username,
            phoneNumber: response.data.phoneNumber || '',
            discordId: response.data.discordId || '',
            role: userRole,
            gender: response.data.studentProfile?.gender || '',
            school: response.data.studentProfile?.school?.name || '',
            grade: response.data.studentProfile?.grade?.toString() || '',
            status: response.data.studentProfile?.status || ''
          });
        }
      } catch (error) {
        toast({
          title: "오류가 발생했습니다",
          description: "사용자 정보를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleSubmit = async (formData: ProfileFormData) => {
    try {
      const response = await authService.updateProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        discordId: formData.discordId,
        gender: formData.gender,
        school: formData.school,
        grade: formData.grade,
        status: formData.status
      });

      if (response.success) {
        toast({
          title: "프로필이 업데이트 되었습니다",
          description: "변경사항이 저장되었습니다.",
        });
        navigate('/account');
      } else {
        throw new Error(response.message || '프로필 업데이트에 실패했습니다.');
      }
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "프로필 저장 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-md mx-auto p-4">
          <div className="text-center py-8">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-md mx-auto p-4">
          <div className="text-center py-8">사용자 정보를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">프로필 정보</h1>
        <ProfileForm initialData={userData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default ProfileEdit;
