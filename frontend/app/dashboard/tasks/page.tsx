'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, UserPlus, UserX, Edit } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

type Member = {
  _id: string;
  fullName: string;
  email: string;
  username: string;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  projectId: string;
  members?: Member[]; // Updated to use Member type instead of string[]
  __v: number;
};

type BackendResponse = {
  statusCode: number;
  data: Task[];
  message: string;
  success: boolean;
};

export default function TasksPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'not-started',
    projectId: '',
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showTasks, setShowTasks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [memberForm, setMemberForm] = useState({
    memberEmail: '',
    taskId: '',
    action: 'assign' as 'assign' | 'deassign'
  });

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`,{
        method:'GET',
        headers:{
          'content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
      });
      const data = await res.json();
      setProjects(data?.data || []);
    } catch {
      console.log('Error fetching projects');
    }
  };

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
    if (!form.title || !form.description || !form.projectId) {
      showError('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${form.projectId}/task/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(prev => [data.data, ...prev]);
        setForm({ title: '', description: '', status: 'not-started', projectId: '' });
        showSuccess('Task created successfully!');
      } else {
        showError(data.message || 'Create failed');
      }
    } catch {
      showError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${editingTask.projectId}/task/updateTask`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          taskId: editingTask._id,
          title: editingTask.title,
          description: editingTask.description,
          updateStatus: editingTask.status
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(prev => prev.map(t => t._id === editingTask._id ? data.data : t));
        setEditingTask(null);
        showSuccess('Task updated successfully!');
      } else {
        showError(data.message || 'Update failed');
      }
    } catch {
      showError('Server error');
    }
  };

  const assignMember = async () => {
    if (!memberForm.memberEmail || !memberForm.taskId) {
      showError('Please enter member email and select task');
      return;
    }

    const task = tasks.find(t => t._id === memberForm.taskId);
    if (!task) return;

    try {
      const endpoint = memberForm.action === 'assign' ? 'assignMember' : 'deAssignMember';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${task.projectId}/task/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          memberEmail: memberForm.memberEmail,
          taskId: memberForm.taskId
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(prev => prev.map(t => t._id === memberForm.taskId ? data.data : t));
        setMemberForm({ memberEmail: '', taskId: '', action: 'assign' });
        showSuccess(`Member ${memberForm.action === 'assign' ? 'assigned' : 'removed'} successfully!`);
      } else {
        showError(data.message || 'Operation failed');
      }
    } catch {
      showError('Server error');
    }
  };

  // Updated fetchTasks function to handle the new response structure
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/getAllTasks`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
        },
        body: JSON.stringify({ startUpId: localStorage.getItem('startUpId') })
      });
      const data: BackendResponse = await res.json();
      
      // Check if the response is successful
      if (data.success && data.statusCode === 200) {
        setTasks(data.data || []);
      } else {
        showError(data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showError('Error fetching tasks');
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

          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            required
          >
            <option value="">Select Project *</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name || project.title}
              </option>
            ))}
          </select>

          <input
            name="title"
            placeholder="Task title *"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            required
          />

          <textarea
            name="description"
            rows={3}
            placeholder="Task description *"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full p-3 mb-6 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={createTask}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </section>

        {/* Member Assignment Section */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={18} /> Assign/Remove Members
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={memberForm.taskId}
              onChange={(e) => setMemberForm({ ...memberForm, taskId: e.target.value })}
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              <option value="">Select Task</option>
              {tasks.map((task) => (
                <option key={task._id} value={task._id}>
                  {task.title}
                </option>
              ))}
            </select>

            <input
              placeholder="Member Email"
              value={memberForm.memberEmail}
              onChange={(e) => setMemberForm({ ...memberForm, memberEmail: e.target.value })}
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            />

            <select
              value={memberForm.action}
              onChange={(e) => setMemberForm({ ...memberForm, action: e.target.value as 'assign' | 'deassign' })}
              className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
            >
              <option value="assign">Assign</option>
              <option value="deassign">Remove</option>
            </select>

            <button
              onClick={assignMember}
              className="py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {memberForm.action === 'assign' ? 'Assign' : 'Remove'}
            </button>
          </div>
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
                {tasks.map((task) => (
                  <li
                    key={task._id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-white">{task.title}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{task.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Project ID: {task.projectId}</p>
                        {task.members && task.members.length > 0 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            <p className="font-medium">Members ({task.members.length}):</p>
                            <div className="ml-2 space-y-1">
                              {task.members.map((member, index) => (
                                <div key={member._id || `${member.email}-${index}`} className="text-slate-600 dark:text-slate-400">
                                  <span className="font-medium">{member.fullName}</span>
                                  <span className="text-slate-500 dark:text-slate-500"> ({member.email})</span>
                                  <span className="text-slate-400 dark:text-slate-500"> - @{member.username}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {statusIcon(task.status)}
                          {task.status.replace('-', ' ')}
                        </div>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 text-blue-500 hover:text-blue-600 transition"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
              
              <input
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
                placeholder="Task title"
              />

              <textarea
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                className="w-full p-3 mb-4 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
                rows={3}
                placeholder="Task description"
              />

              <select
                value={editingTask.status}
                onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as Task['status'] })}
                className="w-full p-3 mb-6 rounded bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={updateTask}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Update Task
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}