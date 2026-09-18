// Profile.skeleton.tsx
'use client';

import React from 'react';
import cn from '@core/utils/class-names';

/* -------------------------------------------
 * Tiny shimmer building blocks
 * ------------------------------------------- */
function Skel({
  className,
  rounded = 'rounded-md',
}: { className?: string; rounded?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200/70 dark:bg-slate-700 dark:bg-slate-700/40',
        rounded,
        className
      )}
    />
  );
}
const Line = ({ className }: { className?: string }) => (
  <Skel className={cn('h-3', className)} />
);
const Circle = ({ className }: { className?: string }) => (
  <Skel className={cn('size-10', className)} rounded="rounded-full" />
);
const Block = ({ className }: { className?: string }) => <Skel className={className} />;

/* -------------------------------------------
 * RowField skeleton (icon + two lines)
 * ------------------------------------------- */
function RowFieldSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Circle className="size-6" />
      <div className="min-w-0 flex-1">
        <Line className="w-40" />
        <Line className="mt-2 h-4 w-28" />
      </div>
    </div>
  );
}

/* -------------------------------------------
 * StatCard skeleton (matches your 200x100)
 * ------------------------------------------- */
function StatCardSkeleton() {
  return (
    <div className="flex h-[100px] w-[200px] items-center justify-between rounded-xl border border-[#E0E6ED] bg-white dark:bg-gray-100 px-4 shadow-sm">
      <div className="flex flex-col">
        <Line className="h-8 w-16" />
        <Line className="mt-2 w-20" />
      </div>
      <div className="relative size-[70px]">
        <Circle className="size-[70px]" />
      </div>
    </div>
  );
}

/* -------------------------------------------
 * Section shell to mimic your cards
 * ------------------------------------------- */
function SectionShell({ titleWidth = 'w-56', children }: { titleWidth?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-5 shadow-sm">
      <Line className={cn('h-6', titleWidth)} />
      <div className="mt-2 h-px w-full border-t border-dashed border-slate-200" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------
 * Tabs skeleton (identity active)
 * ------------------------------------------- */
function TabsSkeleton() {
  return (
    <div className="w-full rounded-b-[16px] border-t border-slate-200 bg-slate-50 dark:bg-gray-100 px-3 sm:px-6 max-[810px]:overflow-x-auto">
      <div className="flex w-full justify-end gap-2 py-3 sm:gap-4 max-[810px]:flex-wrap max-[810px]:justify-start">
        {/* identity tab (active underline) */}
        <div className="relative">
          <Block className="h-8 w-40 rounded-md" />
          <span className="absolute inset-x-2 -bottom-[6px] h-[3px] rounded-full bg-[#123271] dark:bg-white" />
        </div>
        <Block className="h-8 w-32 rounded-md" />
        <Block className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}

/* -------------------------------------------
 * Main Profile skeleton
 * ------------------------------------------- */
export default function ProfileSkeleton({fromStudent = true}: {fromStudent?: boolean}) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[20px] shadow-sm">
        {/* Cover */}
        <div className="relative h-[220px] sm:h-[215px]">
          <div className="absolute inset-0 bg-[#123271]" />
          <Block className="absolute inset-0 h-full w-full opacity-50" />
        </div>

        {/* White strip with avatar, name, role, stats, edit btn */}
        <div className="relative bg-white dark:bg-gray-100 px-5 pb-6 pt-[100px] sm:px-8">
          {/* Avatar */}
          <div className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2">
            <Circle className="size-[170px] ring-8 ring-white shadow-md" />
          </div>

          {/* Name + Role */}
          <div className="flex flex-col items-center">
            <Line className="h-6 w-64" />
            <Line className="mt-3 w-40" />
          </div>

          {/* Metrics + (optional) Edit */}
          <div className={`mt-2 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between ${!fromStudent ? 'hidden' : ''}`}>
            <div className="flex w-full flex-1 flex-wrap gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="flex shrink-0 items-end">
              <Block className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative bg-white dark:bg-gray-100">
          <TabsSkeleton />
        </div>
      </div>

      {/* CONTENT: identity only */}
      <div className="mt-6">
        <div className="col-span-12 md:col-span-12">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Left column: Personal + Education */}
            <div className="space-y-6">
              {/* Personal Information */}
              <SectionShell>
                {Array.from({ length: 6 }).map((_, i) => (
                  <RowFieldSkeleton key={`pi-${i}`} />
                ))}
              </SectionShell>

              {/* Education Information */}
              <SectionShell titleWidth="w-72">
                {Array.from({ length:6}).map((_, i) => (
                  <RowFieldSkeleton key={`edu-${i}`} />
                ))}
                {/* Certificate file row */}
                <div className="sm:col-span-2">
                  <RowFieldSkeleton />
                </div>
              </SectionShell>
            </div>

            {/* Right column: Contact + Identity Document */}
            <div className="space-y-6">
              {/* Contact Information */}
              <SectionShell titleWidth="w-64">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RowFieldSkeleton key={`ci-${i}`} />
                ))}
              </SectionShell>

              {/* Identity Document */}
              <section className="rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-5 shadow-sm">
                <Line className="h-6 w-56" />
                <div className="mt-2 h-px w-full border-t border-dashed border-slate-200" />
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <RowFieldSkeleton key={`id-${i}`} />
                  ))}
                  {/* File row full width */}
                  <div className="sm:col-span-2">
                    <RowFieldSkeleton />
                  </div>
                </div>
              </section>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
