'use client';

import { useState, useEffect } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, UserPlus, UserX, Edit, Target, ChevronDown, ChevronUp } from 'lucide-react';
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
  members?: Member[];
  __v: number;
};

type BackendResponse = {
  statusCode: number;
  data: Task[];
  message: string;
  success: boolean;
};

export default function TeamTasksPage() {
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

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const startUpId = localStorage.getItem('startUpId');
      
      if (!startUpId) {
        showError('Startup ID not found. Please log in again.');
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/getAllTasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startUpId }),
      });
      const data: BackendResponse = await res.json();
      if (res.ok && data.success) {
        setTasks(data.data || []);
      } else {
        showError('Failed to load tasks');
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      showError('Server error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingTask) {
      setEditingTask({ ...editingTask, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check validation based on whether we're editing or creating
    if (editingTask) {
      if (!editingTask.title.trim() || !editingTask.description.trim() || !editingTask.projectId) {
        return showError('Title, description, and project are required');
      }
    } else {
      if (!form.title.trim() || !form.description.trim() || !form.projectId) {
        return showError('Title, description, and project are required');
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      let payload, url;

      if (editingTask) {
        // Update task
        payload = {
          taskId: editingTask._id,
          title: editingTask.title,
          description: editingTask.description,
          updateStatus: editingTask.status
        };
        url = `${process.env.NEXT_PUBLIC_API_URL}/${editingTask.projectId}/task/updateTask`;
      } else {
        // Create task  
        payload = {
          title: form.title,
          description: form.description,
          status: form.status
        };
        url = `${process.env.NEXT_PUBLIC_API_URL}/${form.projectId}/task/create`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (editingTask) {
          setEditingTask(null);
          showSuccess('Task updated successfully');
        } else {
          setForm({ title: '', description: '', status: 'not-started', projectId: '' });
          showSuccess('Task created successfully');
        }
        loadTasks();
      } else {
        showError(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    // Note: Delete functionality not implemented in backend yet
    showError('Delete functionality is not available yet. Please contact your administrator.');
    return;

    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId: id }),
      });

      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
        showSuccess('Task deleted successfully');
      } else {
        showError('Delete failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    }
  };

  const handleMemberAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.memberEmail.trim() || !memberForm.taskId) {
      return showError('Email and task are required');
    }

    try {
      const token = localStorage.getItem('authToken');
      const task = tasks.find(t => t._id === memberForm.taskId);
      
      if (!task) {
        return showError('Task not found');
      }

      const endpoint = memberForm.action === 'assign' ? 'assignMember' : 'deAssignMember';
      const url = `${process.env.NEXT_PUBLIC_API_URL}/${task.projectId}/task/${endpoint}`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          taskId: memberForm.taskId,
          memberEmail: memberForm.memberEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        loadTasks();
        setMemberForm({ memberEmail: '', taskId: '', action: 'assign' });
        showSuccess(`Member ${memberForm.action === 'assign' ? 'assigned' : 'removed'} successfully`);
      } else {
        showError(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-500" size={16} />;
      case 'in-progress': return <Clock className="text-yellow-500" size={16} />;
      default: return <AlertCircle className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div>
        <h2 className="text-2xl font-bold mb-2">Task Management</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Create, assign, and track tasks across your team projects.
        </p>
      </div>

      {/* Create/Edit Task Form */}
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Title</label>
              <input
                type="text"
                name="title"
                value={editingTask ? editingTask.title : form.title}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={editingTask ? editingTask.status : form.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Project</label>
            <select
              name="projectId"
              value={editingTask ? editingTask.projectId : form.projectId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={editingTask ? editingTask.description : form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Member Assignment */}
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Assign/Remove Team Member</h3>
        <form onSubmit={handleMemberAction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Member Email</label>
              <input
                type="email"
                value={memberForm.memberEmail}
                onChange={(e) => setMemberForm({ ...memberForm, memberEmail: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="team@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Task</label>
              <select
                value={memberForm.taskId}
                onChange={(e) => setMemberForm({ ...memberForm, taskId: e.target.value })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select task</option>
                {tasks.map((task) => (
                  <option key={task._id} value={task._id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
              <select
                value={memberForm.action}
                onChange={(e) => setMemberForm({ ...memberForm, action: e.target.value as 'assign' | 'deassign' })}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="assign">Assign</option>
                <option value="deassign">Remove</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
          >
            {memberForm.action === 'assign' ? 'Assign Member' : 'Remove Member'}
          </button>
        </form>
      </div>

      {/* Tasks List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Tasks ({tasks.length})</h3>
          <button
            onClick={() => {
              setShowTasks(!showTasks);
              if (!showTasks) loadTasks();
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {showTasks ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showTasks ? 'Hide' : 'Show'} Tasks
          </button>
        </div>

        {showTasks && (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <Target size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No tasks created yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          {task.title}
                        </h4>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="p-1 text-blue-600 hover:text-blue-700 rounded"
                          title="Edit task"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id)}
                          className="p-1 text-red-600 hover:text-red-700 rounded"
                          title="Delete task"
                        >
                          <UserX size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <strong>Project:</strong> {getProjectName(task.projectId)}
                      </div>

                      {/* Assigned Members */}
                      <div>
                        <div className="text-sm font-medium mb-1">Assigned To:</div>
                        {task.members && task.members.length > 0 ? (
                          <div className="space-y-1">
                            {task.members.map((member) => (
                              <div key={member._id} className="flex items-center gap-2 text-xs">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                  {member.fullName.charAt(0).toUpperCase()}
                                </div>
                                <span>{member.fullName}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400">No one assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
