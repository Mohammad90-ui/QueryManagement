import { AudienceQuery, QueryTag, Priority } from './types';

// Auto-tagging based on content analysis
export function autoTagQuery(content: string): QueryTag[] {
  const tags: QueryTag[] = [];
  const lowerContent = content.toLowerCase();

  const tagPatterns: Record<QueryTag, RegExp[]> = {
    question: [/\?/, /how|what|when|where|why|can you/],
    request: [/request|please|need|want|could you|would you/],
    complaint: [/issue|problem|wrong|broken|error|not work|doesn't|hate|awful|terrible/],
    feedback: [/great|love|amazing|thank|excellent|good job|appreciate/],
    bug: [/bug|crash|error|fail|not working|freeze|stuck|broken/],
    inquiry: [/information|details|info|tell me|explain/],
  };

  Object.entries(tagPatterns).forEach(([tag, patterns]) => {
    if (patterns.some(pattern => pattern.test(lowerContent))) {
      tags.push(tag as QueryTag);
    }
  });

  return tags.length > 0 ? tags : ['inquiry'];
}

// Priority detection based on content and tags
export function detectPriority(content: string, tags: QueryTag[]): Priority {
  const lowerContent = content.toLowerCase();

  // Urgent patterns
  if (/urgent|immediately|asap|critical|emergency|now|dying/i.test(lowerContent)) {
    return 'urgent';
  }

  // High priority if it's a complaint or bug
  if (tags.includes('complaint') || tags.includes('bug')) {
    if (/crash|broken|not work/i.test(lowerContent)) {
      return 'urgent';
    }
    return 'high';
  }

  // Medium priority for requests
  if (tags.includes('request')) {
    return 'medium';
  }

  // Low priority for feedback and questions
  return 'low';
}

// Calculate response time in minutes
export function calculateResponseTime(created: Date, resolved?: Date): number | undefined {
  if (!resolved) return undefined;
  return Math.round((resolved.getTime() - created.getTime()) / (1000 * 60));
}

// Get priority color
export function getPriorityColor(priority: Priority): string {
  const colors: Record<Priority, string> = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  return colors[priority];
}

// Get channel icon
export function getChannelIcon(channel: string): string {
  const icons: Record<string, string> = {
    email: '✉️',
    twitter: '𝕏',
    instagram: '📷',
    facebook: 'f',
    chat: '💬',
    community: '👥',
  };
  return icons[channel] || '📬';
}

// Get status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    new: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    assigned: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'in-progress': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
