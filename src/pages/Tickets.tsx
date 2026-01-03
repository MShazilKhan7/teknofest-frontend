import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Download, TicketIcon } from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { Ticket, TicketFormData, TicketStatus, TicketPriority } from '@/types/ticket';
import { TopNav } from '@/components/layout/TopNav';
import { TicketCard } from '@/components/TicketCard';
import { TicketForm } from '@/components/TicketForm';
import { SearchFilter } from '@/components/SearchFilter';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface OutletContext {
  onCreateTicket: () => void;
}

export default function Tickets() {
  const { tickets, addTicket, updateTicket, deleteTicket, updateStatus } = useTickets();
  const { onCreateTicket } = useOutletContext<OutletContext>();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicket, setDeletingTicket] = useState<Ticket | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'all'>('all');

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

  const handleEditTicket = (data: TicketFormData) => {
    if (editingTicket) {
      updateTicket(editingTicket.id, data);
      setEditingTicket(null);
      toast({
        title: 'Ticket updated',
        description: 'Your changes have been saved.',
      });
    }
  };

  const handleDeleteTicket = () => {
    if (deletingTicket) {
      deleteTicket(deletingTicket.id);
      setDeletingTicket(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Ticket deleted',
        description: 'The ticket has been permanently removed.',
      });
    }
  };

  const handleStatusChange = (id: string, status: TicketStatus) => {
    updateStatus(id, status);
    toast({
      title: 'Status updated',
      description: `Ticket status changed to ${status.replace('-', ' ')}.`,
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

    toast({
      title: 'Export complete',
      description: 'Tickets have been exported to CSV.',
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  return (
    <>
      <TopNav
        title="Tickets"
        search={search}
        onSearchChange={setSearch}
        onCreateTicket={onCreateTicket}
      />

      <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-auto">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchFilter
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={setPriorityFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            hideSearch
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onCreateTicket}
              className="gradient-primary border-0 text-primary-foreground"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {/* Ticket List */}
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <TicketIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No tickets found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Create a new ticket to get started'}
            </p>
            {!hasActiveFilters && (
              <Button onClick={onCreateTicket} className="mt-4 gradient-primary border-0 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
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

      {/* Edit Form */}
      <TicketForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingTicket(null);
        }}
        onSubmit={handleEditTicket}
        initialData={editingTicket}
        mode="edit"
      />

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        ticket={deletingTicket}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTicket}
      />
    </>
  );
}
