export type Channel = 'email' | 'twitter' | 'instagram' | 'facebook' | 'chat' | 'community';
export type QueryTag = 'question' | 'request' | 'complaint' | 'feedback' | 'bug' | 'inquiry';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type QueryStatus = 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';

export interface AudienceQuery {
  id: string;
  content: string;
  sender: string;
  senderHandle?: string;
  channel: Channel;
  receivedAt: Date;
  tags: QueryTag[];
  priority: Priority;
  status: QueryStatus;
  assignedTo?: string;
  responseTime?: number; // in minutes
  notes?: string;
  lastUpdate?: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface QueryAnalytics {
  totalQueries: number;
  averageResponseTime: number;
  queriesByPriority: Record<Priority, number>;
  queriesByTag: Record<QueryTag, number>;
  queriesByChannel: Record<Channel, number>;
  resolutionRate: number;
}
