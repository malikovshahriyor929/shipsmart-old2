"use client";

import cn from "../../utils/class-names";
import { Avatar, Badge, Button, Progressbar, Tooltip } from "rizzui";
import {
  PiArrowRightBold,
  PiVideoBold,
  PiVideoCameraFill,
} from "react-icons/pi";
import { PLACEHOLDER_GLOBAL, PLACEHOLDER_THUMB } from "@core/config/constants";
import { fullName, thumbUrl } from "@core/utils/course-utils";
import { Course, CourseInstructor, User } from "@core/types";
import SmartImage from "@core/ui/smart-image";
import EnhancedAvatarGroup from "../courses/enhanced-avatar-group";
import { t } from "i18next";
import { getStudentCourseProgressUI } from "@core/utils/course-progress-ui";

interface CourseProps {
  role: number; // 5 = student, 3 = advisor
  course: Course;
  className?: string;
  viewCourseContent?: (id: string | number) => void;
  viewCourseDetails?: (id: string | number) => void;
  canToggleCompletion?: boolean;
  isCompleted?: boolean;
  isCompletionLoading?: boolean;
  onToggleCompletion?: (course: Course, nextCompleted: boolean) => void;
  useAdminCompletionLayout?: boolean;
}

function getProgressColorUI(
  color: { value?: string | number | null; label?: string | null } | null | undefined,
  translate: (key: string, options?: Record<string, unknown>) => string
) {
  const normalizedLabel = color?.label?.toLowerCase();
  const colorValue = Number(color?.value);

  if (colorValue === 1 || normalizedLabel === "red") {
    return {
      tone: "danger" as const,
      dotClassName: "bg-red-600",
      textClassName: "text-red-600",
      label: translate("courses.studentProgress-red-status", {
        defaultValue: "Very low performance",
      }),
    };
  }

  if (colorValue === 2 || normalizedLabel === "yellow") {
    return {
      tone: "warning" as const,
      dotClassName: "bg-amber-500",
      textClassName: "text-amber-600",
      label: translate("courses.studentProgress-yellow-status", {
        defaultValue: "Needs attention",
      }),
    };
  }

  if (colorValue === 3 || normalizedLabel === "green") {
    return {
      tone: "success" as const,
      dotClassName: "bg-green",
      textClassName: "text-green",
      label: translate("courses.studentProgress-green-status", {
        defaultValue: "On track",
      }),
    };
  }

  return null;
}

