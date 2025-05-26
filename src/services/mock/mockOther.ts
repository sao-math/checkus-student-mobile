
import { GuardianRequest, School } from '@/types/api';

export const mockGuardianRequests: GuardianRequest[] = [
  {
    id: "req1",
    requesterName: "김부모",
    requesterId: "parent123",
    relationshipType: "부모",
    requestDate: "2025-05-07",
    status: "pending"
  }
];

export const mockSchools: School[] = [
  { id: "1", name: "서울중학교" },
  { id: "2", name: "부산고등학교" },
  { id: "3", name: "대구여자중학교" }
];
