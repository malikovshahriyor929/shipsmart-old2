"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge, Button, Text } from "rizzui";
import { LuLibraryBig } from "react-icons/lu";
import {
  PiBookOpenBold,
  PiCheckCircleBold,
  PiFoldersDuotone,
  PiUsersBold,
} from "react-icons/pi";
import { Course } from "@core/types";
import { formatDateToStringMonth } from "@core/utils/get-formatted-date";
import { t } from "i18next";

export type CourseActionsProps = {
  course: Course;
  onStartLearning?: (course: Course) => Promise<void> | void;
  startButtonLabel?: React.ReactNode;
};

export default function CourseActions({
  course,
  onStartLearning,
  startButtonLabel,
}: CourseActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const features = course?.key_features || null;
  const curriculum_modules = course?.curriculum_modules || null;
  const additional_resources = course?.additional_resources || null;
  const target_audience = course?.target_audience || null;
  const created_at = course?.created_at
    ? formatDateToStringMonth(course.created_at)
    : null;

  const handleClick = async () => {
    if (!onStartLearning || isLoading) return;
    setIsLoading(true);
    try {
      await onStartLearning(course);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        isLoading={isLoading}
        disabled={isLoading || !onStartLearning}
        onClick={handleClick}
        type="button"
        size="lg"
        className="w-full"
      >
        <PiFoldersDuotone className="mr-2 h-5 w-5" />
        {startButtonLabel ?? t("courses.actions-explore-lessons")}
      </Button>

      {/* Content grid */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, delay: 0.03 }}
        className="mt-8 grid gap-1 md:grid-cols-1"
      >
        {/* Features */}
        {features && features.length > 0 && (
          <div className="rounded-lg px-2 py-5">
            <div className="mb-3 flex items-center gap-2 border-b border-dashed border-mainBlue/10 pb-1.5 dark:border-gray-200">
              <PiCheckCircleBold className="h-5 w-5 dark:!text-white" />
              <Text className="font-semibold dark:text-white">
                {t("courses.actions-key-features")}
              </Text>
            </div>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-mainBlue dark:!text-white"
                >
                  <Badge renderAsDot size="sm" className="dark:bg-gray-700" />
                  <Text as="span">{f}</Text>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Modules */}
        {curriculum_modules && curriculum_modules.length > 0 && (
          <div className="rounded-lg px-2 py-5">
            <div className="mb-3 flex items-center gap-2 border-b border-dashed border-mainBlue/10 pb-1.5 dark:border-gray-200">
              <LuLibraryBig className="h-5 w-5 dark:!text-white" />
              <Text className="font-semibold text-mainBlue dark:text-white">
                {t("courses.actions-curriculum-modules")}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {curriculum_modules.map((m, i) => (
                <Badge
                  key={i}
                  rounded="md"
                  variant="flat"
                  className="bg-slate-200 text-slate-700 dark:bg-gray-200/50 dark:text-gray-700"
                >
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Audience */}
        {target_audience && (
          <div className="rounded-lg px-2 py-5">
            <div className="mb-3 flex items-center gap-2 border-b border-dashed border-mainBlue/10 pb-1.5 dark:border-gray-200">
              <PiUsersBold className="h-5 w-5 dark:!text-white" />
              <Text className="font-semibold text-mainBlue dark:text-white">
                {t("courses.actions-target-audience")}
              </Text>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-mainBlue dark:text-white">
                <Badge renderAsDot size="sm" className="dark:bg-gray-700" />
                <Text className="text-inherit">{target_audience}</Text>
              </li>
            </ul>
          </div>
        )}

        {/* Resources */}
        {additional_resources && additional_resources.length > 0 && (
          <div className="rounded-lg px-2 py-5">
            <div className="mb-3 flex items-center gap-2 border-b border-dashed border-mainBlue/10 pb-1.5 dark:border-gray-200">
              <PiBookOpenBold className="h-5 w-5 dark:!text-white" />
              <Text className="font-semibold text-mainBlue dark:text-white">
                {t("courses.actions-additional-resources")}
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {additional_resources.map((r, i) => (
                <Badge
                  key={i}
                  rounded="lg"
                  variant="flat"
                  className="text-white"
                >
                  {r}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Published date */}
        <div className="w-full text-center">
          <Text as="strong" className="text-sm font-medium text-gray-700">
            {t("courses.actions-published-on")} {created_at || "—"}
          </Text>
        </div>
      </motion.div>
    </div>
  );
}
