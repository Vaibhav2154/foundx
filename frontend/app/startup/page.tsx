'use client';

import { useState, useEffect } from 'react';
import { Building2, Search, Users, Plus, CheckCircle, Zap, Eye, CreditCard, Lock, UserPlus, Star, ArrowRight, Sparkles, Shield, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { showError, showSuccess } from '@/utils/toast';
import { API_BASE_URL } from '@/config/constants';

type Employee = {
  _id: string;
  fullName: string;
  email: string;
  username?: string;
};

type Startup = {
  _id: string;
  companyName: string;
  ownerId: string;
};

export default function StartupPage() {
    const router = useRouter();
  const [createForm, setCreateForm] = useState({ companyName: '', password: '' });
  const [accessForm, setAccessForm] = useState({ companyName: '', password: '' });
  const [joinForm, setJoinForm] = useState({ companyName: '', password: '' });
  const [searchName, setSearchName] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [startupData, setStartupData] = useState<Startup | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleAccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessForm({ ...accessForm, [e.target.name]: e.target.value });
  };

  const handleJoinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinForm({ ...joinForm, [e.target.name]: e.target.value });
  };

  const createStartup = async () => {
    if (!createForm.companyName || !createForm.password) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showError('Please login first');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/startups/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: createForm.companyName,
          password: createForm.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Startup created successfully');
        localStorage.setItem('companyName', data.data.companyName);
        localStorage.setItem('startUpId', data.data._id);
        setCreateForm({ companyName: '', password: '' });
      } else {
        showError(data.message || 'Something went wrong.');
      }
    } catch (error) {
      showError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const accessStartup = async () => {
    if (!accessForm.companyName || !accessForm.password) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showError('Please login first');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/startups/access`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: accessForm.companyName,
          password: accessForm.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStartupData(data.data);
        showSuccess('Startup accessed successfully');
        localStorage.setItem('companyName', data.data.companyName);
        localStorage.setItem('startUpId', data.data._id);
        router.push('/dashboard'); // As of now all the employees can see the dashboard
        setAccessForm({ companyName: '', password: '' });
      } else {
        showError(data.message || 'Access denied');
      }
    } catch (error) {
      showError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const joinStartup = async () => {
    if (!joinForm.companyName || !joinForm.password) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        showError('Please login first');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/startups/accessAndJoin`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          companyName: joinForm.companyName,
          password: joinForm.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showSuccess('Successfully joined the startup as an employee!');
        localStorage.setItem('companyName', data.data.companyName);
        localStorage.setItem('startUpId', data.data._id);
        setJoinForm({ companyName: '', password: '' });
        router.push('/dashboard'); // As of now who ever has company credentials can see the dashboard
      } else {
        showError(data.message || 'Failed to join startup');
      }
    } catch (error) {
      showError('Server error');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!searchName) {
      showError('Please enter a company name');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/startups/employees`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          companyName: searchName
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // The backend returns an array of startups with populated employees
        // We need to extract the employees from the first startup
        if (data.data && data.data.length > 0 && data.data[0].employees) {
          setEmployees(data.data[0].employees);
        } else {
          setEmployees([]);
          showError('No employees found for this startup');
        }
      } else {
        showError(data.message || 'No employees found');
        setEmployees([]);
      }
    } catch (error) {
      showError('Server error');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className={`relative py-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Startup Management Hub
              <Star className="w-4 h-4 ml-2 text-yellow-500" />
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
              Build Your 
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"> Dream Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create, manage, and scale your startup with powerful team collaboration tools. 
              <span className="text-blue-600 dark:text-blue-400 font-semibold">Join thousands of successful startups</span> building the future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Startup */}
            <div id='create' className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create a Startup</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  value={createForm.companyName}
                  onChange={handleCreateChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter a secure password for your startup"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This password will be used to secure your startup account
                </p>
              </div>
              <button
                onClick={createStartup}
                disabled={loading || !createForm.companyName || !createForm.password}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Startup...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Create Startup
                  </span>
                )}
              </button>
            </div>
          </div>
          <div id='join' className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <UserPlus className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join a Startup</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  type="text"
                  placeholder="Enter company name to join"
                  value={joinForm.companyName}
                  onChange={handleJoinChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter startup password"
                  value={joinForm.password}
                  onChange={handleJoinChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You will be added as an employee to this startup
                </p>
              </div>
              <button
                onClick={joinStartup}
                disabled={loading || !joinForm.companyName || !joinForm.password}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Joining Startup...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join Startup
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Access a Startup</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  type="text"
                  placeholder="Enter company name"
                  value={accessForm.companyName}
                  onChange={handleAccessChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter startup password"
                  value={accessForm.password}
                  onChange={handleAccessChange}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              <button
                onClick={accessStartup}
                disabled={loading || !accessForm.companyName || !accessForm.password}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Accessing Startup...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Search className="w-5 h-5 mr-2" />
                    Access Startup
                  </span>
                )}
              </button>

              {startupData && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center mb-3">
                    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100">{startupData.companyName}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <CreditCard className="w-4 h-4 mr-2" />
                      ID: {startupData._id}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Users className="w-4 h-4 mr-2" />
                      Owner ID: {startupData.ownerId}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">View Startup Employees</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Enter company name to view employees"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                onClick={fetchEmployees}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  Get Employees
                </span>
              </button>

              {employees.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Found {employees.length} employee{employees.length !== 1 ? 's' : ''}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {employees.map((emp, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {emp.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-slate-900 dark:text-white font-bold">{emp.fullName}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{emp.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}