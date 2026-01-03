import React, { createContext, useContext, useState, useCallback } from 'react';
import { Ticket, TicketFormData, TicketStatus } from '@/types/ticket';

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (data: TicketFormData) => void;
  updateTicket: (id: string, data: Partial<TicketFormData>) => void;
  deleteTicket: (id: string) => void;
  updateStatus: (id: string, status: TicketStatus) => void;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substring(2, 11);

// Sample initial tickets
const initialTickets: Ticket[] = [
  {
    id: generateId(),
    subject: 'Unable to login to account',
    description: 'I am getting an error message when trying to log in with my credentials. The error says "Invalid credentials" but I am sure my password is correct.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago - overdue
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    subject: 'Billing discrepancy on invoice',
    description: 'There seems to be an extra charge on my latest invoice that I do not recognize. Please investigate.',
    category: 'billing',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    subject: 'Feature request: Dark mode',
    description: 'It would be great if the application had a dark mode option for better visibility at night.',
    category: 'general',
    priority: 'low',
    status: 'resolved',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    subject: 'API integration not working',
    description: 'The webhook integration with our third-party service stopped working after the latest update.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: generateId(),
    subject: 'Question about subscription plans',
    description: 'I would like to know more about the enterprise plan and what features are included.',
    category: 'billing',
    priority: 'low',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const addTicket = useCallback((data: TicketFormData) => {
    const newTicket: Ticket = {
      id: generateId(),
      ...data,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  }, []);

  const updateTicket = useCallback((id: string, data: Partial<TicketFormData>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, ...data, updatedAt: new Date() }
          : ticket
      )
    );
  }, []);

  const deleteTicket = useCallback((id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
  }, []);

  const updateStatus = useCallback((id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status, updatedAt: new Date() }
          : ticket
      )
    );
  }, []);

  const getTicketById = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id),
    [tickets]
  );

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        updateStatus,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
