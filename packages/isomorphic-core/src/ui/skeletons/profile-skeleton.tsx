"use client";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="relative rounded-xl bg-mainBlue/80 px-6 py-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-col items-center lg:mr-6">
            <div className="mb-3 h-32 w-32 rounded-md bg-white/30 lg:h-40 lg:w-40" />
            <div className="h-6 w-48 rounded bg-white/30" />
            <div className="mt-2 flex gap-2">
              <div className="h-6 w-28 rounded bg-white/20" />
              <div className="h-6 w-20 rounded bg-white/20" />
            </div>
          </div>
          <div className="flex-1 border-t border-white/20 pt-3 lg:border-l lg:border-t-0 lg:pl-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="h-4 w-56 rounded bg-white/20" />
              <div className="h-4 w-40 rounded bg-white/20" />
              <div className="h-4 w-48 rounded bg-white/20" />
              <div className="h-4 w-52 rounded bg白/20" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-7 w-20 rounded bg-white/20" />
              <div className="h-7 w-20 rounded bg-white/20" />
              <div className="h-7 w-24 rounded bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Card sections */}
      <div className="rounded-md border p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="grid gap-8">
            <div>
              <div className="mb-3 h-5 w-40 rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-4 w-48 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
                <div className="h-4 w-56 rounded bg-gray-100" />
                <div className="h-4 w-36 rounded bg-gray-100" />
              </div>
            </div>
            <div>
              <div className="mb-3 h-5 w-48 rounded bg-gray-200" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-4 w-48 rounded bg-gray-100" />
                <div className="h-4 w-40 rounded bg-gray-100" />
                <div className="h-4 w-56 rounded bg-gray-100" />
              </div>
            </div>
          </div>
          <div>
            <div className="mb-3 h-5 w-48 rounded bg-gray-200" />
            <div className="space-y-3">
              <div className="h-4 w-64 rounded bg-gray-100" />
              <div className="h-4 w-40 rounded bg-gray-100" />
              <div className="h-4 w-52 rounded bg-gray-100" />
              <div className="h-4 w-44 rounded bg-gray-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border p-6">
        <div className="mb-4 h-6 w-40 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-40 rounded-lg bg-gray-50" />
          <div className="h-40 rounded-lg bg-gray-50" />
        </div>
      </div>
    </div>
  );
}
