// ABOUTME: Table component displaying content performance metrics
// ABOUTME: Shows views, completions, and engagement for different content types

import type { ContentMetricsData } from '../types';

interface ContentMetricsTableProps {
  data: ContentMetricsData[];
}

export function ContentMetricsTable({ data }: ContentMetricsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No content metrics available
      </div>
    );
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return '📝';
      case 'video':
        return '🎥';
      case 'course':
        return '🎓';
      default:
        return '📄';
    }
  };

  const getContentTypeBadge = (type: string) => {
    const colors = {
      article: 'bg-blue-100 text-blue-800',
      video: 'bg-purple-100 text-purple-800',
      course: 'bg-green-100 text-green-800',
    };
    
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const calculateCompletionRate = (views: number, completions: number) => {
    if (views === 0) return 0;
    return Math.round((completions / views) * 100);
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completions
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const completionRate = calculateCompletionRate(item.views, item.completions);
              
              return (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {getContentTypeIcon(item.contentType)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-48">
                          {item.contentTitle}
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getContentTypeBadge(item.contentType)}`}>
                          {item.contentType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.completions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${
                        completionRate >= 70 ? 'text-green-600' :
                        completionRate >= 40 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {completionRate}%
                      </span>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            completionRate >= 70 ? 'bg-green-500' :
                            completionRate >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(completionRate, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {item.engagement.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No content data available for the selected period
        </div>
      )}
    </div>
  );
}