import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle,
  Clock,
  DollarSign,
  MessageCircle,
  Trash2,
  Mail,
  Search,
  Settings,
  Loader2,
  AlertCircle,
  Check,
  Filter,
  BellRing,
  Smartphone,
  MessageSquare,
  Eye,
  EyeOff,
  TestTube,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import VendorNotificationsAPI, {
  Notification,
  NotificationSettings,
  NotificationStats
} from "@/services/VendorNotificationsAPI";
import { showSuccess, showError } from "@/utils/toast";

const VendorNotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationStats, setNotificationStats] = useState<NotificationStats | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  // Load data on component mount
  useEffect(() => {
    loadNotificationData();
  }, [pagination.page, filterType, filterStatus]);

  const loadNotificationData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const filters: any = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filterType !== "all") filters.type = filterType;
      if (filterStatus === "read") filters.is_read = true;
      if (filterStatus === "unread") filters.is_read = false;

      // Load notifications data in parallel
      const [notificationsRes, statsRes, settingsRes] = await Promise.all([
        VendorNotificationsAPI.getNotifications(filters),
        VendorNotificationsAPI.getNotificationStats(),
        VendorNotificationsAPI.getNotificationSettings(),
      ]);

      if (notificationsRes.error) {
        setError(notificationsRes.message);
        return;
      }

      if (notificationsRes.data) {
        setNotifications(notificationsRes.data.notifications);
        if (notificationsRes.pagination) setPagination(notificationsRes.pagination);
      }
      if (statsRes.data) setNotificationStats(statsRes.data);
      if (settingsRes.data) setNotificationSettings(settingsRes.data);

    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load notification data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await VendorNotificationsAPI.markAsRead(notificationId);

      if (response.error) {
        showError(response.message);
        return;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, is_read: true, read_at: new Date().toISOString() }
            : notif
        )
      );

      await loadNotificationData(); // Refresh stats
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await VendorNotificationsAPI.markAllAsRead();

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("All notifications marked as read!");
      await loadNotificationData();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to mark all notifications as read");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (!confirm("Are you sure you want to delete this notification?")) return;

    try {
      const response = await VendorNotificationsAPI.deleteNotification(notificationId);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess("Notification deleted!");
      await loadNotificationData();
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to delete notification");
    }
  };

  const handleUpdateSettings = async (settingKey: keyof NotificationSettings, value: any) => {
    if (!notificationSettings) return;

    try {
      setIsUpdating(true);
      setError("");

      const updatedSettings = { ...notificationSettings, [settingKey]: value };
      setNotificationSettings(updatedSettings);

      const response = await VendorNotificationsAPI.updateNotificationSettings({ [settingKey]: value });

      if (response.error) {
        setError(response.message);
        showError(response.message);
        // Revert local state
        setNotificationSettings(notificationSettings);
        return;
      }

      showSuccess("Settings updated successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update settings";
      setError(errorMessage);
      showError(errorMessage);
      // Revert local state
      setNotificationSettings(notificationSettings);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTestNotification = async (type: string, channel: 'email' | 'push' | 'sms') => {
    try {
      const response = await VendorNotificationsAPI.testNotification(type, channel);

      if (response.error) {
        showError(response.message);
        return;
      }

      showSuccess(`Test ${channel} notification sent!`);
    } catch (err: any) {
      showError(err.response?.data?.message || "Failed to send test notification");
    }
  };
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_request": return <Bell className="h-5 w-5 text-blue-600" />;
      case "payment_received": return <DollarSign className="h-5 w-5 text-green-600" />;
      case "review_received": return <CheckCircle className="h-5 w-5 text-yellow-600" />;
      case "message_received": return <MessageCircle className="h-5 w-5 text-purple-600" />;
      case "system_update": return <Settings className="h-5 w-5 text-gray-600" />;
      case "referral_signup": return <BellRing className="h-5 w-5 text-orange-600" />;
      case "service_approved": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "service_rejected": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_request": return "bg-blue-100";
      case "payment_received": return "bg-green-100";
      case "review_received": return "bg-yellow-100";
      case "message_received": return "bg-purple-100";
      case "system_update": return "bg-gray-100";
      case "referral_signup": return "bg-orange-100";
      case "service_approved": return "bg-green-100";
      case "service_rejected": return "bg-red-100";
      default: return "bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "border-l-red-600";
      case "high": return "border-l-red-400";
      case "medium": return "border-l-yellow-400";
      case "low": return "border-l-gray-400";
      default: return "border-l-gray-400";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "read" && notification.is_read) ||
                         (filterStatus === "unread" && !notification.is_read);

    return matchesSearch && matchesType && matchesStatus;
  });

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Manage your notifications and preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {notificationStats?.unread_count || 0} unread
          </Badge>
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notificationStats?.total_notifications || 0}</div>
            <p className="text-xs text-muted-foreground">
              All notifications
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{notificationStats?.unread_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{notificationStats?.today_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Received today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{notificationStats?.high_priority_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              Urgent: {notificationStats?.urgent_count || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
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
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="new_request">New Requests</SelectItem>
                    <SelectItem value="payment_received">Payments</SelectItem>
                    <SelectItem value="message_received">Messages</SelectItem>
                    <SelectItem value="review_received">Reviews</SelectItem>
                    <SelectItem value="system_update">System Updates</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unread">Unread ({notificationStats?.unread_count || 0})</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
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
                    !notification.is_read ? "bg-blue-50/30" : "bg-white"
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
                              !notification.is_read && "font-bold"
                            )}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {(notification.priority === "high" || notification.priority === "urgent") && (
                              <Badge variant="destructive" className="text-xs">
                                {notification.priority === "urgent" ? "Urgent" : "High Priority"}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {formatTimeAgo(notification.created_at)}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-3">{notification.message}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              notification.priority === "urgent" ? "text-red-700 bg-red-50" :
                              notification.priority === "high" ? "text-orange-700 bg-orange-50" :
                              notification.priority === "medium" ? "text-yellow-700 bg-yellow-50" :
                              "text-gray-700 bg-gray-50"
                            )}>
                              {notification.priority}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {notification.action_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={notification.action_url}>
                                  {notification.action_text || "View"}
                                </a>
                              </Button>
                            )}

                            {!notification.is_read ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                                title="Mark as read"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                title="Already read"
                                disabled
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNotification(notification.id)}
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {notificationSettings && (
            <>
              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Service Requests</Label>
                      <p className="text-sm text-gray-600">Get notified when customers request your services</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_new_requests}
                      onCheckedChange={(checked) => handleUpdateSettings("email_new_requests", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Notifications</Label>
                      <p className="text-sm text-gray-600">Payment confirmations and updates</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_payments}
                      onCheckedChange={(checked) => handleUpdateSettings("email_payments", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Review Notifications</Label>
                      <p className="text-sm text-gray-600">New reviews and ratings from customers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_reviews}
                      onCheckedChange={(checked) => handleUpdateSettings("email_reviews", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Message Notifications</Label>
                      <p className="text-sm text-gray-600">New messages from customers</p>
                    </div>
                    <Switch
                      checked={notificationSettings.email_messages}
                      onCheckedChange={(checked) => handleUpdateSettings("email_messages", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Push Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Service Requests</Label>
                      <p className="text-sm text-gray-600">Real-time push notifications for new requests</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_new_requests}
                      onCheckedChange={(checked) => handleUpdateSettings("push_new_requests", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Updates</Label>
                      <p className="text-sm text-gray-600">Instant payment notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.push_payments}
                      onCheckedChange={(checked) => handleUpdateSettings("push_payments", checked)}
                      disabled={isUpdating}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Test Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="h-5 w-5" />
                    Test Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleTestNotification("new_request", "email")}
                    >
                      Test Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleTestNotification("new_request", "push")}
                    >
                      Test Push
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorNotificationsPage;
