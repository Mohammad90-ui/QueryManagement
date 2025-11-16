// In-memory database simulating MongoDB
import { AudienceQuery, TeamMember, QueryTag, Priority } from './types';
import { TEAM_MEMBERS, MOCK_QUERIES } from './mock-data';

interface Database {
  queries: Map<string, AudienceQuery>;
  teamMembers: Map<string, TeamMember>;
}

let db: Database = {
  queries: new Map(MOCK_QUERIES.map(q => [q.id, q])),
  teamMembers: new Map(TEAM_MEMBERS.map(m => [m.id, m])),
};

export function getDatabase() {
  return db;
}

export function resetDatabase() {
  db = {
    queries: new Map(MOCK_QUERIES.map(q => [q.id, q])),
    teamMembers: new Map(TEAM_MEMBERS.map(m => [m.id, m])),
  };
}

export function getAllQueries(): AudienceQuery[] {
  return Array.from(db.queries.values());
}

export function getQueryById(id: string): AudienceQuery | undefined {
  return db.queries.get(id);
}

export function createQuery(query: Omit<AudienceQuery, 'id' | 'receivedAt'>): AudienceQuery {
  const id = Date.now().toString();
  const newQuery: AudienceQuery = {
    ...query,
    id,
    receivedAt: new Date(),
  };
  db.queries.set(id, newQuery);
  return newQuery;
}

export function updateQuery(id: string, updates: Partial<AudienceQuery>): AudienceQuery | undefined {
  const query = db.queries.get(id);
  if (!query) return undefined;
  
  const updated = { ...query, ...updates, lastUpdate: new Date() };
  db.queries.set(id, updated);
  return updated;
}

export function deleteQuery(id: string): boolean {
  return db.queries.delete(id);
}

export function getTeamMembers(): TeamMember[] {
  return Array.from(db.teamMembers.values());
}

export function assignQueryToTeamMember(queryId: string, teamMemberId: string): AudienceQuery | undefined {
  return updateQuery(queryId, { 
    assignedTo: teamMemberId,
    status: 'assigned'
  });
}

export function updateQueryStatus(queryId: string, status: AudienceQuery['status']): AudienceQuery | undefined {
  return updateQuery(queryId, { status });
}
