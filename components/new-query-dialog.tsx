'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { AudienceQuery, Channel, QueryTag, Priority } from '@/lib/types';
import { AutoTagger } from './auto-tagger';
import { autoTagQuery, detectPriority } from '@/lib/query-utils';

interface NewQueryDialogProps {
  onQueryCreated: (query: Omit<AudienceQuery, 'id' | 'receivedAt'>) => void;
}

export function NewQueryDialog({ onQueryCreated }: NewQueryDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [sender, setSender] = useState('');
  const [senderHandle, setSenderHandle] = useState('');
  const [channel, setChannel] = useState<Channel>('email');
  const [tags, setTags] = useState<QueryTag[]>([]);
  const [priority, setPriority] = useState<Priority>('medium');

  const handleAutoTag = (detectedTags: QueryTag[], detectedPriority: Priority) => {
    setTags(detectedTags);
    setPriority(detectedPriority);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !sender.trim()) return;

    const newQuery: Omit<AudienceQuery, 'id' | 'receivedAt'> = {
      content,
      sender,
      senderHandle: senderHandle || undefined,
      channel,
      tags: tags.length > 0 ? tags : autoTagQuery(content),
      priority: priority,
      status: 'new',
    };

    onQueryCreated(newQuery);

    // Reset form
    setContent('');
    setSender('');
    setSenderHandle('');
    setChannel('email');
    setTags([]);
    setPriority('medium');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Query
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Query</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Sender Name</label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="John Doe"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Sender Handle (Optional)</label>
            <input
              type="text"
              value={senderHandle}
              onChange={(e) => setSenderHandle(e.target.value)}
              placeholder="@johndoe"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Channel</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as Channel)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
            >
              <option value="email">Email</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="chat">Chat</option>
              <option value="community">Community</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the query message..."
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background min-h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Auto-Detect Tags & Priority</label>
            <AutoTagger content={content} onTagsDetected={handleAutoTag} />
          </div>

          {tags.length > 0 && (
            <div>
              <label className="text-sm font-medium">Detected Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!content.trim() || !sender.trim()}>
              Create Query
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
