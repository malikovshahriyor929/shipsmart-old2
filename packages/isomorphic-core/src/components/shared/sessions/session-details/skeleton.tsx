'use client';

import React from 'react';
import cn from '@core/utils/class-names';

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-700/60',
        className
      )}
    />
  );
}

export default function SessionDetailsSkeleton() {
  return (
    <div className="border border-gray-200/80 rounded-xl p-5">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-6 w-48" /> {/* title */}
          <Skeleton className="h-3 w-[70%]" /> {/* description */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>

        <div className="shrink-0 text-right">
          <Skeleton className="h-8 w-16 ml-auto rounded-md" />
          <Skeleton className="mt-1 h-3 w-20 ml-auto rounded-md" />
        </div>
      </div>

      {/* Summary row */}
      <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-gray-200/70 p-3 dark:border-gray-700/40"
          >
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Offline location placeholder */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-40" />
      </div>

      {/* Attendance table */}
      {/* <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/50">
        <div className="grid grid-cols-12 border-b px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
          <div className="col-span-4">Status</div>
          <div className="col-span-4 text-center">First Join</div>
          <div className="col-span-4 text-right">Total Participation</div>
        </div>

        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 items-center border-b px-4 py-3 last:border-b-0"
          >
            <div className="col-span-4">
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="col-span-4 text-center">
              <Skeleton className="mx-auto h-3 w-20" />
            </div>
            <div className="col-span-4 text-right">
              <Skeleton className="ml-auto h-3 w-20" />
            </div>
          </div>
        ))}
      </div> */}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end">
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}
