import { z } from 'zod';

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
export const editTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  deadline: z.date({
    required_error: 'Deadline is required',
    invalid_type_error: 'Deadline must be a valid date',
  }),
  priority: z.enum(['urgent', 'high', 'normal', 'low']).default('normal'),
  taskType: z.enum(['reading', 'worksheet', 'quiz']).default('reading'),
  checklistItems: z.array(ChecklistItemSchema).optional().default([]),
  attachments: z.array(AttachmentSchema).optional().default([]),
  selectedStudents: z
    .array(z.string())
    .min(1, { message: 'Select at least one student' }),
  selectedClasses: z.array(z.string()).optional().default([]),
});

// Generate form types from zod validation schema
export type EditTaskFormInput = z.infer<typeof editTaskSchema>;

// Step type definition
export interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  description: string;
}

// Step completion status
export interface StepsCompleted {
  step1: boolean;
  step2: boolean;
  step3: boolean;
}
