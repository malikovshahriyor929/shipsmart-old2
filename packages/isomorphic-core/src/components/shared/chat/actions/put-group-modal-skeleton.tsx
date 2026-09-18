// components/chat/loadings/group-members-modal-skeleton.tsx
import React from "react";

type Props = {
  rows?: number;
};

export default function GroupMembersModalSkeleton({ rows = 10 }: Props) {
  return (
    <div className="w-[560px] max-w-full p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-20 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Search + quick actions */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-10 flex-1 rounded bg-gray-200 animate-pulse" />
        <div className="h-9 w-24 rounded bg-gray-200 animate-pulse" />
        <div className="h-9 w-20 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* List */}
      <div className="custom-scrollbar max-h-[420px] overflow-y-auto rounded border border-gray-200">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2 border-b last:border-b-0"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="min-w-0 flex-1">
              <div className="h-4 w-40 rounded bg-gray-200 animate-pulse mb-1" />
              <div className="h-3 w-28 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="h-6 w-20 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <div className="h-9 w-24 rounded bg-gray-200 animate-pulse" />
        <div className="h-9 w-32 rounded bg-gray-200 animate-pulse" />
      </div>

      <div className="mt-2 h-3 w-52 rounded bg-gray-200 animate-pulse" />
    </div>
  );
}
