// ABOUTME: Table component showing most viewed pages and their metrics
// ABOUTME: Displays page paths, view counts, and unique visitor data

interface TopPage {
  path: string;
  views: number;
  uniqueViews: number;
}

interface TopPagesTableProps {
  data: TopPage[];
}

export function TopPagesTable({ data }: TopPagesTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No page view data available
      </div>
    );
  }

  const getPageIcon = (path: string) => {
    if (path === '/') return '🏠';
    if (path.startsWith('/articles')) return '📝';
    if (path.startsWith('/videos') || path.startsWith('/watch')) return '🎥';
    if (path.startsWith('/courses')) return '🎓';
    if (path.startsWith('/products')) return '🛍️';
    if (path.startsWith('/events')) return '📅';
    if (path.startsWith('/about')) return 'ℹ️';
    if (path.startsWith('/contact')) return '📞';
    if (path.startsWith('/admin')) return '⚙️';
    return '📄';
  };

  const formatPath = (path: string) => {
    if (path === '/') return 'Home';
    return path
      .split('/')
      .filter(Boolean)
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' › ');
  };

  const calculateEngagementRate = (views: number, uniqueViews: number) => {
    if (uniqueViews === 0) return 0;
    return Math.round((views / uniqueViews) * 100);
  };

  const maxViews = Math.max(...data.map(page => page.views));

  return (
    <div className="overflow-hidden">
      <div className="space-y-3">
        {data.map((page, index) => {
          const engagementRate = calculateEngagementRate(page.views, page.uniqueViews);
          const viewsPercentage = (page.views / maxViews) * 100;
          
          return (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center flex-1 min-w-0">
                <span className="text-lg mr-3 flex-shrink-0">
                  {getPageIcon(page.path)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {formatPath(page.path)}
                  </div>
                  <div className="text-xs text-gray-500 truncate" title={page.path}>
                    {page.path}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {page.views.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {page.uniqueViews.toLocaleString()} unique
                  </div>
                </div>
                
                <div className="w-20">
                  <div className="flex items-center justify-end mb-1">
                    <span className="text-xs text-gray-600">
                      {engagementRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${viewsPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No page view data available for the selected period
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Showing top {data.length} pages by total views
        </div>
      </div>
    </div>
  );
}