import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import NotificationsAPI, { Notification } from "@/services/NotificationsAPI";
import {
  Bell,
  Check,
  X,
  Clock,
  MessageCircle,
  DollarSign,
  Trash2,
  FileText,
  ShoppingCart,
  Settings,
  Loader2
} from "lucide-react";

const NotificationsPage = () => {
  const navigate = useNavigate();

  // API state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingRead, setMarkingRead] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await NotificationsAPI.getNotifications(page, 20);
      if (response.error) {
        throw new Error(response.message || 'Failed to fetch notifications');
      }

      setNotifications(response.notifications);
      setTotalPages(response.pagination.total_pages);
      setUnreadCount(response.unread_count);
    } catch (err: any) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Get notification icon and styling
  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'payment':
        return {
          icon: DollarSign,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'message':
        return {
          icon: MessageCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
      case 'service_request':
        return {
          icon: FileText,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        };
      case 'order_update':
        return {
          icon: ShoppingCart,
          color: 'text-orange-600',
          bgColor: 'bg-orange-100'
        };
      case 'system':
        return {
          icon: Settings,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      default:
        return {
          icon: Bell,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      setMarkingRead(notificationId);

      const response = await NotificationsAPI.markAsRead(notificationId);
      if (response.error) {
        throw new Error(response.message || 'Failed to mark as read');
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
    } finally {
      setMarkingRead(null);
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId: number) => {
    try {
      setDeleting(notificationId);

      const response = await NotificationsAPI.deleteNotification(notificationId);
      if (response.error) {
        throw new Error(response.message || 'Failed to delete notification');
      }

      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));

      // Update unread count if it was unread
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete notification');
    } finally {
      setDeleting(null);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      setMarkingAllRead(true);

      const response = await NotificationsAPI.markAllAsRead();
      if (response.error) {
        throw new Error(response.message || 'Failed to mark all as read');
      }

      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
    } finally {
      setMarkingAllRead(false);
    }
  };



  // Loading state
  if (loading && page === 1) {
    return (
      <MarketplaceLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const getNotificationAction = (notification: Notification) => {
    switch (notification.type) {
      case "payment":
        return () => navigate('/marketplace/orders');
      case "message":
        return () => navigate('/marketplace/chat');
      case "service_request":
        return () => navigate('/marketplace/requests');
      case "order_update":
        return () => navigate('/marketplace/orders');
      default:
        return () => {};
    }
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600">
                    Payment and messaging notifications - {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={markingAllRead}
                  >
                    {markingAllRead ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Error State */}
          {error && (
            <Alert className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {notifications.length === 0 && !loading ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No notifications</h2>
              <p className="text-gray-600 mb-8">You're all caught up! Check back later for updates.</p>
              <Button
                onClick={() => navigate('/marketplace/services')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Services
              </Button>
            </div>
          ) : (
            /* Notifications List */
            <div className="space-y-4">
              {notifications.map((notification) => {
                const style = getNotificationStyle(notification.type);
                const IconComponent = style.icon;
                return (
                  <Card
                    key={notification.id}
                    className={`border transition-all duration-200 hover:shadow-md cursor-pointer ${
                      !notification.read ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-white'
                    }`}
                    onClick={getNotificationAction(notification)}
                  >
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 ${style.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 ${style.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  disabled={markingRead === notification.id}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="Mark as read"
                                >
                                  {markingRead === notification.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Check className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                                disabled={deleting === notification.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete notification"
                              >
                                {deleting === notification.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        {notifications.length > 0 && (
          <section className="bg-white border-t border-gray-200 py-8">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <p className="text-gray-600 mb-6">
                Manage payment and messaging notification preferences
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/marketplace/account')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Notification Settings
              </Button>
            </div>
          </section>
        )}
      </div>
    </MarketplaceLayout>
  );
};

export default NotificationsPage;
