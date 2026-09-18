"use client";

import { useEffect, useMemo, useState } from "react";
import Card from "@core/components/cards/card";
import { Badge, Tooltip } from "rizzui";
import {
  PiClockAfternoon,
  PiClockAfternoonFill,
  PiClockClockwise,
  PiClockCountdownBold,
  PiLockBold,
  PiLockDuotone,
  PiLockKey,
  PiLockKeyFill,
  PiPlayCircleDuotone,
  PiStarFill,
} from "react-icons/pi";
import cn from "@core/utils/class-names";
import {
  isComingSoon as isComingSoonLesson,
  thumbUrl,
} from "@core/utils/course-utils";
import { PLACEHOLDER_GLOBAL, PLACEHOLDER_THUMB } from "@core/config/constants";
import CircleProgressBar from "@core/components/charts/circle-progressbar";
import toast from "react-hot-toast";
import type { ApiThumb, Lesson, Id } from "@core/types";
import { getTimeDistance } from "@core/utils/get-formatted-date";
import { parseDDMMYYYY_HHMM } from "@core/utils/time-since";
import SmartImage from "@core/ui/smart-image";
import { t } from "i18next";
type LessonCardProps = {
  role: number; // 5 = student
  courseId: Id;
  lesson: Lesson;
  courseThumb?: ApiThumb | null | undefined;
  onNavigateToDetails: (args: { courseId: Id; lessonSlug: string }) => void;
  onGoToPractice?: (args: { courseId: Id; lessonSlug: string }) => void;
};

