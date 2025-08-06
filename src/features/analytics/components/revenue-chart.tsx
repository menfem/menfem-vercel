// ABOUTME: Revenue chart component using Recharts for data visualization
// ABOUTME: Displays revenue trends over time with subscriptions and course sales

'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import type { RevenueChartData } from '../types';
import { CHART_COLORS } from '../constants';

interface RevenueChartProps {
  data: RevenueChartData[];
  height?: number;
}

export function RevenueChart({ data, height = 300 }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No revenue data available
      </div>
    );
  }

  // Format tooltip to show currency
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      dataKey: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {
              entry.dataKey === 'revenue' 
                ? `$${entry.value.toLocaleString()}` 
                : entry.value.toLocaleString()
            }
          </p>
        ))}
      </div>
    );
  };

  // Format Y-axis for revenue
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  // Format X-axis dates
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis}
          axisLine={false}
          tickLine={false}
          className="text-sm text-gray-600"
        />
        <YAxis 
          tickFormatter={formatYAxis}
          axisLine={false}
          tickLine={false}
          className="text-sm text-gray-600"
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />
        
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke={CHART_COLORS.PRIMARY}
          strokeWidth={3}
          dot={{ fill: CHART_COLORS.PRIMARY, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: CHART_COLORS.PRIMARY, strokeWidth: 2 }}
          name="Revenue"
        />
        
        <Line 
          type="monotone" 
          dataKey="subscriptions" 
          stroke={CHART_COLORS.SUCCESS}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.SUCCESS, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, stroke: CHART_COLORS.SUCCESS, strokeWidth: 2 }}
          name="Subscriptions"
        />
        
        <Line 
          type="monotone" 
          dataKey="courses" 
          stroke={CHART_COLORS.PURPLE}
          strokeWidth={2}
          dot={{ fill: CHART_COLORS.PURPLE, strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, stroke: CHART_COLORS.PURPLE, strokeWidth: 2 }}
          name="Course Sales"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}