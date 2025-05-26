
import { User, ConnectedStudent } from '@/types/api';

export const mockUser: User = {
  id: 'user123',
  username: 'student_hong',
  name: '홍길동',
  phoneNumber: '010-1234-5678',
  discordId: 'student#1234',
  createdAt: '2025-01-01'
};

export const mockUsers: User[] = [
  {
    id: 'user123',
    username: 'student_hong',
    name: '홍길동',
    phoneNumber: '010-1234-5678',
    discordId: 'student#1234',
    createdAt: '2025-01-01'
  }
];

export const mockConnectedStudents: ConnectedStudent[] = [
  {
    id: 'user123',
    username: 'student_hong',
    name: '홍길동',
    phoneNumber: '010-1234-5678',
    discordId: 'student#1234',
    createdAt: '2025-01-01',
    school: 'OO중학교',
    grade: '2학년'
  }
];

interface UserWithProfile extends User {
  school?: string;
  grade?: string;
}

export const mockStudentsWithProfile: UserWithProfile[] = [
  {
    ...mockUsers[0],
    school: 'OO중학교',
    grade: '2학년'
  }
];
