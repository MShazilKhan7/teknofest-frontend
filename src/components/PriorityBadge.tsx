import { cn } from '@/lib/utils';
import { TicketPriority } from '@/types/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

const priorityConfig = {
  high: {
    label: 'High',
    className: 'bg-priority-high-bg text-priority-high',
    dot: 'bg-priority-high',
  },
  medium: {
    label: 'Medium',
    className: 'bg-priority-medium-bg text-priority-medium',
    dot: 'bg-priority-medium',
  },
  low: {
    label: 'Low',
    className: 'bg-priority-low-bg text-priority-low',
    dot: 'bg-priority-low',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config?.label}
    </span>
  );
}
