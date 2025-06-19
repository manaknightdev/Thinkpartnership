import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bell,
  DollarSign,
  Mail,
  Smartphone,
  Clock,
  Eye,
  EyeOff,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "payment" | "message";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const ClientNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n002",
      type: "payment",
      title: "Commission Payment Processed",
      message: "Monthly commission payment of $2,450.00 has been processed to your account ending in ****1234.",
      timestamp: "2024-01-25T09:15:00Z",
      read: false,
      priority: "medium"
    },
    {
      id: "n003",
      type: "message",
      title: "New Message from Vendor",
      message: "Rapid Plumbers sent you a message regarding their service listing approval.",
      timestamp: "2024-01-24T16:45:00Z",
      read: true,
      priority: "low"
    },
    {
      id: "n005",
      type: "payment",
      title: "Payment Notification",
      message: "Transaction fee of $125.50 has been processed for marketplace transactions this week.",
      timestamp: "2024-01-23T14:20:00Z",
      read: false,
      priority: "high"
    },
    {
      id: "n006",
      type: "message",
      title: "Customer Support Message",
      message: "You have a new message from customer support regarding your marketplace setup.",
      timestamp: "2024-01-23T11:30:00Z",
      read: true,
      priority: "low"
    }
  ]);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  const unreadCount = notifications.filter(n => !n.read).length;
  const todayNotifications = notifications.filter(n => {
    const today = new Date().toDateString();
    const notifDate = new Date(n.timestamp).toDateString();
    return today === notifDate;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment": return <DollarSign className="h-5 w-5 text-green-600" />;
      case "message": return <Mail className="h-5 w-5 text-blue-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-lg text-gray-700">
              Payment and messaging notifications for your marketplace.
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{unreadCount}</span>
            </div>
            <p className="text-sm text-gray-600">Unread notifications</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <EyeOff className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-green-600">{todayNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Center
              </CardTitle>
              <CardDescription>Manage your notifications and preferences.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Eye className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
              <Button variant="outline" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notifications">
                Notifications ({notifications.length})
              </TabsTrigger>
              {/* <TabsTrigger value="settings">
                Settings
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                    <p className="text-gray-600">You're all caught up! New notifications will appear here.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <Card 
                      key={notification.id} 
                      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                        !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Delivery Methods</CardTitle>
                        <CardDescription>Choose how you want to receive notifications.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <div>
                              <Label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</Label>
                              <p className="text-xs text-gray-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-gray-600" />
                            <div>
                              <Label htmlFor="push-notifications" className="text-sm font-medium">Push Notifications</Label>
                              <p className="text-xs text-gray-500">Receive browser push notifications</p>
                            </div>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Notification Types</CardTitle>
                        <CardDescription>Choose which types of notifications you want to receive.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="h-5 w-5 text-blue-600" />
                            <div>
                              <Label htmlFor="message-notifications" className="text-sm font-medium">Messages</Label>
                              <p className="text-xs text-gray-500">Messages from vendors and support</p>
                            </div>
                          </div>
                          <Switch
                            id="message-notifications"
                            checked={messageNotifications}
                            onCheckedChange={setMessageNotifications}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-green-600" />
                            <div>
                              <Label htmlFor="payment-notifications" className="text-sm font-medium">Payment & Billing</Label>
                              <p className="text-xs text-gray-500">Commission payments, billing updates</p>
                            </div>
                          </div>
                          <Switch
                            id="payment-notifications"
                            checked={paymentNotifications}
                            onCheckedChange={setPaymentNotifications}
                          />
                        </div>


                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNotificationsPage;
