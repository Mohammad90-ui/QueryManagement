import { Mail, Settings, Bell } from 'lucide-react';
import Link from 'next/link';
import { NewQueryDialog } from './new-query-dialog';

interface InboxHeaderProps {
  onNewQuery?: (query: any) => void;
}

export function InboxHeader({ onNewQuery }: InboxHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Audience Inbox</h1>
        </div>
        <div className="flex items-center gap-4">
          {onNewQuery && <NewQueryDialog onQueryCreated={onNewQuery} />}
          
          <Link
            href="/analytics"
            className="px-3 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Analytics
          </Link>
          <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
