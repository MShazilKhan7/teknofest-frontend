import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TicketFormData, TicketCategory, TicketPriority, Ticket } from '@/types/ticket';
import { cn } from '@/lib/utils';

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  category: z.enum(['technical', 'billing', 'general'], {
    required_error: 'Please select a category',
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: 'Please select a priority',
  }),
});

interface TicketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TicketFormData) => void;
  initialData?: Ticket | null;
  mode: 'create' | 'edit';
}

const categories: { value: TicketCategory; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'billing', label: 'Billing' },
  { value: 'general', label: 'General' },
];

const priorities: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'bg-priority-high' },
  { value: 'medium', label: 'Medium', color: 'bg-priority-medium' },
  { value: 'low', label: 'Low', color: 'bg-priority-low' },
];

export function TicketForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: TicketFormProps) {
  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: initialData
      ? {
          subject: initialData.subject,
          description: initialData.description,
          category: initialData.category,
          priority: initialData.priority,
        }
      : {
          subject: '',
          description: '',
          category: undefined,
          priority: undefined,
        },
  });

  const handleSubmit = (data: TicketFormData) => {
    onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'create' ? 'Create New Ticket' : 'Edit Ticket'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter ticket subject..."
                      className="transition-all focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="animate-in" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue in detail..."
                      className="min-h-[120px] resize-none transition-all focus:ring-2 focus:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="animate-in" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="animate-in" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorities.map((pri) => (
                          <SelectItem key={pri.value} value={pri.value}>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn('h-2 w-2 rounded-full', pri.color)}
                              />
                              {pri.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="animate-in" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity"
              >
                {mode === 'create' ? 'Create Ticket' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
