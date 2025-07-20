'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Briefcase, CheckSquare, Settings } from 'lucide-react';

interface TeamLayoutProps {
  children: React.ReactNode;
}

export default function TeamLayout({ children }: TeamLayoutProps) {
  const pathname = usePathname();

  const teamNavItems = [
    { href: '/dashboard/team', icon: Users, label: 'Team Members' },
    { href: '/dashboard/team/projects', icon: Briefcase, label: 'Projects' },
    { href: '/dashboard/team/tasks', icon: CheckSquare, label: 'Tasks' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/team') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Team Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Team Management
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Manage your team members, projects, and tasks all in one place
          </p>
        </div>

        {/* Team Navigation */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {teamNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Page Content */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
