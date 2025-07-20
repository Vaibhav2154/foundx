'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, Edit, Trash2, Settings, ChevronDown, ChevronUp, Calendar, Clock, Target, Plus, X } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  owner: string;
  startUpId: string;
  members: string[];
  tasks: string[];
}

interface Employee {
  _id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
}

export default function TeamProjectsPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'not-started',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [showEmployees, setShowEmployees] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showMemberActions, setShowMemberActions] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingProject) {
      setEditingProject({ ...editingProject, [name]: value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check validation based on whether we're editing or creating
    if (editingProject) {
      if (!editingProject.name.trim() || !editingProject.description.trim()) {
        return showError('Name and description are required');
      }
    } else {
      if (!form.name.trim() || !form.description.trim()) {
        return showError('Name and description are required');
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = editingProject ? editingProject : form;

      const res = await fetch(
        editingProject
          ? `${process.env.NEXT_PUBLIC_API_URL}/projects/update/${editingProject._id}`
          : `${process.env.NEXT_PUBLIC_API_URL}/projects/create`,
        {
          method: editingProject ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (res.ok) {
        if (editingProject) {
          setProjects((prev) =>
            prev.map((project) => (project._id === editingProject._id ? data.data : project))
          );
          setEditingProject(null);
          showSuccess('Project updated successfully');
        } else {
          setProjects((prev) => [...prev, data.data]);
          setForm({ name: '', description: '', startDate: '', endDate: '', status: 'not-started' });
          showSuccess('Project created successfully');
        }
        loadProjects();
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
      } else {
        showError(data.message || 'Failed to load projects');
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      showError('Server error');
    }
  };

  const loadEmployees = async () => {
    if (employees.length > 0) return; // Already loaded

    setEmployeesLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const companyName = localStorage.getItem('companyName');
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/getEmployees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyName }),
      });

      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        const employeeList = data.data[0].employees || [];
        setEmployees(employeeList.map((emp: any) => ({
          _id: emp._id,
          name: emp.fullName,
          email: emp.email,
          role: emp.role,
        })));
      }
    } catch (error) {
      console.error('Error loading employees:', error);
      showError('Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => prev.filter((project) => project._id !== id));
        showSuccess('Project deleted successfully');
      } else {
        showError(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    }
  };

  const addMemberToProject = async (projectId: string) => {
    if (!selectedEmployeeId) {
      return showError('Please select an employee');
    }

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/addMembers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId, memberId: selectedEmployeeId }),
      });

      const data = await res.json();
      if (res.ok) {
        loadProjects(); // Reload to get updated member list
        setSelectedEmployeeId('');
        setShowEmployeeDropdown(null);
        showSuccess('Member added to project successfully');
      } else {
        showError(data.message || 'Failed to add member');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    }
  };

  const removeMemberFromProject = async (projectId: string, memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/removeMembers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId, memberId }),
      });

      const data = await res.json();
      if (res.ok) {
        loadProjects(); // Reload to get updated member list
        showSuccess('Member removed from project successfully');
      } else {
        showError(data.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Server error');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'on-hold': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  const getMemberName = (memberId: string) => {
    const employee = employees.find((emp) => emp._id === memberId);
    return employee?.name || 'Unknown';
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div>
        <h2 className="text-2xl font-bold mb-2">Project Management</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Create and manage projects for your team collaboration.
        </p>
      </div>

      {/* Create/Edit Project Form */}
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <input
                type="text"
                name="name"
                value={editingProject ? editingProject.name : form.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={editingProject ? editingProject.status : form.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={editingProject ? editingProject.description : form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter project description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={editingProject ? editingProject.startDate?.split('T')[0] : form.startDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
              <input
                type="date"
                name="endDate"
                value={editingProject ? editingProject.endDate?.split('T')[0] || '' : form.endDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
            {editingProject && (
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Projects ({projects.length})</h3>
          <button
            onClick={() => {
              setShowProjects(!showProjects);
              if (!showProjects) loadProjects();
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {showProjects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showProjects ? 'Hide' : 'Show'} Projects
          </button>
        </div>

        {showProjects && (
          <div className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Target size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No projects created yet.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{project.name}</h4>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {project.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-1 text-blue-600 hover:text-blue-700 rounded"
                          title="Edit project"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="p-1 text-red-600 hover:text-red-700 rounded"
                          title="Delete project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        Start: {formatDate(project.startDate)}
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-2">
                          <Clock size={12} />
                          End: {formatDate(project.endDate)}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users size={12} />
                        Members: {project.members?.length || 0}
                      </div>
                    </div>

                    {/* Member Management */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Team Members</span>
                        <button
                          onClick={() => {
                            setShowEmployeeDropdown(showEmployeeDropdown === project._id ? null : project._id);
                            if (!employees.length) loadEmployees();
                          }}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          title="Add member"
                        >
                          <UserPlus size={14} />
                        </button>
                      </div>

                      {/* Add Member Dropdown */}
                      {showEmployeeDropdown === project._id && (
                        <div className="mb-2 p-2 bg-white dark:bg-slate-700 rounded border">
                          <select
                            value={selectedEmployeeId}
                            onChange={(e) => setSelectedEmployeeId(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-600 rounded border"
                          >
                            <option value="">Select employee to add</option>
                            {employees
                              .filter((emp) => !project.members?.includes(emp._id))
                              .map((emp) => (
                                <option key={emp._id} value={emp._id}>
                                  {emp.name} ({emp.email})
                                </option>
                              ))}
                          </select>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => addMemberToProject(project._id)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setShowEmployeeDropdown(null)}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Current Members */}
                      <div className="space-y-1">
                        {project.members?.length === 0 ? (
                          <p className="text-xs text-slate-400">No members assigned</p>
                        ) : (
                          project.members?.map((memberId) => (
                            <div key={memberId} className="flex items-center justify-between text-xs">
                              <span>{getMemberName(memberId)}</span>
                              <button
                                onClick={() => removeMemberFromProject(project._id, memberId)}
                                className="text-red-500 hover:text-red-600 ml-2"
                                title="Remove member"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))
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
