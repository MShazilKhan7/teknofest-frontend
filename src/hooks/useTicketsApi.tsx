import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TicketAPI from '@/api/tickets';
import type { CreateTicketRequest, UpdateTicketRequest, TicketStatus } from '@/types/tickets';

export const TICKETS_KEY = ['tickets'];
export const TICKET_STATS_KEY = ['ticket-stats'];

export function useTicketsQuery(filters?: any) {
  return useQuery({
    queryKey: [...TICKETS_KEY, filters],
    queryFn: () => TicketAPI.getAll(filters),
    select: (res) => res.data,
  });
}

export function useTicketStatsQuery() {
  return useQuery({
    queryKey: TICKET_STATS_KEY,
    queryFn: () => TicketAPI.getStats(),
    select: (res) => res.data,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) => TicketAPI.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TICKETS_KEY });
      qc.invalidateQueries({ queryKey: TICKET_STATS_KEY });
    },
  });
}

export function useUpdateTicket() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      TicketAPI.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TICKETS_KEY });
      qc.invalidateQueries({ queryKey: TICKET_STATS_KEY });
    },
  });
}

export function useUpdateTicketStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      TicketAPI.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TICKETS_KEY });
      qc.invalidateQueries({ queryKey: TICKET_STATS_KEY });
    },
  });
}

export function useDeleteTicket() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TicketAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TICKETS_KEY });
      qc.invalidateQueries({ queryKey: TICKET_STATS_KEY });
    },
  });
}
