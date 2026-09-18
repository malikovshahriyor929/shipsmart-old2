"use client";

import { useState } from "react";
import { Avatar, Badge, Tooltip } from "rizzui";
import { PiStarFill } from "react-icons/pi";
import cn from "@core/utils/class-names";
import { LessonReview, User } from "@core/types";
import { fullName, thumbUrl } from "@core/utils/course-utils";
import { getRelativeTime } from "@core/utils/get-relative-time";
import { t } from "i18next";
export default function ReviewCard({ review }: { review: LessonReview }) {
  const user = (review?.student ?? review?.user_id) as User | null;
  const text = (review?.content ?? review?.comment ?? "").trim();
  const rating = review?.rating || 0;

  // view more / view less
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 180;

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={thumbUrl(user?.avatar, "avatar")}
            name={fullName(user)}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div className="flex flex-col items-start gap-0.5 leading-tight min-w-0">
            <p className="truncate font-medium text-gray-600">
              {fullName(user)}
            </p>
            <Badge
              size="sm"
              rounded="pill"
              color="warning"
              variant="flat"
              className=""
            >
              {t("courses.studentProgress-id")} {user?.id}
            </Badge>
          </div>
        </div>

        <Tooltip size="sm" placement="top" content={`${rating} / 5`}>
          <div className="ml-1 flex shrink-0">
            {[...Array(5)].map((_, i) => (
              <PiStarFill
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < rating ? "text-amber-500" : "text-gray-300"
                )}
              />
            ))}
          </div>
        </Tooltip>
      </div>

      {text && (
        <div className="mt-2 min-w-0">
          <p
            className={cn(
              "whitespace-pre-wrap break-words hyphens-auto text-gray-600",
              !expanded && isLong && "line-clamp-3"
            )}
          >
            {text}
          </p>

          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 text-sm font-medium text-mainBlue hover:underline"
            >
              {expanded ? t("commons.view-less") : t("commons.view-more")}
            </button>
          )}
        </div>
      )}

      <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-gray-400">
        {getRelativeTime(review?.created_at || "")}
      </div>
    </div>
  );
}
