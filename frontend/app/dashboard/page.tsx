'use client';

import { useState, useEffect } from 'react';
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
  CheckCircle,
  Quote
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatRelativeTime } from '@/utils/dateUtils';

import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
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
  const { user, getUserData } = useAuth();
  const { stats, activities, chartData, loading, error, refresh } = useDashboard();
  const [activeTab, setActiveTab] = useState('overview');
  const [quote, setQuote] = useState<{ text: string, author: string } | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [userData, setUserData] = useState<any | null>(null);

  useEffect(() => {
    const data = user || getUserData();
    setUserData(data);
  }, [user]);

  const fetchQuote = async () => {
    try {
      setQuoteLoading(true);
      const response = await fetch('https://api.quotable.io/random?minLength=50&maxLength=150');
      const data = await response.json();
      setQuote({ text: data.content, author: data.author });
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      setQuote({
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      });
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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
                Welcome back{userData && userData.fullName ? `, ${userData.fullName.split(' ')[0]}` : ''}! 👋
              </h1>
              {quoteLoading ? (
                <div className="flex items-center gap-2 text-gray-300 text-lg">
                  <div className="animate-pulse bg-gray-600 h-4 w-64 rounded"></div>
                </div>
              ) : quote ? (
                <div className="max-w-2xl">
                  <div className="flex items-start gap-3 text-gray-300 text-lg">
                    <Quote className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="italic leading-relaxed">"{quote.text}"</p>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm mt-2">— {quote.author}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
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
                {quote && (
                  <button
                    onClick={fetchQuote}
                    className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                    New Quote
                  </button>
                )}
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle icon={<Target className="w-5 h-5 text-blue-400" />}>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickActions.slice(2).map((action, index) => (
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
                <CardTitle icon={<Calendar className="w-5 h-5 text-yellow-400" />}>
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {loading ? (
                    Array(2).fill(0).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl animate-pulse">
                        <div className="w-12 h-12 bg-gray-600/50 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-600/50 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-600/30 rounded w-1/2"></div>
                        </div>
                        <div className="w-8 h-8 bg-gray-600/40 rounded-lg"></div>
                      </div>
                    ))
                  ) : (
                    activities.slice(0, 2).map((activity, index) => {
                      // Extract date from timestamp
                      const date = new Date(activity.timestamp);
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const day = date.getDate();

                      // Generate gradients for different activities
                      const gradients = [
                        'from-blue-500 to-blue-600',
                        'from-purple-500 to-purple-600',
                        'from-red-500 to-red-600',
                        'from-green-500 to-green-600'
                      ];

                      return (
                        <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                          <div className={`w-12 h-12 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-xl flex items-center justify-center text-white font-bold text-sm`}>
                            {month}<br />{day}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{activity.entity}</p>
                            <p className="text-gray-400 text-sm">{activity.action} by {activity.user}</p>
                            <p className="text-blue-400 text-xs mt-1">{formatRelativeTime(activity.timestamp)}</p>
                          </div>
                          <Button size="sm" variant="secondary">
                            <Bell size={14} />
                          </Button>
                        </div>
                      );
                    })
                  )}

                  {!loading && activities.length === 0 && (
                    <div className="text-center py-6 text-gray-400">
                      <p>No upcoming events</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
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


            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">


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
