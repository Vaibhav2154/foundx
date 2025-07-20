"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Users, Settings, Bell, MessageCircle, Menu, X, Search, Scale, LogOut, ChevronDown, ExternalLink, Bot } from 'lucide-react';
import Image from 'next/image';
import { CommandPalette } from '../../components/ui/CommandPalette';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { useRouter } from 'next/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { useAuth } from '@/contexts/AuthContext';
import { showSuccess } from '@/utils/toast';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { NotificationCenter } from '@/components/ui/NotificationCenter';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const router = useRouter();
  const { navigate } = useNavigation();
  const { isActive, pathname } = useActiveRoute();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Guest User',
    role: 'Member',
    initials: 'GU'
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
      if (!target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    };

    if (userMenuOpen || mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [userMenuOpen, mobileMenuOpen]);

  const handleQuickLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully!');
    } catch (error) {
      console.error('Error during logout:', error);
      showSuccess('Logged out successfully!');
      router.push('/sign-in');
    }
  };

  useEffect(() => {
    try {
      const loggedUser = localStorage.getItem('user');
      const userFromStorage = loggedUser ? JSON.parse(loggedUser) : null;
      
      const resolvedUser = user || userFromStorage || {
        name: 'Guest User',
        role: 'Member',
        initials: 'GU'
      };
      
      setCurrentUser(resolvedUser);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      setCurrentUser(user || {
        name: 'Guest User',
        role: 'Member',
        initials: 'GU'
      });
    }
  }, [user]);

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
    { href: '/dashboard', icon: Home, label: 'Overview' },
    { href: '/dashboard/team', icon: Users, label: 'Team' },
    { href: '/dashboard/assistant', icon: Bot, label: 'PitchPilot' },
    { href: '/dashboard/legal', icon: Scale, label: 'Legal' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <nav className="bg-gray-800/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-[95%] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="FoundX Logo"
                  width={100}
                  height={100}
                  priority
                  className="rounded-lg"
                />
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 group ${
                      isActive(item.href)
                        ? 'text-white bg-blue-600/20 border border-blue-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <NotificationCenter /> 
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden md:flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors group"
              >
                <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>


              <Link target='_blank' href="https://lakshya-brown.vercel.app/" className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
                <ExternalLink className="w-5 h-5" />
              </Link>

              <button 
                onClick={() => navigate('/dashboard/settings')}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>

              <div className="relative" data-user-menu>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
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
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium">{currentUser.name}</p>
                    <p className="text-xs text-gray-400">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 hidden lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-700/50">
                      <p className="text-sm font-medium text-white">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.role}</p>
                      {currentUser.email && (
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setUserMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button
                      onClick={handleQuickLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                data-mobile-menu
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700/50 py-4" data-mobile-menu>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      navigate(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'text-white bg-blue-600/20 border border-blue-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <button
                  onClick={() => {
                    setShowCommandPalette(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 mr-3" />
                </button>
                <button className="flex items-center w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors mt-2">
                  <Bell className="w-4 h-4 mr-3" />
                  Notifications
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[95%] 2xl:max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 animate-in fade-in duration-300">
        {/* Breadcrumbs - only show on sub-pages */}
        {pathname !== '/dashboard' && (
          <div className="mb-6">
            <Breadcrumbs />
          </div>
        )}
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          onNavigate={(path) => {
            navigate(path);
            setShowCommandPalette(false);
          }}
        />
      )}
    </div>
  );
}