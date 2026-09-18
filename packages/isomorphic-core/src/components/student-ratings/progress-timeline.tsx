"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text, Badge } from "rizzui";
import { RatingProgress } from "@core/types/student-ratings";
import { PiCheckCircleDuotone, PiXCircleDuotone } from "react-icons/pi";
import { fullName, thumbUrl } from "@core/utils/course-utils";
import cn from "@core/utils/class-names";
import { BsExclamationCircle } from "react-icons/bs";
import { History } from "lucide-react";

type TFn = (key: string) => string | undefined;

// Helper to format date groups
function getRelativeDateLabel(dateString: string, t: TFn) {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return t("studentRatings.timeline-today") ?? "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return t("studentRatings.timeline-yesterday") ?? "Yesterday";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Map known API status labels for display while keeping logic on the raw value
function translateStatusLabel(label: string | undefined, t: TFn): string {
  if (!label) return "";
  const map: Record<string, string> = {
    Submitted: t("studentRatings.timeline-status-submitted") ?? "Submitted",
    "Admin Approved":
      t("studentRatings.timeline-status-admin-approved") ?? "Admin Approved",
    "Head Counselor Approved":
      t("studentRatings.timeline-status-head-counselor-approved") ??
      "Head Counselor Approved",
    "Admin Rejected":
      t("studentRatings.timeline-status-admin-rejected") ?? "Admin Rejected",
    "Head Counselor Rejected":
      t("studentRatings.timeline-status-head-counselor-rejected") ??
      "Head Counselor Rejected",
    Reopened: t("studentRatings.timeline-status-reopened") ?? "Reopened",
  };
  return map[label] ?? label;
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityThreadCard({ thread }: { thread: RatingProgress }) {
  const t = useTranslations();
  const { creator, status, comment, score, created_at } = thread;

  // Handle creator potentially being null or having different structure
  const username = fullName(creator);
  const userAvatar = thumbUrl(creator?.avatar, "avatar");
  const logMessage =
    status?.value === 1
      ? (t("studentRatings.activity-submitted") ?? "submitted")
      : status?.value === 2 || status?.value === 4
        ? (t("studentRatings.activity-approved") ?? "approved")
        : status?.value === 3 || status?.value === 5
          ? (t("studentRatings.activity-rejected") ?? "rejected")
          : (t("studentRatings.activity-reopened") ?? "reopened");
  const actionLabel =
    t("studentRatings.activity-action-label") ?? "the rating request.";

  function getStatusTextColor(value: number): string {
    if (value === 1 || value === 2 || value === 4) {
      return "text-green-600";
    }
    if (value === 3 || value === 5) {
      return "text-red-600";
    }
    return "text-amber-600";
  }

  return (
    <div className="relative flex items-start gap-x-2.5 pb-8 before:absolute before:start-[17px] before:top-0 before:z-0 before:h-full before:w-[1px] before:bg-gray-300 last:pb-0 last:before:hidden">
      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
        <Image
          className="aspect-square object-cover"
          src={userAvatar}
          alt={username}
          fill
          sizes="(max-width: 768px) 100vw"
        />
      </div>
      <div className="min-w-0 flex-1">
        <Text
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            getStatusTextColor(status?.value),
          )}
        >
          {status?.value === 1 || status?.value === 2 || status?.value === 4 ? (
            <PiCheckCircleDuotone className="size-3" />
          ) : status?.value === 3 || status?.value === 5 ? (
            <PiXCircleDuotone className="size-3" />
          ) : (
            <BsExclamationCircle className="size-3" />
          )}
          {translateStatusLabel(status?.label, t)}
        </Text>
        <Text className="text-sm text-gray-700">
          <Text
            as="span"
            className="mr-1 inline font-semibold capitalize text-gray-900"
          >
            {username}
          </Text>
          <Text as="span" className="mr-1 inline font-medium text-gray-900">
            {logMessage}
          </Text>
          <Text as="span" className="mr-1 inline font-normal text-gray-700">
            {actionLabel}
          </Text>
        </Text>

        <Text
          as="span"
          className="mt-2.5 inline-flex items-center gap-1 text-sm font-medium text-gray-700"
        >
          {t("studentRatings.score-label") ?? "Score:"}
          <span className="inline-flex h-5 w-fit min-w-5 items-center justify-center rounded-full bg-blue-100 px-1 align-middle text-[10px] font-bold text-blue-700">
            {score ?? 0}
          </span>
        </Text>

        {/* Comment and Score Display */}
        {comment && (
          <div className="relative mt-1 rounded-lg border border-gray-300 bg-gray-50/50 p-2">
            <Text className="w-full min-w-0 flex-1 whitespace-pre-line break-words text-sm text-gray-700">
              {comment ||
                (t("studentRatings.no-comment-provided") ??
                  "No comment provided")}
            </Text>
            <Text
              as="span"
              className="absolute -bottom-5 right-2 text-xs text-gray-500"
            >
              {formatTime(created_at)}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

export function ActivityThreads({
  title,
  threads,
}: {
  title: string;
  threads: RatingProgress[];
}) {
  return (
    <div className="relative mb-5 last:mb-0">
      <Text className="mb-3 inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </Text>
      <div>
        {threads.map((item) => (
          <ActivityThreadCard key={`progress-${item.id}`} thread={item} />
        ))}
      </div>
    </div>
  );
}

export default function ProgressTimeline({
  data = [],
  className,
}: {
  data?: RatingProgress[];
  className?: string;
}) {
  const t = useTranslations();
  // Group logic
  const groups: { title: string; threads: RatingProgress[] }[] = [];

  // Sort by date desc
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  sortedData.forEach((item) => {
    const title = getRelativeDateLabel(item.created_at, t);
    const existingGroup = groups.find((g) => g.title === title);
    if (existingGroup) {
      existingGroup.threads.push(item);
    } else {
      groups.push({ title, threads: [item] });
    }
  });

  const total = data.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-[#003b71]/15 bg-white shadow-[0_8px_18px_-16px_rgba(0,59,113,0.18)]",
        className,
      )}
    >
      <div className="border-b border-[#003b71]/10 bg-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003b71] text-white">
              <History className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <Text className="text-base font-semibold text-[#003b71]">
                {t("studentRatings.recent-activities") ?? "Recent Activities"}
              </Text>
              <Text className="mt-0.5 text-xs text-slate-500">
                {t("studentRatings.timeline-subtitle") ??
                  "Timeline of status updates for this request"}
              </Text>
            </div>
          </div>
          <Badge
            variant="flat"
            rounded="md"
            className="h-6 min-w-6 shrink-0 border border-[#003b71]/15 bg-[#003b71]/10 px-2 py-0.5 text-xs font-semibold text-[#003b71]"
          >
            {total}
          </Badge>
        </div>
      </div>

      <div className="max-h-[70dvh] overflow-y-auto p-5">
        {groups.length > 0 ? (
          groups.map((group, index) => (
            <ActivityThreads
              key={`group-${index}`}
              title={group.title}
              threads={group.threads}
            />
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-medium text-slate-500">
            {t("studentRatings.no-recent-activities") ??
              "No recent activities found."}
          </div>
        )}
      </div>
    </div>
  );
}
