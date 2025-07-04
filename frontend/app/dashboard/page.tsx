"use client";
import { getStartUp } from '@/api/startup';
import { 
  FileText, 
  Users, 
  FolderKanban, 
  Bot, 
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [startup, setStartup] = useState<any>(null);

  const stats = [
    { label: 'Documents Generated', value: '12', icon: FileText, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Team Members', value: '5', icon: Users, color: 'text-green-600 dark:text-green-400' },
    { label: 'Active Projects', value: '3', icon: FolderKanban, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'AI Queries', value: '47', icon: Bot, color: 'text-orange-600 dark:text-orange-400' }
  ];

  const recentActivities = [
    { type: 'document', title: 'NDA generated for Acme Corp', time: '2 hours ago', status: 'completed' },
    { type: 'team', title: 'Sarah joined as Product Manager', time: '1 day ago', status: 'completed' },
    { type: 'project', title: 'MVP Development sprint started', time: '2 days ago', status: 'active' },
    { type: 'assistant', title: 'Asked about equity distribution', time: '3 days ago', status: 'completed' }
  ];

  const quickActions = [
    { title: 'Generate Legal Document', description: 'Create NDAs, contracts, and agreements', link: '/legal', icon: FileText },
    { title: 'Add Team Member', description: 'Invite new members to your startup', link: '/team', icon: Users },
    { title: 'Create New Project', description: 'Start tracking a new initiative', link: '/projects', icon: FolderKanban },
    { title: 'Ask AI Assistant', description: 'Get help with startup questions', link: '/assistant', icon: Bot }
  ];

  useEffect(() => {
    getStartUp()
      .then(data => setStartup(data))
      .catch(() => setStartup(null));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, Bhumika!</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">Here's what's happening with your startup today.</p>
          {startup && (
            <div className="mt-2 text-blue-700 dark:text-blue-300 font-semibold">
              Startup: {startup.name || startup.title || JSON.stringify(startup)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.link}
                    className="flex items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                  >
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg p-2 mr-4 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-colors">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 dark:text-white">{activity.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">This Week's Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Legal Setup</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">5 of 7 documents completed</p>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Team Building</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">3 key hires made</p>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-green-600 to-green-500 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">MVP Progress</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">60% development complete</p>
              <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                <div className="bg-gradient-to-r from-purple-600 to-purple-500 h-2 rounded-full w-3/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;