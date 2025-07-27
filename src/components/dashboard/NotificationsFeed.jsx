import React, { useState } from 'react';
import { Bell, Check, X, Calendar, MessageSquare, User, AlertCircle, CheckCheck } from 'lucide-react';
import { useNotificationsQuery, useUnreadNotificationsCountQuery } from '../../queries';
import { useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '../../mutations';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  LoadingCard, 
  EmptyState,
  useToast 
} from '../ui';
import { formatRelativeTime } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errorHandling';

const NotificationsFeed = ({ compact = false }) => {
  const [filter, setFilter] = useState('all');
  const { showSuccess, showError } = useToast();

  // Queries - Add error handling and fallbacks
  const { 
    data: notificationsData, 
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications 
  } = useNotificationsQuery({ 
    read: filter === 'unread' ? false : filter === 'read' ? true : undefined,
    limit: compact ? 5 : 20
  }, {
    retry: 1,
    staleTime: 30 * 1000,
    onError: (error) => {
      console.error('Failed to fetch notifications:', error);
    }
  });

  const { 
    data: unreadCountData,
    error: unreadCountError 
  } = useUnreadNotificationsCountQuery({
    retry: 1,
    staleTime: 10 * 1000,
    onError: (error) => {
      console.error('Failed to fetch unread count:', error);
    }
  });

  // Mutations
  const markAsReadMutation = useMarkNotificationReadMutation();
  const markAllAsReadMutation = useMarkAllNotificationsReadMutation();

  const notifications = Array.isArray(notificationsData?.data?.notifications) ? notificationsData.data.notifications : [];
  const unreadCount = notificationsData?.data?.unreadCount || unreadCountData?.data?.count || unreadCountData?.count || 0;

  if (notificationsLoading) {
    return <LoadingCard message="Loading notifications..." />;
  }

  // Handle API errors gracefully
  if (notificationsError) {
    console.error('Notifications API error:', notificationsError);
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={Bell}
            title="Unable to load notifications"
            description="There was an error loading your notifications. Please try again later."
          />
        </CardContent>
      </Card>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'SESSION_BOOKED':
      case 'SESSION_CONFIRMED':
      case 'SESSION_CANCELLED':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'TICKET_CLAIMED':
      case 'TICKET_COMMENTED':
      case 'TICKET_RESOLVED':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'SESSION_REMINDER':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'NEW_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      case 'PROFILE_VERIFIED':
        return <User className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatNotificationTitle = (type) => {
    switch (type?.toUpperCase()) {
      case 'SESSION_BOOKED':
        return 'Session Booked';
      case 'SESSION_CONFIRMED':
        return 'Session Confirmed';
      case 'SESSION_CANCELLED':
        return 'Session Cancelled';
      case 'TICKET_CLAIMED':
        return 'Ticket Claimed';
      case 'TICKET_COMMENTED':
        return 'New Comment';
      case 'TICKET_RESOLVED':
        return 'Ticket Resolved';
      case 'SESSION_REMINDER':
        return 'Session Reminder';
      case 'NEW_MESSAGE':
        return 'New Message';
      case 'PROFILE_VERIFIED':
        return 'Profile Verified';
      default:
        return type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Notification';
    }
  };

  const getNotificationBgColor = (read) => {
    return read ? 'bg-white' : 'bg-blue-50';
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
      showSuccess('Notification marked as read');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      showSuccess('All notifications marked as read');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-semibold text-gray-900">Recent Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No new notifications"
              description="You're all caught up!"
            />
          ) : (
            <div className="space-y-3">
              {filteredNotifications.slice(0, 3).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border ${getNotificationBgColor(notification.read)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {formatNotificationTitle(notification.type)}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-blue-600 hover:text-blue-800"
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {filteredNotifications.length > 3 && (
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              isLoading={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: 'Read' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-gray-600 hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            description={
              filter === 'unread' 
                ? 'You\'re all caught up!' 
                : 'Notifications will appear here when you receive them.'
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${getNotificationBgColor(notification.read)}`}
              >
                <div className="flex items-start space-x-4">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {formatNotificationTitle(notification.type)}
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            isLoading={markAsReadMutation.isPending}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationsFeed;
