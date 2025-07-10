import { useState, useEffect, useCallback } from 'react';
import { getProjects } from '../api/project';

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

  // Generate sample activities based on current data
  const generateActivities = useCallback((projects: any[], tasks: any[]) => {
    const sampleActivities: Activity[] = [];
    const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    const actions = ['created', 'updated', 'completed', 'assigned to', 'commented on'];
    
    // Generate activities from recent projects
    projects.slice(0, 3).forEach((project, index) => {
      sampleActivities.push({
        id: `activity-${index}`,
        user: users[index % users.length],
        action: 'created project',
        entity: project.name,
        timestamp: new Date(Date.now() - index * 3600000).toISOString(),
        type: 'success',
      });
    });

    // Generate activities from recent tasks
    tasks.slice(0, 2).forEach((task, index) => {
      sampleActivities.push({
        id: `task-activity-${index}`,
        user: users[(index + 1) % users.length],
        action: task.status === 'completed' ? 'completed task' : 'updated task',
        entity: task.title,
        timestamp: new Date(Date.now() - (index + 3) * 3600000).toISOString(),
        type: task.status === 'completed' ? 'success' : 'info',
      });
    });

    return sampleActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [projectsResponse] = await Promise.all([
        getProjects().catch(() => ({ data: [] }))
      ]);

      const projects = projectsResponse?.data || [];
      // For now, extract tasks from projects until task API is implemented
      const tasks = projects.reduce((allTasks: any[], project: any) => {
        return allTasks.concat(project.tasks || []);
      }, []);

      // Calculate stats
      const totalProjects = projects.length;
      const activeProjects = projects.filter((p: any) => p.status === 'in-progress').length;
      const completedProjects = projects.filter((p: any) => p.status === 'completed').length;
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
      const inProgressTasks = tasks.filter((t: any) => t.status === 'in-progress').length;
      
      // Calculate unique members across all projects
      const allMembers = new Set();
      projects.forEach((project: any) => {
        if (project.members) {
          project.members.forEach((member: any) => allMembers.add(member));
        }
      });
      const totalMembers = allMembers.size;

      // Calculate productivity percentage
      const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const newStats: DashboardStats = {
        totalProjects,
        activeProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        totalMembers,
        revenue: 45000, // TODO: Replace with real revenue data
        growth: 12.5,   // TODO: Replace with real growth data
        productivity
      };

      setStats(newStats);

      // Generate chart data
      const newChartData: ChartData = {
        projectsChart: [
          { label: 'Active', value: activeProjects, color: 'bg-gradient-to-t from-blue-500 to-blue-400' },
          { label: 'Completed', value: completedProjects, color: 'bg-gradient-to-t from-green-500 to-green-400' },
          { label: 'Not Started', value: totalProjects - activeProjects - completedProjects, color: 'bg-gradient-to-t from-gray-500 to-gray-400' }
        ],
        tasksChart: [
          { label: 'Completed', value: completedTasks, color: 'bg-gradient-to-t from-green-500 to-green-400' },
          { label: 'In Progress', value: inProgressTasks, color: 'bg-gradient-to-t from-yellow-500 to-yellow-400' },
          { label: 'Not Started', value: totalTasks - completedTasks - inProgressTasks, color: 'bg-gradient-to-t from-red-500 to-red-400' }
        ],
        productivityChart: [
          { label: 'Mon', value: Math.floor(Math.random() * 100) },
          { label: 'Tue', value: Math.floor(Math.random() * 100) },
          { label: 'Wed', value: Math.floor(Math.random() * 100) },
          { label: 'Thu', value: Math.floor(Math.random() * 100) },
          { label: 'Fri', value: Math.floor(Math.random() * 100) },
          { label: 'Sat', value: Math.floor(Math.random() * 100) },
          { label: 'Sun', value: Math.floor(Math.random() * 100) }
        ],
        monthlyProgress: [
          { label: 'Jan', value: 65 },
          { label: 'Feb', value: 78 },
          { label: 'Mar', value: 82 },
          { label: 'Apr', value: 88 },
          { label: 'May', value: 95 },
          { label: 'Jun', value: 92 }
        ]
      };

      setChartData(newChartData);

      // Generate activities
      const newActivities = generateActivities(projects, tasks);
      setActivities(newActivities);

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [generateActivities]);

  // Auto-refresh data every 5 minutes
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
