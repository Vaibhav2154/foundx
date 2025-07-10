import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight, Users, Briefcase, ClipboardList, Settings } from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'actions' | 'recent';
}

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose, onNavigate }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: 'nav-projects',
      title: 'Go to Projects',
      description: 'View and manage all projects',
      icon: <Briefcase className="w-4 h-4" />,
      action: () => onNavigate('/dashboard/projects'),
      category: 'navigation'
    },
    {
      id: 'nav-tasks',
      title: 'Go to Tasks',
      description: 'View and manage tasks',
      icon: <ClipboardList className="w-4 h-4" />,
      action: () => onNavigate('/dashboard/tasks'),
      category: 'navigation'
    },
    {
      id: 'nav-team',
      title: 'Go to Team',
      description: 'Manage team members',
      icon: <Users className="w-4 h-4" />,
      action: () => onNavigate('/dashboard/team'),
      category: 'navigation'
    },
    {
      id: 'nav-settings',
      title: 'Go to Settings',
      description: 'Configure your workspace',
      icon: <Settings className="w-4 h-4" />,
      action: () => onNavigate('/dashboard/settings'),
      category: 'navigation'
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center gap-3 p-4 border-b border-gray-700/50">
          <Command className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs text-gray-400 bg-gray-700/50 rounded border border-gray-600">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => {
                    command.action();
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    index === selectedIndex
                      ? 'bg-blue-600/20 border border-blue-500/30'
                      : 'hover:bg-gray-700/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    index === selectedIndex ? 'bg-blue-500/20' : 'bg-gray-700/50'
                  }`}>
                    {command.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium">{command.title}</p>
                    <p className="text-gray-400 text-sm truncate">{command.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-700/50 text-xs text-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">↵</kbd>
              <span>Select</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-700/50 rounded text-xs">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
