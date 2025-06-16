import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Building,
  Edit,
  AlertTriangle,
  FileText
} from "lucide-react";
import { Task } from "@/components/TaskCard";
import { cn } from "@/lib/utils";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onStatusChange?: (taskId: string, status: Task['status']) => void;
  showEditButton?: boolean;
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
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onStatusChange,
  showEditButton = true
}) => {
  if (!task) return null;

  const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Task Details
            {isTaskOverdue && (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete task information and status
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Title and Badges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {task.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.toUpperCase()} PRIORITY
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {getCategoryLabel(task.category)}
                </Badge>
                {isTaskOverdue && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    OVERDUE
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            </div>

            {/* Task Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Task Information
                </h3>
                
                {task.clientName && (
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Assigned Client</p>
                      <p className="text-sm text-gray-600">{task.clientName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created By</p>
                    <p className="text-sm text-gray-600">{task.createdBy}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Created</p>
                    <p className="text-sm text-gray-600">{formatDate(task.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Timeline
                </h3>

                {task.dueDate && (
                  <div className="flex items-center space-x-3">
                    <Calendar className={cn(
                      "h-5 w-5",
                      isTaskOverdue ? "text-red-500" : "text-gray-400"
                    )} />
                    <div>
                      <p className={cn(
                        "text-sm font-medium",
                        isTaskOverdue ? "text-red-900" : "text-gray-900"
                      )}>
                        Due Date
                        {isTaskOverdue && " (Overdue)"}
                      </p>
                      <p className={cn(
                        "text-sm",
                        isTaskOverdue ? "text-red-600" : "text-gray-600"
                      )}>
                        {formatDateShort(task.dueDate)}
                      </p>
                    </div>
                  </div>
                )}

                {task.completedAt && (
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Completed</p>
                      <p className="text-sm text-gray-600">{formatDate(task.completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {task.notes && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {task.notes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {showEditButton && onEdit && task.status !== 'completed' && (
            <Button
              variant="outline"
              onClick={() => {
                onEdit(task);
                onClose();
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </Button>
          )}

          {onStatusChange && task.status !== 'completed' && (
            <Button
              onClick={() => {
                onStatusChange(task.id, 'completed');
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
