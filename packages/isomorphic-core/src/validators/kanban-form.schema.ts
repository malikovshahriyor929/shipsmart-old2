import { z } from 'zod';

// Define priority type
export const taskPriorityEnum = z.enum(['open', 'urgent', 'high', 'normal', 'low']);
export type TaskPriority = z.infer<typeof taskPriorityEnum>;
// Define the task schema with stricter types
export const kanbanTaskSchema = z.object({
  id: z.string().optional(), // Make optional for new tasks
  title: z.string().min(1, 'Title is required'),
  description: z.string().default(''),
  tags: z.array(z.string()).default([]),
  dueDate: z.date().nullable().optional(),
  assignee: z.string().default('AF'),
  columnId: z.string(),
  priority: taskPriorityEnum.default('open'),
  createdAt: z.date().optional().default(() => new Date()),
});

// Transform the schema to apply defaults (using a different approach)
export const kanbanTaskFormSchema = kanbanTaskSchema.transform((data) => ({
  ...data,
  description: data.description || '',
  tags: data.tags || [],
  assignee: data.assignee || 'AF',
}));

export type KanbanTaskInput = z.infer<typeof kanbanTaskSchema>;

// For columns, create a simpler schema without defaults
export const kanbanColumnSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Column title is required'),
  color: z.string(), // No default here
  icon: z.any().optional(),
});

// Create a separate type for column form values
export interface KanbanColumnFormValues {
  id: string;
  title: string;
  color: string;
}

export type KanbanColumnInput = z.infer<typeof kanbanColumnSchema>;