import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <nav className="mb-6 flex gap-4 text-blue-400">
        <Link href="/dashboard/startup">Startup</Link>
        <Link href="/dashboard/projects">Projects</Link>
        <Link href="/dashboard/tasks">Tasks</Link>
        <Link href="/dashboard/team">Team</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
