'use client';

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { QueryAnalytics, Priority, QueryTag, Channel } from '@/lib/types';

interface AnalyticsChartsProps {
  analytics: QueryAnalytics;
}

export function AnalyticsCharts({ analytics }: AnalyticsChartsProps) {
  // Priority distribution data
  const priorityData = Object.entries(analytics.queriesByPriority).map(([priority, count]) => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: count,
    priority,
  }));

  // Tag distribution data
  const tagData = Object.entries(analytics.queriesByTag)
    .filter(([, count]) => count > 0)
    .map(([tag, count]) => ({
      name: tag.charAt(0).toUpperCase() + tag.slice(1),
      value: count,
    }));

  // Channel distribution data
  const channelData = Object.entries(analytics.queriesByChannel)
    .filter(([, count]) => count > 0)
    .map(([channel, count]) => ({
      name: channel.charAt(0).toUpperCase() + channel.slice(1),
      value: count,
    }));

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Queries by Priority</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="value" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Queries by Channel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {channelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Tag Distribution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Queries by Tag</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tagData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="value" fill="var(--color-chart-2)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Resolution Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Resolution Rate</span>
              <span className="text-sm font-bold text-primary">{analytics.resolutionRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${analytics.resolutionRate}%` }}
              ></div>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">Avg. Response Time</p>
            <p className="text-2xl font-bold text-foreground">{analytics.averageResponseTime}m</p>
          </div>
        </div>
      </div>
    </div>
  );
}
