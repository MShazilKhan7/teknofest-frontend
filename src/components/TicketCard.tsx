import { format } from "date-fns";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: Ticket;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticket: Ticket) => void;
  onStatusChange: (id: string, status: Ticket["status"]) => void;
  compact?: boolean;
}

const categoryLabels = {
  technical: "Technical",
  billing: "Billing",
  general: "General",
};

export function TicketCard({
  ticket,
  onEdit,
  onDelete,
  onStatusChange,
  compact = false,
}: TicketCardProps) {
  const isOverdue =
    ticket.status === "open" &&
    Date.now() - ticket.createdAt.getTime() > 24 * 60 * 60 * 1000;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in",
        isOverdue && "ring-2 ring-overdue-border bg-overdue-bg"
      )}
    >
      {/* Overdue badge */}
      {isOverdue && (
        <div className="absolute top-0 right-0 m-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 rounded-full bg-overdue-border/20 px-2 py-1 text-xs font-medium text-overdue-border pulse-soft">
                <AlertTriangle className="h-3.5 w-3.5" /> Overdue
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>This ticket has been open for more than 24 hours</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}

      <div className="p-5">
        {/* Subject & description */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate pr-8">
              {ticket.subject}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {ticket.description}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <StatusBadge
            status={ticket.status}
            onChange={(status) => onStatusChange(ticket.id, status)}
            interactive
          />
          <PriorityBadge priority={ticket.priority} />
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
            {categoryLabels[ticket.category]}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Created {format(ticket.createdAt, "MMM d, yyyy • h:mm a")}
          </span>

          {/* Action buttons */}
          {!compact && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {onEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-accent"
                      onClick={() => onEdit(ticket)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit ticket</TooltipContent>
                </Tooltip>
              )}

              {onDelete && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(ticket)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete ticket</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
