
import { Task } from '@/types/api';

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "수학 숙제 완료하기",
    description: "교과서 37-38페이지 연습문제 풀기",
    teacher: "김선생님",
    resourceType: "link",
    resourceUrl: "https://example.com/math",
    isCompleted: false,
    dueTime: "오후 6:00",
    dueDate: "2025-05-25"
  },
  {
    id: "2",
    title: "영어 단어 시험 준비",
    description: "Unit 5-6 단어 암기하기",
    teacher: "이선생님",
    resourceType: "link",
    resourceUrl: "https://example.com/english",
    isCompleted: false,
    dueTime: "오후 8:00",
    dueDate: "2025-05-25"
  }
];
