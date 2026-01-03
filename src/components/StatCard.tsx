import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  variant: 'open' | 'progress' | 'resolved';
}

const variantStyles = {
  open: 'gradient-open',
  progress: 'gradient-progress',
  resolved: 'gradient-resolved',
};

export function StatCard({ title, count, icon, variant }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
              {count}
            </p>
          </div>
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl text-primary-foreground transition-transform duration-300 group-hover:scale-110',
              variantStyles[variant]
            )}
          >
            {icon}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'absolute bottom-0 left-0 h-1 w-full opacity-80',
          variantStyles[variant]
        )}
      />
    </div>
  );
}
