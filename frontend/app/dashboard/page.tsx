'use client';

import { useEffect, useState } from 'react';
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
  ArrowUpRight,
  Clock,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 3,
    totalMembers: 8,
    totalTasks: 24,
    completedTasks: 18,
    revenue: 45000,
    growth: 12.5
  });

  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([
    {
      user: "Sarah Johnson",
      action: "completed task",
      entity: "User Authentication",
      timestamp: new Date().toISOString(),
      type: "success"
    },
    {
      user: "Mike Chen",
      action: "created project",
      entity: "Mobile App MVP",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      type: "info"
    },
    {
      user: "Emma Davis",
      action: "joined team",
      entity: "Design Team",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      type: "success"
    }
  ]);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const statCards = [
    {
      title: "Active Projects",
      value: stats.totalProjects,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      change: "+2 this month"
    },
    {
      title: "Team Members",
      value: stats.totalMembers,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      change: "+3 this month"
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: ClipboardList,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      change: `${stats.completedTasks} completed`
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
      change: `+${stats.growth}% growth`
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : card.value}
              </p>
              <p className="text-xs text-gray-500">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/dashboard/projects'}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <PlusCircle size={18} />
                New Project
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/tasks'}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <PlusCircle size={18} />
                New Task
              </button>
              <button
                onClick={() => window.location.href = '/legal'}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <FileText size={18} />
                Legal Documents
              </button>
              <button
                onClick={() => window.location.href = '/dashboard/team'}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                <Users size={18} />
                Invite Member
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Tasks Completed</span>
                  <span className="text-white">{stats.completedTasks}/{stats.totalTasks}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Monthly Goal</span>
                  <span className="text-white">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-400" />
              Recent Activity
            </h3>
            {activities.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No recent activity found.</p>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'success' ? 'bg-green-400' : 
                      activity.type === 'info' ? 'bg-blue-400' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <strong>{activity.user}</strong> {activity.action} on{' '}
                        <span className="text-blue-400">{activity.entity}</span>
                      </p>
                      <p className="text-gray-400 text-xs flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-yellow-400" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  Dec<br/>15
                </div>
                <div>
                  <p className="text-white font-medium">Product Demo Meeting</p>
                  <p className="text-gray-400 text-sm">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  Dec<br/>18
                </div>
                <div>
                  <p className="text-white font-medium">Sprint Planning</p>
                  <p className="text-gray-400 text-sm">10:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
