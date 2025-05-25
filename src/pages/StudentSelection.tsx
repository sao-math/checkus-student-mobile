import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, PlusCircle, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data for student list - in a real app, this would come from API
const mockStudents = [
  {
    id: "1",
    name: "김학생",
    grade: "2",
    school: "OO중학교",
    relationshipType: "자녀"
  },
  {
    id: "2",
    name: "이학생",
    grade: "3",
    school: "창덕여자중학교",
    relationshipType: "자녀"
  },
  {
    id: "3",
    name: "박학생", 
    grade: "1",
    school: "상봉중학교",
    relationshipType: "조카"
  }
];

// Mock connection requests - in a real app, this would be stored in a database
const mockPendingRequests = [
  {
    id: "req1",
    studentId: "student123",
    status: "pending"
  }
];

const StudentSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [pendingRequests, setPendingRequests] = useState(mockPendingRequests);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const handleContinue = () => {
    if (!selectedStudentId) {
      toast({
        title: "학생을 선택해주세요",
        description: "관리할 학생을 선택한 후 계속해주세요.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would store the selected student in context or state
    toast({
      title: "학생 선택 완료",
      description: "선택한 학생의 정보를 볼 수 있습니다.",
    });
    navigate("/dashboard");
  };

  const handleAddStudent = () => {
    if (!studentIdInput.trim()) {
      toast({
        title: "학생 ID를 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // In a real app, you would send a request to the backend
    toast({
      title: "연결 요청 전송 완료",
      description: "학생이 요청을 승인하면 목록에 추가됩니다.",
    });

    // Add to pending requests
    const newRequest = {
      id: `req${Date.now()}`,
      studentId: studentIdInput,
      status: "pending"
    };
    
    setPendingRequests([...pendingRequests, newRequest]);
    setStudentIdInput("");
    setIsAddDialogOpen(false);
  };

  const handleCancelRequest = (requestId: string) => {
    // In a real app, you would send a delete request to the backend
    setPendingRequests(pendingRequests.filter(request => request.id !== requestId));
    toast({
      title: "요청 취소됨",
      description: "연결 요청이 취소되었습니다."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container max-w-md mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">학생 선택</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-500">
              관리하실 학생을 선택해주세요.
            </p>
            
            <div className="space-y-2">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedStudentId === student.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleStudentSelect(student.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-accent rounded-full p-2">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">
                        {student.school} {student.grade}학년 ({student.relationshipType})
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {pendingRequests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">대기 중인 요청</h3>
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-muted/50 rounded-md mb-2 text-sm flex justify-between items-center">
                    <div>
                      <span className="font-medium">{request.studentId}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                        승인 대기중
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                      onClick={() => handleCancelRequest(request.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">취소</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex gap-2">
              <Button onClick={handleContinue} className="flex-1">
                계속하기
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex gap-1 items-center"
              >
                <PlusCircle className="h-4 w-4" />
                학생 추가
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>학생 추가하기</DialogTitle>
            <DialogDescription>
              학생 ID를 입력하면 연결 요청이 전송됩니다.
              학생이 요청을 승인하면 목록에 추가됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="학생 ID를 입력해주세요"
              value={studentIdInput}
              onChange={(e) => setStudentIdInput(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              * 학생이 앱 설정에서 제공한 ID를 입력해주세요
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>취소</Button>
            <Button onClick={handleAddStudent}>연결 요청</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSelection;
