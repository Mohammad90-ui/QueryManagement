'use client';

import { AudienceQuery } from '@/lib/types';
import { getPriorityColor, getStatusColor, getChannelIcon } from '@/lib/query-utils';
import { Clock, User } from 'lucide-react';

interface QueryCardProps {
  query: AudienceQuery;
  isSelected?: boolean;
  onClick: () => void;
}

export function QueryCard({ query, isSelected = false, onClick }: QueryCardProps) {
  const isNew = query.status === 'new';
  const timeAgo = Math.round((Date.now() - query.receivedAt.getTime()) / (1000 * 60));

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border hover:border-primary/50 hover:bg-muted/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{getChannelIcon(query.channel)}</span>
            <h3 className="font-semibold text-foreground truncate">
              {query.sender}
            </h3>
            {query.senderHandle && (
              <span className="text-muted-foreground text-sm">@{query.senderHandle}</span>
            )}
            {isNew && (
              <span className="ml-auto flex-shrink-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{query.content}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {query.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(query.priority)}`}>
            {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(query.status)}`}>
            {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{timeAgo}m ago</span>
        </div>
      </div>
    </div>
  );
}
