import React from 'react';

interface ChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  height?: number;
  className?: string;
}

export const SimpleBarChart: React.FC<ChartProps> = ({ 
  data, 
  title, 
  height = 200,
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 ${className}`}>
        {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-32 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 ${className}`}>
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="relative w-full max-w-12">
              <div 
                className={`w-full rounded-t-lg transition-all duration-500 ease-out ${
                  item.color || 'bg-blue-600'
                }`}
                style={{ 
                  height: `${(item.value / maxValue) * (height - 60)}px`,
                  minHeight: '4px'
                }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white font-medium">
                  {item.value}
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-400 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleLineChart: React.FC<ChartProps> = ({ 
  data, 
  title,
  height = 200,
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 ${className}`}>
        {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center h-32 text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - ((item.value - minValue) / range) * 100
  }));

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 ${className}`}>
      {title && <h3 className="text-white font-semibold mb-4">{title}</h3>}
      <div className="relative" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2"
            className="drop-shadow-lg"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="#3B82F6"
              className="drop-shadow-lg hover:r-4 transition-all cursor-pointer"
            >
              <title>{`${data[index].label}: ${data[index].value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between mt-4">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-400">{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
