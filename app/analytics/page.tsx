'use client';

import { useMemo, useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { calculateAnalytics } from '@/lib/analytics-utils';
import { AnalyticsCard } from '@/components/analytics-card';
import { AnalyticsCharts } from '@/components/analytics-charts';
import { AudienceQuery, QueryAnalytics } from '@/lib/types';

export default function AnalyticsPage() {
  const [queries, setQueries] = useState<AudienceQuery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await fetch('/api/queries');
        const data = await res.json();
        if (data.success) {
          const queriesWithDates = data.data.map((q: any) => ({
            ...q,
            receivedAt: new Date(q.receivedAt),
            lastUpdate: q.lastUpdate ? new Date(q.lastUpdate) : undefined,
          }));
          setQueries(queriesWithDates);
        }
      } catch (error) {
        console.error('Failed to fetch queries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  const analytics = useMemo(() => calculateAnalytics(queries), [queries]);

  const newCount = queries.filter((q) => q.status === 'new').length;
  const inProgressCount = queries.filter((q) => q.status === 'in-progress').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-10 border-b border-border bg-background">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-muted-foreground">Loading metrics...</p>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-muted-foreground">Audience query performance metrics</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AnalyticsCard
            title="Total Queries"
            value={analytics.totalQueries}
            description="All time"
            icon="📬"
          />
          <AnalyticsCard
            title="Avg. Response Time"
            value={`${analytics.averageResponseTime}m`}
            description="For resolved queries"
            icon={<Clock className="w-8 h-8" />}
          />
          <AnalyticsCard
            title="Resolution Rate"
            value={`${analytics.resolutionRate}%`}
            description="Queries resolved"
            icon={<CheckCircle className="w-8 h-8" />}
          />
          <AnalyticsCard
            title="Pending Queries"
            value={newCount + inProgressCount}
            description={`${newCount} new, ${inProgressCount} in progress`}
            icon={<MessageSquare className="w-8 h-8" />}
          />
        </div>

        {/* Charts */}
        <AnalyticsCharts analytics={analytics} />
      </main>
    </div>
  );
}
