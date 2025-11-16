'use client';

import { useState } from 'react';
import { AudienceQuery, QueryStatus } from '@/lib/types';
import { TEAM_MEMBERS } from '@/lib/mock-data';
import { getStatusColor, getPriorityColor } from '@/lib/query-utils';
import { X, Send, User, Clock, Tag, AlertCircle } from 'lucide-react';

interface QueryDetailPanelProps {
  query: AudienceQuery;
  onClose: () => void;
  onUpdate: (updatedQuery: AudienceQuery) => void;
}

export function QueryDetailPanel({ query, onClose, onUpdate }: QueryDetailPanelProps) {
  const [notes, setNotes] = useState(query.notes || '');
  const [newNote, setNewNote] = useState('');
  const [assignedTo, setAssignedTo] = useState(query.assignedTo);
  const [status, setStatus] = useState(query.status);

  const assignedMember = TEAM_MEMBERS.find((m) => m.id === query.assignedTo);
  const timeAgo = Math.round((Date.now() - query.receivedAt.getTime()) / (1000 * 60));

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const timestamp = new Date().toLocaleTimeString();
    const updatedNotes = notes
      ? `${notes}\n\n[${timestamp}] ${newNote}`
      : `[${timestamp}] ${newNote}`;
    setNotes(updatedNotes);
    setNewNote('');
    onUpdate({ ...query, notes: updatedNotes, lastUpdate: new Date() });
  };

  const handleAssignmentChange = (memberId: string) => {
    setAssignedTo(memberId);
    onUpdate({ ...query, assignedTo: memberId, status: 'assigned', lastUpdate: new Date() });
  };

  const handleStatusChange = (newStatus: QueryStatus) => {
    setStatus(newStatus);
    onUpdate({ ...query, status: newStatus, lastUpdate: new Date() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/30">
      <div
        className="h-full w-full max-w-md bg-background border-l border-border shadow-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold">Query Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Sender Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-muted-foreground">From</p>
              </div>
              <p className="font-medium">{query.sender}</p>
              {query.senderHandle && (
                <p className="text-sm text-muted-foreground">@{query.senderHandle}</p>
              )}
            </div>

            {/* Received Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-muted-foreground">Received</p>
              </div>
              <p className="text-sm">
                {query.receivedAt.toLocaleString()} ({timeAgo}m ago)
              </p>
            </div>

            {/* Query Content */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Message</p>
              <p className="p-3 bg-muted rounded-lg border border-border text-sm leading-relaxed">
                {query.content}
              </p>
            </div>

            {/* Priority */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Priority</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(query.priority)}`}>
                {query.priority.charAt(0).toUpperCase() + query.priority.slice(1)}
              </span>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-semibold text-muted-foreground">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {query.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Status</p>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as QueryStatus)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Assign To */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Assign To</p>
              <select
                value={assignedTo || ''}
                onChange={(e) => handleAssignmentChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
              >
                <option value="">Unassigned</option>
                {TEAM_MEMBERS.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes Section */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Notes</p>
              {notes && (
                <div className="p-3 bg-muted rounded-lg border border-border text-sm whitespace-pre-wrap mb-3 max-h-32 overflow-y-auto text-muted-foreground">
                  {notes}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                  className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddNote}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {query.responseTime && (
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Resolved in {query.responseTime} minutes
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
