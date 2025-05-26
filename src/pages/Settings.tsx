
import React from "react";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Copy, Check, X } from "lucide-react";
import { 
  useStudentId, 
  useGuardianRequests, 
  useApproveGuardianRequest, 
  useRejectGuardianRequest 
} from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  
  // API 훅 사용
  const { data: studentIdData, isLoading: studentIdLoading } = useStudentId();
  const { data: requests = [], isLoading: requestsLoading } = useGuardianRequests();
  const approveMutation = useApproveGuardianRequest();
  const rejectMutation = useRejectGuardianRequest();

  const handleCopyStudentId = () => {
    if (studentIdData?.studentId) {
      navigator.clipboard.writeText(studentIdData.studentId);
      toast({
        title: "복사 완료",
        description: "학생 ID가 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleRequestAction = (requestId: string, action: "approve" | "reject") => {
    if (action === "approve") {
      approveMutation.mutate(requestId);
    } else {
      rejectMutation.mutate(requestId);
    }
  };

  // Filter pending requests
  const pendingRequests = requests.filter(req => req.status === "pending");
  
  // Filter approved and rejected requests for history
  const historyRequests = requests.filter(req => req.status !== "pending");

  if (studentIdLoading || requestsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 flex items-center justify-center min-h-96">
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
      <div className="container max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">학부모 연결</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>내 학생 ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">
              학부모나 선생님이 귀하를 연결하려면 아래 ID가 필요합니다.
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-3 py-1.5 rounded text-sm font-mono flex-1">
                {studentIdData?.studentId || 'Loading...'}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopyStudentId}>
                <Copy className="h-4 w-4 mr-1" /> 복사
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>연결 요청 관리</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-center py-8 text-gray-500">대기 중인 연결 요청이 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>요청자</TableHead>
                    <TableHead>관계</TableHead>
                    <TableHead>요청일</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.requesterName}</TableCell>
                      <TableCell>{request.relationshipType}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestAction(request.id, "approve")}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={approveMutation.isPending}
                          >
                            <Check className="h-4 w-4 mr-1" /> 승인
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleRequestAction(request.id, "reject")}
                            disabled={rejectMutation.isPending}
                          >
                            <X className="h-4 w-4 mr-1" /> 거부
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {historyRequests.length > 0 && (
              <>
                <Separator className="my-6" />
                <h3 className="font-semibold mb-4">요청 기록</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>요청자</TableHead>
                      <TableHead>관계</TableHead>
                      <TableHead>요청일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.requesterName}</TableCell>
                        <TableCell>{request.relationshipType}</TableCell>
                        <TableCell>{request.requestDate}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === "approved" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {request.status === "approved" ? "승인됨" : "거절됨"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
