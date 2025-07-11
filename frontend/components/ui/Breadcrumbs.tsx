import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { useNavigation } from '@/contexts/NavigationContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const { pathname } = useActiveRoute();
  const { navigate } = useNavigation();

  // Generate breadcrumbs from pathname if items not provided
  const breadcrumbItems = items || generateBreadcrumbs(pathname);

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          {item.href ? (
            <button
              onClick={() => navigate(item.href!)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-white font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Remove 'dashboard' from segments since we start with home icon
  const dashboardIndex = segments.indexOf('dashboard');
  if (dashboardIndex !== -1) {
    segments.splice(dashboardIndex, 1);
  }

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    
    if (isLast) {
      breadcrumbs.push({ label });
    } else {
      const href = `/dashboard/${segments.slice(0, index + 1).join('/')}`;
      breadcrumbs.push({ label, href });
    }
  });

  return breadcrumbs;
}
