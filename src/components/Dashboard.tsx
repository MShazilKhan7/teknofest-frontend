import { useState, useMemo } from 'react';
import { Plus, Download, Circle, Clock, CheckCircle2, TicketIcon } from 'lucide-react';
import { TicketForm } from './TicketForm';
import { StatCard } from './StatCard';
import { TicketCard } from './TicketCard';
import { SearchFilter } from './SearchFilter';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useTicketsQuery,
  useTicketStatsQuery,
  useCreateTicket,
  useUpdateTicket,
  useUpdateTicketStatus,
  useDeleteTicket,
} from "../hooks/useTicketsApi";
import type { Ticket, TicketFormData, TicketStatus, TicketPriority } from '@/types/ticket';

export function Dashboard() {
  const { toast } = useToast();

  // Form / edit / delete states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

  // React Query hooks
  const { data: tickets = [], isLoading: ticketsLoading } = useTicketsQuery();
  const stats = useMemo(() => ({
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  }), [tickets]);
  console.log("stats", stats);

  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();
  const updateStatusMutation = useUpdateTicketStatus();
  const deleteTicketMutation = useDeleteTicket();

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  const hasActiveFilters = search !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  // Handlers
  const handleCreateTicket = (data: TicketFormData) => {
    createTicketMutation.mutate(data, {
      onSuccess: () => {
        toast({ title: 'Ticket created', description: 'Your support ticket has been created successfully.' });
        setIsFormOpen(false);
      },
    });
  };

  const handleEditTicket = (data: TicketFormData) => {
    if (!editingTicket) return;
    updateTicketMutation.mutate({ id: editingTicket.id, data }, {
      onSuccess: () => {
        toast({ title: 'Ticket updated', description: 'Your changes have been saved.' });
        setEditingTicket(null);
        setIsFormOpen(false);
      },
    });
  };

  const handleDeleteTicket = () => {
    if (!deletingTicket) return;
    deleteTicketMutation.mutate(deletingTicket.id, {
      onSuccess: () => {
        toast({ title: 'Ticket deleted', description: 'The ticket has been permanently removed.' });
        setDeletingTicket(null);
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateStatusMutation.mutate({ id, status }, {
      onSuccess: () => {
        toast({
          title: 'Status updated',
          description: `Ticket status changed to ${status.replace('-', ' ')}.`,
        });
      },
    });
  };

  const handleExport = () => {
    const headers = ['Subject', 'Description', 'Category', 'Priority', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...tickets.map((t) =>
        [
          `"${t.subject.replace(/"/g, '""')}"`,
          `"${t.description.replace(/"/g, '""')}"`,
          t.category,
          t.priority,
          t.status,
          t.createdAt.toISOString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({ title: 'Export complete', description: 'Tickets have been exported to CSV.' });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <TicketIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Support Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" /> New Ticket
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard title="Open Tickets" count={stats.open} icon={<Circle className="h-6 w-6" />} variant="open" />
          <StatCard title="In Progress" count={stats.inProgress} icon={<Clock className="h-6 w-6" />} variant="progress" />
          <StatCard title="Resolved" count={stats.resolved} icon={<CheckCircle2 className="h-6 w-6" />} variant="resolved" />
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Ticket List */}
        {ticketsLoading ? (
          <div className="text-center py-16">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <TicketIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No tickets found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Create a new ticket to get started'}
            </p>
            {!hasActiveFilters && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="mt-4 gradient-primary border-0 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Ticket
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={(t) => {
                  setEditingTicket(t);
                  setIsFormOpen(true);
                }}
                onDelete={(t) => {
                  setDeletingTicket(t);
                  setIsDeleteDialogOpen(true);
                }}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Form */}
      <TicketForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTicket(null);
        }}
        onSubmit={editingTicket ? handleEditTicket : handleCreateTicket}
        initialData={editingTicket}
        mode={editingTicket ? 'edit' : 'create'}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        ticket={deletingTicket}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTicket}
      />
    </div>
  );
}
