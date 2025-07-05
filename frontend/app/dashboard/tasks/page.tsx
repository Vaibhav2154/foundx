'use client';

import { useState } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  projectId?: string;
};

export default function TasksPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'not-started',
    projectId: '',
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const statusIcon = (s: Task['status']) =>
    s === 'completed'
      ? <CheckCircle size={16} className="text-green-500" />
      : s === 'in-progress'
      ? <Clock size={16} className="text-blue-500" />
      : <AlertCircle size={16} className="text-yellow-500" />;

  const createTask = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/task/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(prev => [data.data, ...prev]);
        setForm({ title: '', description: '', status: 'not-started', projectId: '' });
      } else {
        alert(data.message || 'Create failed');
      }
    } catch {
      alert('Server error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/task/all');
      const data = await res.json();
      setTasks(data?.data || []);
    } catch {
      alert('Error fetching tasks');
    }
  };

  const toggleShow = () => {
    setShowTasks(!showTasks);
    if (!showTasks) fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">Task Manager</h1>
          <p className="text-slate-600 dark:text-slate-300">Create, track and update all of your project tasks.</p>
        </div>

        {/* Create Task Form */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} /> Create Task
          </h2>

          <input
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
          />

          <textarea
            name="description"
            rows={3}
            placeholder="Task description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <input
            name="projectId"
            placeholder="Project ID (optional)"
            value={form.projectId}
            onChange={handleChange}
            className="w-full p-3 mb-6 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
          />

          <button
            onClick={createTask}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </section>

        {/* Toggle Button */}
        <div className="text-center">
          <button
            onClick={toggleShow}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition"
          >
            {showTasks ? 'Hide Tasks' : 'Show All Tasks'}
          </button>
        </div>

        {/* Tasks List */}
        {showTasks && (
          <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">All Tasks</h3>

            {tasks.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No tasks found.</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map(task => (
                  <li
                    key={task._id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700 flex justify-between items-start"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-white">{task.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{task.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                      {statusIcon(task.status)}
                      {task.status.replace('-', ' ')}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
