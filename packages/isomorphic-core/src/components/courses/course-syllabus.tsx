"use client";

import { useRef, useState } from "react";
import { Badge, Button, Text } from "rizzui";
import {
  PiBookBookmarkDuotone,
  PiCaretRightBold,
  PiPaperclip,
  PiVideoBold,
} from "react-icons/pi";
import Card from "@core/components/cards/card";
import Section from "@core/ui/section";
import cn from "@core/utils/class-names";
import { formatDuration, isVideoExt } from "@core/utils/course-utils";
import { t } from "i18next";

export default function CourseSyllabus({
  course,
  role,
  handleLessonLearning,
}: {
  course: any;
  role?: number;
  handleLessonLearning?: (courseId: number, lessonId: number) => void;
}) {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lessons: any[] = Array.isArray(course?.lessons) ? course.lessons : [];
  const hasSyllabus = lessons.length > 0;
  const isStudent = role == 5;
  const hasEnrolled = isStudent && course?.progress?.status?.value == 1;

  const toggleDayExpansion = (day: number) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  return (
    <Section
      title={t("courses.syllabus-title")}
      icon={<PiBookBookmarkDuotone className="h-5 w-5" />}
      additional={
        <Text className="text-sm text-mainBlue dark:text-gray-500">
          {hasSyllabus
            ? `${lessons.length} ${t("courses.syllabus-summary-lessons")}`
            : `${course?.lesson_counts ?? 0} ${t("courses.syllabus-summary-lessons")}`}
        </Text>
      }
      className="mb-0"
    >
      <div className="space-y-4 overflow-y-auto" ref={containerRef}>
        {!hasSyllabus ? (
          <div className="rounded-md bg-gray-50 p-6 text-center text-sm text-gray-600 dark:bg-gray-100 dark:text-gray-700">
            {t("courses.syllabus-empty")}
          </div>
        ) : (
          lessons.map((l, idx) => {
            const order = idx + 1;
            const isExpanded = expandedDay === order;

            return (
              <div key={l?.id ?? order} className="overflow-clip rounded-lg">
                <div
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-200 lg:p-4",
                    isExpanded && "bg-gray-50"
                  )}
                  onClick={() => toggleDayExpansion(order)}
                >
                  <div className="flex items-center gap-3">
                    {/* <Text className="text-sm font-medium text-mainBlue dark:text-gray-600">
                        Lesson { order }
                      </Text> */}
                    <Badge
                      variant="flat"
                      rounded="md"
                      className="bg-mainBlue/10 text-mainBlue dark:bg-gray-100 dark:text-white"
                    >
                      {order}
                    </Badge>
                    <Text className="max-w-[35em] truncate font-medium text-mainBlue dark:text-gray-600 max-[1366px]:w-[30em] max-[650px]:w-[20em] max-[505px]:w-[12em] max-[388px]:w-[10em]">
                      {l?.title}
                    </Text>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-mainBlue dark:text-gray-500">
                    {/* <span className="capitalize">{ type }</span> */}
                    <span>{formatDuration(l?.duration)}</span>
                    <PiCaretRightBold
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isExpanded ? "rotate-90" : ""
                      )}
                    />
                  </div>
                </div>

                <div
                  className="overflow-hidden border-t border-mainBlue/20 bg-gray-50 px-4 transition-all duration-300 ease-in-out dark:border-gray-200"
                  style={{
                    maxHeight: isExpanded ? 1000 : 0,
                    paddingBottom: isExpanded ? 16 : 0,
                    paddingTop: isExpanded ? 16 : 0,
                  }}
                >
                  {l?.description && (
                    <div className="mb-3">
                      <Text className="mb-1 text-sm font-bold text-mainBlue dark:text-gray-600">
                        {t("courses.syllabus-description")}
                      </Text>
                      <Text className="text-sm text-gray-700 dark:text-gray-600">
                        {l.description}
                      </Text>
                    </div>
                  )}

                  {/* If your API later adds lesson.content or attachments, they'll render below */}
                  {/* {l?.content && ( */}
                  {
                    <div className="mb-3">
                      {isStudent ? (
                        hasEnrolled ? (
                          <Button
                            onClick={() => {
                              handleLessonLearning?.(course.id, l.id);
                            }}
                            size="sm"
                            variant="flat"
                            className="flex items-center justify-center bg-mainBlue/10 text-mainBlue hover:bg-mainBlue/15 border-mainBlue/5 border dark:bg-gray-200 dark:hover:bg-gray-200/80 dark:text-white"
                          >
                            <PiVideoBold className="me-2 size-4 shrink-0" />
                            watch video
                          </Button>
                        ) : (
                          <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Enroll first to watch video lessons
                          </Text>
                        )
                      ) : (
                        <Button
                          onClick={() => {
                            handleLessonLearning?.(course.id, l.id);
                          }}
                          size="sm"
                          variant="flat"
                          className="flex items-center justify-center bg-mainBlue/10 text-mainBlue hover:bg-mainBlue/15 border-mainBlue/5 border dark:bg-gray-200 dark:hover:bg-gray-200/80 dark:text-white"
                        >
                          <PiVideoBold className="me-2 size-4 shrink-0" />
                          watch video
                        </Button>
                      )}
                    </div>
                  }
                  {/* )} */}

                  {/* {Array.isArray(l?.attachments) &&
                      l.attachments.length > 0 && (
                        <div className="mt-2">
                          <Text className="mb-1 text-sm font-bold text-mainBlue dark:text-gray-600">
                            Attachments
                          </Text>
                          <ul className="space-y-1 text-sm">
                            {l.attachments.map((a: any, i: number) => (
                              <li key={i} className="flex items-center gap-2">
                                <PiPaperclip className="h-4 w-4 text-gray-500" />
                                <a
                                  href={a?.attachment?.url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {a?.attachment?.file_name || 'Attachment'}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )} */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Section>
  );
}
