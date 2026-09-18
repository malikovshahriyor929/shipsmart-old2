"use client";

import { Text, Badge, Avatar, Tooltip } from "rizzui";
import { PiEnvelope } from "react-icons/pi";
import { formatDate } from "@core/utils/format-date";
import { useTranslations } from "next-intl";

function getStudentStatusBadge(
  status: any | undefined,
  t: ReturnType<typeof useTranslations>,
) {
  if (!status)
    return (
      <Badge color="secondary">
        {t("profile.rating.status.unknown") ?? "Unknown"}
      </Badge>
    );

  switch (status.toLowerCase()) {
    case "completed":
      return (
        <Badge color="success">
          {t("courses.studentProgress-completed") ?? "Completed"}
        </Badge>
      );
    case "in progress":
      return (
        <Badge color="info" className="bg-blue-600">
          {t("courses.studentProgress-in-progress") ?? "In Progress"}
        </Badge>
      );
    case "not started":
      return (
        <Badge color="warning">
          {t("courses.studentProgress-not-started") ?? "Not Started"}
        </Badge>
      );
    default:
      return <Badge color="secondary">{status}</Badge>;
  }
}

interface StudentPopoverProps {
  student: any;
  onClose?: () => void;
}

export default function StudentPopover({
  student,
  onClose,
}: StudentPopoverProps) {
  const t = useTranslations();
  const completionStatus = student.status || "Not Started";
  const completedDate = student.completedDate
    ? new Date(student.completedDate)
    : null;
  const startedDate = student.startedDate
    ? new Date(student.startedDate)
    : null;
  const groupCode = student.groupCode || "N/A";

  return (
    <div className="font-geist w-64 p-1">
      <div className="mb-3 flex items-center gap-3">
        <Avatar
          name={student.name}
          src={student.avatar}
          className="ring-2 ring-blue-500 ring-offset-2"
          size="lg"
        />
        <div className="flex-1 items-center justify-between space-y-1">
          <Text className="text-base font-semibold text-mainBlue dark:text-gray-600">
            {student.name}
          </Text>

          <div className="flex items-center gap-2">
            <Tooltip
              placement="bottom-start"
              size="sm"
              color="secondary"
              content={t("students.student-id") ?? "Student ID"}
            >
              <Badge size="sm" variant="outline" color="success">
                PU-{student.id}
              </Badge>
            </Tooltip>
            <Tooltip
              placement="right"
              size="sm"
              color="secondary"
              content={t("students.group-class-code") ?? "Group/Class Code"}
            >
              <Badge size="sm" variant="outline" color="info">
                {groupCode}
              </Badge>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between">
          <Text className="text-sm font-medium text-mainBlue dark:text-gray-600">
            {t("commons.status") ?? "Status"}:
          </Text>
          {getStudentStatusBadge(completionStatus as any, t)}
        </div>
        {completedDate && (
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-mainBlue dark:text-gray-600">
              {t("students.completed-on") ?? "Completed on:"}
            </Text>
            <Text className="text-xs text-gray-600">
              {formatDate(completedDate)}
            </Text>
          </div>
        )}
        {startedDate && !completedDate && (
          <div className="flex items-center justify-between">
            <Text className="text-sm font-medium text-mainBlue dark:text-gray-600">
              {t("students.started-on") ?? "Started on:"}
            </Text>
            <Text className="text-xs text-gray-600">
              {formatDate(startedDate)}
            </Text>
          </div>
        )}
      </div>
      <div className="space-y-1 border-t border-mainBlue/20 pt-3">
        <div className="flex items-center gap-2 text-sm">
          <PiEnvelope className="h-5 w-5 text-gray-600" />
          <Text>{student.email || `${student.id}@newuu.uz`}</Text>
        </div>
      </div>
    </div>
  );
}
