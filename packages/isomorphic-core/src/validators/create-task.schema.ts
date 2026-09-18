import { z } from 'zod';
import { messages } from '@core/config/messages';

// Define valid task priorities
export const TaskPriority = z.enum(['urgent', 'high', 'normal', 'low', 'open']);
export type TaskPriority = z.infer<typeof TaskPriority>;

export const taskFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string().optional(),
  columnId: z.string().optional(),
  dueDate: z.date({
    required_error: messages.dueDateIsRequired,
  }),
  priority: TaskPriority.optional().default('normal'),
  tags: z.array(z.string()).optional().default([]),
  assignee: z.string().optional(),
  totalAssigned: z.number().optional(),
  submittedCount: z.number().optional(),
});

// Generate form types from zod validation schema
export type TaskFormInput = z.infer<typeof taskFormSchema>;
