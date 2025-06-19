import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  MessageCircle,
  Trash2,
  Mail,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Notification {
  id: string;
  type: "message" | "payment";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: "low" | "normal" | "high";
  actionUrl?: string;
  customerName?: string;
  amount?: string;
}

const VendorNotificationsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif002",
      type: "message",
      title: "New Message",
      message: "Sarah Wilson: 'Thank you for the quick response! When can you start?'",
      timestamp: "15 minutes ago",
      isRead: false,
      priority: "normal",
      actionUrl: "/vendor-portal/messages/sarah-wilson",
      customerName: "Sarah Wilson",
    },
    {
      id: "notif003",
      type: "payment",
      title: "Payment Received",
      message: "Payment of $320 received for Deck Staining service from David Martinez",
      timestamp: "1 hour ago",
      isRead: true,
      priority: "normal",
      customerName: "David Martinez",
      amount: "$320",
    },
    {
      id: "notif005",
      type: "payment",
      title: "Payment Processed",
      message: "Payment of $2,450 for Bathroom Renovation has been processed to your account",
      timestamp: "1 day ago",
      isRead: true,
      priority: "high",
      actionUrl: "/vendor-portal/wallet",
      customerName: "Mike Johnson",
      amount: "$2,450",
    },
    {
      id: "notif007",
      type: "message",
      title: "Customer Message",
      message: "Alex Thompson: 'Could you provide references from previous work?'",
      timestamp: "3 days ago",
      isRead: true,
      priority: "normal",
      actionUrl: "/vendor-portal/messages/alex-thompson",
      customerName: "Alex Thompson",
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message": return <MessageCircle className="h-5 w-5 text-green-600" />;
      case "payment": return <DollarSign className="h-5 w-5 text-emerald-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "message": return "bg-green-100";
      case "payment": return "bg-emerald-100";
      default: return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "normal": return "border-l-blue-500";
      case "low": return "border-l-gray-500";
      default: return "border-l-gray-500";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
    toast.success("Marked as read");
  };

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: false } : notif
    ));
    toast.success("Marked as unread");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success("Notification deleted");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (notif.customerName && notif.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || notif.type === filterType;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "unread" && !notif.isRead) ||
                         (filterStatus === "read" && notif.isRead);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const unreadCount = notifications.filter(notif => !notif.isRead).length;
  const typeStats = {
    all: notifications.length,
    message: notifications.filter(n => n.type === "message").length,
    payment: notifications.filter(n => n.type === "payment").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Payment and messaging notifications for your business.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {unreadCount} unread
          </Badge>
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{typeStats.all}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{typeStats.message}</div>
            <div className="text-sm text-gray-600">Messages</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{typeStats.payment}</div>
            <div className="text-sm text-gray-600">Payments</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types ({typeStats.all})</SelectItem>
                <SelectItem value="message">Messages ({typeStats.message})</SelectItem>
                <SelectItem value="payment">Payments ({typeStats.payment})</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread ({unreadCount})</SelectItem>
                <SelectItem value="read">Read ({notifications.length - unreadCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== "all" || filterStatus !== "all" 
                  ? "Try adjusting your filters to see more notifications."
                  : "You're all caught up! New notifications will appear here."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={cn(
                "border-l-4 transition-all hover:shadow-md",
                getPriorityColor(notification.priority),
                !notification.isRead ? "bg-blue-50/30" : "bg-white"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-full", getNotificationColor(notification.type))}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={cn(
                          "font-semibold text-gray-900",
                          !notification.isRead && "font-bold"
                        )}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {notification.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">High Priority</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">{notification.timestamp}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {notification.customerName && (
                          <Badge variant="outline" className="text-xs">
                            {notification.customerName}
                          </Badge>
                        )}
                        {notification.amount && (
                          <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                            {notification.amount}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={notification.actionUrl}>View</a>
                          </Button>
                        )}
                        
                        {notification.isRead ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsUnread(notification.id)}
                            title="Mark as unread"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default VendorNotificationsPage;
