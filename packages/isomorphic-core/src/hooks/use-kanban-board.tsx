"use client";

import { useState, createContext, useContext, useEffect } from "react";
import {
  PiListBullets,
  PiCircleFill,
  PiCheckCircle,
  PiClockCountdown,
} from "react-icons/pi";
// Define the task type
export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  dueDate?: Date | null;
  assignee: string;
  columnId: string;
  priority: any;
  createdAt: Date;
}

// Define column type
export interface Column {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
}

// Initial data structure
const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    icon: <PiListBullets className="mr-2 h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "inprogress",
    title: "In Progress",
    icon: <PiCircleFill className="mr-2 h-5 w-5" />,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "inreview",
    title: "In Review",
    icon: <PiClockCountdown className="mr-2 h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "done",
    title: "Done",
    icon: <PiCheckCircle className="mr-2 h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
];

// Define priority to background color mapping
export const PRIORITY_COLORS: Record<any, string> = {
  open: "bg-gray-50",
  urgent: "bg-red-50",
  high: "bg-yellow-50",
  normal: "bg-blue-50",
  low: "bg-gray-50",
};

// Define available column colors
export const COLUMN_COLOR_OPTIONS = [
  { value: "bg-blue-100 text-blue-700", label: "Blue", color: "#93c5fd" },
  { value: "bg-green-100 text-green-700", label: "Green", color: "#86efac" },
  { value: "bg-red-100 text-red-700", label: "Red", color: "#fca5a5" },
  { value: "bg-yellow-100 text-yellow-700", label: "Yellow", color: "#fde047" },
  { value: "bg-purple-100 text-purple-700", label: "Purple", color: "#d8b4fe" },
  { value: "bg-orange-100 text-orange-700", label: "Orange", color: "#fdba74" },
  { value: "bg-gray-100 text-gray-700", label: "Gray", color: "#d1d5db" },
  { value: "bg-indigo-100 text-indigo-700", label: "Indigo", color: "#a5b4fc" },
  { value: "bg-pink-100 text-pink-700", label: "Pink", color: "#f9a8d4" },
  { value: "bg-teal-100 text-teal-700", label: "Teal", color: "#5eead4" },
];

interface KanbanBoardContextProps {
  columns: Column[];
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number
  ) => void;
  addColumn: (column: Column) => void;
  updateColumn: (column: Column) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (sourceIndex: number, destinationIndex: number) => void;
  getTasksByColumn: (columnId: string) => Task[];
}

// Define the type for our global state
interface GlobalStateType {
  columns: Column[];
  tasks: Task[];
  listeners: Array<() => void>;
  addListener: (callback: () => void) => () => void;
  notifyListeners: () => void;
}

// Global state to share across provider instances
const GLOBAL_STATE: GlobalStateType = {
  columns: initialColumns,
  tasks: [],
  listeners: [],
  addListener: function (callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  },
  notifyListeners: function () {
    this.listeners.forEach((listener) => listener());
  },
};

export const KanbanBoardContext = createContext<
  KanbanBoardContextProps | undefined
>(undefined);

