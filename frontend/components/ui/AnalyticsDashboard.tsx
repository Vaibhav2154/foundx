import React from 'react';
import { TrendingUp, TrendingDown, Activity, Users, Briefcase, Target } from 'lucide-react';

interface KPIData {
  title: string;
  value: string | number;
  change: {
    value: number;
    period: string;
  };
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface AnalyticsDashboardProps {
  className?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ className = '' }) => {
  const kpiData: KPIData[] = [
    {
      title: 'Project Completion Rate',
      value: '78%',
      change: { value: 12, period: 'month' },
      trend: 'up',
      icon: <Target className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      title: 'Team Productivity',
      value: '92%',
      change: { value: 8, period: 'week' },
      trend: 'up',
      icon: <Activity className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      title: 'Active Users',
      value: '2.4k',
      change: { value: -3, period: 'day' },
      trend: 'down',
      icon: <Users className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    {
      title: 'Project Velocity',
      value: '15.3',
      change: { value: 23, period: 'sprint' },
      trend: 'up',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-yellow-400'
    }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-gray-400" />;
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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {kpiData.map((kpi, index) => (
        <div
          key={index}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group hover:shadow-xl hover:shadow-purple-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gray-700/50 ${kpi.color}`}>
              {kpi.icon}
            </div>
            {getTrendIcon(kpi.trend)}
          </div>
          
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{kpi.title}</p>
            <p className="text-2xl font-bold text-white mb-2">{kpi.value}</p>
            <div className={`flex items-center text-xs ${getTrendColor(kpi.trend)}`}>
              <span className="font-semibold">
                {kpi.change.value > 0 ? '+' : ''}{kpi.change.value}%
              </span>
              <span className="text-gray-500 ml-1">this {kpi.change.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
