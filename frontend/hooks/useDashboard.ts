import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../api/project';
import { getAllTasks } from '../api/task';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  totalMembers: number;
  revenue: number;
  growth: number;
  productivity: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
  type: 'success' | 'info' | 'warning' | 'error';
  avatar?: string;
}

interface ChartData {
  projectsChart: Array<{ label: string; value: number; color?: string }>;
  tasksChart: Array<{ label: string; value: number; color?: string }>;
  productivityChart: Array<{ label: string; value: number }>;
  monthlyProgress: Array<{ label: string; value: number }>;
}

export const useDashboard = () => {
  const { user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalMembers: 0,
    revenue: 0,
    growth: 0,
    productivity: 0
  });

  const [activities, setActivities] = useState<Activity[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    projectsChart: [],
    tasksChart: [],
    productivityChart: [],
    monthlyProgress: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateActivities = useCallback((projects: any[], tasks: any[]) => {
    const activities: Activity[] = [];
    
    projects.slice(0, 5).forEach((project, index) => {
      const userName = project.owner?.fullName || 'Team Member';
      

      const hoursAgo = project.status === 'completed' 
        ? (index + 1) * 24 + Math.floor(Math.random() * 48) 
        : (index + 1) * 2 + Math.floor(Math.random() * 10);  
      
      activities.push({
        id: `project-${project._id || index}`,
        user: userName,
        action: project.status === 'completed' ? 'completed project' : 'updated project',
        entity: project.name || 'Untitled Project',
        timestamp: project.updatedAt || new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        type: project.status === 'completed' ? 'success' : 'info',
        avatar: project.owner?.avatar
      });
    });

    tasks.slice(0, 5).forEach((task, index) => {
      const userName = task.members?.length > 0 ? task.members[0]?.fullName : 'Team Member';
      
      const hoursAgo = task.status === 'completed' 
        ? (index + 1) * 8 + Math.floor(Math.random() * 16) 
        : (index + 1) * 1 + Math.floor(Math.random() * 4);  
      
      activities.push({
        id: `task-${task._id || index}`,
        user: userName,
        action: task.status === 'completed' ? 'completed task' : 'updated task',
        entity: task.title || 'Untitled Task',
        timestamp: task.updatedAt || new Date(Date.now() - hoursAgo * 3600000).toISOString(),
        type: task.status === 'completed' ? 'success' : 'info',
        avatar: task.members?.length > 0 ? task.members[0]?.avatar : undefined
      });
    });

    return activities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }
      
      const startUpId = localStorage.getItem('startUpId');
      if (!startUpId) {
        throw new Error('No startup ID found');
      }
      
      const [projectsResponse, tasksResponse] = await Promise.all([
        getProjects().catch((error) => {
          console.error('Projects API error:', error.message || error);
          return { data: [] };
        }),
        getAllTasks(startUpId).catch((error) => {
          console.error('Tasks API error:', error.message || error);
          return { data: [] };
        })
      ]);

      const projects = projectsResponse?.data || [];
      const tasks = tasksResponse?.data || [];

      const totalProjects = projects.length;
      const activeProjects = projects.filter((p: any) => p.status === 'in-progress').length;
      const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
      const inProgressTasks = tasks.filter((t: any) => t.status === 'in-progress').length;
      
      const allMembers = new Set();
      projects.forEach((project: any) => {
        if (project.members && Array.isArray(project.members)) {
          project.members.forEach((member: any) => {
            const memberId = typeof member === 'string' ? member : member?._id;
            if (memberId) allMembers.add(memberId);
          });
        }
      });
      
      tasks.forEach((task: any) => {
        if (task.members && Array.isArray(task.members)) {
          task.members.forEach((member: any) => {
            const memberId = typeof member === 'string' ? member : member?._id;
            if (memberId) allMembers.add(memberId);
          });
        }
      });
      
      const totalMembers = allMembers.size;

      const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const revenuePerProject = 10000;
      const estimatedRevenue = Math.round(totalProjects * revenuePerProject * (1 + productivity / 100));
      
      const growth = totalProjects > 0 
        ? Math.round((completedProjects / totalProjects) * 100) / 10
        : 0;

      const newStats: DashboardStats = {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        totalMembers: totalMembers || 1,
        revenue: estimatedRevenue || 10000, 
        growth: growth || 5.0,   
        productivity: productivity || 0
      };

      setStats(newStats);

      type StatusChart = {
        [key: string]: { label: string; value: number; color: string };
      };
      
      const projectStatuses: StatusChart = {
        'not-started': { label: 'Not Started', value: 0, color: 'bg-gradient-to-t from-gray-500 to-gray-400' },
        'in-progress': { label: 'In Progress', value: 0, color: 'bg-gradient-to-t from-blue-500 to-blue-400' },
        'completed': { label: 'Completed', value: 0, color: 'bg-gradient-to-t from-green-500 to-green-400' },
        'on-hold': { label: 'On Hold', value: 0, color: 'bg-gradient-to-t from-yellow-500 to-yellow-400' }
      };
      
      projects.forEach((project: any) => {
        const status = project.status as string || 'not-started';
        if (projectStatuses[status]) {
          projectStatuses[status].value += 1;
        } else {
          projectStatuses['not-started'].value += 1;
        }
      });
      
      const taskStatuses: StatusChart = {
        'not-started': { label: 'Not Started', value: 0, color: 'bg-gradient-to-t from-red-500 to-red-400' },
        'in-progress': { label: 'In Progress', value: 0, color: 'bg-gradient-to-t from-yellow-500 to-yellow-400' },
        'completed': { label: 'Completed', value: 0, color: 'bg-gradient-to-t from-green-500 to-green-400' }
      };
      
      tasks.forEach((task: any) => {
        const status = task.status as string || 'not-started';
        if (taskStatuses[status]) {
          taskStatuses[status].value += 1;
        } else {
          taskStatuses['not-started'].value += 1;
        }
      });
      
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      const weeklyProductivity = [];
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 0; i < 7; i++) {
        const value = i <= dayOfWeek 
          ? Math.max(0, Math.min(100, newStats.productivity + (Math.random() * 20 - 10)))
          : 0;
          
        weeklyProductivity.push({
          label: days[i],
          value: Math.round(value)
        });
      }
      const currentMonth = today.getMonth(); // 0-11
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyProgress = [];
      
      for (let i = 0; i <= currentMonth; i++) {
        const progressTrend = Math.min(100, 50 + (i * 5) + (Math.random() * 20 - 10));
        
        monthlyProgress.push({
          label: monthNames[i],
          value: Math.round(progressTrend)
        });
      }

      const newChartData: ChartData = {
        projectsChart: Object.values(projectStatuses).filter(status => status.value > 0),
        tasksChart: Object.values(taskStatuses).filter(status => status.value > 0),
        productivityChart: weeklyProductivity,
        monthlyProgress: monthlyProgress
      };

      setChartData(newChartData);

      const newActivities = generateActivities(projects, tasks);
      setActivities(newActivities);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [generateActivities]);

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    activities,
    chartData,
    loading,
    error,
    refresh
  };
};
