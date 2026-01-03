import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketStatus, TicketPriority } from '@/types/ticket';

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TicketStatus | 'all';
  onStatusFilterChange: (value: TicketStatus | 'all') => void;
  priorityFilter: TicketPriority | 'all';
  onPriorityFilterChange: (value: TicketPriority | 'all') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SearchFilter({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onClearFilters,
  hasActiveFilters,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-card border-border focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex gap-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusFilterChange(v as TicketStatus | 'all')}
        >
          <SelectTrigger className="w-[140px] bg-card">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={priorityFilter}
          onValueChange={(v) => onPriorityFilterChange(v as TicketPriority | 'all')}
        >
          <SelectTrigger className="w-[140px] bg-card">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFilters}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
