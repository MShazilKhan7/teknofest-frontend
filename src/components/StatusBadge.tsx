import { cn } from '@/lib/utils';
import { TicketStatus } from '@/types/ticket';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Circle, Clock, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  onChange?: (status: TicketStatus) => void;
  interactive?: boolean;
  className?: string;
}

const statusConfig = {
  open: {
    label: 'Open',
    className: 'bg-status-open-bg text-status-open',
    icon: Circle,
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-progress-bg text-status-progress',
    icon: Clock,
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-status-resolved-bg text-status-resolved',
    icon: CheckCircle2,
  },
};

const allStatuses: TicketStatus[] = ['open', 'in-progress', 'resolved'];

export function StatusBadge({
  status,
  onChange,
  interactive = false,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const badge = (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
        config.className,
        interactive && 'cursor-pointer hover:opacity-80',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
      {interactive && <ChevronDown className="h-3 w-3 ml-0.5" />}
    </span>
  );

  if (!interactive || !onChange) {
    return badge;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{badge}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {allStatuses.map((s) => {
          const sConfig = statusConfig[s];
          const SIcon = sConfig.icon;
          return (
            <DropdownMenuItem
              key={s}
              onClick={() => onChange(s)}
              className={cn(
                'flex items-center gap-2 cursor-pointer',
                s === status && 'bg-accent'
              )}
            >
              <SIcon className="h-4 w-4" />
              {sConfig.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
