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
  Search, 
  Filter, 
  CheckSquare, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";
import { TaskCard, Task } from "@/components/TaskCard";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { toast } from "sonner";

// Mock data for client-specific tasks (read-only view)
const mockClientTasks: Task[] = [
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
    id: 'task5',
    title: 'Review Marketplace Branding Guidelines',
    description: 'Review and approve the custom branding elements for your marketplace including logo placement, color scheme, and custom domain setup.',
    status: 'pending',
    priority: 'medium',
    category: 'account-setup',
    clientId: 'client1',
    clientName: 'ThinkPartnership Corp',
    createdBy: 'Admin User',
    createdAt: '2024-01-23T11:00:00Z',
    dueDate: '2024-01-30T17:00:00Z',
    notes: 'Branding team has prepared initial mockups for review.'
  },
  {
    id: 'task6',
    title: 'Set Up Payment Processing',
    description: 'Complete the Stripe Connect setup for your marketplace to enable commission processing and vendor payouts.',
    status: 'completed',
    priority: 'high',
    category: 'billing',
    clientId: 'client1',
    clientName: 'ThinkPartnership Corp',
    createdBy: 'Admin User',
    createdAt: '2024-01-19T14:30:00Z',
    dueDate: '2024-01-25T17:00:00Z',
    completedAt: '2024-01-24T15:45:00Z',
    notes: 'Payment processing is now active. Test transactions completed successfully.'
  },
  {
    id: 'task7',
    title: 'Vendor Approval Process Training',
    description: 'Schedule and complete training session on how to review and approve vendor applications for your marketplace.',
    status: 'pending',
    priority: 'medium',
    category: 'onboarding',
    clientId: 'client1',
    clientName: 'ThinkPartnership Corp',
    createdBy: 'Admin User',
    createdAt: '2024-01-24T09:00:00Z',
    dueDate: '2024-02-02T17:00:00Z',
    notes: 'Training materials have been prepared. Waiting for client availability.'
  }
];

const ClientTasksPage = () => {
  const [tasks] = useState<Task[]>(mockClientTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Get tasks by status for tabs
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Statistics
  const totalTasks = tasks.length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;
  const pendingCount = tasks.filter(task => task.status === 'pending').length;
  const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsModalOpen(true);
  };

  const handleContactSupport = () => {
    toast.info("Redirecting to support chat...");
    // In a real app, this would navigate to support or open a chat
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks & Follow-ups</h1>
        <p className="text-lg text-gray-700 mb-4">
          Track your account setup progress and follow-up items assigned by our admin team.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleContactSupport} className="bg-green-600 hover:bg-green-700">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalTasks}</div>
            <p className="text-xs text-gray-600">Assigned to your account</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
            <p className="text-xs text-blue-600">
              {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgressCount}</div>
            <p className="text-xs text-orange-600">Currently being worked on</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-yellow-600">Awaiting action</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All ({filteredTasks.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 text-center mb-4">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all'
                    ? "Try adjusting your search criteria or filters."
                    : "No tasks have been assigned to your account yet."
                  }
                </p>
                <Button onClick={handleContactSupport} className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
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
                  showClient={false}
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
                showClient={false}
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
                showClient={false}
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
                showClient={false}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={selectedTask}
        showEditButton={false} // Client view is read-only
      />
    </div>
  );
};

export default ClientTasksPage;
