import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/components/TaskCard";
import { toast } from "sonner";
import { User, Calendar, AlertTriangle } from "lucide-react";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (taskIds: string[], assigneeId: string, notes?: string) => void;
  tasks: Task[];
  selectedTaskIds: string[];
}

// Mock assignee data - in real app this would come from API
const mockAssignees = [
  { id: 'admin1', name: 'Admin User', role: 'Administrator' },
  { id: 'admin2', name: 'Sarah Johnson', role: 'Account Manager' },
  { id: 'admin3', name: 'Mike Chen', role: 'Technical Support' },
  { id: 'admin4', name: 'Lisa Rodriguez', role: 'Billing Specialist' },
];

export const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  tasks,
  selectedTaskIds
}) => {
  const [assigneeId, setAssigneeId] = useState('');
  const [notes, setNotes] = useState('');

  const selectedTasks = tasks.filter(task => selectedTaskIds.includes(task.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigneeId) {
      toast.error("Please select an assignee");
      return;
    }

    onAssign(selectedTaskIds, assigneeId, notes);
    onClose();
    
    const assigneeName = mockAssignees.find(a => a.id === assigneeId)?.name;
    toast.success(`${selectedTaskIds.length} task(s) assigned to ${assigneeName}`);
  };

  const handleClose = () => {
    setAssigneeId('');
    setNotes('');
    onClose();
  };

  const getTaskPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-purple-600" />
            Assign Tasks
          </DialogTitle>
          <DialogDescription>
            Assign {selectedTaskIds.length} selected task{selectedTaskIds.length !== 1 ? 's' : ''} to a team member.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Tasks Preview */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Selected Tasks ({selectedTasks.length})
            </Label>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-lg p-3 bg-gray-50">
              {selectedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {task.title}
                      </span>
                      {task.dueDate && isOverdue(task.dueDate) && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTaskPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      {task.clientName && (
                        <span className="text-xs text-gray-600">
                          Client: {task.clientName}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Assignee Selection */}
            <div>
              <Label htmlFor="assignee">Assign to *</Label>
              <Select value={assigneeId} onValueChange={setAssigneeId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select team member..." />
                </SelectTrigger>
                <SelectContent>
                  {mockAssignees.map((assignee) => (
                    <SelectItem key={assignee.id} value={assignee.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{assignee.name}</span>
                        <span className="text-xs text-gray-500">{assignee.role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assignment Notes */}
            <div>
              <Label htmlFor="notes">Assignment Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific instructions or context for the assignee..."
                rows={3}
                className="mt-1"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                Assign Tasks
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
