// Generic status wrapper
export type Status<L extends string = string> = {
  value: number;
  label: L;
};

// (Optional) stricter status label unions you can extend later
export type TaskStatusLabel = 'Inactive' | 'Active' | 'Draft' | 'Archived';
export type AssigneeStatusLabel = 'Assigned' | 'Submitted' | 'Graded' | 'Late';

// Common file/attachment
export interface AttachmentFile {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number; // bytes
  url: string;
  created_at: string; // ISO string from API (e.g., "2025-09-16T11:55:07+03:00")
}

// Minimal user summary
export interface UserSummary {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  avatar: AttachmentFile | null;
}

// Source/reference link
export interface SourceLink {
  id: number;
  url: string;
  title: string;
}

// Submission made by a student for a task
export interface Submission {
  id: number;
  task_id: number;
  task_student_id: number;
  student: UserSummary;
  comment: string;                // can be empty string
  submitted_at: string;           // "dd.MM.yyyy HH:mm"
  attachments: AttachmentFile[];  // may be []
}

// A task assignee (student) with their submissions history
export interface Assignee {
  id: number;
  task_id: number;
  student: UserSummary;
  status: Status<AssigneeStatusLabel> | Status; // keep flexible
  advisor_comment: string | null;
  last_submission_at: string | null;            // "dd.MM.yyyy HH:mm" or null
  submissions: Submission[];
}

// The task detail object
export interface TaskDetail {
  id: number;
  title: string;
  status: Status<TaskStatusLabel> | Status;
  due_at: string;                 // "dd.MM.yyyy HH:mm"
  created_by: UserSummary & {     // avatar can be null here per sample
    avatar: AttachmentFile | null;
  };
  attachments_count: number;
  sources_count: number;
  created_at: string;             // "dd.MM.yyyy HH:mm"
  updated_at: string;             // "dd.MM.yyyy HH:mm"
  description: string;
  attachments: AttachmentFile[];
  sources: SourceLink[];
  assignees: Assignee[];
}


