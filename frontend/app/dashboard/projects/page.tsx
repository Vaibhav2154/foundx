'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Eye, Edit, Trash2, Settings, ChevronDown, ChevronUp, Calendar, Clock, Target, Plus, X } from 'lucide-react';

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

export default function ProjectsPage() {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchEmployees = () => {
    setEmployeesLoading(true);
    fetch('http://localhost:8000/api/v1/startups/getEmployees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ companyName: localStorage.getItem('companyName') })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.success && data.data && data.data.length > 0) {
          // Extract employees from the nested structure
          const employees = data.data[0].employees || [];
          setEmployees(employees);
        }
      })
      .catch(() => alert('Failed to load team'))
      .finally(() => setEmployeesLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
  // Fetch All Employees
  {/*const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch('http://localhost:8000/api/v1/startups/getEmployees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`  
        },
        body: JSON.stringify({ companyName: localStorage.getItem('companyName') }),
      });
      const data = await res.json();
      console.log(data);
      if (Array.isArray(data?.data)) {
        setEmployees(data.data);
      } else {
        console.error('Expected array but got:', data);
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Error fetching employees');
      setEmployees([]);
    } finally {
      setEmployeesLoading(false);
    }
  };*/}

  // Create Project
  const createProject = async () => {
    setLoading(true);
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch('http://localhost:8000/api/v1/projects/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [data.data, ...prev]);
        setForm({ name: '', description: '', startDate: '', endDate: '', status: 'not-started' });
        alert('✅ Project created successfully!');
      } else {
        alert(data.message || 'Error creating project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Server error while creating project');
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Projects
  const fetchProjects = async () => {
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch('http://localhost:8000/api/v1/projects/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`  
        }
      });
      const data = await res.json();
      
      if (Array.isArray(data?.data)) {
        setProjects(data.data);
      } else {
        console.error('Expected array but got:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Error fetching projects');
      setProjects([]);
    }
  };

  // Fetch Project by ID
  const fetchProjectById = async (projectId: string) => {
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch(`http://localhost:8000/api/v1/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedProject(data.data);
        setShowProjectDetails(true);
      } else {
        alert(data.message || 'Error fetching project details');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      alert('Error fetching project details');
    }
  };

  // Delete Project
  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch(`http://localhost:8000/api/v1/projects/delete/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => prev.filter((project) => project._id !== projectId));
        alert('✅ Project deleted successfully!');
      } else {
        alert(data.message || 'Error deleting project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Server error while deleting project');
    }
  };

  // Update Project
  const updateProject = async () => {
    if (!editingProject) return;

    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch(`http://localhost:8000/api/v1/projects/update/${editingProject._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: editingProject.name,
          description: editingProject.description,
          startDate: editingProject.startDate,
          endDate: editingProject.endDate,
          status: editingProject.status,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project._id === editingProject._id ? data.data : project
          )
        );
        setEditingProject(null);
        alert('✅ Project updated successfully!');
      } else {
        alert(data.message || 'Error updating project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Server error while updating project');
    }
  };

  // Add Member to Project
  const addMemberToProject = async (projectId: string) => {
    if (!selectedEmployeeId) {
      alert('Please select an employee');
      return;
    }

    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch('http://localhost:8000/api/v1/projects/addMembers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          projectId,
          memberId: selectedEmployeeId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project._id === projectId ? data.data : project
          )
        );
        setSelectedEmployeeId('');
        setShowEmployeeDropdown(null);
        alert('✅ Member added successfully!');
      } else {
        alert(data.message || 'Error adding member');
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Server error while adding member');
    }
  };

  // Remove Member from Project
  const removeMemberFromProject = async (projectId: string, memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      const res = await fetch('http://localhost:8000/api/v1/projects/removeMembers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          projectId,
          memberId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((project) =>
            project._id === projectId ? data.data : project
          )
        );
        alert('✅ Member removed successfully!');
      } else {
        alert(data.message || 'Error removing member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Server error while removing member');
    }
  };

  const toggleProjects = () => {
    setShowProjects((prev) => !prev);
    if (!showProjects) fetchProjects();
  };

  const toggleEmployees = () => {
    setShowEmployees((prev) => !prev);
    if (!showEmployees) fetchEmployees();
  };

  const startEditingProject = (project: Project) => {
    setEditingProject({ ...project });
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Helper function to get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.name : employeeId;
  };

  // Helper function to get employee email by ID
  const getEmployeeEmail = (employeeId: string) => {
    const employee = employees.find(emp => emp._id === employeeId);
    return employee ? employee.email : '';
  };

  // Helper function to safely format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Helper function to safely get date input value
  const getDateInputValue = (dateString: string) => {
    try {
      return dateString ? dateString.split('T')[0] : '';
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Manager
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Create and manage your startup's projects with your team members.
          </p>
        </div>

        {/* Project Form */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold">Create New Project</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Name</label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter project name"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date (Optional)</label>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Description</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your project goals and objectives"
                className="w-full p-3 bg-gray-50 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                required
              />
            </div>
            
            <button
              onClick={createProject}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={toggleProjects}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Target className="w-4 h-4" />
            {showProjects ? 'Hide Projects' : 'Show All Projects'}
            {showProjects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          <button
            onClick={toggleEmployees}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Users className="w-4 h-4" />
            {showEmployees ? 'Hide Employees' : 'Show All Employees'}
            {showEmployees ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Employees List */}
        {showEmployees && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Company Employees</h3>
              {employeesLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>}
            </div>
            
            {employeesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Loading employees...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No employees found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee) => (
                  <div
                    key={employee._id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {employee.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">{employee.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{employee.email}</p>
                      </div>
                    </div>
                    
                    {employee.role && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          {employee.role}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Name:{employee.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Projects List */}
        {showProjects && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold">All Projects</h3>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No projects found.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200"
                  >
                    {editingProject && editingProject._id === project._id ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <h4 className="font-semibold text-blue-600 dark:text-blue-400">Edit Project</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            name="name"
                            type="text"
                            value={editingProject.name}
                            onChange={handleEditChange}
                            placeholder="Project Name"
                            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          
                          <select
                            name="status"
                            value={editingProject.status}
                            onChange={handleEditChange}
                            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on-hold">On Hold</option>
                          </select>
                          
                          <input
                            name="startDate"
                            type="date"
                            value={getDateInputValue(editingProject.startDate)}
                            onChange={handleEditChange}
                            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          
                          <input
                            name="endDate"
                            type="date"
                            value={getDateInputValue(editingProject.endDate || '')}
                            onChange={handleEditChange}
                            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        
                        <textarea
                          name="description"
                          value={editingProject.description}
                          onChange={handleEditChange}
                          placeholder="Project Description"
                          className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                          rows={3}
                        />
                        
                        <div className="flex gap-3">
                          <button
                            onClick={updateProject}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Plus className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div>
                        <div className="flex flex-wrap justify-between items-start mb-4">
                          <h4 className="text-xl font-bold text-blue-600 dark:text-blue-300 mb-2">
                            {project.name}
                          </h4>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                              project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                              project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                            }`}>
                              {project.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Start Date</p>
                              <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">End Date</p>
                              <p className="text-sm font-medium">{project.endDate ? formatDate(project.endDate) : 'Not set'}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Team Members</p>
                              <p className="text-sm font-medium">{Array.isArray(project.members) ? project.members.length : 0}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Tasks</p>
                              <p className="text-sm font-medium">{Array.isArray(project.tasks) ? project.tasks.length : 0}</p>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-300 mb-6 bg-white dark:bg-gray-800 p-3 rounded-lg">
                          {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => fetchProjectById(project._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          
                          <button
                            onClick={() => startEditingProject(project)}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                          
                          <button
                            onClick={() => setShowMemberActions(showMemberActions === project._id ? null : project._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <Settings className="w-4 h-4" />
                            Manage Team
                          </button>
                        </div>

                        {/* Member Management */}
                        {showMemberActions === project._id && (
                          <div className="mt-6 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
                              <h5 className="font-semibold text-slate-800 dark:text-slate-200">Team Management</h5>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                  Add Team Member
                                </label>
                                <div className="flex gap-3">
                                  <div className="flex-1 relative">
                                    <button
                                      onClick={() => setShowEmployeeDropdown(showEmployeeDropdown === project._id ? null : project._id)}
                                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
                                    >
                                      <span className="text-slate-700 dark:text-slate-300">
                                        {selectedEmployeeId ? 
                                          employees.find(emp => emp._id === selectedEmployeeId)?.name || 'Select an employee' : 
                                          'Select an employee'
                                        }
                                      </span>
                                      <ChevronDown className="w-4 h-4 text-slate-400" />
                                    </button>
                                    
                                    {showEmployeeDropdown === project._id && (
                                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                        {employees.length === 0 ? (
                                          <div className="p-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                                            No employees available
                                          </div>
                                        ) : (
                                          employees.map((employee) => (
                                            <button
                                              key={employee._id}
                                              onClick={() => {
                                                setSelectedEmployeeId(employee._id);
                                                setShowEmployeeDropdown(null);
                                              }}
                                              className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-3"
                                            >
                                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {employee?.name?.charAt(0)?.toUpperCase() || "?"}
                                              </div>
                                              <div className="flex-1">
                                                <p className="font-medium text-slate-800 dark:text-slate-200">{employee.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{employee.email}</p>
                                              </div>
                                            </button>
                                          ))
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => addMemberToProject(project._id)}
                                    disabled={!selectedEmployeeId}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                    Add Member
                                  </button>
                                </div>
                              </div>
                              
                              <div>
                                <h6 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Current Team Members</h6>
                                {Array.isArray(project.members) && project.members.length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {project.members.map((memberId) => (
                                      <div key={memberId} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                         {getEmployeeName(String(memberId))?.charAt(0)?.toUpperCase() || "?"}
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium text-slate-800 dark:text-slate-200">{getEmployeeName(String(memberId))}</p>
                                          <p className="text-xs text-slate-500 dark:text-slate-400">{getEmployeeEmail(String(memberId))}</p>
                                        </div>
                                        <button
                                          onClick={() => removeMemberFromProject(project._id, String(memberId))}
                                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                                          title="Remove member"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm text-slate-500 dark:text-slate-400">No team members assigned yet.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Project Details Modal */}
        {showProjectDetails && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {selectedProject.name}
                </h3>
                <button
                  onClick={() => setShowProjectDetails(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Description</h4>
                  <p className="text-slate-600 dark:text-slate-400">{selectedProject.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Start Date</h4>
                        <p className="text-slate-600 dark:text-slate-400">{formatDate(selectedProject.startDate)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">End Date</h4>
                        <p className="text-slate-600 dark:text-slate-400">
                          {selectedProject.endDate ? formatDate(selectedProject.endDate) : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Status</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedProject.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' :
                          selectedProject.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                          selectedProject.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
                        }`}>
                          {selectedProject.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300">Project Owner</h4>
                        <p className="text-slate-600 dark:text-slate-400">{getEmployeeName(String(selectedProject.owner))}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Team Members ({Array.isArray(selectedProject.members) ? selectedProject.members.length : 0})
                  </h4>
                  {Array.isArray(selectedProject.members) && selectedProject.members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProject.members.map((memberId) => (
                        <div key={memberId} className="flex items-center gap-3 bg-white dark:bg-gray-700 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {getEmployeeName(String(memberId)).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200">{getEmployeeName(String(memberId))}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{getEmployeeEmail(String(memberId))}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400">No team members assigned yet.</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    Tasks ({Array.isArray(selectedProject.tasks) ? selectedProject.tasks.length : 0})
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">
                    {Array.isArray(selectedProject.tasks) && selectedProject.tasks.length > 0 
                      ? `${selectedProject.tasks.length} tasks assigned to this project` 
                      : 'No tasks assigned yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}