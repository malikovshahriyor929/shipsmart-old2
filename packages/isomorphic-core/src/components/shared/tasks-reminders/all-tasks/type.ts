// Status
export type TaskStatusValue = 0 | 1 | 2; // 0=Archived, 1=Active, 2=Inactive
export type TaskStatusLabel = 'Archived' | 'Active' | 'Inactive';

export interface TaskStatus {
  value: TaskStatusValue;
  label: TaskStatusLabel;
}

// Minimal user info
export interface UserLite {
  id: number;
  name: string;
  email: string;
  role: number;
}

// Attachment on a task
export interface TaskAttachment {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number;
  url: string;
  created_at: string; // ISO string e.g. "2025-09-11T13:08:34+03:00"
}

// Source (reference link) on a task
export interface TaskSource {
  id: number;
  url: string;
  title: string | null; // can be "" or null per samples
}
interface Students {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  avatar: TaskAttachment | null;
}

// Single task item
export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  due_at: string; // "YYYY-MM-DD HH:mm" per samples
  created_by: UserLite;
  created_at: string; // "YYYY-MM-DD HH:mm"
  updated_at: string; // "YYYY-MM-DD HH:mm"
  attachments: TaskAttachment[];
  sources: TaskSource[];
  assignees: Students[]; // assuming student IDs; change to string[] if your API uses strings
}

// List response
export type TaskListResponse = TaskItem[];
