
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, PlusCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useConnectedStudents, useSendGuardianRequest } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

const StudentSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  // API 훅 사용
  const { data: students = [], isLoading } = useConnectedStudents();
  const sendRequestMutation = useSendGuardianRequest();

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

    sendRequestMutation.mutate(studentIdInput, {
      onSuccess: () => {
        setPendingRequests([...pendingRequests, studentIdInput]);
        setStudentIdInput("");
        setIsAddDialogOpen(false);
      }
    });
  };

  const handleCancelRequest = (studentId: string) => {
    setPendingRequests(pendingRequests.filter(id => id !== studentId));
    toast({
      title: "요청 취소됨",
      description: "연결 요청이 취소되었습니다."
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-md mx-auto p-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

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
              {students.map((student) => (
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
                        {student.school} {student.grade}학년
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {pendingRequests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">대기 중인 요청</h3>
                {pendingRequests.map((studentId) => (
                  <div key={studentId} className="p-3 bg-muted/50 rounded-md mb-2 text-sm flex justify-between items-center">
                    <div>
                      <span className="font-medium">{studentId}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full ml-2">
                        승인 대기중
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                      onClick={() => handleCancelRequest(studentId)}
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
            <Button 
              onClick={handleAddStudent}
              disabled={sendRequestMutation.isPending}
            >
              {sendRequestMutation.isPending ? "전송 중..." : "연결 요청"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentSelection;