export const KanbanBoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Local state that syncs with global state
  const [columns, setColumns] = useState<Column[]>(GLOBAL_STATE.columns);
  const [tasks, setTasks] = useState<Task[]>(GLOBAL_STATE.tasks);

  // Sync with global state
  useEffect(() => {
    // Initial sync
    setColumns(GLOBAL_STATE.columns);
    setTasks(GLOBAL_STATE.tasks);

    // Subscribe to changes
    const unsubscribe = GLOBAL_STATE.addListener(() => {
      setColumns([...GLOBAL_STATE.columns]);
      setTasks([...GLOBAL_STATE.tasks]);
    });

    return unsubscribe;
  }, []);

  // Task operations
  const addTask = (task: Task) => {
    GLOBAL_STATE.tasks = [...GLOBAL_STATE.tasks, task];
    setTasks([...GLOBAL_STATE.tasks]);
    GLOBAL_STATE.notifyListeners();
  };

  const updateTask = (updatedTask: Task) => {
    const index = GLOBAL_STATE.tasks.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      GLOBAL_STATE.tasks = GLOBAL_STATE.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      setTasks([...GLOBAL_STATE.tasks]);
      GLOBAL_STATE.notifyListeners();
    }
  };

  const deleteTask = (taskId: string) => {
    GLOBAL_STATE.tasks = GLOBAL_STATE.tasks.filter((t) => t.id !== taskId);
    setTasks([...GLOBAL_STATE.tasks]);
    GLOBAL_STATE.notifyListeners();
  };

  const moveTask = (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number
  ) => {
    const taskIndex = GLOBAL_STATE.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    // Create new array and remove task
    const newTasks = [...GLOBAL_STATE.tasks];
    const [task] = newTasks.splice(taskIndex, 1);

    // Update task's column
    const updatedTask: Task = { ...task, columnId: destinationColumnId };

    // Get destination tasks for position calculation
    const destinationTasks = GLOBAL_STATE.tasks.filter(
      (t) => t.columnId === destinationColumnId
    );

    // Calculate insert position - insert at the end if newIndex is out of bounds
    let insertPosition: number;
    if (newIndex >= destinationTasks.length) {
      // If inserting at the end, find the position after the last task in this column
      const lastTask = destinationTasks[destinationTasks.length - 1];
      insertPosition = lastTask
        ? GLOBAL_STATE.tasks.indexOf(lastTask) + 1
        : taskIndex;
    } else {
      // Otherwise insert at the specified index
      insertPosition = GLOBAL_STATE.tasks.indexOf(destinationTasks[newIndex]);
    }

    // Ensure insertPosition is valid
    if (insertPosition === -1) {
      insertPosition = GLOBAL_STATE.tasks.length;
    }

    // Insert task at the calculated position
    newTasks.splice(insertPosition, 0, updatedTask);

    // Update global state
    GLOBAL_STATE.tasks = newTasks;
    setTasks(newTasks);
    GLOBAL_STATE.notifyListeners();
  };

  // Column operations
  const addColumn = (column: Column) => {
    GLOBAL_STATE.columns = [...GLOBAL_STATE.columns, column];
    setColumns([...GLOBAL_STATE.columns]);
    GLOBAL_STATE.notifyListeners();
  };

  const updateColumn = (updatedColumn: Column) => {
    GLOBAL_STATE.columns = GLOBAL_STATE.columns.map((column) =>
      column.id === updatedColumn.id ? updatedColumn : column
    );
    setColumns([...GLOBAL_STATE.columns]);
    GLOBAL_STATE.notifyListeners();
  };

  const deleteColumn = (columnId: string) => {
    // Delete the column
    GLOBAL_STATE.columns = GLOBAL_STATE.columns.filter(
      (c) => c.id !== columnId
    );

    // Delete tasks in this column
    GLOBAL_STATE.tasks = GLOBAL_STATE.tasks.filter(
      (t) => t.columnId !== columnId
    );

    setColumns([...GLOBAL_STATE.columns]);
    setTasks([...GLOBAL_STATE.tasks]);
    GLOBAL_STATE.notifyListeners();
  };

  const reorderColumns = (sourceIndex: number, destinationIndex: number) => {
    const result = [...GLOBAL_STATE.columns];
    const [removed] = result.splice(sourceIndex, 1);
    result.splice(destinationIndex, 0, removed);

    GLOBAL_STATE.columns = result;
    setColumns(result);
    GLOBAL_STATE.notifyListeners();
  };

  const getTasksByColumn = (columnId: string) => {
    return tasks.filter((task) => task.columnId === columnId);
  };

  return (
    <KanbanBoardContext.Provider
      value={{
        columns,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addColumn,
        updateColumn,
        deleteColumn,
        reorderColumns,
        getTasksByColumn,
      }}
    >
      {children}
    </KanbanBoardContext.Provider>
  );
};

export default function useKanbanBoard() {
  const context = useContext(KanbanBoardContext);
  if (context === undefined) {
    throw new Error("useKanbanBoard must be used within a KanbanBoardProvider");
  }
  return context;
}
