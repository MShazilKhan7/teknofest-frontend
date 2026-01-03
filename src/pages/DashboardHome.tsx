import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Circle, Clock, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { TopNav } from '@/components/layout/TopNav';
import { StatCard } from '@/components/StatCard';
import { TicketCard } from '@/components/TicketCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketStatus } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';

interface OutletContext {
  onCreateTicket: () => void;
}

export default function DashboardHome() {
  const { tickets, updateStatus } = useTickets();
  const { onCreateTicket } = useOutletContext<OutletContext>();
  const { toast } = useToast();

  const stats = useMemo(
    () => ({
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in-progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    }),
    [tickets]
  );

  const overdueTickets = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return tickets.filter(
      (t) => t.status === 'open' && new Date(t.createdAt) < twentyFourHoursAgo
    );
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [tickets]);

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateStatus(id, status);
    toast({
      title: 'Status updated',
      description: `Ticket status changed to ${status.replace('-', ' ')}.`,
    });
  };

  return (
    <>
      <TopNav title="Dashboard" showSearch={false} onCreateTicket={onCreateTicket} />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Open Tickets"
            count={stats.open}
            icon={<Circle className="h-6 w-6" />}
            variant="open"
          />
          <StatCard
            title="In Progress"
            count={stats.inProgress}
            icon={<Clock className="h-6 w-6" />}
            variant="progress"
          />
          <StatCard
            title="Resolved"
            count={stats.resolved}
            icon={<CheckCircle2 className="h-6 w-6" />}
            variant="resolved"
          />
        </div>

        {/* Overdue Alerts */}
        {overdueTickets.length > 0 && (
          <Card className="border-status-high/30 bg-status-high/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-status-high">
                <AlertTriangle className="h-5 w-5" />
                Overdue Tickets ({overdueTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                These tickets have been open for more than 24 hours and need attention.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overdueTickets.slice(0, 3).map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Tickets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No tickets yet. Create your first ticket to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    compact
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
