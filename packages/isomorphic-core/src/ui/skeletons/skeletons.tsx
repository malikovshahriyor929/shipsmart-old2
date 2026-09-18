"use client";

import React from "react";
import cn from "@core/utils/class-names";
import Shimmer from "./shimmer";

/* ------------------------------------------------
 * Tiny building blocks (now using Shimmer)
 * ------------------------------------------------ */
function Skeleton({
  className,
  rounded,
}: {
  className?: string;
  rounded?: string;
}) {
  return <Shimmer className={className} rounded={rounded} />;
}
function Line({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3 rounded-md", className)} />;
}
function Circle({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("h-10 w-10", className)} rounded="rounded-full" />
  );
}
function Block({ className }: { className?: string }) {
  return <Skeleton className={className} />;
}

// Global Table skeleton
export function TableSkeleton({
  rows = 8,
  columns = 5,
  withHeader = true,
  withFooter = true,
}: {
  rows?: number;
  columns?: number;
  withHeader?: boolean;
  withFooter?: boolean;
}) {
  return (
    <div className="@container space-y-4">
      {/* Table shell */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-100">
        {/* Header */}
        {withHeader && (
          <div className="hidden items-center border-b bg-gray-50 px-4 py-3 text-sm text-gray-500 @lg:flex dark:bg-gray-800/40">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={`table-skel-header-${i}`} className="min-w-0 flex-1">
                <Skeleton className="h-3.5 w-24 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`table-skel-row-${rowIndex}`}
              className="flex flex-col gap-3 px-4 py-4 @lg:flex-row @lg:items-center"
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={`table-skel-row-${rowIndex}-col-${colIndex}`}
                  className="min-w-0 flex-1"
                >
                  {/* Primary line */}
                  <Skeleton className="mb-1 h-3 w-3/5 rounded-md" />
                  {/* Secondary / subtext line */}
                  <Skeleton className="h-3 w-2/5 rounded-md" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination skeleton */}
      {withFooter && (
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-36 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------
 * Helpers
 * ------------------------------------------------ */
function SectionTitleSkeleton() {
  return (
    <div className="mb-6">
      <Skeleton className="h-6 w-56 rounded-md" />
      <Skeleton className="mt-2 h-3 w-80 rounded-md" />
    </div>
  );
}

function FormGroupSkeleton({
  cols = 3,
  rows = 1,
}: {
  cols?: 1 | 2 | 3;
  rows?: number;
}) {
  return (
    <div className="mb-10">
      {/* "FormGroup" header */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>

      {/* inputs grid */}
      <div
        className={cn(
          "grid gap-5",
          cols === 1 && "grid-cols-1",
          cols === 2 && "grid-cols-1 @xl:grid-cols-2",
          cols === 3 && "grid-cols-1 @lg:grid-cols-3"
        )}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Line className="w-24" />
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DateRowSkeleton() {
  return (
    <div className="mb-10 grid grid-cols-1 gap-5 @lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Line className="w-28" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function SelectRowSkeleton({ cols = 2 }: { cols?: 1 | 2 }) {
  return (
    <div
      className={cn(
        "mb-10 grid gap-5",
        cols === 1 ? "grid-cols-1" : "grid-cols-1 @lg:grid-cols-2"
      )}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Line className="w-28" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function AvatarBlockSkeleton() {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>

      <div className="flex items-center gap-4">
        <Skeleton
          className="h-[100px] w-[100px] rounded-md"
          rounded="rounded-md"
        />
        <div className="space-y-2">
          <Skeleton className="h-4 w-44 rounded-md" />
          <Skeleton className="h-3 w-64 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function FilePickerSkeleton() {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-5/6 rounded-md" />
          <Skeleton className="h-3 w-3/5 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function StickyFooterSkeleton() {
  // visually similar to your FormFooter stickiness
  return (
    <div className="-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10 sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t bg-white px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 dark:bg-gray-50">
      <Skeleton className="h-10 w-full rounded-lg @xl:w-36" />
      <Skeleton className="h-10 w-full rounded-lg @xl:w-32" />
    </div>
  );
}

/* ------------------------------------------------
 * Main exported skeleton
 * ------------------------------------------------ */
export function CreateStaffFormSkeleton({
  role = "advisor",
}: {
  role?: "advisor" | "teacher" | "counselor";
}) {
  const isCounselor = role === "counselor";
  const showSchool = role !== "counselor";

  return (
    <div className="@container">
      <div className="mx-auto mb-10 grid w-full max-w-screen-2xl gap-7 divide-y divide-dashed">
        {/* BASIC INFO */}
        <div className="pt-7">
          <SectionTitleSkeleton />

          {/* Name */}
          <FormGroupSkeleton cols={3} />

          {/* Contacts */}
          <FormGroupSkeleton cols={2} />

          {/* Gender & Language */}
          <SelectRowSkeleton cols={2} />

          {/* Region */}
          <SelectRowSkeleton cols={1} />

          {/* Birth Date */}
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
          </div>

          {/* Profile photo */}
          <AvatarBlockSkeleton />
        </div>

        {/* COUNSELOR INFO */}
        {isCounselor && (
          <div className="pt-7">
            <SectionTitleSkeleton />
            <FormGroupSkeleton cols={2} />
            <FormGroupSkeleton cols={1} />
            {/* Bio textarea */}
            <div className="mb-10 space-y-2">
              <Line className="w-20" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
            <FormGroupSkeleton cols={1} />
          </div>
        )}

        {/* PASSPORT INFO */}
        <div className="pt-7">
          <SectionTitleSkeleton />

          {/* Passport number + PINFL */}
          <FormGroupSkeleton cols={2} />

          {/* Given place */}
          <FormGroupSkeleton cols={1} />

          {/* Dates */}
          <DateRowSkeleton />

          {/* Citizenship + Nationality */}
          <SelectRowSkeleton cols={2} />

          {/* Passport file */}
          <FilePickerSkeleton />
        </div>

        {/* SCHOOL INFO (advisor/teacher only) */}
        {showSchool && (
          <div className="pt-7">
            <SectionTitleSkeleton />
            {/* Type, Region, District */}
            <FormGroupSkeleton cols={3} />
            {/* School Name */}
            <FormGroupSkeleton cols={1} />
          </div>
        )}
      </div>

      {/* Sticky footer skeleton */}
      <StickyFooterSkeleton />
    </div>
  );
}

/* =========================================================
 * EXISTING: Course card & grid skeletons (Shimmer-ized)
 * ========================================================= */

export function CourseCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-100",
        className
      )}
    >
      {/* Thumb (Aspect ratio is a guess, but 4/3 is common for small cards) */}
      <div className="relative aspect-[4/3] w-full">
        <Skeleton
          className="absolute inset-0 w-full h-full rounded-t-xl"
          rounded="rounded-t-xl"
        />
        {/* Subject Badge (SAT) */}
        <Skeleton
          className="absolute top-2 right-2 h-6 w-10"
          rounded="rounded-lg"
        />
        {/* Instructor Avatar (optional, based on some images) */}
        <Circle className="absolute top-2 left-2 h-8 w-8" />
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <Line className="mb-3 h-5 w-5/6" />

        {/* Progress Bar (Dashed line/space) */}
        <div className="relative mb-3 h-2 w-full">
          {/* Faux Progress Bar line (e.g., 50% filled) */}
          <Block className="absolute top-0 left-0 h-2 w-1/2 bg-gray-200 dark:bg-gray-500" />
        </div>

        {/* Status Row: Enrolled/Progress Left, Lessons Right */}
        <div className="flex items-center justify-between pt-1">
          {/* Status (Enrolled) */}
          <Line className="h-4 w-16" />

          {/* Lessons Count/CTA */}
          <Skeleton className="h-7 w-20 rounded-full" rounded="rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CourseGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-6 @container @md:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] @xl:gap-x-7 @xl:gap-y-9 @4xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] @6xl:grid-cols-[repeat(auto-fill,minmax(364px,1fr))]">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={`course-skeleton-${i}`} />
      ))}
    </div>
  );
}

/** Header: badges, title, meta, instructor */
export function CourseHeaderSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-100">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-shrink-0">
          <Block className="h-16 w-16 rounded-xl" />
        </div>

        <div className="flex-1">
          {/* Badges */}
          <div className="mb-3 flex flex-wrap gap-2">
            <Skeleton
              className="h-6 w-20 rounded-full"
              rounded="rounded-full"
            />
            <Skeleton
              className="h-6 w-24 rounded-full"
              rounded="rounded-full"
            />
          </div>

          {/* Title */}
          <Skeleton className="mb-3 h-8 w-3/5 rounded-md" />

          {/* Meta row */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <Line className="h-4 w-28" />
            <Line className="h-4 w-40" />
            <Line className="h-4 w-20" />
          </div>

          {/* Description */}
          <Line className="mb-2 h-4 w-full" />
          <Line className="mb-2 h-4 w-11/12" />
          <Line className="h-4 w-9/12" />

          {/* Creator */}
          <div className="mt-5 flex items-center gap-3">
            <Circle className="h-10 w-10" />
            <div className="space-y-1">
              <Line className="h-4 w-32" />
              <Line className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Media (thumbnail) */
export function CourseMediaSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-100">
      <Skeleton className="aspect-video w-full rounded-none" />
    </div>
  );
}

/** Syllabus list */
export function CourseSyllabusSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-100">
      <div className="mb-6 flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-2">
          <Circle className="h-5 w-5" />
          <Line className="h-5 w-36" />
        </div>
        {/* Right summary */}
        <Line className="h-4 w-24" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="overflow-clip rounded-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between bg-gray-50 p-4 dark:bg-gray-700/30">
              <div className="flex items-center gap-4">
                <Line className="h-4 w-20" />
                <Line className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-4">
                <Line className="h-4 w-16" />
                <Line className="h-4 w-10" />
                <Circle className="h-4 w-4" />
              </div>
            </div>
            <div className="border-t border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-100">
              <Line className="mb-2 h-4 w-5/6" />
              <Line className="h-4 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sidebar actions */
export function CourseActionsSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-100">
      <Block className="h-12 w-full rounded-xl" />
      <div className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-500/10">
        <Line className="mx-auto h-3 w-7/12" />
      </div>
    </div>
  );
}

/** Full Course Details layout skeleton */
export function CourseDetailsSkeleton() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-8 lg:col-span-2">
          <CourseHeaderSkeleton />
          <CourseSyllabusSkeleton />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <CourseMediaSkeleton />
          <CourseActionsSkeleton />
        </div>
      </div>
    </div>
  );
}

