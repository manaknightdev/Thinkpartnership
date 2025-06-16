import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  User, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Edit,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'account-setup' | 'billing' | 'support' | 'onboarding' | 'compliance' | 'general';
  assignedTo?: string;
  clientId?: string;
  clientName?: string;
  createdBy: string;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
}

interface TaskCardProps {
  task: Task;
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  onSelect?: (taskId: string) => void;
  isSelected?: boolean;
  showClient?: boolean;
  compact?: boolean;
  showSelection?: boolean;
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryLabel = (category: Task['category']) => {
  switch (category) {
    case 'account-setup':
      return 'Account Setup';
    case 'billing':
      return 'Billing';
    case 'support':
      return 'Support';
    case 'onboarding':
      return 'Onboarding';
    case 'compliance':
      return 'Compliance';
    case 'general':
      return 'General';
    default:
      return 'General';
  }
};

const isOverdue = (dueDate?: string) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onView,
  onEdit,
  onStatusChange,
  onSelect,
  isSelected = false,
  showClient = false,
  compact = false,
  showSelection = false
}) => {
  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <Card className={cn(
      "hover:shadow-md transition-all duration-200",
      isTaskOverdue && "border-red-200 bg-red-50",
      isSelected && "border-purple-300 bg-purple-50",
      compact ? "p-3" : "p-4"
    )}>
      <CardHeader className={cn("pb-3", compact && "pb-2")}>
        <div className="flex items-start justify-between">
          {showSelection && onSelect && (
            <div className="flex items-center mr-3 mt-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(task.id)}
                className="rounded border-gray-300"
              />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className={cn(
              "text-lg font-semibold text-gray-900 mb-2",
              compact && "text-base mb-1"
            )}>
              {task.title}
              {isTaskOverdue && (
                <AlertTriangle className="inline-block ml-2 h-4 w-4 text-red-500" />
              )}
            </CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {getCategoryLabel(task.category)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("pt-0", compact && "pt-0")}>
        {!compact && (
          <p className="text-gray-600 mb-4 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="space-y-2 mb-4">
          {showClient && task.clientName && (
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-2" />
              <span>Client: {task.clientName}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Created by: {task.createdBy}</span>
          </div>

          {task.dueDate && (
            <div className={cn(
              "flex items-center text-sm",
              isTaskOverdue ? "text-red-600 font-medium" : "text-gray-600"
            )}>
              <Calendar className="h-4 w-4 mr-2" />
              <span>Due: {formatDate(task.dueDate)}</span>
              {isTaskOverdue && <span className="ml-1">(Overdue)</span>}
            </div>
          )}

          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>

          {task.completedAt && (
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed: {formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(task)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          )}
          
          {onEdit && task.status !== 'completed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(task)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}

          {onStatusChange && task.status !== 'completed' && (
            <Button
              size="sm"
              onClick={() => onStatusChange(task.id, 'completed')}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
