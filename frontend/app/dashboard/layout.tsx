"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Rocket, Briefcase, CheckSquare, Users, Settings, Bell, User, MessageCircle, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Overview', active: true },
    { href: '/dashboard/startup', icon: Rocket, label: 'Startup' },
    { href: '/dashboard/projects', icon: Briefcase, label: 'Projects' },
    { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-800/50 backdrop-blur-xl border-r border-gray-700/50 transition-all duration-300`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center ${sidebarOpen ? 'px-14 py-2' : 'px-4 py-4 justify-center'} transition-all duration-300`}>
            {sidebarOpen ? (
              <Image
                src="/logo.png"
                alt="FoundX Logo"
                width={120}
                height={120}
                className="rounded-lg"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                F
              </div>
            )}
           </div>
          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center ${sidebarOpen ? 'px-4' : 'px-2 justify-center'} py-3 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-200 group`}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    {sidebarOpen && item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {sidebarOpen && (
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700/50 rounded-xl transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">Founder</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${sidebarOpen ? 'pl-64' : 'pl-16'} transition-all duration-300`}>
        <header className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors mr-4"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">Dashboard</h2>
                <p className="text-gray-400 text-sm">Welcome back! Here's what's happening with your startup.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Assistant Floating Button */}
      <Link
        href="/assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Link>
    </div>
  );
}
