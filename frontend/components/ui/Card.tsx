import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false 
}) => {
  return (
    <div className={`
      ${gradient 
        ? 'bg-slate-800/50 border-slate-700/50' 
        : 'bg-gray-800/50'
      }
      backdrop-blur-sm rounded-2xl border border-gray-700/50 
      ${hover ? 'hover:border-gray-600/50 hover:shadow-xl hover:shadow-purple-500/10' : ''}
      transition-all duration-300 
      ${className}
    `}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`p-6 pb-4 ${className}`}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`px-6 pb-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; icon?: React.ReactNode }> = ({ 
  children, 
  className = '',
  icon 
}) => (
  <h3 className={`text-lg font-semibold text-white flex items-center ${className}`}>
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </h3>
);
