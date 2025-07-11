'use client';

import { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  ClipboardList, 
  PlusCircle, 
  TrendingUp, 
  Calendar,
  Target,
  DollarSign,
  Activity,
  Clock,
  FileText,
  RefreshCw,
  BarChart3,
  PieChart,
  Bell,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';

import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { ActivityFeed } from '../../components/ui/ActivityFeed';
import { MetricCard } from '../../components/ui/MetricCard';
import { SimpleBarChart, SimpleLineChart } from '../../components/ui/Charts';
import { AnalyticsDashboard } from '../../components/ui/AnalyticsDashboard';
import { PerformanceMetrics } from '../../components/ui/PerformanceMetrics';
import { TeamStatus } from '../../components/ui/TeamStatus';
import { useDashboard } from '../../hooks/useDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { navigate } = useNavigation();
  const { stats, activities, chartData, loading, error, refresh } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');

  const statCards = [
    {
      title: "Active Projects",
      value: stats.totalProjects,
      icon: <Briefcase className="w-6 h-6" />,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      change: {
        value: "+2 this month",
        trend: "up" as const,
        period: "month"
      }
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: <Users className="w-6 h-6" />,
      gradient: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      change: {
        value: "+3 this month",
        trend: "up" as const,
        period: "month"
      }
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: <ClipboardList className="w-6 h-6" />,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      change: {
        value: `${stats.completedTasks} completed`,
        trend: "neutral" as const
      }
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      gradient: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      change: {
        value: `+${stats.growth}% growth`,
        trend: "up" as const,
        period: "month"
      }
    }
  ];

  const quickActions = [
    {
      label: "New Project",
      icon: <PlusCircle size={18} />,
      variant: "primary" as const,
      onClick: () => navigate('/dashboard/projects')
    },
    {
      label: "New Task", 
      icon: <PlusCircle size={18} />,
      variant: "success" as const,
      onClick: () => navigate('/dashboard/tasks')
    },
    {
      label: "Legal Documents",
      icon: <FileText size={18} />,
      variant: "warning" as const,
      onClick: () => navigate('/dashboard/legal')
    },
    {
      label: "Invite Member",
      icon: <Users size={18} />,
      variant: "secondary" as const,
      onClick: () => navigate('/dashboard/team')
    }
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="p-8 text-center">
          <div className="text-red-400 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={refresh} icon={<RefreshCw size={18} />}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-2xl border border-gray-700/50 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Here's what's happening with your projects today.
              </p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
                <button
                  onClick={refresh}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-4">
              {quickActions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={action.onClick}
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            gradient={card.gradient}
            bgColor={card.bgColor}
            change={card.change}
            loading={loading}
          />
        ))}
      </div>

      {/* Tab Navigation */}

      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-xl border border-gray-700/50">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
          { id: 'analytics', label: 'Analytics', icon: <PieChart size={16} /> },
          { id: 'activity', label: 'Activity', icon: <Activity size={16} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Quick Actions & Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle icon={<Target className="w-5 h-5 text-blue-400" />}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      onClick={action.onClick}
                      icon={action.icon}
                      className="w-full"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle icon={<TrendingUp className="w-5 h-5 text-green-400" />}>
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <ProgressBar
                    value={stats.completedTasks}
                    max={stats.totalTasks}
                    label="Tasks Completed"
                    showLabel={true}
                  />
                  <ProgressBar
                    value={stats.productivity}
                    max={100}
                    label="Team Productivity"
                    showLabel={true}
                  />
                  <ProgressBar
                    value={75}
                    max={100}
                    label="Monthly Goal"
                    showLabel={true}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-3">
              <MetricCard
                title="Completed Projects"
                value={stats.completedProjects}
                icon={<CheckCircle className="w-5 h-5 text-green-400" />}
                change={{ value: "+2", isPositive: true }}
              />
              <MetricCard
                title="Active Projects"
                value={stats.activeProjects}
                icon={<Clock className="w-5 h-5 text-yellow-400" />}
                change={{ value: "+1", isPositive: true }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <TeamStatus />
            
            <Card>
              <CardHeader>
                <CardTitle icon={<BarChart3 className="w-5 h-5 text-purple-400" />}>
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={chartData.projectsChart.slice(0, 3)}
                  title=""
                  height={200}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle icon={<Activity className="w-5 h-5 text-purple-400" />}>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={activities} loading={loading} />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle icon={<Calendar className="w-5 h-5 text-yellow-400" />}>
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        Dec<br/>15
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Product Demo</p>
                        <p className="text-gray-400 text-sm">2:00 PM - 3:30 PM</p>
                      </div>
                      <Button size="sm" variant="secondary">
                        <Bell size={14} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        Dec<br/>18
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">Sprint Planning</p>
                        <p className="text-gray-400 text-sm">10:00 AM - 12:00 PM</p>
                      </div>
                      <Button size="sm" variant="secondary">
                        <Bell size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <PerformanceMetrics />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <AnalyticsDashboard />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleBarChart 
              data={chartData.projectsChart}
              title="Projects by Status"
              height={250}
            />
            <SimpleBarChart 
              data={chartData.tasksChart}
              title="Tasks by Status"
              height={250}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SimpleLineChart 
                data={chartData.productivityChart}
                title="Weekly Productivity Trend"
                height={300}
              />
            </div>
            <PerformanceMetrics />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart 
              data={chartData.monthlyProgress}
              title="Monthly Progress"
              height={250}
            />
            <TeamStatus />
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle icon={<Activity className="w-5 h-5 text-purple-400" />}>
                All Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities} loading={loading} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
