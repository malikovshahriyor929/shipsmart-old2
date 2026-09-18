import { atom, useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import type { TaskPriority } from "../validators/create-task.schema";

// Define the task type
export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  dueDate?: Date | null;
  assignee: string;
  columnId: string;
  priority: TaskPriority;
  createdAt: Date;
  submittedCount?: number;
  totalAssigned?: number;
}

// Define column type
export interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

// Default task for initialization
const initialTasks: Task[] = [];

// Define priority to background color mapping
export const PRIORITY_COLORS = {
  open: "bg-gray-50",
  urgent: "bg-red-50",
  high: "bg-yellow-50",
  normal: "bg-blue-50",
  low: "bg-gray-50",
};

// Create atoms for state management
export const tasksAtom = atom<Task[]>(initialTasks);
export const selectedColumnIdAtom = atom<string | null>(null);

export default function useTaskBoard() {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [selectedColumnId, setSelectedColumnId] = useAtom(selectedColumnIdAtom);

  function createTask(task: Omit<Task, "id" | "createdAt">) {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      tags: task.tags || [],
    };

    setTasks((prev) => [...prev, newTask]);
    return newTask;
  }

  function updateTask(updatedTask: Task) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function getTasksByColumn(columnId: string) {
    return tasks.filter((task) => task.columnId === columnId);
  }

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByColumn,
    selectedColumnId,
    setSelectedColumnId,
  };
}
