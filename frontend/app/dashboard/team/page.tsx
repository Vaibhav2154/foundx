'use client';

import { useEffect, useState } from 'react';
import { Plus, UserPlus, UserX, Users } from 'lucide-react';
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
    <div className="space-y-8 text-slate-900 dark:text-white">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Members</h2>
        <p className="text-slate-600 dark:text-slate-300">View, add, or remove members of your startup.</p>
      </div>

      {/* Add Member */}
      <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus size={20} /> Add New Member
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className="flex-1 p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={addMember}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </div>

      {/* Team List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Current Team ({members.length} members)</h3>

        {members.length === 0 ? (
          <div className="text-center py-8">
            <Users size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No team members added yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map(member => (
              <div
                key={member._id}
                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{member.fullName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{member.email}</p>
                      {member.role && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 capitalize mt-1">{member.role}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(member._id)}
                    className="text-red-500 hover:text-red-600 p-1 rounded transition"
                    title="Remove member"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}