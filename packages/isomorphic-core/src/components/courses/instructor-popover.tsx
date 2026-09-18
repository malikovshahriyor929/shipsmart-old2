"use client";

import { Text, Badge, Avatar } from "rizzui";
import { CourseInstructor } from "@core/types";
import { thumbUrl, fullName } from "@core/utils/course-utils";
import { t } from "i18next";

type Size = "sm" | "md" | "lg" | "xl";
interface InstructorPopoverProps {
  instructor: CourseInstructor;
  size?: Size;
  onClose?: () => void;
}

export default function InstructorPopover({
  instructor,
  size = "md",
}: InstructorPopoverProps) {
  const isArrayShape = (inst: any): inst is CourseInstructor =>
    Boolean(inst?.user);
  const user = isArrayShape(instructor) ? instructor.user : instructor;

  const experience = isArrayShape(instructor)
    ? instructor.extra_data?.Experience || null
    : null;
  const specialization = isArrayShape(instructor)
    ? instructor.extra_data?.Specialization || null
    : null;
  // Size mapping for avatar + typography
  const nameCls: Record<Size, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };
  const smallCls: Record<Size, string> = {
    sm: "text-[11px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-sm",
  };

  return (
    <div className="w-60 md:w-72 lg:w-80">
      <div className="mb-3 flex items-center gap-3">
        <Avatar
          rounded="full"
          name={fullName(user)}
          src={thumbUrl(user?.avatar, "avatar")}
          size={size}
          className="ring-1 ring-mainBlue ring-offset-1"
        />

        <div className="min-w-0 flex-1">
          <Text
            className={`truncate font-semibold text-mainBlue dark:text-gray-700 ${nameCls[size]}`}
          >
            {fullName(user)}
          </Text>

          {user?.username && (
            <div className="flex flex-wrap items-center gap-1">
              <Badge
                size="sm"
                variant="flat"
                className="bg-gray-200 dark:bg-gray-300 text-gray-700"
              >
                @{user.username}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* Experience / Specialization from extra_data */}
        {experience && (
          <div className="flex items-start justify-between">
            <Text
              className={`font-medium  text-mainBlue dark:text-gray-700 ${smallCls[size]}`}
            >
              {/* Experience: */}
              {t("something.experience")}
            </Text>
            <Text
              className={`${smallCls[size]} flex-1 text-right text-gray-600`}
            >
              {experience}
            </Text>
          </div>
        )}
        {specialization && (
          <div className="flex items-start justify-between">
            <Text
              className={`font-medium text-mainBlue dark:text-gray-700 ${smallCls[size]}`}
            >
              {/* Specialization: */}
              {t("something.specialization")}
            </Text>
            <Text
              className={`${smallCls[size]} flex-1 text-right text-gray-600`}
            >
              {specialization}
            </Text>
          </div>
        )}

        {/* Phone */}
        {user?.phone_number && user?.phone_number.trim().length !== 0 && (
          <div className="flex items-center justify-between">
            <Text
              className={`font-medium text-mainBlue dark:text-gray-700 ${smallCls[size]}`}
            >
              {t("something.phone")}
            </Text>
            <Text
              className={`${smallCls[size]} flex-1 text-right text-gray-600`}
            >
              {user.phone_number}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}
