import React from 'react';
import { Users, Clock, UserCheck, Coffee } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  currentTask?: string;
  workload: number; // percentage
}

interface TeamStatusProps {
  className?: string;
}

export const TeamStatus: React.FC<TeamStatusProps> = ({ className = '' }) => {
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Frontend Developer',
      status: 'online',
      currentTask: 'Dashboard UI',
      workload: 85
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Backend Developer',
      status: 'busy',
      currentTask: 'API Integration',
      workload: 92
    },
    {
      id: '3',
      name: 'Mike Johnson',
      role: 'UI/UX Designer',
      status: 'away',
      currentTask: 'Wireframes',
      workload: 67
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      role: 'Project Manager',
      status: 'online',
      currentTask: 'Sprint Planning',
      workload: 78
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-400';
      case 'busy':
        return 'bg-red-400';
      case 'away':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <UserCheck className="w-3 h-3 text-green-400" />;
      case 'busy':
        return <Clock className="w-3 h-3 text-red-400" />;
      case 'away':
        return <Coffee className="w-3 h-3 text-yellow-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'from-red-500 to-red-400';
    if (workload >= 70) return 'from-yellow-500 to-yellow-400';
    return 'from-green-500 to-green-400';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          Team Status
        </h3>
        <div className="text-xs text-gray-400">
          {teamMembers.filter(m => m.status === 'online').length} online
        </div>
      </div>

      <div className="space-y-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {getInitials(member.name)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.status)}`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium text-sm truncate">{member.name}</h4>
                {getStatusIcon(member.status)}
              </div>
              <p className="text-gray-400 text-xs mb-1">{member.role}</p>
              {member.currentTask && (
                <p className="text-blue-400 text-xs truncate">Working on: {member.currentTask}</p>
              )}
              
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Workload</span>
                  <span className={`font-semibold ${
                    member.workload >= 90 ? 'text-red-400' : 
                    member.workload >= 70 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {member.workload}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getWorkloadColor(member.workload)} transition-all duration-300 rounded-full`}
                    style={{ width: `${member.workload}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">
              {teamMembers.filter(m => m.status === 'online').length}
            </p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {teamMembers.filter(m => m.workload >= 80).length}
            </p>
            <p className="text-xs text-gray-400">High Load</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(teamMembers.reduce((acc, m) => acc + m.workload, 0) / teamMembers.length)}%
            </p>
            <p className="text-xs text-gray-400">Avg Load</p>
          </div>
        </div>
      </div>
    </div>
  );
};
