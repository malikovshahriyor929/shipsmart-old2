"use client";

import { Button, Tooltip } from "rizzui";
import {
  PiBooks,
  PiFiles,
  PiUsersThree,
  PiClipboardText,
  PiStar,
  PiExam,
  PiCheckCircleFill,
  PiWarningCircleFill,
  PiChartBar,
  PiLineSegment,
  PiChartLineUp,
} from "react-icons/pi";
import { t } from "i18next";
import cn from "@core/utils/class-names";

export type TabsOptions =
  | "overview"
  | "files"
  | "notes"
  | "reviews"
  | "practice"
  | "statistics";

interface LessonNavTabsProps {
  counts?: Record<string, number>;
  activeTab: string;
  onTabChange: (tab: any) => void;
  tabs: string[];
  loading?: boolean;
  isPassed?: boolean;
}

const TAB_CONFIG: Record<string, { label: string; icon: React.ReactNode }> = {
  overview: {
    label: "courses.lesson-tabs.overview",
    icon: <PiBooks className="mr-2 h-5 w-5" />,
  },
  files: {
    label: "courses.lesson-tabs.files",
    icon: <PiFiles className="mr-2 h-5 w-5" />,
  },
  notes: {
    label: "courses.lesson-tabs.notes",
    icon: <PiClipboardText className="mr-2 h-5 w-5" />,
  },
  reviews: {
    label: "courses.lesson-tabs.reviews",
    icon: <PiStar className="mr-2 h-5 w-5" />,
  },
  practice: {
    label: "courses.lesson-tabs.practice",
    icon: <PiExam className="mr-2 h-5 w-5" />,
  },
  students: {
    label: "courses.lesson-tabs.students",
    icon: <PiUsersThree className="mr-2 h-5 w-5" />,
  },
  statistics: {
    label: "courses.lesson-tabs.statistics",
    icon: <PiChartLineUp className="mr-2 h-5 w-5" />,
  },
};

function AttentionBadge({
  tone = "red",
  children,
  size = "size-5",
}: {
  tone?: "red" | "amber";
  children: React.ReactNode;
  size?: string;
}) {
  const ringStrong = tone === "red" ? "bg-red-600/55" : "bg-amber-600/55";
  const ringSoft = tone === "red" ? "bg-red-500/35" : "bg-amber-500/35";

  return (
    <div
      className={`relative grid ${size} place-items-center overflow-visible`}
    >
      <span
        className={`absolute inset-0 rounded-full ${ringStrong} animate-badge-pulse`}
      />
      <span
        className={`absolute inset-0 rounded-full ${ringSoft} animate-badge-pulse`}
      />
      <div
        className={`relative z-10 grid place-items-center rounded-full border border-white bg-white`}
      >
        {children}
      </div>
    </div>
  );
}

export default function LessonNavTabs({
  counts = {},
  activeTab,
  onTabChange,
  tabs,
  loading,
  isPassed,
}: LessonNavTabsProps) {
  return (
    <div className="no-scrollbar flex w-full flex-1 flex-wrap items-center justify-start gap-2">
      {tabs.map((tabId) => {
        const config = TAB_CONFIG[tabId];
        if (!config) return null;

        const isActive = activeTab === tabId;
        const count = counts[tabId] ?? 0;
        const showCount = count > 0;
        const isPractice = tabId === "practice";

        return (
          <button
            key={tabId}
            type="button"
            className={cn(
              "relative flex items-center whitespace-nowrap text-xs font-medium rounded-md px-4 py-2 transition-all duration-200 ease-in-out",
              isActive
                ? "bg-mainBlue text-white hover:text-white"
                : "bg-mainBlue/10 text-primary/90 hover:text-mainBlue hover:ring-1 hover:ring-mainBlue/20 dark:bg-gray-100 dark:text-white dark:hover:text-gray-800 dark:hover:ring-gray-200"
            )}
            onClick={() => onTabChange(tabId)}
          >
            {config.icon}
            {t(config.label)}

            {showCount && !isPractice && (
              <div
                className={cn(
                  "absolute -right-1 -top-1 grid h-5 min-w-5 px-1 w-fit place-items-center overflow-hidden rounded-full border border-white bg-white text-[10px]",
                  isActive
                    ? "bg-primary text-white"
                    : "border border-primary/20 bg-white text-primary/90"
                )}
              >
                {count}
              </div>
            )}

            {isPractice && !loading && (
              <Tooltip
                size="sm"
                placement="top"
                content={
                  isPassed
                    ? "You passed the practice test"
                    : "Practice test not passed yet"
                }
              >
                <div className="absolute -right-1.5 -top-1.5">
                  {isPassed ? (
                    <div className="size grid place-items-center rounded-full border border-white bg-white">
                      <PiCheckCircleFill className="size-4 text-green/80" />
                    </div>
                  ) : (
                    <AttentionBadge tone="red">
                      <PiWarningCircleFill className="size-4 text-red/80" />
                    </AttentionBadge>
                  )}
                </div>
              </Tooltip>
            )}
          </button>
        );
      })}
    </div>
  );
}
