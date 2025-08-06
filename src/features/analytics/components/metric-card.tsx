// ABOUTME: Reusable metric card component for displaying key statistics
// ABOUTME: Shows metric value, percentage change, and trend indicators

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon?: string;
  description?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon,
  description 
}: MetricCardProps) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendIcon = trend === 'up' ? '↗' : '↘';

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {value}
          </div>
          <div className={`text-sm flex items-center ${changeColor}`}>
            <span className="mr-1">{trendIcon}</span>
            <span>{Math.abs(change)}%</span>
            <span className="text-gray-500 ml-1">from last period</span>
          </div>
          {description && (
            <div className="text-xs text-gray-500 mt-1">
              {description}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-2xl opacity-70">
            {icon}
          </div>
        )}
      </div>
      
      {/* Change indicator bar */}
      <div className="mt-4">
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-300 ${
                isPositive ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ 
                width: `${Math.min(Math.abs(change), 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}