/* ================================
 * Course Lessons List – Skeletons
 * ================================ */

/** Overview card at the top of the page */
export function CourseLessonsOverviewSkeleton() {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-5 dark:border-gray-700">
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        {/* Thumb */}
        <Skeleton
          className="relative aspect-[4/3] w-full max-w-[230px] rounded-xl"
          rounded="rounded-xl"
        />

        {/* Right side */}
        <div className="flex-1 sm:py-2">
          {/* Title + badges row */}
          <div className="mb-3 flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-7 w-64 rounded-md" />
            <div className="flex items-center gap-2">
              <Skeleton
                className="h-6 w-16 rounded-full"
                rounded="rounded-full"
              />
              <Skeleton
                className="h-6 w-24 rounded-full"
                rounded="rounded-full"
              />
              <Skeleton
                className="h-6 w-28 rounded-full"
                rounded="rounded-full"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-3 space-y-2">
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-9/12 rounded" />
          </div>

          {/* Instructor + lessons count */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Circle className="h-10 w-10" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
            <Skeleton
              className="h-7 w-28 rounded-full"
              rounded="rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Single lesson card skeleton */
export function LessonCardSkeleton() {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white  transition-all duration-300 dark:border-gray-700 dark:bg-gray-100">
      {/* Thumb */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Body */}
      <div className="flex flex-col gap-2 p-5">
        <Skeleton className="mb-1 h-5 w-3/4 rounded" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-12 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full page skeleton: overview + grid of lessons */
export function CourseLessonsListSkeleton({ cards = 8 }: { cards?: number }) {
  return (
    <div className="@container">
      <CourseLessonsOverviewSkeleton />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, i) => (
          <LessonCardSkeleton key={`lesson-card-skel-${i}`} />
        ))}
      </div>
    </div>
  );
}

