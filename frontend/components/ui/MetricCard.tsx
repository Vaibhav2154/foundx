import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive?: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  className = ''
}) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          {icon}
        </div>
        {change && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            change.isPositive 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {change.value}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};
