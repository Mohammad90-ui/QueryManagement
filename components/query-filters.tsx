'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Priority, QueryStatus, Channel, QueryTag } from '@/lib/types';

interface QueryFiltersProps {
  onFilterChange: (filters: {
    search: string;
    priority?: Priority;
    status?: QueryStatus;
    channel?: Channel;
    tag?: QueryTag;
  }) => void;
}

export function QueryFilters({ onFilterChange }: QueryFiltersProps) {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const priorities: Priority[] = ['low', 'medium', 'high', 'urgent'];
  const statuses: QueryStatus[] = ['new', 'assigned', 'in-progress', 'resolved', 'closed'];
  const channels: Channel[] = ['email', 'twitter', 'instagram', 'facebook', 'chat', 'community'];
  const tags: QueryTag[] = ['question', 'request', 'complaint', 'feedback', 'bug', 'inquiry'];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, ...activeFilters });
  };

  const handleFilterToggle = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (newFilters[filterType] === value) {
      delete newFilters[filterType];
    } else {
      newFilters[filterType] = value;
    }
    setActiveFilters(newFilters);
    onFilterChange({ search, ...newFilters });
  };

  const clearFilters = () => {
    setSearch('');
    setActiveFilters({});
    onFilterChange({ search: '' });
  };

  const hasFilters = search || Object.keys(activeFilters).length > 0;

  return (
    <div className="space-y-4 px-6 py-4 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search queries by content, sender..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Filter className="h-5 w-5" />
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showFilters && (
        <div className="space-y-4 p-4 bg-muted rounded-lg border border-border">
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Priority</p>
            <div className="flex flex-wrap gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  onClick={() => handleFilterToggle('priority', p)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.priority === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterToggle('status', s)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.status === s
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Channel</p>
            <div className="flex flex-wrap gap-2">
              {channels.map((c) => (
                <button
                  key={c}
                  onClick={() => handleFilterToggle('channel', c)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.channel === c
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Tag</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterToggle('tag', t)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.tag === t
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
