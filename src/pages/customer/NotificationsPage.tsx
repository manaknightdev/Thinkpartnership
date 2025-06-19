import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Bell,
  Check,
  X,
  Clock,
  MessageCircle,
  DollarSign,
  Trash2
} from "lucide-react";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "payment",
      title: "Payment Processed",
      message: "Your payment of $320 for home painting service has been processed successfully",
      time: "2 hours ago",
      read: false,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "You have a new message from your service provider",
      time: "4 hours ago",
      read: false,
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Confirmation",
      message: "Payment receipt for cleaning service ($150) has been sent to your email",
      time: "1 day ago",
      read: true,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      id: 4,
      type: "message",
      title: "Message Reply",
      message: "Service provider replied to your message about scheduling",
      time: "2 days ago",
      read: true,
      icon: MessageCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationAction = (notification: any) => {
    switch (notification.type) {
      case "payment":
        return () => navigate('/marketplace/orders');
      case "message":
        return () => navigate('/marketplace/messages');
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
                    onClick={markAllAsRead}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark all read
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearAll}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {notifications.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No notifications</h2>
              <p className="text-gray-600 mb-8">You're all caught up! Check back later for updates.</p>
              <Button 
                onClick={() => navigate('/marketplace')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Services
              </Button>
            </div>
          ) : (
            /* Notifications List */
            <div className="space-y-4">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
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
                        <div className={`w-12 h-12 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className={`w-6 h-6 ${notification.color}`} />
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
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                title="Delete notification"
                              >
                                <X className="w-4 h-4" />
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
