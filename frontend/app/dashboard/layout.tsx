"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Rocket, Briefcase, CheckSquare, Users, Settings, Bell, User, MessageCircle, Menu, X, Search } from 'lucide-react';
import Image from 'next/image';
import { NotificationCenter } from '../../components/ui/NotificationCenter';
import { CommandPalette } from '../../components/ui/CommandPalette';
import { useRouter } from 'next/navigation';

interface UserProfile {
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  initials?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: UserProfile;
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Guest User',
    role: 'Member',
    initials: 'GU'
  });

  // Add keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get user from localStorage on component mount
  useEffect(() => {
    try {
      const loggedUser = localStorage.getItem('user');
      const userFromStorage = loggedUser ? JSON.parse(loggedUser) : null;
      
      // Priority: prop user > localStorage user > default user
      const resolvedUser = user || userFromStorage || {
        name: 'Guest User',
        role: 'Member',
        initials: 'GU'
      };
      
      setCurrentUser(resolvedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Fall back to prop user or default
      setCurrentUser(user || {
        name: 'Guest User',
        role: 'Member',
        initials: 'GU'
      });
    }
  }, [user]);

  // Generate initials from name if not provided
  const getInitials = (name: string) => {
    if (currentUser.initials) return currentUser.initials;
    if (!name || typeof name !== 'string') return 'GU';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Overview', active: true },
    { href: '/dashboard/projects', icon: Briefcase, label: 'Projects' },
    { href: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/legal', icon: Settings, label: 'Legal' },
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
                  {currentUser.avatar ? (
                    <Image
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {getInitials(currentUser.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {currentUser.role || 'Member'}
                  </p>
                  {currentUser.email && (
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${sidebarOpen ? 'pl-64' : 'pl-16'} transition-all duration-300`}>
        <header className="bg-gray-800/30 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4 relative">
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
                <p className="text-gray-400 text-sm">
                  Welcome back, {currentUser.name?.split(' ')[0] || 'Guest'}! Here's what's happening with your startup.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 relative z-[110]">
                <button
                  onClick={() => setShowCommandPalette(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden md:block text-sm">Search</span>
                  <kbd className="hidden md:block px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded border border-gray-600">
                    ⌘K
                  </kbd>
                </button>
                <NotificationCenter />
                <Link target='_blank' href="https://lakshya-brown.vercel.app/" className="p-2 text-gray-400 hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
                </Link>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="p-6 relative">
          {children}
        </main>
      </div>

      Assistant Floating Button
      <Link
        href="/assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </Link>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onNavigate={(path) => {
            router.push(path);
            setShowCommandPalette(false);
          }}
        />
      )}
    </div>
  );
}