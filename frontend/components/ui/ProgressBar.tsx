import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  gradient?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className = '',
  gradient = true,
  size = 'md',
  showLabel = true,
  label
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const getColorClass = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">{label || 'Progress'}</span>
          <span className="text-white">{value}/{max}</span>
        </div>
      )}
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${getColorClass(percentage)}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
