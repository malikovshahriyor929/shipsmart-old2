export type StudentStatus = 'Completed' | 'In Progress' | 'Not Started';
export type GroupCode =
  | 'JSE1'
  | 'JED3'
  | 'JED6'
  | 'JSE2'
  | 'JIM1'
  | 'JED4'
  | 'JIM2'
  | 'JME3';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  // Extended student properties
  status?: StudentStatus;
  completedDate?: string; // ISO date string for when task was completed
  startedDate?: string; // ISO date string for when task was started
  groupCode?: GroupCode; // Group/class code
  email?: string;
  phone?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string format
  urgency: 'Urgent' | 'High' | 'Normal' | 'Low';
  assignedStudents: Student[];
  status: number; // Percentage completed (0-100)
  submittedCount: number;
  totalAssigned: number;
  tags?: string[];
  createdAt: string; // ISO date string format
}

// Current system timestamp
const CURRENT_DATE = new Date('2025-07-14 11:39:13');

// Helper to generate a date string relative to the current date
function getRelativeDateString(dayOffset: number): string {
  const date = new Date(CURRENT_DATE);
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString();
}

// Sample data for tasks with the current date context
export const allTasksData: Task[] = [
  {
    id: 'TASK-001',
    title: 'Complete Math Assignment',
    description: 'Solve problems from Chapter 5, exercises 1-20',
    assignedStudents: [
      {
        id: 's1',
        name: 'John Doe',
        avatar: '/images/avatar/1.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-2),
        startedDate: getRelativeDateString(-5),
        groupCode: 'JSE1',
        email: 'john.doe@milliy.uz',
        phone: '(555) 123-4567',
      },
      {
        id: 's2',
        name: 'Jane Smith',
        avatar: '/images/avatar/2.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-1),
        startedDate: getRelativeDateString(-4),
        groupCode: 'JSE1',
        email: 'jane.smith@milliy.uz',
        phone: '(555) 987-6543',
      },
      {
        id: 's3',
        name: 'Mike Johnson',
        avatar: '/images/avatar/3.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-3),
        groupCode: 'JED3',
        email: 'mike.johnson@milliy.uz',
        phone: '(555) 456-7890',
      },
    ],
    status: 75,
    dueDate: '2025-07-15T00:00:00',
    urgency: 'High',
    submittedCount: 15,
    totalAssigned: 20,
    tags: ['Math', 'Chapter 5', 'Homework'],
    createdAt: '2025-07-01T00:00:00',
  },
  {
    id: 'TASK-002',
    title: 'Physics Lab Report',
    description: 'Submit lab report on gravitational acceleration experiment',
    assignedStudents: [
      {
        id: 's2',
        name: 'Jane Smith',
        avatar: '/images/avatar/2.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-3),
        startedDate: getRelativeDateString(-6),
        groupCode: 'JSE1',
        email: 'jane.smith@milliy.uz',
        phone: '(555) 987-6543',
      },
      {
        id: 's4',
        name: 'Alex Brown',
        avatar: '/images/avatar/4.png',
        status: 'Not Started',
        groupCode: 'JED6',
        email: 'alex.brown@milliy.uz',
        phone: '(555) 321-7654',
      },
    ],
    status: 50,
    dueDate: '2025-07-10T00:00:00',
    urgency: 'Urgent',
    submittedCount: 10,
    totalAssigned: 20,
    tags: ['Physics', 'Lab Report'],
    createdAt: '2025-07-02T00:00:00',
  },
  {
    id: 'TASK-003',
    title: 'Literature Essay',
    description: 'Write a 500-word analysis on "The Great Gatsby"',
    assignedStudents: [
      {
        id: 's1',
        name: 'John Doe',
        avatar: '/images/avatar/1.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-2),
        groupCode: 'JSE1',
        email: 'john.doe@milliy.uz',
        phone: '(555) 123-4567',
      },
      {
        id: 's3',
        name: 'Mike Johnson',
        avatar: '/images/avatar/3.png',
        status: 'Not Started',
        groupCode: 'JED3',
        email: 'mike.johnson@milliy.uz',
        phone: '(555) 456-7890',
      },
      {
        id: 's5',
        name: 'Sarah Wilson',
        avatar: '/images/avatar/5.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-1),
        groupCode: 'JSE2',
        email: 'sarah.wilson@milliy.uz',
        phone: '(555) 765-4321',
      },
      {
        id: 's6',
        name: 'Emily Davis',
        avatar: '/images/avatar/6.png',
        status: 'Not Started',
        groupCode: 'JIM2',
        email: 'emily.davis@milliy.uz',
        phone: '(555) 234-5678',
      },
    ],
    status: 25,
    dueDate: '2025-07-20T00:00:00',
    urgency: 'Normal',
    submittedCount: 5,
    totalAssigned: 20,
    tags: ['Literature', 'Essay', 'Analysis'],
    createdAt: '2025-07-03T00:00:00',
  },
  {
    id: 'TASK-004',
    title: 'Programming Project',
    description: 'Create a simple calculator app in JavaScript',
    assignedStudents: [
      {
        id: 's7',
        name: 'David Garcia',
        avatar: '/images/avatar/7.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-5),
        startedDate: getRelativeDateString(-10),
        groupCode: 'JED3',
        email: 'david.garcia@milliy.uz',
        phone: '(555) 876-5432',
      },
      {
        id: 's8',
        name: 'Lisa Martinez',
        avatar: '/images/avatar/8.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-4),
        startedDate: getRelativeDateString(-9),
        groupCode: 'JED4',
        email: 'lisa.martinez@milliy.uz',
        phone: '(555) 345-6789',
      },
      {
        id: 's9',
        name: 'Robert Taylor',
        avatar: '/images/avatar/9.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-6),
        startedDate: getRelativeDateString(-11),
        groupCode: 'JED6',
        email: 'robert.taylor@milliy.uz',
        phone: '(555) 654-3210',
      },
    ],
    status: 100,
    dueDate: '2025-07-05T00:00:00', // Past due date
    urgency: 'Low',
    submittedCount: 20,
    totalAssigned: 20,
    tags: ['Programming', 'JavaScript', 'Project'],
    createdAt: '2025-07-04T00:00:00',
  },
  {
    id: 'TASK-005',
    title: 'Chemistry Lab Safety Quiz',
    description: 'Online quiz about lab safety procedures',
    assignedStudents: [
      {
        id: 's2',
        name: 'Jane Smith',
        avatar: '/images/avatar/2.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-2),
        startedDate: getRelativeDateString(-2), // Completed same day
        groupCode: 'JSE1',
        email: 'jane.smith@milliy.uz',
        phone: '(555) 987-6543',
      },
      {
        id: 's4',
        name: 'Alex Brown',
        avatar: '/images/avatar/4.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-1),
        groupCode: 'JED6',
        email: 'alex.brown@milliy.uz',
        phone: '(555) 321-7654',
      },
      {
        id: 's6',
        name: 'Emily Davis',
        avatar: '/images/avatar/6.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-1),
        startedDate: getRelativeDateString(-3),
        groupCode: 'JIM2',
        email: 'emily.davis@milliy.uz',
        phone: '(555) 234-5678',
      },
      {
        id: 's8',
        name: 'Lisa Martinez',
        avatar: '/images/avatar/8.png',
        status: 'Not Started',
        groupCode: 'JSE2',
        email: 'lisa.martinez@milliy.uz',
        phone: '(555) 345-6789',
      },
      {
        id: 's10',
        name: 'Thomas Anderson',
        avatar: '/images/avatar/10.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-2),
        groupCode: 'JSE2',
        email: 'thomas.anderson@milliy.uz',
        phone: '(555) 789-0123',
      },
    ],
    status: 60,
    dueDate: '2025-07-08T00:00:00',
    urgency: 'High',
    submittedCount: 12,
    totalAssigned: 20,
    tags: ['Chemistry', 'Lab Safety', 'Quiz'],
    createdAt: '2025-07-05T00:00:00',
  },
  {
    id: 'TASK-006',
    title: 'History Research Paper',
    description: 'Research paper on World War II events',
    assignedStudents: [
      {
        id: 's1',
        name: 'John Doe',
        avatar: '/images/avatar/1.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-5),
        groupCode: 'JSE1',
        email: 'john.doe@milliy.uz',
        phone: '(555) 123-4567',
      },
      {
        id: 's5',
        name: 'Sarah Wilson',
        avatar: '/images/avatar/5.png',
        status: 'Completed',
        completedDate: getRelativeDateString(-1),
        startedDate: getRelativeDateString(-6),
        groupCode: 'JIM2',
        email: 'sarah.wilson@milliy.uz',
        phone: '(555) 765-4321',
      },
      {
        id: 's9',
        name: 'Robert Taylor',
        avatar: '/images/avatar/9.png',
        status: 'In Progress',
        startedDate: getRelativeDateString(-4),
        groupCode: 'JED6',
        email: 'robert.taylor@milliy.uz',
        phone: '(555) 654-3210',
      },
    ],
    status: 40,
    dueDate: '2025-07-18T00:00:00',
    urgency: 'Normal',
    submittedCount: 8,
    totalAssigned: 20,
    tags: ['History', 'Research', 'WWII'],
    createdAt: '2025-07-06T00:00:00',
  },
];

export type TaskType = (typeof allTasksData)[number];
