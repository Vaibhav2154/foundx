import React from 'react';
import { Clock, User, Calendar } from 'lucide-react';
import { formatRelativeTime } from '@/utils/dateUtils';

interface Activity {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
  avatar?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  loading = false,
  className = '' 
}) => {
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-400';
      case 'warning':
        return 'bg-yellow-400';
      case 'error':
        return 'bg-red-400';
      default:
        return 'bg-blue-400';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return formatRelativeTime(timestamp);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl animate-pulse">
            <div className="w-2 h-2 rounded-full bg-gray-600 mt-2"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-400 text-sm">No recent activity found.</p>
        <p className="text-gray-500 text-xs mt-1">Activity will appear here as your team works on projects.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity, index) => (
        <div 
          key={activity.id || index} 
          className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)} shadow-lg`}></div>
            {activity.avatar ? (
              <img 
                src={activity.avatar} 
                alt={activity.user} 
                className="w-8 h-8 rounded-full border-2 border-gray-600"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm leading-relaxed">
              <span className="font-semibold text-blue-400">{activity.user}</span>
              <span className="text-gray-300 mx-1">{activity.action}</span>
              <span className="font-medium text-purple-400">{activity.entity}</span>
            </p>
            <p className="text-gray-400 text-xs flex items-center mt-1 group-hover:text-gray-300 transition-colors">
              <Clock className="w-3 h-3 mr-1" />
              {formatTimestamp(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
