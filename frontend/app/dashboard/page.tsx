'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Users, ClipboardList, PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalTasks: 0
  });

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch {
        alert('Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    async function fetchActivities() {
      try {
        const res = await fetch('/api/dashboard/activities');
        const data = await res.json();
        if (data.success) setActivities(data.data);
      } catch {
        console.log('Activity load error');
      }
    }

    fetchStats();
    fetchActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-bold mb-2">📊 Dashboard Overview</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Keep track of your startup's key stats and recent activities.</p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-700">
          <Briefcase size={28} className="text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Projects</p>
            <h2 className="text-3xl font-bold">{loading ? '...' : stats.totalProjects}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-700">
          <Users size={28} className="text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Team Members</p>
            <h2 className="text-3xl font-bold">{loading ? '...' : stats.totalMembers}</h2>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-xl p-6 flex items-center gap-4 border border-slate-200 dark:border-slate-700">
          <ClipboardList size={28} className="text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tasks</p>
            <h2 className="text-3xl font-bold">{loading ? '...' : stats.totalTasks}</h2>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <h3 className="text-2xl font-semibold mb-6">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => window.location.href = '/dashboard/projects'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow transition-all"
          >
            <PlusCircle size={20} /> New Project
          </button>
          <button
            onClick={() => window.location.href = '/dashboard/tasks'}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow transition-all"
          >
            <PlusCircle size={20} /> New Task
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        {activities.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity found.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {activities.map((act, index) => (
              <li key={index} className="py-3 text-sm text-slate-700 dark:text-slate-300">
                <strong>{act.user}</strong> {act.action} on <span className="text-blue-600 dark:text-blue-400">{act.entity}</span> •{' '}
                <span className="text-slate-500 dark:text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
