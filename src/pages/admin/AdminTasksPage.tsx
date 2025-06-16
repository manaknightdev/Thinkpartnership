import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskModal } from "@/components/modals/TaskModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { TaskAssignmentModal } from "@/components/modals/TaskAssignmentModal";
import { toast } from "sonner";

// Mock data for tasks
const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Complete Client Onboarding Documentation',
    description: 'Finalize the onboarding documentation for ThinkPartnership Corp including contract review, payment setup, and initial vendor approval process.',
    status: 'in-progress',
    priority: 'high',
    category: 'onboarding',
    clientId: 'client1',
    clientName: 'ThinkPartnership Corp',
    createdBy: 'Admin User',
    createdAt: '2024-01-20T10:00:00Z',
    dueDate: '2024-01-28T17:00:00Z',
    notes: 'Client has requested expedited setup due to Q1 launch timeline.'
  },
  {
    id: 'task2',
    title: 'Resolve Billing Discrepancy',
    description: 'Investigate and resolve the commission calculation discrepancy reported by Local Connect for December transactions.',
    status: 'pending',
    priority: 'urgent',
    category: 'billing',
    clientId: 'client2',
    clientName: 'Local Connect',
    createdBy: 'Admin User',
    createdAt: '2024-01-22T14:30:00Z',
    dueDate: '2024-01-25T12:00:00Z',
    notes: 'Client reported $500 difference in expected vs actual commission payout.'
  },
  {
    id: 'task3',
    title: 'Follow up on Vendor Application',
    description: 'Contact Rapid Plumbers regarding missing documentation in their vendor application.',
    status: 'overdue',
    priority: 'medium',
    category: 'support',
    clientId: 'client1',
    clientName: 'ThinkPartnership Corp',
    createdBy: 'Admin User',
    createdAt: '2024-01-18T09:15:00Z',
    dueDate: '2024-01-23T17:00:00Z'
  },
  {
    id: 'task4',
    title: 'Quarterly Compliance Review',
    description: 'Conduct quarterly compliance review for all active clients and ensure all documentation is up to date.',
    status: 'completed',
    priority: 'medium',
    category: 'compliance',
    createdBy: 'Admin User',
    createdAt: '2024-01-15T11:00:00Z',
    dueDate: '2024-01-31T17:00:00Z',
    completedAt: '2024-01-24T16:30:00Z',
    notes: 'All clients passed compliance review. Minor documentation updates completed.'
  }
];

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Helper function to check if a task is overdue
  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // Update overdue tasks automatically
  React.useEffect(() => {
    const updateOverdueTasks = () => {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.status !== 'completed' && task.dueDate && isOverdue(task.dueDate) && task.status !== 'overdue') {
            return { ...task, status: 'overdue' as Task['status'] };
          }
          return task;
        })
      );
    };

    updateOverdueTasks();
    // Check for overdue tasks every minute
    const interval = setInterval(updateOverdueTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.clientName && task.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesClient = clientFilter === 'all' || task.clientId === clientFilter;
    const matchesAssignee = assigneeFilter === 'all' ||
                           (assigneeFilter === 'unassigned' && !task.assignedTo) ||
                           task.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesClient && matchesAssignee;
  });

  // Get tasks by status for tabs
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const overdueTasks = filteredTasks.filter(task => task.status === 'overdue');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Statistics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const overdueCount = tasks.filter(task => task.status === 'overdue').length;
  const urgentCount = tasks.filter(task => task.priority === 'urgent' && task.status !== 'completed').length;

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalMode('create');
    setIsTaskModalOpen(true);
  };

  const handleCreateTaskFromTemplate = (template: 'onboarding' | 'billing' | 'support') => {
    const templates = {
      onboarding: {
        title: 'Client Onboarding Checklist',
        description: 'Complete the full onboarding process including documentation review, payment setup, and initial configuration.',
        category: 'onboarding' as Task['category'],
        priority: 'high' as Task['priority'],
        notes: 'Standard onboarding template - customize as needed for specific client requirements.'
      },
      billing: {
        title: 'Billing Issue Resolution',
        description: 'Investigate and resolve billing discrepancy or payment processing issue.',
        category: 'billing' as Task['category'],
        priority: 'urgent' as Task['priority'],
        notes: 'Review transaction logs and contact client for clarification if needed.'
      },
      support: {
        title: 'Client Support Follow-up',
        description: 'Follow up on client support request or technical issue.',
        category: 'support' as Task['category'],
        priority: 'medium' as Task['priority'],
        notes: 'Ensure client satisfaction and document resolution steps.'
      }
    };

    const templateData = templates[template];
    const newTask: Task = {
      ...templateData,
      id: `task${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: 'Admin User',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };

    setTasks(prev => [newTask, ...prev]);
    toast.success(`${templateData.title} created successfully!`);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalMode('edit');
    setIsTaskModalOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'createdBy'>) => {
    if (modalMode === 'create') {
      const newTask: Task = {
        ...taskData,
        id: `task${Date.now()}`,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User'
      };
      setTasks(prev => [newTask, ...prev]);
    } else if (selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, ...taskData }
          : task
      ));
    }
  };

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? {
            ...task,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));
    toast.success("Task status updated successfully!");
  };

  const handleBulkStatusChange = (status: Task['status']) => {
    if (selectedTasks.length === 0) {
      toast.error("Please select tasks to update");
      return;
    }

    setTasks(prev => prev.map(task =>
      selectedTasks.includes(task.id)
        ? {
            ...task,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ));

    setSelectedTasks([]);
    setShowBulkActions(false);
    toast.success(`${selectedTasks.length} tasks updated successfully!`);
  };

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) {
      toast.error("Please select tasks to delete");
      return;
    }

    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
    setShowBulkActions(false);
    toast.success(`${selectedTasks.length} tasks deleted successfully!`);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  const handleAssignTasks = (taskIds: string[], assigneeId: string, notes?: string) => {
    setTasks(prev => prev.map(task =>
      taskIds.includes(task.id)
        ? {
            ...task,
            assignedTo: assigneeId,
            notes: notes ? `${task.notes ? task.notes + '\n\n' : ''}Assignment: ${notes}` : task.notes
          }
        : task
    ));

    setSelectedTasks([]);
    setShowBulkActions(false);
  };

  // Update bulk actions visibility
  React.useEffect(() => {
    setShowBulkActions(selectedTasks.length > 0);
  }, [selectedTasks]);

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks & Follow-ups</h1>
        <p className="text-lg text-gray-700 mb-4">
          Manage client account tasks, follow-ups, and administrative activities.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleCreateTask} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
          </Button>
          <Button
            onClick={() => handleCreateTaskFromTemplate('onboarding')}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Quick: Onboarding
          </Button>
          <Button
            onClick={() => handleCreateTaskFromTemplate('billing')}
            variant="outline"
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            Quick: Billing Issue
          </Button>
          <Button
            onClick={() => handleCreateTaskFromTemplate('support')}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            Quick: Support
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalTasks}</div>
            <p className="text-xs text-gray-600">All time tasks</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-green-600">
              {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
            <p className="text-xs text-red-600">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{urgentCount}</div>
            <p className="text-xs text-orange-600">High priority active tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="account-setup">Account Setup</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="client1">ThinkPartnership Corp</SelectItem>
                <SelectItem value="client2">Local Connect</SelectItem>
                <SelectItem value="client3">ServiceHub Pro</SelectItem>
                <SelectItem value="client4">MarketPlace Solutions</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Assignees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="admin1">Admin User</SelectItem>
                <SelectItem value="admin2">Sarah Johnson</SelectItem>
                <SelectItem value="admin3">Mike Chen</SelectItem>
                <SelectItem value="admin4">Lisa Rodriguez</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {showBulkActions && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-purple-900">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTasks([])}
                  className="text-purple-700 border-purple-300"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignmentModalOpen(true)}
                  className="text-purple-700 border-purple-300"
                >
                  Assign Tasks
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('in-progress')}
                  className="text-blue-700 border-blue-300"
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange('completed')}
                  className="text-green-700 border-green-300"
                >
                  Mark Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-red-700 border-red-300"
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">
              All ({filteredTasks.length})
            </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-red-600">
            Overdue ({overdueTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
          </TabsList>

          {filteredTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTasks.length === filteredTasks.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                Select All ({filteredTasks.length})
              </span>
            </div>
          )}
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 text-center mb-4">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all' || clientFilter !== 'all'
                    ? "Try adjusting your search criteria or filters."
                    : "Create your first task to get started with client account management."
                  }
                </p>
                <Button onClick={handleCreateTask} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={handleViewTask}
                  onEdit={handleEditTask}
                  onStatusChange={handleStatusChange}
                  onSelect={handleSelectTask}
                  isSelected={selectedTasks.includes(task.id)}
                  showSelection={true}
                  showClient={true}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={handleViewTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.includes(task.id)}
                showSelection={true}
                showClient={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={handleViewTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.includes(task.id)}
                showSelection={true}
                showClient={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={handleViewTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.includes(task.id)}
                showSelection={true}
                showClient={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={handleViewTask}
                onEdit={handleEditTask}
                onStatusChange={handleStatusChange}
                onSelect={handleSelectTask}
                isSelected={selectedTasks.includes(task.id)}
                showSelection={true}
                showClient={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={selectedTask}
        mode={modalMode}
      />

      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        onEdit={handleEditTask}
        onStatusChange={handleStatusChange}
      />

      <TaskAssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        onAssign={handleAssignTasks}
        tasks={tasks}
        selectedTaskIds={selectedTasks}
      />
    </div>
  );
};

export default AdminTasksPage;
