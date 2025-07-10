import React from 'react';
import { TrendingUp, Users, Clock, Target, Award, Zap } from 'lucide-react';

interface PerformanceMetricsProps {
  className?: string;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ className = '' }) => {
  const metrics = [
    {
      title: 'Sprint Velocity',
      value: '42',
      unit: 'story points',
      change: '+18%',
      trend: 'up',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Team Efficiency',
      value: '87%',
      unit: 'completion rate',
      change: '+5%',
      trend: 'up',
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Average Response',
      value: '2.3',
      unit: 'hours',
      change: '-12%',
      trend: 'up',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Quality Score',
      value: '9.2',
      unit: 'out of 10',
      change: '+0.8',
      trend: 'up',
      icon: <Award className="w-5 h-5" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Performance Metrics
        </h3>
        <div className="text-xs text-gray-400">Last 30 days</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group ${metric.bgColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gray-700/50 ${metric.color}`}>
                {metric.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                metric.trend === 'up' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">{metric.title}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white">{metric.value}</span>
                <span className="text-xs text-gray-500">{metric.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Overall Performance</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
            </div>
            <span className="text-white font-semibold">85%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
