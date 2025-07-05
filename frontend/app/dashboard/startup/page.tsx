'use client';

import { useState } from 'react';

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
}

export default function ProjectsPage() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createProject = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/project/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [data.data, ...prev]);
        setForm({ name: '', description: '', startDate: '' });
        alert('✅ Project created successfully!');
      } else {
        alert(data.message || 'Error creating project');
      }
    } catch {
      alert('Server error while creating project');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project/all');
      const data = await res.json();
      setProjects(data?.data || []);
    } catch {
      alert('Error fetching projects');
    }
  };

  const toggleProjects = () => {
    setShowProjects((prev) => !prev);
    if (!showProjects) fetchProjects();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-5xl font-bold mb-2">Project Manager</h2>
          <p className="text-slate-600 dark:text-slate-300">Create and manage your startup’s projects in one place.</p>
        </div>

        {/* Project Form */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
          <div className="space-y-4">
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Project Name"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg"
              required
            />
            <input
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg"
              required
            />
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Project Description"
              className="w-full p-3 bg-gray-100 dark:bg-gray-800 text-slate-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg"
              required
            />
            <button
              onClick={createProject}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <div className="text-center">
          <button
            onClick={toggleProjects}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition"
          >
            {showProjects ? 'Hide All Projects' : 'Show All Projects'}
          </button>
        </div>

        {/* Projects List */}
        {showProjects && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">All Projects</h3>
            {projects.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No projects found.</p>
            ) : (
              <ul className="space-y-4">
                {projects.map((project) => (
                  <li
                    key={project._id}
                    className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700"
                  >
                    <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-300 mb-1">
                      {project.name}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Start Date: {new Date(project.startDate).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{project.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
