import { AudienceQuery, QueryAnalytics, Priority, QueryTag, Channel } from './types';

export function calculateAnalytics(queries: AudienceQuery[]): QueryAnalytics {
  const totalQueries = queries.length;
  
  // Calculate average response time (only for resolved queries)
  const resolvedQueries = queries.filter((q) => q.responseTime);
  const averageResponseTime =
    resolvedQueries.length > 0
      ? Math.round(resolvedQueries.reduce((sum, q) => sum + (q.responseTime || 0), 0) / resolvedQueries.length)
      : 0;

  // Count by priority
  const queriesByPriority: Record<Priority, number> = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };
  queries.forEach((q) => {
    queriesByPriority[q.priority]++;
  });

  // Count by tag
  const queriesByTag: Record<QueryTag, number> = {
    question: 0,
    request: 0,
    complaint: 0,
    feedback: 0,
    bug: 0,
    inquiry: 0,
  };
  queries.forEach((q) => {
    q.tags.forEach((tag) => {
      queriesByTag[tag]++;
    });
  });

  // Count by channel
  const queriesByChannel: Record<Channel, number> = {
    email: 0,
    twitter: 0,
    instagram: 0,
    facebook: 0,
    chat: 0,
    community: 0,
  };
  queries.forEach((q) => {
    queriesByChannel[q.channel]++;
  });

  // Calculate resolution rate
  const resolvedCount = queries.filter((q) => q.status === 'resolved' || q.status === 'closed').length;
  const resolutionRate = totalQueries > 0 ? Math.round((resolvedCount / totalQueries) * 100) : 0;

  return {
    totalQueries,
    averageResponseTime,
    queriesByPriority,
    queriesByTag,
    queriesByChannel,
    resolutionRate,
  };
}
