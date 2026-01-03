export type TicketStatus = 'open'| 'in progress'| 'resolved';
export type TicketPriority = 'high' | 'medium' | 'low';
export type TicketCategory = 'technical' | 'billing' | 'general';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketFormData {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}
