import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  gradient,
  bgColor,
  loading = false
}) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <ArrowUpRight className="w-3 h-3" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:shadow-xl hover:shadow-purple-500/10 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgColor} transition-transform group-hover:scale-110`}>
          <div className="w-6 h-6">
            {icon}
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
      </div>
      
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-2xl font-bold text-white mb-2 transition-all duration-300">
          {loading ? (
            <div className="h-8 w-16 bg-gray-700 rounded animate-pulse"></div>
          ) : (
            value
          )}
        </p>
        
        {change && (
          <div className={`flex items-center text-xs ${getTrendColor(change.trend)} transition-colors`}>
            {getTrendIcon(change.trend)}
            <span className="ml-1">
              {change.value} {change.period && `this ${change.period}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