export function CourseCard({
  role,
  course,
  className,
  viewCourseContent,
  viewCourseDetails,
  canToggleCompletion = false,
  isCompleted,
  isCompletionLoading = false,
  onToggleCompletion,
  useAdminCompletionLayout = false,
}: CourseProps) {
  const isStudent = role === 5;
  const showAdminCompletionAction = canToggleCompletion && !isStudent;
  const subjectLabel = course.subject_id?.label || course.subject?.label || "";
  const totalPublishedLessons =
    typeof course.lesson_counts === "number"
      ? `${course.lesson_counts} ${t("courses.card-lessons")}`
      : t("courses.card-fallback-alt");
  const hasEnrolled = course?.progress?.status?.value === 1 && isStudent;
  // const creator = course?.created_by || null;
  const instructors = Array.isArray(course?.instructors)
    ? (course.instructors as CourseInstructor[])
    : [];
  const completion_percent = course?.progress?.completion_percent || 0;
  const completed =
    isCompleted ??
    Boolean(course?.progress?.completed_at || completion_percent === 100);
  const completionActionLabel = completed
    ? t("courses.actions-mark-as-uncompleted", {
        defaultValue: "Mark as uncompleted",
      })
    : t("courses.mark-as-completed", {
        defaultValue: "Mark as completed",
      });

  const behindBy =
    typeof course?.progress?.behind_by === "number"
      ? course.progress.behind_by
      : 15; //static fallback for testing

  const progressUI = getStudentCourseProgressUI({
    isStudent,
    isEnrolled: hasEnrolled,
    completionPercent: completion_percent,
    behindBy,
    t,
  });
  const apiProgressColorUI = getProgressColorUI(course?.progress?.color, t);
  const studentProgressBadge = apiProgressColorUI
    ? {
        tone: apiProgressColorUI.tone,
        dotClassName: apiProgressColorUI.dotClassName,
        textClassName: apiProgressColorUI.textClassName,
        label: apiProgressColorUI.label,
      }
    : progressUI;

  // const people: CourseInstructor[] =
  //   instructors.length > 0
  //     ? instructors
  //     : creator
  //       ? [
  //           {
  //             user: creator as User,
  //             extra_data: { experience: null, specialization: null },
  //           },
  //         ]
  //       : [];
  const statusLabel = hasEnrolled
    ? completion_percent === 100
      ? t("courses.studentProgress-completed")
      : completion_percent > 0
        ? t("courses.studentProgress-in-progress")
        : t("courses.card-enrolled")
    : t("courses.not-enrolled");

  return (
    <div
      className={cn(
        "group overflow-hidden bg-white p-2 rounded-3xl border border-gray-200 transition-all duration-20 hover:border-mainBlue/20 hover:shadow-md dark:border-gray-300 dark:bg-gray-200",
        className,
      )}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
        <SmartImage
          fallbackSrc={PLACEHOLDER_GLOBAL}
          alt={course.name || t("courses.card-fallback-alt")}
          src={thumbUrl(course.thumbnail)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>
        {instructors.length !== 0 ? (
          <div className="absolute left-3 top-3 flex items-center justify-start z-10">
            <EnhancedAvatarGroup<CourseInstructor>
              items={instructors}
              maxDisplay={4}
              size="sm"
              spacing="-space-x-2"
              showCount={false}
              onlyAvatars={true}
              getAvatarName={(it) => fullName(it?.user)}
              getAvatarSrc={(it) => thumbUrl(it?.user?.avatar, "avatar")}
              getKey={(it, idx) => it?.user?.id ?? idx}
            />
          </div>
        ) : (
          <Avatar
            size="sm"
            name={fullName(course?.created_by)}
            src={thumbUrl(course?.created_by?.avatar, "avatar")}
            className="absolute left-3 top-3 z-10"
          />
        )}
        <Badge
          variant="flat"
          className="absolute right-3 top-3 bg-black/30 backdrop-blur-sm text-white dark:bg-gray-100/50 z-10"
          rounded="lg"
        >
          {subjectLabel}
        </Badge>
      </div>

      <div className="p-2 pt-3">
        <h3 className="mb-1.5 line-clamp-2 text-base font-medium text-primary dark:text-gray-700">
          {course.name}
        </h3>

        <div
          className={cn(
            "mt-2 border-gray-200 dark:border-gray-700",
            useAdminCompletionLayout
              ? "flex flex-col gap-3"
              : "flex items-center gap-3 justify-between"
          )}
        >
          {isStudent ? (
            <div className="flex flex-1 flex-col gap-1.5">
              {progressUI.showProgressbar && (
                <Progressbar
                  value={progressUI.progressValue}
                  color={studentProgressBadge.tone}
                  size="sm"
                  labelClassName="hidden"
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-medium">
                  <Badge
                    size="md"
                    renderAsDot
                    color={studentProgressBadge.tone}
                    className={studentProgressBadge.dotClassName}
                  />
                  <span className={studentProgressBadge.textClassName}>
                    {studentProgressBadge.label}
                  </span>
                </div>

                {progressUI.showPercent && (
                  <div className="text-xs text-gray-600 dark:text-gray-800">
                    {`${progressUI.progressValue}%`}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                <PiVideoCameraFill className="h-4 w-4" />
                {totalPublishedLessons}
              </div>
              {showAdminCompletionAction && (
                <Button
                  size="sm"
                  rounded="lg"
                  variant={completed ? "solid" : "outline"}
                  color={completed ? "primary" : "secondary"}
                  isLoading={isCompletionLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onToggleCompletion?.(course, !completed);
                  }}
                  className={cn(
                    "shrink-0",
                    completed
                      ? "bg-green text-white hover:bg-green/90 dark:bg-green/80 dark:hover:bg-green/70"
                      : "border-slate-300 text-slate-700 hover:border-green hover:text-green dark:border-gray-500 dark:text-gray-200"
                  )}
                >
                  {completionActionLabel}
                </Button>
              )}
            </div>
          )}

          <div
            className={cn(
              useAdminCompletionLayout
                ? "flex flex-col gap-2 sm:flex-row"
                : "contents"
            )}
          >

            {hasEnrolled ? (
              <Button
              size="sm"
              rounded="lg"
              variant="flat"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                viewCourseContent?.(course.id);
              }}
              className={cn(
                "flex items-center justify-center gap-1 hover:bg-green hover:text-white dark:text-white dark:bg-green/80 dark:hover:bg-green/50",
                useAdminCompletionLayout ? "w-full" : "",
                canToggleCompletion && isStudent && useAdminCompletionLayout
                ? "sm:flex-1"
                : ""
              )}
              >
                <span>{totalPublishedLessons}</span>
                <PiArrowRightBold className="font-extrabold h-4 w-4" />
              </Button>
            ) : (
              <Button
              size="sm"
              rounded="lg"
              variant="flat"
              className={cn(
                "flex items-center justify-center gap-1 hover:text-white dark:bg-gray-400 dark:hover:bg-gray-500 dark:text-white",
                useAdminCompletionLayout ? "w-full" : "",
                canToggleCompletion && isStudent && useAdminCompletionLayout
                ? "sm:flex-1"
                : ""
              )}
              >
                <span>{t("courses.card-view-details")}</span>
                <PiArrowRightBold className="font-extrabold h-4 w-4" />
              </Button>
            )}
          </div>
            {canToggleCompletion && isStudent && (
              <Button
                size="sm"
                rounded="lg"
                variant={completed ? "solid" : "outline"}
                color={completed ? "primary" : "secondary"}
                isLoading={isCompletionLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggleCompletion?.(course, !completed);
                }}
                className={cn(
                  useAdminCompletionLayout ? "w-full sm:flex-1" : "shrink-0",
                  completed
                    ? "bg-green text-white hover:bg-green/90 dark:bg-green/80 dark:hover:bg-green/70"
                    : "border-slate-300 text-slate-700 hover:border-green hover:text-green dark:border-gray-500 dark:text-gray-200",
                    "py-1.5"
                )}
              >
                {completionActionLabel}
              </Button>
            )}
        </div>
      </div>
    </div>
  );
}
