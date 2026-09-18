import { z } from 'zod';
import { messages } from '@core/config/messages';

// Define task priorities
export const TaskPriority = z.enum(['urgent', 'high', 'normal', 'low']);
export type TaskPriorityType = z.infer<typeof TaskPriority>;

// Define checklist item schema
export const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, { message: "Checklist item can't be empty" }),
  isCompleted: z.boolean().default(false),
});
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// Define attachment schema
export const AttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  size: z.number(),
  url: z.string().optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

// Define the form schema
export const assignTaskSchema = z.object({
  title: z.string().min(1, { message: messages.nameIsRequired }),
  description: z.string(),
  deadline: z
    .date({
      required_error: 'Deadline is required',
      invalid_type_error: 'Deadline must be a valid date',
    })
    .refine((date) => date > new Date(), {
      message: 'Deadline must be in the future',
    }),
  priority: TaskPriority.default('normal'),
  taskType: z.enum(['reading', 'worksheet', 'quiz']).default('reading'),
  checklistItems: z.array(ChecklistItemSchema).optional().default([]),
  attachments: z.array(AttachmentSchema).optional().default([]),
  selectedStudents: z
    .array(z.string())
    .min(1, { message: 'Select at least one student' }),
  selectedClasses: z.array(z.string()).optional().default([]),
});

// Generate form types from zod validation schema
export type AssignTaskFormInput = z.infer<typeof assignTaskSchema>;
