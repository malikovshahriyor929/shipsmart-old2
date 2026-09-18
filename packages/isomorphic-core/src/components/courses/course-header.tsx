import { Avatar, Badge, Progressbar, Text, Title } from "rizzui";
import {
  PiCalendarDots,
  PiChartLineUpBold,
  PiChartLineUpDuotone,
  PiClockCountdownBold,
  PiStackBold,
  PiUsers,
  PiUsersBold,
  PiVideoCameraBold,
} from "react-icons/pi";
import Card from "@core/components/cards/card";
import InstructorPopover from "./instructor-popover";
import { PLACEHOLDER_AVATAR } from "@core/config/constants";
import { fullName, thumbUrl } from "@core/utils/course-utils";
import { Course, User, CourseInstructor } from "@core/types";
import SmartImage from "@core/ui/smart-image";
import EnhancedAvatarGroup from "./enhanced-avatar-group";
import { t } from "i18next";

type CourseHEaderProps = {
  role?: number; // 5 = student, 3 = advisore
  course: Course;
};
export default function CourseHeader({ role = 5, course }: CourseHEaderProps) {
  const subjectLabel = course?.subject_id?.label || "IELTS";
  const levelLabel = course?.level_id?.label || "Beginner";
  const studentsCount = course?.student_counts || 0;
  const creator = course?.created || null;
  const description = course?.description || "";
  const duration_months = course?.duration_months || "";
  const live_sessions = course?.live_sessions || 0;
  const video_lessons = course?.video_lessons || 0;
  const hours_per_week = course?.hours_per_week || 0;
  const completion_percent = course?.progress?.completion_percent || 0;

  const instructors = Array.isArray(course?.instructors)
    ? (course.instructors as CourseInstructor[])
    : [];

  const people: CourseInstructor[] =
    instructors.length > 0
      ? instructors
      : creator
        ? [
            {
              user: creator as User,
              extra_data: {},
            },
          ]
        : [];

  return (
    <Card className="p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row">
        {/* Thumb */}
        <div className="relative mx-auto w-full overflow-clip rounded-xl md:rounded-2xl bg-gray-100 h-60 md:h-72 lg:w-96">
          <SmartImage
            src={thumbUrl(course.thumbnail)}
            alt={course.name || t("courses.card-fallback-alt")}
            className="absolute inset-0 h-full w-full object-cover object-center"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {subjectLabel && (
            <Badge
              variant="flat"
              rounded="lg"
              className="absolute top-2 right-2 bg-black/40 text-white"
            >
              {subjectLabel}
            </Badge>
          )}
        </div>

        {/* Right column */}
        <div className="flex-1 flex flex-col items-start justify-around lg:py-2">
          {/* Title + tags */}
          {/* Main container stacks vertically on all screens to organize Title/Level above Tags */}
          <div className="w-full mb-2 flex flex-col 2xl:flex-row gap-2 sm:mb-4 sm:justify-between items-start 2xl:items-center">
            {/* Title and Level Badge Group */}
            <div className="flex items-center gap-3">
              <Title
                as="h1"
                className="text-xl font-bold text-primary dark:text-gray-700 md:text-2xl"
              >
                {course?.name || "—"}
              </Title>
              {levelLabel && (
                <span className="inline-block px-2 py-1 rounded-lg bg-mainBlue/10 text-inherit dark:bg-gray-200 dark:text-white text-xs font-semibold">
                  {levelLabel}
                </span>
              )}
            </div>

            {/* Badges/Tags Container - FIXED: uses flex-wrap to allow badges to stack on small screens */}
            <div className="flex flex-wrap items-center gap-2 text-primary dark:text-gray-700 mt-2 sm:mt-0">
              <Badge
                variant="flat"
                color="success"
                className="flex items-center gap-1.5 bg-green/10 text-green "
              >
                <PiUsersBold className="h-4 w-4" />
                {studentsCount} {t("courses.header-students")}
                {/* {studentsCount === 1 ? "student" : "students"} */}
              </Badge>

              <Badge
                variant="flat"
                className="flex items-center gap-1.5 bg-slate-100 text-primary dark:bg-slate-700 dark:text-white"
              >
                <PiVideoCameraBold className="h-4 w-4" />
                {live_sessions} {t("courses.header-live-sessions")}
                {/* {live_sessions === 1 ? "live session" : "live sessions"} */}
              </Badge>

              <Badge
                variant="flat"
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 dark:text-white  text-primary"
              >
                <PiStackBold className="h-4 w-4" />
                {video_lessons} {t("courses.header-video-lessons")}
                {/* {video_lessons === 1 ? "video lesson" : "video lessons"} */}
              </Badge>

              {/* <Badge
                variant="flat"
                className="flex items-center gap-1.5 bg-cyan-50 text-cyan-700"
              >
                <PiCalendarDots className="h-4 w-4" />
                {hours_per_week}{" "}
                {hours_per_week === 1 ? "hour/week" : "hours/week"}
              </Badge> */}

              <Badge
                variant="flat"
                className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600"
              >
                <PiClockCountdownBold className="h-4 w-4" />
                {duration_months}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {description ? (
            <Text className="mb-4 text-sm leading-relaxed text-gray-700">
              {description}
            </Text>
          ) : null}

          {/* Instructors / Creator */}
          {people.length > 0 && (
            <div className="flex w-full flex-col gap-2 mb-5 lg:mt-auto">
              <div className="flex items-center gap-1.5 text-primary dark:text-gray-800">
                <PiUsersBold className="inline size-4 sm:size-5" />
                <Text className="text-sm font-bold">
                  {instructors.length > 0
                    ? t("courses.header-instructors")
                    : t("courses.header-instructor")}
                </Text>
              </div>

              {instructors.length && instructors.length > 0 ? (
                <div className="flex items-center justify-start">
                  <EnhancedAvatarGroup<CourseInstructor>
                    items={people}
                    maxDisplay={4}
                    size="md"
                    spacing="-space-x-2"
                    showCount={false}
                    renderPopover={(item, close) => (
                      <InstructorPopover
                        size="md"
                        instructor={item}
                        onClose={close}
                      />
                    )}
                    getAvatarName={(it) => fullName(it?.user)}
                    getAvatarSrc={(it) => thumbUrl(it?.user?.avatar, "avatar")}
                    getKey={(it, idx) => it?.user?.id ?? idx}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar
                    size="md"
                    name={fullName(creator)}
                    src={thumbUrl(creator?.avatar, "avatar")}
                  />
                  <div className="flex flex-col text-sm items-start text-primary dark:text-gray-800">
                    <span className="font-semibold">{fullName(creator)}</span>
                    <span className="text-xs">{creator?.email || ""}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Course Completion status */}
          {role === 5 && (
            <div className="flex w-full  flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 text-primary dark:text-gray-800">
                <PiChartLineUpBold className="inline size-4 sm:size-5" />
                <Text className="text-sm font-bold">
                  {t("courses.completion-label")}:
                </Text>
              </div>
              {/* Assuming Progressbar component handles the 75% display */}
              <Progressbar
                color="success"
                value={completion_percent}
                label={`${completion_percent}%`}
                labelClassName="dark:text-white"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
