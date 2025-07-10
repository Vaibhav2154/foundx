import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Project Completed',
      message: 'Mobile App Development project has been completed successfully.',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Deadline Approaching',
      message: 'Web Redesign project deadline is in 2 days.',
      timestamp: '4 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'New Team Member',
      message: 'Sarah Wilson has joined the development team.',
      timestamp: '1 day ago',
      read: true
    },
    {
      id: '4',
      type: 'error',
      title: 'Task Overdue',
      message: 'API Integration task is overdue by 1 day.',
      timestamp: '2 days ago',
      read: true
    }
  ]);

  const [showNotifications, setShowNotifications] = useState(false);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="fixed inset-0 z-[99]" onClick={() => setShowNotifications(false)}>
          <div 
            className="absolute right-6 top-16 w-80 bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 mb-2 rounded-xl border transition-all hover:bg-gray-700/30 ${
                      notification.read ? 'opacity-60' : ''
                    } ${getBgColor(notification.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-white transition-colors ml-2"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-gray-300 text-xs mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.timestamp}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-400 hover:text-blue-300 text-xs transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </div>
  );
};