function secondsUntil(ts: number | null): number {
  if (ts == null) return 0;
  const diffMs = ts - Date.now();
  return Math.max(0, Math.floor(diffMs / 1000));
}
function fmtCountdown(secs: number) {
  const d = Math.floor(secs / 86400);
  const h = Math.floor((secs % 86400) / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function LessonCard({
  role,
  courseId,
  lesson,
  courseThumb,
  onNavigateToDetails,
  onGoToPractice,

}: LessonCardProps) {
  const isStudent = role === 5;

  const startsAtTs = useMemo(
    () => parseDDMMYYYY_HHMM(lesson.starts_at || ""),
    [lesson.starts_at]
  );
  const [countdown, setCountdown] = useState<number>(() =>
    secondsUntil(startsAtTs)
  );
  const isComingSoon = isComingSoonLesson(lesson);

  const isPublished = (lesson.status?.value ?? 0) === 1;

  // progress
  const progressStatus = lesson.progress?.status?.value ?? null; // 1=LOCKED, 2=IN_PROGRESS, 3=COMPLETED
  const progressPercent = Math.max(
    0,
    Math.min(100, lesson.progress?.completion_percent ?? 0)
  );

  // lock (student)
  const isLockedForStudent = isStudent && progressStatus === 1;

  // access
  const canOpenForStudent = isPublished && !isComingSoon && !isLockedForStudent;
  const canOpenForStaff = isPublished && !isComingSoon;
  const canOpen = isStudent ? canOpenForStudent : canOpenForStaff;
  const has_practice_test = lesson.has_practice_test;
  // console.log(isStudent, has_practice_test, lesson.slug);
  // console.log({ has_practice_test });
  // practice rule (student only)
  const canPractice = isStudent && has_practice_test;
  const rating =
    lesson?.progress?.rating?.toFixed(1) ||
    t("courses.lesson-card-rating-not-rated");

  useEffect(() => {
    if (!isComingSoon) return;
    const id = window.setInterval(
      () => setCountdown(secondsUntil(startsAtTs)),
      1000
    );
    return () => window.clearInterval(id);
  }, [isComingSoon, startsAtTs]);

  const onCardClick = () => {
    if (!canOpen && role !== 4) {
      if (isComingSoon)
        toast(
          <span className="flex items-center gap-2 text-primary">
            <PiClockAfternoonFill className="h-5 w-5" />
            {t("courses.lesson-toast-coming-soon") ?? "This lesson is coming soon."}
          </span>
        );
      else if (!isPublished)
        toast(
          <span className="flex items-center gap-2 text-amber-500">
            <PiClockAfternoonFill className="h-5 w-5" />
            {t("courses.lesson-toast-not-published") ?? "This lesson is not published yet."}
          </span>
        );
      else if (isLockedForStudent)
        toast(
          <span className="flex items-center gap-2 text-red">
            <PiLockKeyFill className="h-5 w-5 " />
            {t("courses.lesson-toast-locked") ?? "Complete the previous lesson to unlock!"}
          </span>
        );
      return;
    }
    onNavigateToDetails?.({ courseId, lessonSlug: lesson.slug ?? "" });
  };

  // const onPracticeClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (canPractice) {
  //     onGoToPractice?.({ courseId, lessonId: lesson.id });
  //   } else {
  //     toast.error("Complete the lesson to see practice tests.");
  //   }
  // };

  return (
    <Card
      className={ cn(
        "group md:rounded-3xl relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        canOpen ? "cursor-pointer" : "cursor-info",
        isComingSoon && "bg-mainBlue/10 backdrop-blur-md"
      ) }
      onClick={ onCardClick }
    >
      {/* media */ }
      <div className="relative h-48 flex-1 @5xl:h-52 bg-gray-100 rounded-2xl overflow-hidden m-2">
        {/* <img
          src={mediaUrl}
          alt={String(lesson.title || "Lesson")}
          className={cn(
            "h-full w-full object-cover transition",
            isComingSoon && "scale-105 blur-[3px] brightness-90"
          )}
        /> */}

        <SmartImage
          src={ thumbUrl(lesson.thumbnail) }
          alt={ String(lesson.title || t("courses.lesson-card-title-fallback")) }
          imgClassName={ cn(
            "h-full w-full object-cover transition",
            isComingSoon && "scale-[1.03] blur-[3px] brightness-90"
          ) }
          fallbackSrc={ PLACEHOLDER_GLOBAL }
        />

        { isComingSoon ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-mainBlue/30 backdrop-blur-[6px]">
            <span className="inline-flex items-center gap-2 rounded-xl bg-white/30 px-3 py-1 text-base font-semibold text-white backdrop-blur">
              <PiClockCountdownBold className="h-6 w-6" />
              { t("courses.lesson-card-coming-soon") }
            </span>
            <div className="mt-2 text-xs font-medium text-white/90">
              { fmtCountdown(countdown) } { t("courses.lesson-card-countdown") }
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              { isLockedForStudent ? (
                <PiLockDuotone className="h-16 w-16 text-white opacity-80 transition-transform group-hover:scale-[1.03]" />
              ) : (
                <PiPlayCircleDuotone className="h-16 w-16 text-white opacity-80 transition-transform group-hover:scale-[1.03]" />
              ) }
            </div>
            <Badge
              variant="flat"
              size="sm"
              className="absolute top-2 left-3 bg-black/30 text-white backdrop-blur-sm font-semibold ring-1 ring-black/30"
            >
              <PiClockCountdownBold className="inline-block size-4 mr-1" />
              { typeof lesson.duration === "number"
                ? `${lesson.duration} m`
                : lesson.duration || t("commons.emDash") }
            </Badge>
          </>
        ) }

        { !isComingSoon && !isPublished && (
          <div className="absolute left-3 top-3 rounded bg-amber-600 px-2 py-1 text-xs font-semibold text-white">
            { t("courses.lesson-card-not-published") }
          </div>
        ) }

        {/* lock chip — only for student */ }
        { isStudent && !isComingSoon && isLockedForStudent && (
          <Tooltip
            size="sm"
            content={ t("courses.lesson-card-locked-tooltip") }
            placement="top"
          >
            <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs font-semibold text-white">
              <PiLockKey className="h-4 w-4" />
              { t("courses.lesson-card-locked") }
            </div>
          </Tooltip>
        ) }
      </div>

      {/* body */ }
      <div className="flex flex-1 flex-col gap-2 px-4 pb-3">
        {/* Title — one row only */ }
        <h3 className="mb-1 line-clamp-1 text-base font-semibold text-mainBlue group-hover:text-mainBlue dark:group-hover:text-white">
          { lesson.title || t("courses.lesson-card-title-fallback") }
        </h3>

        {/* Small info chips (duration, attachments) */ }
        {/* <div className="flex items-center gap-2">
          <Badge variant="flat" size="sm" className="bg-mainBlue/90 text-white">
            {typeof lesson.duration === "number"
              ? `${lesson.duration} m`
              : lesson.duration || "—"}
          </Badge>
          {!!lesson.attachments?.length && (
            <Badge
              rounded="md"
              size="sm"
              variant="outline"
              className="border-mainBlue/50 dark:border-gray-300"
            >
              {lesson.attachments.length} files
            </Badge>
          )}
        </div> */}

        {/* Bottom row: left = time + practice, right = progress ring */ }
        <div className=" flex items-center justify-between">
          {/* Left side */ }
          <div className="flex items-center gap-3">
            {/* Time that lesson started */ }
            {/* <div className="flex items-center gap-1 text-xs text-mainBlue dark:text-gray-700">
              <PiClockClockwise className="h-4 w-4" />
              <span>
                {timeDistance?.isPast
                  ? `Started ${timeDistance?.value} ago`
                  : `Starts in ${timeDistance?.value}`}
              </span>
            </div> */}

            { !isComingSoon && (
              <Badge
                size="sm"
                variant="flat"
                className="bg-amber-50 text-amber-700 ring-1 ring-amber-100"
              >
                <span className="inline-flex items-center gap-1">
                  <PiStarFill className="h-3 w-3" />
                  { rating }
                </span>
              </Badge>
            ) }
          </div>

          {/* Right side — progress ring */ }
          { !isComingSoon && isStudent && (
            <CircleProgressBar
              size={ 40 }
              strokeWidth={ 4 }
              stroke="#e0e0e0"
              percentage={ progressPercent }
              label={ `${progressPercent}%` }
              showLabel={ true }
              labelClassName="text-[10px] font-semibold text-gray-700"
              progressColor={
                progressPercent >= 100
                  ? "#0DA000"
                  : progressPercent > 20
                    ? "#EE5D26"
                    : "#FF0000"
              }
            />
          ) }
        </div>
      </div>
    </Card>
  );
}
