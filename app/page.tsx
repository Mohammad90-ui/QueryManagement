'use client';

import { useState, useMemo, useEffect } from 'react';
import { InboxHeader } from '@/components/inbox-header';
import { QueryFilters } from '@/components/query-filters';
import { QueryCard } from '@/components/query-card';
import { QueryDetailPanel } from '@/components/query-detail-panel';
import { AudienceQuery } from '@/lib/types';

export default function InboxPage() {
  const [queries, setQueries] = useState<AudienceQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<AudienceQuery | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    priority: undefined as any,
    status: undefined as any,
    channel: undefined as any,
    tag: undefined as any,
  });

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

  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      if (
        filters.search &&
        !q.content.toLowerCase().includes(filters.search.toLowerCase()) &&
        !q.sender.toLowerCase().includes(filters.search.toLowerCase()) &&
        !q.senderHandle?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.priority && q.priority !== filters.priority) return false;
      if (filters.status && q.status !== filters.status) return false;
      if (filters.channel && q.channel !== filters.channel) return false;
      if (filters.tag && !q.tags.includes(filters.tag)) return false;
      return true;
    });
  }, [queries, filters]);

  // Sort by most recent and urgent
  const sortedQueries = useMemo(() => {
    return [...filteredQueries].sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.receivedAt.getTime() - a.receivedAt.getTime();
    });
  }, [filteredQueries]);

  const handleUpdateQuery = async (updatedQuery: AudienceQuery) => {
    try {
      const res = await fetch(`/api/queries/${updatedQuery.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuery),
      });
      const data = await res.json();
      if (data.success) {
        const updated = {
          ...data.data,
          receivedAt: new Date(data.data.receivedAt),
          lastUpdate: data.data.lastUpdate ? new Date(data.data.lastUpdate) : undefined,
        };
        setQueries(queries.map((q) => (q.id === updated.id ? updated : q)));
        setSelectedQuery(updated);
      }
    } catch (error) {
      console.error('Failed to update query:', error);
    }
  };

  const handleCreateQuery = async (newQuery: Omit<AudienceQuery, 'id' | 'receivedAt'>) => {
    try {
      const res = await fetch('/api/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuery),
      });
      const data = await res.json();
      if (data.success) {
        const created = {
          ...data.data,
          receivedAt: new Date(data.data.receivedAt),
          lastUpdate: data.data.lastUpdate ? new Date(data.data.lastUpdate) : undefined,
        };
        setQueries([created, ...queries]);
      }
    } catch (error) {
      console.error('Failed to create query:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground">
        <InboxHeader onNewQuery={handleCreateQuery} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading queries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <InboxHeader onNewQuery={handleCreateQuery} />
      <QueryFilters onFilterChange={setFilters} />

      <div className="flex-1 flex overflow-hidden">
        {/* Main Inbox List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {sortedQueries.length > 0 ? (
              sortedQueries.map((query) => (
                <QueryCard
                  key={query.id}
                  query={query}
                  isSelected={selectedQuery?.id === query.id}
                  onClick={() => setSelectedQuery(query)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No queries found</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedQuery && (
          <QueryDetailPanel
            query={selectedQuery}
            onClose={() => setSelectedQuery(null)}
            onUpdate={handleUpdateQuery}
          />
        )}
      </div>
    </div>
  );
}
