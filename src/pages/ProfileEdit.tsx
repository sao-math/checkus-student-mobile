
import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import ProfileForm from "@/components/profile/ProfileForm";

const ProfileEdit = () => {
  const navigate = useNavigate();
  
  // In a real app, we would fetch the user profile data here
  const mockStudentData = {
    name: "홍길동",
    username: "student_user",
    phoneNumber: "010-1234-5678",
    discordId: "student#1234",
    role: "student",
    gender: "MALE",
    school: "OO중학교",
    grade: "2",
    status: "ENROLLED",
  };
  
  const mockParentData = {
    name: "김부모",
    username: "parent_user",
    phoneNumber: "010-9876-5432",
    discordId: "parent#5678",
    role: "parent",
    studentRelationships: [
      {
        studentId: "1",
        relationship: "FATHER",
        studentName: "김학생"
      }
    ]
  };
  
  // For demonstration purposes, we'll determine based on URL parameters
  // In a real app, this would come from an auth context or similar
  // You can change this to test different roles
  const isParent = window.location.search.includes('role=parent');
  const userData = isParent ? mockParentData : mockStudentData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">프로필 정보</h1>
        <ProfileForm initialData={userData} />
      </div>
    </div>
  );
};

export default ProfileEdit;
