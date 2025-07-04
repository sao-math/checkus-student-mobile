import React from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { 
  FileX, 
  Calendar, 
  Users, 
  BookOpen, 
  Bell, 
  Search,
  Plus,
  RefreshCw,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
    icon?: LucideIcon;
  };
  className?: string;
  type?: 'default' | 'tasks' | 'students' | 'notifications' | 'calendar' | 'search';
}

const TYPE_CONFIGS = {
  default: {
    icon: FileX,
    iconColor: 'text-gray-400',
    bgColor: 'bg-gray-100',
  },
  tasks: {
    icon: BookOpen,
    iconColor: 'text-blue-400', 
    bgColor: 'bg-blue-100',
  },
  students: {
    icon: Users,
    iconColor: 'text-green-400',
    bgColor: 'bg-green-100',
  },
  notifications: {
    icon: Bell,
    iconColor: 'text-yellow-400',
    bgColor: 'bg-yellow-100',
  },
  calendar: {
    icon: Calendar,
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-100',
  },
  search: {
    icon: Search,
    iconColor: 'text-orange-400',
    bgColor: 'bg-orange-100',
  },
};

/**
 * 빈 상태 컴포넌트
 * 데이터가 없거나 조건에 맞는 결과가 없을 때 표시됩니다.
 * 
 * @example
 * ```tsx
 * // 기본 빈 상태
 * <EmptyState 
 *   title="할일이 없습니다"
 *   description="오늘 예정된 할일이 없습니다."
 * />
 * 
 * // 액션 버튼이 있는 빈 상태
 * <EmptyState 
 *   type="tasks"
 *   title="할일이 없습니다"
 *   description="새로운 할일을 추가해보세요."
 *   action={{
 *     label: "할일 추가",
 *     onClick: () => console.log("Add task"),
 *     icon: Plus
 *   }}
 * />
 * 
 * // 커스텀 아이콘
 * <EmptyState 
 *   icon={CustomIcon}
 *   title="커스텀 메시지"
 *   description="커스텀 설명입니다."
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  type = 'default',
}) => {
  const config = TYPE_CONFIGS[type];
  const IconComponent = icon || config.icon;
  const ActionIcon = action?.icon;

  return (
    <Card className={cn('border-none shadow-none', className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className={cn(
          'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
          config.bgColor
        )}>
          <IconComponent className={cn('h-8 w-8', config.iconColor)} />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            {description}
          </p>
        )}
        
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="flex items-center gap-2"
          >
            {ActionIcon && <ActionIcon className="h-4 w-4" />}
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * 할일 빈 상태
 */
export const TasksEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState 
    type="tasks" 
    title="할일이 없습니다"
    description="선택한 날짜에 예정된 할일이 없습니다."
    {...props}
  />
);

/**
 * 학생 빈 상태
 */
export const StudentsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState 
    type="students" 
    title="연결된 학생이 없습니다"
    description="학생을 추가하여 학습 상황을 관리해보세요."
    action={{
      label: "학생 추가",
      onClick: () => {},
      icon: Plus,
      variant: "default",
      ...props.action
    }}
    {...props}
  />
);

/**
 * 알림 빈 상태
 */
export const NotificationsEmptyState: React.FC<Omit<EmptyStateProps, 'type'>> = (props) => (
  <EmptyState 
    type="notifications" 
    title="알림이 없습니다"
    description="새로운 알림이 도착하면 여기에 표시됩니다."
    {...props}
  />
);

/**
 * 검색 결과 빈 상태
 */
export const SearchEmptyState: React.FC<Omit<EmptyStateProps, 'type'> & { query?: string }> = ({ 
  query, 
  ...props 
}) => (
  <EmptyState 
    type="search" 
    title="검색 결과가 없습니다"
    description={query ? `"${query}"에 대한 검색 결과를 찾을 수 없습니다.` : "다른 검색어를 시도해보세요."}
    action={{
      label: "검색 조건 변경",
      onClick: () => {},
      icon: RefreshCw,
      variant: "outline",
      ...props.action
    }}
    {...props}
  />
);

/**
 * 일반적인 빈 상태들
 */
export const EmptyStates = {
  Tasks: TasksEmptyState,
  Students: StudentsEmptyState,
  Notifications: NotificationsEmptyState,
  Search: SearchEmptyState,
};

export default EmptyState; 