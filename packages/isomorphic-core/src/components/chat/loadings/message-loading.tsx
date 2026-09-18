"use client";

import cn from "@core/utils/class-names";
import React from "react";

type Props = {
  groups?: number;             // number of date groups
  messagesPerGroup?: number;   // messages per group
  showAttachments?: boolean;
  withAvatars?: boolean;
  className?: string;
};

export default function ChatMessagesSkeleton({
  groups = 2,
  messagesPerGroup = 6,
  showAttachments = true,
  withAvatars = true,
  className,
}: Props) {
  return (
    <div className={cn(className)}>
      {Array.from({ length: groups }).map((_, gIdx) => (
        <div key={gIdx} className="mb-6">
          {/* Date chip */}
          <div className="mb-4 flex justify-center">
            <span className="h-6 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
          </div>

          {Array.from({ length: messagesPerGroup }).map((__, mIdx) => {
            const isCurrentUser = mIdx % 2 === 1;
            const bubbleWidths = [
              "w-48",
              "w-64",
              "w-56",
              "w-40",
              "w-60",
              "w-52",
              "w-44",
              "w-72",
            ];
            const bw = bubbleWidths[mIdx % bubbleWidths.length];

            return (
              <div
                key={`${gIdx}-${mIdx}`}
                className={cn(
                  "mb-4 flex",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                {/* Avatar (left side for incoming) */}
                {!isCurrentUser && withAvatars && (
                  <div className="mr-2 self-end">
                    <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[55%]",
                    isCurrentUser ? "items-end" : "items-start"
                  )}
                >
                  {/* Attachments grid skeleton */}
                  {showAttachments && mIdx % 3 === 0 && (
                    <div className="mb-1 grid grid-cols-2 gap-2">
                      {Array.from({ length: 3 }).map((___, aIdx) => (
                        <div
                          key={aIdx}
                          className={cn(
                            "h-28 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10",
                            aIdx === 0 && 3 % 2 === 1 ? "col-span-2" : "col-span-1"
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      isCurrentUser
                        ? "ml-auto rounded-br-sm bg-mainBlue text-white dark:bg-blue-900"
                        : "mr-auto rounded-bl-sm bg-gray-100 dark:bg-white/10"
                    )}
                  >
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "h-3 animate-pulse rounded",
                          isCurrentUser
                            ? "bg-white/40"
                            : "bg-gray-300 dark:bg-white/20",
                          bw
                        )}
                      />
                      {/* sometimes render a second line */}
                      {mIdx % 2 === 0 && (
                        <div
                          className={cn(
                            "h-3 animate-pulse rounded",
                            isCurrentUser
                              ? "bg-white/40"
                              : "bg-gray-300 dark:bg-white/20",
                            "w-40"
                          )}
                        />
                      )}
                    </div>
                  </div>

                  {/* Time row */}
                  <div
                    className={cn(
                      "mt-1 flex items-center text-xs text-gray-500",
                      isCurrentUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <span className="h-3 w-10 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
