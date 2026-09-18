"use client";

import React, { createContext, useContext } from "react";
import type { Course, Lesson, Id } from "@core/types";

type LessonLearningContextValue = {
  isPublic: boolean;

  course: Course | null;
  headerLesson: Lesson | null;

  lessons: Lesson[];
  activeLessonId: Id | null;

  onSelectLesson: (lesson: Lesson) => void | Promise<void>;

  // protected mode (scroll pagination)
  onLoadMore: () => void | Promise<void>;
  hasMore: boolean;
  loadingMore: boolean;

  // public mode (page navigation)
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void | Promise<void>;
};

const LessonLearningContext = createContext<LessonLearningContextValue | null>(
  null
);

export function LessonLearningProvider({
  value,
  children,
}: {
  value: LessonLearningContextValue;
  children: React.ReactNode;
}) {
  return (
    <LessonLearningContext.Provider value={value}>
      {children}
    </LessonLearningContext.Provider>
  );
}

export function useLessonLearning() {
  const ctx = useContext(LessonLearningContext);
  if (!ctx) {
    throw new Error(
      "useLessonLearning must be used inside LessonLearningProvider"
    );
  }
  return ctx;
}