/* =========================
   Course Learning Page
   ========================= */

export function CourseLearningSkeleton({
  sidebarItems = 6,
}: {
  sidebarItems?: number;
}) {
  return (
    <div className="h-full w-full overflow-hidden lg:flex">
      {/* Left: lesson content skeleton */}
      <div className="min-w-0 flex-1">
        <LessonContentSkeleton />
      </div>

      {/* Right: sidebar skeleton */}
      <div className="w-full min-w-[300px] max-w-full border-l border-gray-200 lg:w-[40%]">
        <LessonSidebarSkeleton items={sidebarItems} />
      </div>
    </div>
  );
}

/* =========================
   Lesson Content Skeleton
   ========================= */

export function LessonContentSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-transparent backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto w-full max-w-screen-2xl px-5 py-4">
          <div>
            <Skeleton className="mb-2 h-4 w-40 rounded" />
            <Skeleton className="h-7 w-64 rounded" />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Media placeholder */}
        <div className="p-5">
          <Skeleton className="aspect-video w-full rounded-lg" />
        </div>

        {/* Tabs header */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 dark:bg-gray-100 backdrop-blur">
          <div className="mx-auto flex w-full max-w-screen-2xl gap-2 px-5 py-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded" />
            ))}
          </div>
        </div>

        {/* Tab panel content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-screen-2xl space-y-4 p-5">
            <Skeleton className="h-4 w-56 rounded" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-3 rounded" />
              <Skeleton className="h-3 rounded" />
            </div>
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Lesson Sidebar Skeleton
   ========================= */

export function LessonSidebarSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:bg-gray-100 p-5">
        <div>
          <Skeleton className="mb-3 h-5 w-56 rounded" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-16 rounded" />
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-6 w-14 rounded" />
          </div>
          <Skeleton className="mt-3 h-3 w-full rounded" />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto p-5">
        <div>
          {Array.from({ length: items }).map((_, i) => (
            <div
              key={`lesson-skeleton-${i}`}
              className={cn(
                "mb-4 w-full rounded-lg border px-3 py-4",
                "border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-center gap-3">
                <Skeleton
                  className="h-6 w-6 rounded-full"
                  rounded="rounded-full"
                />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-3/5 rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                </div>
                <Skeleton className="h-4 w-14 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========
// Practice Tab Start Page Skeletons
// ========
export function PracticeTabSkeleton() {
  return (
    <div className="mx-auto w-full">
      {/* ======== Start Section (Hero) ======== */}
      <section className="relative overflow-hidden rounded-2xl px-1 md:border md:border-gray-200 md:p-6">
        {/* Title + badges */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <Block className="h-7 w-72 rounded-md md:h-8 md:w-96" />
            <Line className="w-64" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Block className="h-7 w-28 rounded-full" />
            <Block className="h-7 w-24 rounded-full" />
            <Block className="h-7 w-32 rounded-full" />
            <Block className="h-7 w-36 rounded-full" />
          </div>
        </div>

        {/* What to expect + Rules */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Card: What to expect */}
          <div className="rounded-xl bg-white dark:bg-gray-100  p-3 ring-1 ring-gray-200 md:p-5">
            <Line className="mb-3 w-40" />
            <ul className="grid gap-3">
              {[0, 1, 2, 3].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <Circle className="h-6 w-6" />
                  <Line className="w-[75%]" />
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Rules */}
          <div className="rounded-xl bg-white dark:bg-gray-100 p-3 ring-1 ring-gray-200 md:p-5">
            <Line className="mb-3 w-28" />
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Circle className="h-6 w-6" />
                  <Line className="w-[70%]" />
                </div>
              ))}
            </div>

            {/* Checkbox line */}
            <div className="mt-4 flex items-center gap-3">
              <Block className="h-5 w-5 rounded" />
              <Line className="w-56" />
            </div>
          </div>
        </div>

        {/* Start button */}
        <div className="mt-8 flex items-center justify-center">
          <Block className="h-11 w-56 rounded-lg" />
        </div>
      </section>

      {/* ======== History Section ======== */}
      <section className="mt-6 space-y-4">
        <Line className="w-40" />

        {/* Attempt card */}
        <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Block className="h-6 w-20 rounded-full" />
              <Block className="h-6 w-24 rounded-full" />
            </div>
            <Line className="w-40" />
          </div>

          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            {/* Donut placeholder */}
            <div className="relative mx-auto h-44 w-44">
              <Block className="h-44 w-44 rounded-full" />
              <div className="absolute inset-0 grid place-items-center gap-2">
                <Block className="h-6 w-20 rounded-md" />
                <Line className="w-12" />
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200 p-4">
                  <Line className="mb-2 w-24" />
                  <Circle className="mb-3 h-9 w-9" />
                  <Block className="h-2 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Skeleton for Student Sessions table
export function StudentSessionsSkeleton({
  type = "upcoming",
  rows = 8,
}: {
  type?: "upcoming" | "past";
  rows?: number;
}) {
  return <TableSkeleton rows={rows} columns={7} withHeader withFooter />;
}
