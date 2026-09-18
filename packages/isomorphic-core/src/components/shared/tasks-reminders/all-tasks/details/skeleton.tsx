'use client';

import cn from '@core/utils/class-names';
import React from 'react';

type Props = { className?: string };

export default function TaskDetailSkeleton({ className }: Props) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn(
        'rounded-xl border border-mainBlue/20 bg-gray-50/50 p-5 shadow-sm animate-pulse',
        className
      )}
    >
      {/* Header row: title + badges */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        {/* Title */}
        <div className="h-6 w-56 rounded-md bg-gray-200 dark:bg-gray-700" />

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-40 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Meta: due date + instructor */}
      <div className="mb-4 flex items-center max-[616px]:flex-col max-[616px]:items-start gap-3">
        <div className="h-8 w-56 rounded-lg border border-gray-200 bg-white/80 dark:border-white/10 dark:bg-gray-800/60" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 rounded-md border border-gray-200 bg-white/80 p-4 backdrop-blur-sm dark:border-white/10 dark:bg-gray-800/60">
        <div className="mb-2 h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mb-2 h-4 w-4/6 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-3/6 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* Attachments */}
      <div className="mb-3">
        <div className="mb-2 h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`att-${i}`}
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 dark:border-white/10 dark:bg-gray-800/60"
            >
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-1">
                <div className="h-3 w-44 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="mb-2">
        <div className="mb-2 h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="ml-2 flex w-full flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`res-${i}`} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-600" />
              <div className="h-4 w-56 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}
