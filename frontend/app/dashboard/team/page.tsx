'use client';

import { useEffect, useState } from 'react';
import { Plus, UserPlus, UserX } from 'lucide-react';
import { showError, showSuccess } from '@/utils/toast';

type TeamMember = {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/getEmployees`,{
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
          setMembers(employees);
        }
      })
      .catch(() => showError('Failed to load team'));
  }, []);

  async function addMember() {
    if (!newEmail.trim()) return showError('Enter email');
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/addEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail })
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(prev => [...prev, data.data]);
        setNewEmail('');
        showSuccess('Member added successfully');
      } else showError(data.message || 'Add failed');
    } catch {
      showError('Server error');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Remove this member?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/startups/removeEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
       },
        body: JSON.stringify({ employeeId: id })
      });
      const data = await res.json();
      if (res.ok) {
        setMembers(prev => prev.filter(m => m._id !== id));
        showSuccess('Member removed successfully');
      } else showError(data.message || 'Remove failed');
    } catch {
      showError('Server error');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-900 px-4 sm:px-6 lg:px-8 py-12 text-slate-900 dark:text-white">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">
  Team Management
</h1>

          <p className="text-slate-600 dark:text-slate-300">View, add, or remove members of your startup.</p>
        </div>

        {/* Add Member */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <UserPlus size={20} /> Add Member
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white"
            />
            <button
              onClick={addMember}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition"
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Current Team</h2>

          {members.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400">No members added yet.</p>
          ) : (
            <ul className="space-y-4">
              {members.map(member => (
                <li
                  key={member._id}
                  className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{member.fullName}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                    {member.role && (
                      <p className="text-xs text-slate-500 dark:text-slate-500 capitalize">{member.role}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(member._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 transition"
                  >
                    <UserX size={16} /> Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}