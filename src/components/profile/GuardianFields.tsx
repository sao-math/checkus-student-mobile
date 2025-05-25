
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StudentRelationship {
  studentId: string;
  relationship: string;
  studentName: string;
}

interface GuardianFieldsProps {
  studentRelationships: StudentRelationship[];
  onRelationshipChange: (index: number, field: string, value: string) => void;
}

const GuardianFields: React.FC<GuardianFieldsProps> = ({
  studentRelationships,
  onRelationshipChange,
}) => {
  // If no relationships exist yet, show a placeholder
  if (studentRelationships.length === 0) {
    return (
      <div className="rounded-md border p-4 text-center text-gray-500">
        연결된 학생이 없습니다. 학생을 등록하려면 관리자에게 문의해주세요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label>연결된 학생</Label>
      {studentRelationships.map((relationship, index) => (
        <Card key={relationship.studentId}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{relationship.studentName}</div>
            </div>
            
            <div className="space-y-2 mt-2">
              <Label htmlFor={`relationship-${index}`}>관계</Label>
              <Select
                value={relationship.relationship}
                onValueChange={(value) => onRelationshipChange(index, "relationship", value)}
              >
                <SelectTrigger id={`relationship-${index}`}>
                  <SelectValue placeholder="관계 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FATHER">부</SelectItem>
                  <SelectItem value="MOTHER">모</SelectItem>
                  <SelectItem value="OTHER">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GuardianFields;
