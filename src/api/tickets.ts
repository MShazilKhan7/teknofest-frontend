import api from './api';
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketStats,
  TicketQueryParams,
} from '../types/tickets';

export const TicketAPI = {
  /**
   * Create a new ticket
   * POST /api/tickets
   */
  create: async (data: CreateTicketRequest) =>
    api.post<{ success: boolean; data: Ticket }>('/tickets', data).then((res) => res.data),

  /**
   * Get all tickets (with optional filters)
   * GET /api/tickets
   */
  getAll: async (params?: TicketQueryParams) =>
    api
      .get<{ success: boolean; count: number; data: Ticket[] }>('/tickets', { params })
      .then((res) => res.data),

  /**
   * Get ticket stats for dashboard
   * GET /api/tickets/stats
   */
  getStats: async () =>
    api
      .get<{ success: boolean; data: TicketStats }>('/tickets/stats')
      .then((res) => res.data),

  /**
   * Update ticket details
   * PUT /api/tickets/:id
   */
  update: async (id: string, data: UpdateTicketRequest) =>
    api
      .put<{ success: boolean; data: Ticket }>(`/tickets/${id}`, data)
      .then((res) => res.data),

  /**
   * Update ticket status
   * PATCH /api/tickets/:id/status
   */
  updateStatus: async (id: string, status: string) =>
    api
      .patch<{ success: boolean; data: Ticket }>(`/tickets/${id}/status`, { status })
      .then((res) => res.data),

  /**
   * Delete a ticket
   * DELETE /api/tickets/:id
   */
  delete: async (id: string) =>
    api
      .delete<{ success: boolean; message: string }>(`/tickets/${id}`)
      .then((res) => res.data),
};

export default TicketAPI;
