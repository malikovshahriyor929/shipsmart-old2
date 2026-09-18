import { memo, useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Badge, Loader, Text, Title, Tooltip } from "rizzui";
import {
  PiClock,
  PiClockAfternoonFill,
  PiPlayCircleBold,
  PiStarFill,
} from "react-icons/pi";
import toast from "react-hot-toast";

import cn from "@core/utils/class-names";
import type { Lesson } from "@core/types";
import SmartImage from "@core/ui/smart-image";
import {
  thumbUrl,
  isComingSoon as isComingSoonUtil,
} from "@core/utils/course-utils";
import { PLACEHOLDER_GLOBAL } from "@core/config/constants";
import { parseDDMMYYYY_HHMM } from "@core/utils/time-since";
import { t } from "i18next";

import { useLessonLearning } from "@core/providers/lesson-learning-provider";

const secsUntil = (l: Lesson) => {
  const tt = parseDDMMYYYY_HHMM(l.starts_at || "");
  if (tt == null) return 0;
  return Math.max(0, Math.floor((tt - Date.now()) / 1000));
};

function fmtCountdown(total: number) {
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const durationText = (d?: number | null) =>
  typeof d === "number"
    ? d >= 60
      ? `${Math.floor(d / 60)}h ${d % 60}m`
      : `${d}m`
    : t("commons.emDash");

type ItemProps = {
  lesson: Lesson;
  index: number;
  isActive: boolean;
  countdownSecs?: number;
  onSelect: (lesson: Lesson) => void | Promise<void>;
};

const SidebarLessonItem = memo(function SidebarLessonItem({
  lesson,
  index,
  isActive,
  countdownSecs = 0,
  onSelect,
}: ItemProps) {
  const comingSoon = isComingSoonUtil(lesson);

  const handleClick = () => {
    if (comingSoon) {
      return toast(
        <span className="flex items-center gap-2 text-amber-500">
          <PiClockAfternoonFill className="h-5 w-5" />
          {t("courses.lesson-toast-coming-soon")}
        </span>
      );
    }
    onSelect(lesson);
  };

  const container = cn(
    "group relative cursor-pointer flex items-stretch rounded-lg border p-1 transition-all",
    isActive
      ? "border-mainBlue/50 bg-mainBlue text-white shadow-md shadow-mainBlue/20"
      : comingSoon
        ? "border-amber-200 bg-amber-50/40 dark:bg-amber-50/10 hover:bg-amber-50/60 dark:hover:bg-amber-50/30"
        : "border-gray-200 bg-white hover:bg-gray-50  dark:bg-gray-100 dark:hover:bg-gray-50"
  );

  const titleCls = cn(
    "line-clamp-2 text-sm font-semibold",
    isActive ? "text-white" : "text-gray-800"
  );

  const metaCls = cn(
    "mt-1 flex items-center gap-3 text-xs",
    isActive ? "text-white/90" : "text-gray-600"
  );

  return (
    <div className={container} onClick={handleClick}>
      <div className="flex flex-1 items-start">
        <SmartImage
          src={thumbUrl(lesson.thumbnail)}
          alt={
            lesson.title ||
            `${t("courses.lesson-card-title-fallback")} ${index + 1}`
          }
          imgClassName={cn(
            "rounded-md object-cover object-center",
            comingSoon && "grayscale"
          )}
          className="mr-2 aspect-video h-20 w-auto flex-shrink-0 rounded-md"
          fallbackSrc={PLACEHOLDER_GLOBAL}
        />

        <div className="flex h-full min-h-0 flex-1 flex-col items-start py-1">
          <Title as="h3" className={titleCls}>
            {lesson.title ||
              `${t("courses.lesson-card-title-fallback")} ${index + 1}`}
          </Title>

          <div className={metaCls}>
            {comingSoon ? (
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 ring-1 ring-amber-100">
                <PiClock className="h-3 w-3" />
                {fmtCountdown(countdownSecs)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <PiPlayCircleBold className="h-3 w-3" />
                {durationText(lesson.duration)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ml-3 flex items-center px-1">
        {comingSoon ? (
          <Tooltip
            size="sm"
            color="warning"
            content={t("courses.sidebar-starts-soon") ?? "Starts soon"}
          >
            <div className="grid size-10 place-items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <PiClock className="h-5 w-5" />
            </div>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
});

export default function LessonSidebar({
  onClose,
}: {
  onClose?: () => void;
  course?: any;
  lessons?: any;
  activeLessonId?: any;
  activeLessonDetails?: any;
  onSelectLesson?: any;
  onLoadMore?: any;
  hasMore?: any;
  loadingMore?: any;
  activeLessonSlug?: any;
}) {
  const {
    course,
    headerLesson,
    lessons,
    activeLessonId,
    onSelectLesson,
    onLoadMore,
    hasMore,
    loadingMore,
  } = useLessonLearning();

  // ===== Coming soon countdowns =====
  const [cd, setCd] = useState<Record<string, number>>({});
  const intervalRef = useRef<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Map to store refs for each lesson item for auto-scrolling
  const lessonRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  // Callback to register lesson item refs
  const setLessonRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      lessonRefsMap.current.set(id, el);
    } else {
      lessonRefsMap.current.delete(id);
    }
  }, []);

  // Auto-scroll to active lesson when it changes
  useEffect(() => {
    if (!activeLessonId) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const activeEl = lessonRefsMap.current.get(String(activeLessonId));
      if (activeEl && scrollRef.current) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [activeLessonId]);

  const soonIds = useMemo(
    () => (lessons || []).filter(isComingSoonUtil).map((l) => String(l.id)),
    [lessons]
  );

  useEffect(() => {
    if (!soonIds.length) return;

    const tick = () =>
      setCd((prev) => {
        const next: Record<string, number> = { ...prev };
        for (const id of soonIds) {
          const l = (lessons || []).find((x) => String(x.id) === id);
          next[id] = l ? secsUntil(l) : 0;
        }
        return next;
      });

    tick();
    intervalRef.current = window.setInterval(tick, 1000);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [soonIds, lessons]);

  // ===== Scroll pagination (always for advisor/teacher apps) =====
  useEffect(() => {
    const root = scrollRef.current;
    const target = bottomRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          onLoadMore();
        }
      },
      { root, threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, onLoadMore]);

  const header = headerLesson ?? null;
  const headerComingSoon = header ? isComingSoonUtil(header) : false;
  const rating = header?.progress?.rating;

  const handleSelect = useCallback(
    async (l: Lesson) => {
      await onSelectLesson(l);
      onClose?.();
    },
    [onSelectLesson, onClose]
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden lg:border-l lg:border-gray-200 lg:pl-1">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white pb-3 pt-0 dark:bg-transparent lg:px-3 lg:pe-0">
        <Title as="h5" className="text-mainBlue">
          {header?.title || course?.name || t("commons.emDash")}
        </Title>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {rating !== null && rating !== undefined && (
            <Badge
              size="sm"
              variant="flat"
              className="bg-amber-50 text-amber-700 ring-1 ring-amber-100"
            >
              <span className="inline-flex items-center gap-1">
                <PiStarFill className="h-3 w-3" />
                {rating?.toFixed?.(1) ??
                  t("courses.lesson-card-rating-not-rated")}
              </span>
            </Badge>
          )}

          <Badge size="sm" variant="flat" className="bg-green text-white">
            {t("courses.sidebar-duration-label")}{" "}
            {durationText(header?.duration ?? null)}
          </Badge>

          {headerComingSoon && (
            <Badge size="sm" className="bg-amber-600 text-white">
              {t("courses.sidebar-starts-soon")}
            </Badge>
          )}
        </div>

        {header?.description && (
          <Text className="mt-2 line-clamp-3 text-xs text-gray-600">
            {header.description}
          </Text>
        )}
      </div>

      {/* List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pt-5 lg:p-3 lg:pe-0 lg:pb-0"
      >
        {(lessons || []).map((lesson, idx) => (
          <div
            className="mb-3"
            key={String(lesson.slug || lesson.id)}
            ref={(el) => setLessonRef(String(lesson.id), el)}
          >
            <SidebarLessonItem
              lesson={lesson}
              index={idx}
              isActive={String(lesson.id) === String(activeLessonId)}
              countdownSecs={cd[String(lesson.id)] ?? 0}
              onSelect={handleSelect}
            />
          </div>
        ))}

        <div ref={bottomRef} className="h-1" />

        {loadingMore && (
          <div className="py-3 text-center text-xs text-gray-500">
            <Loader variant="threeDot" size="sm" />
          </div>
        )}

        {!lessons?.length && (
          <div className="rounded-md bg-gray-50 p-4 text-center text-xs text-gray-700">
            {t("courses.sidebar-no-lessons")}
          </div>
        )}
      </div>
    </div>
  );
}
