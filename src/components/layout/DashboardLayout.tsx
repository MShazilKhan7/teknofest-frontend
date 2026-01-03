import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TicketForm } from '@/components/TicketForm';
import { useTickets } from '@/context/TicketContext';
import { TicketFormData } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';

export function DashboardLayout() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { addTicket } = useTickets();
  const { toast } = useToast();

  const handleCreateTicket = (data: TicketFormData) => {
    addTicket(data);
    toast({
      title: 'Ticket created',
      description: 'Your support ticket has been created successfully.',
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar onCreateTicket={() => setIsFormOpen(true)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ onCreateTicket: () => setIsFormOpen(true) }} />
      </div>

      {/* Global Ticket Form */}
      <TicketForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleCreateTicket}
        mode="create"
      />
    </div>
  );
}
