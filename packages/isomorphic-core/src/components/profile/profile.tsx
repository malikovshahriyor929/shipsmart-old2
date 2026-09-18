"use client";
import { PLACEHOLDER_AVATAR } from "@core/config/constants";
import SmartImage from "@core/ui/smart-image";
import clsx from "clsx";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Title,
  Text,
  Avatar,
  Button,
  Badge,
  Empty,
  EmptyProductBoxIcon,
  Modal,
  Textarea,
  Input,
} from "rizzui";
import { motion } from "framer-motion";
import {
  PiIdentificationCard,
  PiPencilSimple,
  PiCertificate,
  PiArrowCounterClockwise,
  PiPaperclip,
  PiUploadSimple,
  PiClock,
  PiX,
  PiUser,
  PiEnvelope,
  PiPhone,
  PiBroadcast,
  PiUserCircle,
} from "react-icons/pi";
import TestScoresTab from "./tabs/test-scores-tab";
import AchievementsTab from "./tabs/achievements-tab";
import Link from "next/link";
import { routes } from "@core/config/routes";
import {
  Id,
  ApiThumb,
  ProfileType,
  StudentGradeCourse,
  StudentGradeSlot,
  StudentDataType,
  StudentRating,
  UploadResult,
} from "@core/types";
import AttachmentCard from "../cards/attachment-card";
import { CourseCard } from "../cards/course-card";
import { AdvisorTaskList } from "./tabs/task-tab";
import { ResultCardList } from "./tabs/practice-tab";
import { t } from "i18next";
import {
  PassportInfo,
  PersonalInfo,
  StudentContactInfo,
  StudentEducationInfo,
} from "./profileAdvisor";
import { ProfileSection, type ProfileSectionField } from "./profile-section";
import { MdHistory } from "react-icons/md";
import MultiAttachmentPicker from "@core/components/fileUpload";
import { toUploads } from "@core/utils/multi-attachment-utils";
import RenessansCertificateCard from "../cards/renessans-certificate-card";
import { EmptyFallback } from "@core/ui/empty-fallback";
import { DatePicker } from "@core/ui/datepicker";

const BG_SRC = "/advisor-student-profile-header-2.png";
function StatCard({
  title,
  value,
}: {
  title: "GPA" | "IELTS" | "SAT";
  value: number | string;
}) {
  const numeric = Number(value ?? 0);
  const max = title === "GPA" ? 5 : title === "IELTS" ? 9 : 1600;
  const percentage = Math.min(100, Math.round((numeric / max) * 100)) ?? 0;
  const strokeColor =
    title === "GPA" ? "#2196F3" : title === "IELTS" ? "#10B981" : "#F59E0B";
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const label =
    title === "GPA"
      ? t("profile.statcard-item-gpa")
      : title === "IELTS"
        ? t("profile.statcard-item-ielts")
        : t("profile.statcard-item-sat", { default: "SAT" });

  return (
    <div
      className={`flex h-[100px] w-[200px] items-center justify-between rounded-xl border border-[#E0E6ED] bg-gradient-to-br bg-[#ffffff] dark:bg-gray-100 px-4 shadow-sm dark:border-gray-300`}
    >
      {/* Value & Title */}
      <div className="flex flex-col">
        <span
          className={`text-4xl font-semibold ${
            title === "GPA"
              ? "text-[#0095CC]"
              : title === "IELTS"
                ? "text-[#13CCA4]"
                : "text-[#F59E0B]"
          }`}
        >
          {value}
        </span>
        <span className="text-[16px] text-gray-500 font-medium dark:text-gray-600">
          {label}
        </span>
      </div>

      {/* Circular progress */}
      <svg
        className="size-[70px] flex items-center justify-center relative"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="4"
        />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference ?? 0}
          strokeDashoffset={offset ?? 0}
          transform="rotate(-90 20 20)"
          initial={{ strokeDashoffset: circumference ?? 0 }}
          animate={{ strokeDashoffset: offset ?? 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={7}
          fill={strokeColor}
          className="!text-[9px] font-semibold "
        >
          {isNaN(percentage) ? 0 : percentage}%
        </text>
      </svg>
    </div>
  );
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  } else if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

const ratingStatusStyles: Record<
  number | string,
  { bg: string; text: string; border: string; accent?: string }
> = {
  1: {
    bg: "bg-amber-50 hover:bg-amber-50",
    text: "text-amber-700 hover:text-amber-600",
    border: "border-amber-200 hover:border-amber-300",
    accent: "text-amber-600 hover:text-amber-500",
  },
  2: {
    bg: "bg-emerald-50 hover:bg-emerald-50",
    text: "text-emerald-700 hover:text-emerald-400",
    border: "border-emerald-200 hover:border-emerald-300",
    accent: "text-emerald-600 hover:text-emerald-500 ",
  },
  3: {
    bg: "bg-blue-50 hover:bg-blue-50",
    text: "text-blue-700 hover:text-blue-400",
    border: "border-blue-200 hover:border-blue-300",
    accent: "text-blue-600 hover:text-blue-500",
  },
  4: {
    bg: "bg-rose-50 hover:bg-rose-50",
    text: "text-rose-700 hover:text-rose-400",
    border: "border-rose-200 hover:border-rose-300",
    accent: "text-rose-600 hover:text-rose-500",
  },
  6: {
    bg: "bg-orange-50 hover:bg-orange-50",
    text: "text-orange-700 hover:text-orange-400",
    border: "border-orange-200 hover:border-orange-300",
    accent: "text-orange-600 hover:text-orange-500",
  },
  default: {
    bg: "bg-slate-50 hover:bg-slate-50",
    text: "text-slate-700 hover:text-slate-300",
    border: "border-slate-200 hover:border-slate-700",
    accent: "text-slate-700 hover:text-slate-300",
  },
};

const ratingBorder = (status?: number | string) => {
  const palette =
    ratingStatusStyles[status ?? ""] ?? ratingStatusStyles.default;
  return {
    border: palette.border,
    // shadow:
    //   status === 2
    //     ? "shadow-[0_10px_30px_-15px_rgba(16,185,129,0.45)]"
    //     : status === 1
    //       ? "shadow-[0_10px_30px_-15px_rgba(217,119,6,0.35)]"
    //       : "shadow-sm",
  };
};

const getStatusPalette = (value?: number | string) =>
  ratingStatusStyles[value ?? ""] ?? ratingStatusStyles.default;

function AdvisorOverviewSection({
  advisor,
}: {
  advisor?: StudentDataType["advisor"];
}) {
  const fields: ProfileSectionField[] = [
    {
      id: "advisor-full-name",
      icon: <PiUser className="h-6 w-6" />,
      label: t("profile.advisor.fullName", { default: "Full name" }),
      value:
        `${advisor?.first_name ?? ""} ${advisor?.last_name ?? ""}`.trim() ||
        null,
    },
    {
      id: "advisor-role",
      icon: <PiUserCircle className="h-6 w-6" />,
      label: t("profile.advisor.role", { default: "Role" }),
      value: advisor?.role?.label ?? null,
    },
    {
      id: "advisor-username",
      icon: <PiUser className="h-6 w-6" />,
      label: t("profile.advisor.username", { default: "Username" }),
      value: advisor?.username ?? null,
    },
    {
      id: "advisor-status",
      icon: <PiBroadcast className="h-6 w-6" />,
      label: t("profile.advisor.status", { default: "Status" }),
      value:
        typeof advisor?.online === "boolean"
          ? advisor.online
            ? t("profile.advisor.online", { default: "Online" })
            : t("profile.advisor.offline", { default: "Offline" })
          : null,
    },
  ];

  return (
    <ProfileSection
      title={t("profile.advisor.summaryTitle", {
        default: "Advisor overview",
      })}
      fields={fields}
      columns={2}
      emptyMessage={t("profile.advisor.empty", {
        default: "Advisor information is not available.",
      })}
    />
  );
}

function AdvisorProfileCard({
  advisor,
  profileHref,
}: {
  advisor?: StudentDataType["advisor"];
  profileHref?: string | null;
}) {
  if (!advisor) {
    return (
      <ProfileSection
        title={t("profile.tabs.advisor", { default: "My Advisor" })}
        emptyMessage={t("profile.advisor.empty", {
          default: "Advisor information is not available.",
        })}
      />
    );
  }

  const fullName =
    `${advisor.first_name ?? ""} ${advisor.last_name ?? ""}`.trim() || "—";

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-300 dark:bg-gray-100">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
        <Avatar
          name={fullName}
          src={advisor.avatar?.url || PLACEHOLDER_AVATAR}
          customSize={60}
          className="rounded-full ring-4 ring-slate-100 dark:ring-gray-200"
        />

        <div className="min-w-0 flex-1">
          <Title as="h3" className="text-[22px] font-semibold text-[#0F274F]">
            {fullName}
          </Title>
          <Text className="mt-1 text-sm text-slate-500">
            {advisor.role?.label ?? t("profile.role-label-advisor")}
          </Text>
        </div>

        {profileHref ? (
          <div className="shrink-0">
            <Link href={profileHref}>
              <Button variant="outline" className="rounded-md">
                {t("profile.advisor.viewProfile", {
                  default: "View profile",
                })}
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function AdvisorContactSection({
  advisor,
}: {
  advisor?: StudentDataType["advisor"];
}) {
  const fields: ProfileSectionField[] = [
    {
      id: "advisor-email",
      icon: <PiEnvelope className="h-6 w-6" />,
      label: t("profile.advisor.email", { default: "Email" }),
      value: advisor?.email ?? null,
      variant: "green",
    },
    {
      id: "advisor-phone",
      icon: <PiPhone className="h-6 w-6" />,
      label: t("profile.advisor.phone", { default: "Phone" }),
      value: advisor?.phone_number ?? null,
      variant: "green",
    },
    {
      id: "advisor-last-seen",
      icon: <PiClock className="h-6 w-6" />,
      label: t("profile.advisor.lastSeen", { default: "Last seen" }),
      value: advisor?.last_seen_at ?? null,
      variant: "green",
    },
  ];

  return (
    <ProfileSection
      title={t("profile.advisor.contactTitle", {
        default: "Advisor contact",
      })}
      fields={fields}
      columns={2}
      emptyMessage={t("profile.advisor.empty", {
        default: "Advisor information is not available.",
      })}
    />
  );
}

const renderHistoryList = (
  progresses: StudentRating["progresses"] | undefined,
  t: typeof import("i18next").t,
) => {
  if (!progresses?.length) {
    return (
      <Text className="text-sm text-slate-500">
        {t("profile.rating.history.empty", {
          default: "No history yet",
        })}
      </Text>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {[...progresses]
        .sort((a, b) =>
          (b?.created_at || "").localeCompare(a?.created_at || ""),
        )
        .map((progress) => {
          const progressPalette = getStatusPalette(
            progress?.status?.value ?? "",
          );
          return (
            <div
              key={String(progress.id)}
              className={`rounded-lg border px-3 py-3 ${progressPalette.bg} ${progressPalette.border} dark:bg-gray-100`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`rounded-full border px-0 py-0 text-xs font-semibold bg-transparent dark:bg-gray-100 ${progressPalette.text} border-none`}
                  >
                    {progress?.status?.label ??
                      t("profile.rating.status.unknown", {
                        default: "Unknown",
                      })}
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {/* {t("profile.rating.history.updatedAt", {
                      value: formatDisplayDate(
                        progress?.checked_at ||
                          progress?.updated_at ||
                          progress?.created_at
                      ),
                      defaultValue: "Updated {{value}}",
                    })} */}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <h1 className="text-sm text-gray-600">
                    {t("profile.rating.scoreLabel") ?? "Score"}
                  </h1>
                  <div
                    className={`text-base leading-tight font-semibold ${progressPalette.accent ?? "text-slate-800"}`}
                  >
                    {progress?.score ??
                      t("profile.rating.history.noScore", {
                        default: "—",
                      })}
                  </div>
                </div>
              </div>
              <div className="">
                <p className="text-xs  ">
                  {t("profile.rating.history.comment", { default: "Comment" })}:
                </p>
                {progress?.comment ? (
                  <Text className="ml-1 text-sm text-slate-700 dark:text-slate-100">
                    {progress.comment}
                  </Text>
                ) : (
                  t("profile.rating.history.noComment")
                )}
              </div>
              {/* <div className="mt-2 flex flex-col gap-2 text-xs text-slate-500">
                <div>
                  {progress?.creator && (
                    <span>
                      {t("profile.rating.history.creator", {
                        name:
                          `${progress.creator.first_name ?? ""} ${progress.creator.last_name ?? ""}`.trim() ||
                          progress.creator.username ||
                          t("profile.rating.history.unknownUser", {
                            default: "Unknown",
                          }),
                        defaultValue: "By {{name}}",
                      })}
                    </span>
                  )}
                </div>
                {progress?.checker && (
                  <span>
                    {t("profile.rating.history.checker", {
                      name:
                        `${progress.checker.first_name ?? ""} ${progress.checker.last_name ?? ""}`.trim() ||
                        progress.checker.username ||
                        t("profile.rating.history.unknownUser", {
                          default: "Unknown",
                        }),
                      defaultValue: "Checked by {{name}}",
                    })}
                  </span>
                )}
              </div> */}
            </div>
          );
        })}
    </div>
  );
};

function toCourseArray(
  courses?: StudentGradeSlot["courses"],
): StudentGradeCourse[] {
  if (!courses) return [];
  if (Array.isArray(courses)) return courses;
  if (typeof courses === "object") return Object.values(courses);
  return [];
}

interface ProfileHeaderProps {
  student: StudentDataType | null;
  OtherPaylaod?: ProfileType | null;
  from?: string;
  activeTab?: string;
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>;
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  ratings?: StudentRating[];
  ratingsLoading?: boolean;
  onReopenRating?: (payload: {
    ratingId: StudentRating["id"];
    comment: string;
    files: File[];
    testScores?: ReopenTestScoresPayload;
  }) => Promise<void>;
  onLoadRatingDetail?: (
    ratingId: StudentRating["id"],
  ) => Promise<StudentRating | null | undefined>;
  canToggleCourseCompletion?: boolean;
  completionLoadingCourseId?: Id | null;
  onToggleCourseCompletion?: (payload: {
    courseId: Id;
    nextCompleted: boolean;
  }) => void | Promise<void>;
  useAdminCourseCardLayout?: boolean;
  tab?: { key: string; label: string; icon: React.ReactNode }[];
  getAdvisorProfileHref?: (advisorId: Id) => string | null;
}

type ReopenIeltsForm = {
  trf_number: string;
  score: string;
  test_date: string;
  expiry_date: string;
  reading: string;
  listening: string;
  writing: string;
  speaking: string;
};

type ReopenSatForm = {
  registration_no: string;
  score: string;
  test_date: string;
  math: string;
  english: string;
};

export type ReopenTestScoresPayload = {
  ielts?: ReopenIeltsForm & { certificate_attachment_id?: UploadResult[] };
  sat?: ReopenSatForm & { certificate_attachment_id?: UploadResult[] };
};

const emptyIeltsForm = (): ReopenIeltsForm => ({
  trf_number: "",
  score: "",
  test_date: "",
  expiry_date: "",
  reading: "",
  listening: "",
  writing: "",
  speaking: "",
});

const emptySatForm = (): ReopenSatForm => ({
  registration_no: "",
  score: "",
  test_date: "",
  math: "",
  english: "",
});

type ReopenModalForm = {
  ielts_certificate_attachment_id: UploadResult[];
  sat_certificate_attachment_id: UploadResult[];
};

type ReopenTestType = "ielts" | "sat" | null;

const detectReopenTestType = (
  rating?: StudentRating | null,
): ReopenTestType => {
  const label = String(rating?.category?.label ?? "")
    .trim()
    .toLowerCase();
  if (label.includes("ielts")) return "ielts";
  if (label.includes("sat")) return "sat";
  return null;
};

const toInputDate = (value?: string | null): string => {
  if (!value) return "";
  const directIso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (directIso) return `${directIso[1]}-${directIso[2]}-${directIso[3]}`;
  const ddmmyyyy = value.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  return "";
};

const parseInputDate = (value?: string | null): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};
/* ---------- Component ---------- */
const Profile = ({
  student,
  OtherPaylaod,
  from,
  activeTab,
  setActiveTab,
  tab = [],
  ratings = [],
  ratingsLoading = false,
  onReopenRating,
  onLoadRatingDetail,
  canToggleCourseCompletion = false,
  completionLoadingCourseId = null,
  onToggleCourseCompletion,
  useAdminCourseCardLayout = false,
  getAdvisorProfileHref,
  // points,
}: ProfileHeaderProps) => {
  const isStudent = !!student?.student;
  const [activeModal, setActiveModal] = React.useState<
    "reopen" | "history" | null
  >(null);
  const activeModalRef = React.useRef<"reopen" | "history" | null>(null);
  const attachmentUploadUrl = React.useMemo(() => {
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    return apiBase
      ? `${apiBase}/en/v1/attachments/upload`
      : "/en/v1/attachments/upload";
  }, []);
  const advisorProfileHref =
    student?.advisor?.id != null
      ? getAdvisorProfileHref?.(student.advisor.id) ??
        routes.staff.staffDetails("advisor", student.advisor.id)
      : null;
  const studentYear = String(
    student?.student?.student_year ?? (student as { student_year?: unknown } | null)?.student_year ?? "",
  ).trim();
  
  const [reopenModal, setReopenModal] = React.useState<{
    open: boolean;
    rating: StudentRating | null;
  }>({ open: false, rating: null });
  const [historyModal, setHistoryModal] = React.useState<{
    open: boolean;
    rating: StudentRating | null;
  }>({ open: false, rating: null });
  const [reopenComment, setReopenComment] = React.useState("");
  const [reopenFiles, setReopenFiles] = React.useState<File[]>([]);
  const [reopenTestType, setReopenTestType] =
    React.useState<ReopenTestType>(null);
  const [reopenIeltsForm, setReopenIeltsForm] =
    React.useState<ReopenIeltsForm>(emptyIeltsForm);
  const [reopenSatForm, setReopenSatForm] =
    React.useState<ReopenSatForm>(emptySatForm);
  const {
    control: reopenControl,
    reset: resetReopenForm,
    watch: watchReopenForm,
  } = useForm<ReopenModalForm>({
    defaultValues: {
      ielts_certificate_attachment_id: [],
      sat_certificate_attachment_id: [],
    },
  });
  const [reopenSubmitting, setReopenSubmitting] = React.useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = React.useState(false);
  const reopenIeltsCertificate = watchReopenForm(
    "ielts_certificate_attachment_id",
  );
  const reopenSatCertificate = watchReopenForm("sat_certificate_attachment_id");

  const canReopen = from === "studentViewForAdvisor" && !!onReopenRating;
  const sortedRatings = React.useMemo(
    () =>
      [...(ratings ?? [])].sort((a, b) =>
        (a?.category?.label || "").localeCompare(b?.category?.label || ""),
      ),
    [ratings],
  );

  const renessansCertificatesBySlot = React.useMemo(() => {
    const rawSlots = student?.student?.grades ?? [];

    return rawSlots
      .map((slot, slotIndex) => {
        const slotNo = Number(slot?.slot_no);
        const safeSlotNo =
          Number.isFinite(slotNo) && slotNo > 0 ? slotNo : slotIndex + 1;
        const certificates = toCourseArray(slot?.courses).map(
          (course, courseIndex) => {
            const point = Number(course?.point ?? 0);
            const grade = Number(course?.grade);
            return {
              key: `${safeSlotNo}-${String(course?.value ?? courseIndex + 1)}-${courseIndex}`,
              courseName: String(course?.label ?? "").trim(),
              slotNo: safeSlotNo,
              point: Number.isFinite(point) ? point : 0,
              grade: Number.isFinite(grade) && grade > 0 ? grade : null,
              createdAt: course?.created_at ?? null,
            };
          },
        );
        return {
          slotNo: safeSlotNo,
          certificates,
        };
      })
      .filter((slot) => slot.certificates.length > 0)
      .sort((a, b) => a.slotNo - b.slotNo);
  }, [student?.student?.grades]);

  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyLoadingId, setHistoryLoadingId] = React.useState<Id | null>(
    null,
  );

  const openReopenModal = (rating: StudentRating) => {
    const ielts = student?.related_data?.ielts;
    const sat = student?.related_data?.sat;
    const testType = detectReopenTestType(rating);

    activeModalRef.current = "reopen";
    setActiveModal("reopen");
    setHistoryModal({ open: false, rating: null });
    setReopenModal({ open: true, rating });
    setReopenComment("");
    setReopenFiles([]);
    setReopenTestType(testType);
    setReopenIeltsForm({
      trf_number: ielts?.trf_number ?? "",
      score: ielts?.overall != null ? String(ielts.overall) : "",
      test_date: toInputDate(ielts?.test_date),
      expiry_date: toInputDate(ielts?.expiry_date),
      reading: ielts?.reading != null ? String(ielts.reading) : "",
      listening: ielts?.listening != null ? String(ielts.listening) : "",
      writing: ielts?.writing != null ? String(ielts.writing) : "",
      speaking: ielts?.speaking != null ? String(ielts.speaking) : "",
    });
    setReopenSatForm({
      registration_no: sat?.registration_no ?? "",
      score: sat?.total_score != null ? String(sat.total_score) : "",
      test_date: toInputDate(sat?.test_date),
      math: sat?.math_score != null ? String(sat.math_score) : "",
      english: sat?.english_score != null ? String(sat.english_score) : "",
    });
    resetReopenForm({
      ielts_certificate_attachment_id: toUploads(ielts?.certificate),
      sat_certificate_attachment_id: toUploads(sat?.certificate),
    });
  };
  const openHistoryModal = async (rating: StudentRating) => {
    if (historyLoading) return;
    activeModalRef.current = "history";
    setActiveModal("history");
    setReopenModal({ open: false, rating: null });
    setHistoryModal({ open: true, rating });
    setHistoryLoading(true);
    setHistoryLoadingId(rating.id);
    try {
      let detail = rating;
      if (onLoadRatingDetail) {
        const fetched = await onLoadRatingDetail(rating.id);
        if (fetched) detail = fetched;
      }
      setHistoryModal((prev) =>
        activeModalRef.current === "history"
          ? { ...prev, open: true, rating: detail }
          : prev
      );
    } finally {
      setHistoryLoading(false);
      setHistoryLoadingId(null);
    }
  };

  const closeReopenModal = () => {
    if (reopenSubmitting) return;
    if (activeModalRef.current === "reopen") activeModalRef.current = null;
    setActiveModal((prev) => (prev === "reopen" ? null : prev));
    setReopenModal({ open: false, rating: null });
    setReopenComment("");
    setReopenFiles([]);
    setReopenTestType(null);
    setReopenIeltsForm(emptyIeltsForm());
    setReopenSatForm(emptySatForm());
    resetReopenForm({
      ielts_certificate_attachment_id: [],
      sat_certificate_attachment_id: [],
    });
  };

  const closeHistoryModal = () => {
    if (activeModalRef.current === "history") activeModalRef.current = null;
    setActiveModal((prev) => (prev === "history" ? null : prev));
    setHistoryModal({ open: false, rating: null });
  };

  const addFiles = (files: File[]) => {
    if (files.length) {
      setReopenFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFiles(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    addFiles(files);
  };

  const removeFileAt = (index: number) => {
    setReopenFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitReopen = async () => {
    if (!onReopenRating || !reopenModal.rating) return;
    try {
      const testScoresPayload: ReopenTestScoresPayload = {};

      if (reopenTestType === "ielts") {
        testScoresPayload.ielts = {
          ...reopenIeltsForm,
          certificate_attachment_id: reopenIeltsCertificate,
        };
      }

      if (reopenTestType === "sat") {
        testScoresPayload.sat = {
          ...reopenSatForm,
          certificate_attachment_id: reopenSatCertificate,
        };
      }

      setReopenSubmitting(true);
      await onReopenRating({
        ratingId: reopenModal.rating.id,
        comment: reopenComment.trim(),
        files: reopenFiles,
        testScores:
          testScoresPayload.ielts || testScoresPayload.sat
            ? testScoresPayload
            : undefined,
      });
      closeReopenModal();
    } catch (err) {
      // handled by caller
    } finally {
      setReopenSubmitting(false);
    }
  };

  const tabs = (tab?.length > 0 && tab) || [
    {
      key: "rating",
      label: t("profile.tabs.rating"),
      icon: <PiIdentificationCard className="h-5 w-5" />,
    },
    {
      key: "identity",
      label: t("profile.tabs.identity"),
      icon: <PiIdentificationCard className="h-5 w-5" />,
    },
    {
      key: "files",
      label: t("profile.tabs.files"),
      icon: <PiCertificate className="h-5 w-5" />,
    },
    // { key: "attendance", label: "Attendance", icon: <PiGraduationCap className="h-5 w-5" /> },
  ];
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-[20px]  shadow-sm">
        {/* Navy cover with watermark / your bg image */}
        <div className="relative h-[220px] sm:h-[215px]">
          {/* Gradient fallback underneath, then image on top */}
          <div className="absolute inset-0 bg-[#123271]" />
          <SmartImage
            src={BG_SRC}
            alt={t("profile.media.profile-cover-alt")}
            className="absolute inset-0 h-full w-full object-cover opacity-95"
          />
          {studentYear && (
            <div className="absolute right-5 top-5 z-10 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm font-semibold text-white shadow-sm backdrop-blur-sm sm:right-8">
              {studentYear}
            </div>
          )}
        </div>

        {/* White strip area */}
        <div className="relative bg-white pb-6 dark:bg-gray-100/50 px-5 pt-[100px] sm:px-8">
          {/* Avatar overlapping seam */}
          <div className="absolute left-1/2 top-0 -translate-y-1/2 -translate-x-1/2">
            <Avatar
              name={
                student?.student?.first_name + " " + student?.student?.last_name
              }
              customSize={170}
              src={student?.student?.avatar?.url || PLACEHOLDER_AVATAR}
              className="rounded-full ring-8 ring-white shadow-md text-2xl"
            />
          </div>

          {/* Name + Title */}
          <div className="flex flex-col items-center">
            <Title
              as="h2"
              className="text-xl font-semibold text-[#0f2039] sm:text-2xl"
            >
              {student?.student?.first_name} {student?.student?.last_name}
            </Title>
            <Text className="mt-1 text-base text-slate-500">
              {" "}
              {student?.student?.role?.label ||
                (isStudent
                  ? t("profile.role-label-student")
                  : t("profile.role-label-student"))}
            </Text>
          </div>

          {/* Metrics row (left) + Edit button (right) */}
          <div className="mt- flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between">
            {isStudent ? (
              <div className="flex w-full flex-1 flex-wrap gap-6 pt-3">
                <StatCard
                  title="GPA"
                  value={student?.related_data?.education?.gpa ?? "—"}
                />
                <StatCard
                  title="SAT"
                  value={student?.related_data?.sat?.total_score ?? "—"}
                />
                <StatCard
                  title="IELTS"
                  value={student?.related_data?.ielts?.overall ?? "—"}
                />
                {/*<StatCard title="Readiness"  value={`${student?.readinessScore ?? "—"}/5`} />*/}
              </div>
            ) : (
              <div className="flex w-full flex-1 flex-wrap gap-6">
                {/* <StatCard title="GPA" value={ student?.related_data.education?.gpa ?? "—" } /> */}
                {/* <StatCard title="IELTS" value={ student?.related_data?.ielts?.overall ?? "—" } /> */}
                {/*<StatCard title="Readiness"  value={`${student?.readinessScore ?? "—"}/5`} />*/}
              </div>
            )}
            {from === "studentViewForAdvisor" && (
              <div className="flex shrink-0 items-end">
                <Link
                  href={{
                    pathname: routes.myStudents.editStudent,
                    query: { studentId: student?.student?.id },
                  }}
                >
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-md border-slate-300 bg-[#123271] px-4 py-2 text-white hover:text-white-500 dark:hover:text-white dark:hover:border-white dark:text-gray-700 dark:border-gray-300"
                  >
                    <PiPencilSimple className="h-5 w-5" />
                    <span>{t("profile.actions.edit")}</span>
                  </Button>
                </Link>
              </div>
            )}
            {/* { isAdvisor &&
              <Button
                onClick={ () => setIsEdit?.(!isEdit) }
                variant="outline"
                className="flex items-center gap-2 rounded-md border-slate-300 bg-[#123271] px-4 py-2 text-white hover:text-white-500"
              >
                { isEdit ? <PiArrowLeft className="h-5 w-5" /> : <PiPencilSimple className="h-5 w-5" /> }
                <span>{ isEdit ? "Cancel" : "Edit" }</span>
              </Button>
            } */}
          </div>
        </div>

        <div className="relative bg-whit  dark:!bg-gray-100">
          <div className="rounded-b-[16px] w-full max-[810px]:overflow-x-aut border-t border-slate-200 bg-slate-50  px-3 sm:px-6 dark:!bg-gray-100 dark:border-gray-300 ">
            <div className="flex w-full justify-end max-[810px]:flex-wrap max-[810px]:justify-start  gap-2 py-3 sm:gap-4">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab?.(t.key)}
                  className={clsx(
                    "group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#123271] dark:text-white",
                    activeTab === t.key && "text-[#123271]",
                  )}
                >
                  {t.icon}
                  <span>{t.label}</span>
                  {activeTab === t.key && (
                    <span className="absolute inset-x-2 -bottom-[6px] h-[3px] rounded-full bg-[#123271] dark:bg-white " />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="col-span-12 md:col-span-12">
          {activeTab === "rating" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-300 dark:bg-gray-100">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-[22px] font-semibold text-[#0F274F]">
                      {t("profile.rating.title", { default: "Student rating" })}
                    </h3>
                    <Text className="text-sm text-slate-600 dark:text-gray-600">
                      {t("profile.rating.subtitle", {
                        default:
                          "Advisor provides scores across 10 categories. Reopen to request updates from the student.",
                      })}
                    </Text>
                  </div>
                  <Badge className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase text-slate-700 dark:border-gray-300 dark:bg-white dark:text-slate-800">
                    {t("profile.rating.categoryCount", {
                      count: ratings?.length ?? 0,
                      defaultValue: "{{count}} categories",
                    })}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {ratingsLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-[142px] w-full animate-pulse rounded-lg border border-slate-200 bg-slate-50/70 dark:border-gray-300 dark:bg-white/70"
                      />
                    ))
                  ) : sortedRatings?.length ? (
                    sortedRatings.map((rating) => {
                      const badgeStyle = getStatusPalette(
                        rating?.status?.value ?? "",
                      );
                      const categoryResult =
                        rating?.category?.result &&
                        typeof rating.category.result === "object"
                          ? (rating.category.result as {
                              certificate?: ApiThumb | null;
                            })
                          : null;
                      const categoryCertificate =
                        categoryResult?.certificate &&
                        typeof categoryResult.certificate === "object"
                          ? categoryResult.certificate
                          : null;
                      const hasAttachments =
                        Boolean(categoryCertificate) ||
                        Boolean(rating?.attachments?.length);
                      const isApproved =
                        Number(rating?.status?.value) === 2 ||
                        Number(rating?.status?.value) === 1 ||
                        Number(rating?.status?.value) === 3;

                      return (
                        <div
                          key={String(rating.id)}
                          className={`rounded-xl bg-white dark:bg-gray-100 flex flex-col  p-4 transition hover:-translate-y-[1px] ${ratingBorder(rating?.status?.value).border} border`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                  <Title
                                    as="h4"
                                    className="text-base font-semibold text-slate-900 dark:text-slate-100"
                                  >
                                    {rating?.category?.label ??
                                      t(
                                        "profile.rating.labels.unknownCategory",
                                        {
                                          default: "Category",
                                        },
                                      )}
                                  </Title>
                                  <Badge
                                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                                  >
                                    {rating?.status?.label ??
                                      t("profile.rating.status.unknown", {
                                        default: "Unknown",
                                      })}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                  <span className="inline-flex items-center gap-1">
                                    <PiClock className="h-4 w-4" />
                                    {rating?.updated_at}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="text-xs text-slate-500">
                                {t("profile.rating.scoreLabel", {
                                  default: "Score",
                                })}
                              </div>
                              <div
                                className={`text-2xl font-semibold ${badgeStyle.accent ?? "text-slate-900"}`}
                              >
                                {rating?.score ?? "—"}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-600">
                              <PiPaperclip className="h-4 w-4" />
                              {t("profile.rating.attachments", {
                                default: "Attachments",
                              })}
                            </div>
                            {hasAttachments ? (
                              <div className="mt-2 flex flex-col gap-2">
                                {categoryCertificate && (
                                  <AttachmentCard
                                    attachment={categoryCertificate}
                                  />
                                )}
                                {(rating?.attachments ?? []).map((att) =>
                                  att?.attachment ? (
                                    <AttachmentCard
                                      key={String(
                                        att?.id ??
                                          att?.attachment?.public_id ??
                                          att?.attachment?.url ??
                                          "",
                                      )}
                                      attachment={att.attachment as ApiThumb}
                                    />
                                  ) : null,
                                )}
                              </div>
                            ) : (
                              // <Text className="mt-2 text-sm text-slate-500">
                              //   {t("profile.rating.noAttachments", {
                              //     default: "No attachments provided",
                              //   })}
                              // </Text>
                              <Empty defaultImageClassName="h-24" />
                            )}
                          </div>

                          <div className="mt-auto pt-4">
                            <div className="rounded-lg ">
                              <div
                                className={`grid  ${canReopen && isApproved ? "grid-cols-2" : "grid-cols-1"} gap-4`}
                              >
                                <Button
                                  variant="outline"
                                  className={`flex items-center gap-1 w-full  ${badgeStyle.accent} ${badgeStyle.border}`}
                                  isLoading={
                                    historyLoading &&
                                    historyLoadingId === rating.id
                                  }
                                  onClick={() => openHistoryModal(rating)}
                                >
                                  <MdHistory className="h-4 w-4" />
                                  {t("profile.rating.history.title", {
                                    default: "History",
                                  })}
                                </Button>
                                {canReopen && isApproved && (
                                  <Button
                                    variant="outline"
                                    className="flex items-center gap-2 w-full text-[#123271] border-[#123271] hover:text-[#123271] dark:border-gray-300"
                                    onClick={() => openReopenModal(rating)}
                                  >
                                    <PiArrowCounterClockwise className="h-4 w-4" />
                                    {t("profile.rating.actions.reopen", {
                                      default: "Reopen",
                                    })}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Empty
                        image={<EmptyProductBoxIcon className="h-40" />}
                        text={t("profile.rating.empty.title", {
                          default: "No ratings yet",
                        })}
                      />
                      <Text className="text-sm text-slate-500">
                        {t("profile.rating.empty.subtitle", {
                          default:
                            "Advisor has not added rating categories for this student.",
                        })}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "identity" && (
            <div className={`grid grid-cols-1 xl:grid-cols-2  gap-6`}>
              <div className={`space-y-6`}>
                <PersonalInfo
                  title={t("profile.headings.personal-info")}
                  data={student?.student}
                />

                <StudentEducationInfo
                  title={t("profile.headings.education-info")}
                  data={student?.related_data.education}
                />
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <StudentContactInfo
                  title={t("profile.headings.contact-info")}
                  data={student?.related_data?.contact}
                />

                <PassportInfo
                  title={t("profile.headings.identity-doc")}
                  data={student?.related_data?.passport}
                />
              </div>
            </div>
          )}

          {activeTab === "advisor" && (
            <div className="space-y-6">
              <AdvisorProfileCard
                advisor={student?.advisor}
                profileHref={advisorProfileHref}
              />
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <AdvisorOverviewSection advisor={student?.advisor} />
              <AdvisorContactSection advisor={student?.advisor} />
              </div>
            </div>
          )}

          {/* Attendance */}
          {/* { activeTab === "attendance" && isStudent && (
            <p>No Information yet</p>
          ) } */}

          {/* Contact */}
          {activeTab === "courses" &&
            isStudent &&
            from === "studentViewForAdvisor" && (
              <>
                {OtherPaylaod?.courses.length === 0 && (
                  <p>{t("profile.fallbacks.no-data")}</p>
                )}

                {OtherPaylaod && OtherPaylaod?.courses?.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2 min-[880px]:grid-cols-3 min-[1440px]:grid-cols-4">
                      {OtherPaylaod?.courses?.map((course) => (
                        <Link
                          href={routes.courses.courseDetails(
                            String(course?.course?.id),
                          )}
                          key={course.course.id}
                        >
                          <CourseCard
                            role={student?.student.role?.value || 0}
                            course={course.course}
                            canToggleCompletion={canToggleCourseCompletion}
                            isCompleted={Boolean(
                              course?.completion_date ||
                                course?.course?.progress?.completed_at ||
                                (course?.course?.progress?.completion_percent ||
                                  0) === 100,
                            )}
                            isCompletionLoading={
                              completionLoadingCourseId === course.course.id
                            }
                            useAdminCompletionLayout={
                              useAdminCourseCardLayout
                            }
                            onToggleCompletion={(selectedCourse, nextCompleted) =>
                              onToggleCourseCompletion?.({
                                courseId: selectedCourse.id,
                                nextCompleted,
                              })
                            }
                          />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

          {/*Assigned Tasks */}
          {activeTab === "tasks" &&
            isStudent &&
            from === "studentViewForAdvisor" && (
              <div>
                {OtherPaylaod?.latest_tasks.length === 0 && (
                  <EmptyFallback
                    className=" mx-auto"
                    withBorder
                    text={t("profile.fallbacks.no-data")}
                  />
                )}
                <AdvisorTaskList data={OtherPaylaod?.latest_tasks ?? []} />
              </div>
            )}

          {/* Practice Tests results */}
          {activeTab === "practice" &&
            isStudent &&
            from === "studentViewForAdvisor" && (
              <>
                <ResultCardList items={OtherPaylaod?.latest_practices ?? []} />
              </>
            )}

          {/* Attached files , Test Scores & certificatess */}
          {activeTab === "files" && isStudent && (
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mt-5">
                  <h3 className="text-[22px] font-semibold text-[#0F274F]">
                    {t("profile.renessans.gradesTitle") ?? "Renesans grades"}
                  </h3>
                </div>
                <div className="mt-2 h-px w-full border-t border-dashed border-slate-200" />
                <div className="mt-6 space-y-4 rounded-xl">
                  {renessansCertificatesBySlot.length > 0 ? (
                    renessansCertificatesBySlot.map((slot) => (
                      <div
                        key={`slot-${slot.slotNo}`}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-gray-300 dark:bg-gray-100"
                      >
                        <div className="mb-4 flex items-center justify-between gap-2">
                          <h4 className="text-base font-semibold text-[#0F274F]">
                            {t("profile.renessans.slotLabel", {
                              count: slot.slotNo,
                              defaultValue: `${slot.slotNo}${
                                slot.slotNo === 1
                                  ? "st"
                                  : slot.slotNo === 2
                                    ? "nd"
                                    : slot.slotNo === 3
                                      ? "rd"
                                      : "th"
                              } Slot`,
                            })}
                          </h4>
                          <Badge
                            variant="flat"
                            color="info"
                            className="rounded-full bg-[#123271]/10 px-2.5 py-1 text-[11px] text-[#123271]"
                          >
                            {t("profile.renessans.certificateCount", {
                              count: slot.certificates.length,
                              defaultValue: "{{count}} certificates",
                            })}
                          </Badge>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                          {slot.certificates.map((certificate) => (
                            <RenessansCertificateCard
                              key={certificate.key}
                              slotNo={certificate.slotNo}
                              courseName={certificate.courseName}
                              point={certificate.point}
                              grade={certificate.grade}
                              createdAt={certificate.createdAt}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyFallback
                      className=" mx-auto"
                      text={t("profile.fallbacks.no-data")}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-5">
                  <h3 className="text-[22px] font-semibold text-[#0F274F]">
                    {t("profile.headings.achievements")}
                  </h3>
                </div>
                <div className="mt-2 h-px w-full border-t border-dashed border-slate-200" />
                <div className="mt-6">
                  <AchievementsTab
                    achievements={
                      student?.related_data?.achievement ??
                      ([] as StudentDataType["related_data"]["achievement"])
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={activeModal === "reopen" && reopenModal.open}
        onClose={closeReopenModal}
        size="xl"
        overlayClassName="bg-black/40"
        containerClassName="min-w-[calc(100vw-32px)] md:min-w-[700px] p-0 rounded-lg"
      >
        <div className="space-y-4 p-6 sm:p-7 w-full min-w-[700px] bg-white rounded-lg dark:bg-gray-100 ">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <Title as="h3" className="text-lg font-semibold text-slate-900">
                {t("profile.rating.reopen.title", {
                  default: "Reopen rating",
                })}
              </Title>
              <Text className="text-sm text-slate-600">
                {t("profile.rating.reopen.subtitle", {
                  category:
                    reopenModal.rating?.category?.label ||
                    t("profile.rating.labels.unknownCategory", {
                      default: "category",
                    }),
                  default:
                    "Ask the student to resubmit evidence for this category.",
                })}
              </Text>
            </div>
          </div>

          <div className="space-y-2">
            <Text className="text-sm font-medium text-slate-700">
              {t("profile.rating.reopen.commentLabel", { default: "Comment" })}{" "}
              {t("profile.rating.reopen.optional", { default: "(optional)" })}
            </Text>
            <Textarea
              value={reopenComment}
              onChange={(e) => setReopenComment(e.target.value)}
              placeholder={t("profile.rating.reopen.commentPlaceholder", {
                default: "Describe what needs to be updated",
              })}
              textareaClassName="min-h-[96px]"
            />
          </div>

          {reopenTestType && (
            <div className="space-y-3 rounded-md border border-slate-200 p-3 dark:border-gray-300">
              <Text className="text-sm font-medium text-slate-700">
                {reopenTestType === "ielts"
                  ? t("students.testScore.ieltsHeading") ?? "IELTS Test Scores"
                  : t("students.testScore.satHeading") ?? "SAT Test Scores"}
              </Text>

              {reopenTestType === "ielts" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label={t("students.testScore.fields.trfNumber") ?? "TRF Number"}
                      value={reopenIeltsForm.trf_number}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          trf_number: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.overallScore") ?? "Overall Score"}
                      inputMode="decimal"
                      value={reopenIeltsForm.score}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          score: e.target.value,
                        }))
                      }
                    />
                    <DatePicker
                      selected={parseInputDate(reopenIeltsForm.test_date)}
                      onChange={(date: Date | null) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          test_date: date ? toInputDate(date.toISOString()) : "",
                        }))
                      }
                      dateFormat="dd.MM.yyyy"
                      inputProps={{
                        label: t("students.testScore.fields.testDate") ?? "Test Date",
                        inputClassName: "bg-white",
                      }}
                    />
                    <DatePicker
                      selected={parseInputDate(reopenIeltsForm.expiry_date)}
                      onChange={(date: Date | null) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          expiry_date: date ? toInputDate(date.toISOString()) : "",
                        }))
                      }
                      dateFormat="dd.MM.yyyy"
                      inputProps={{
                        label: t("students.testScore.fields.expiryDate") ?? "Expiry Date",
                        inputClassName: "bg-white",
                      }}
                    />
                    <Input
                      label={t("students.testScore.fields.reading") ?? "Reading"}
                      inputMode="decimal"
                      value={reopenIeltsForm.reading}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          reading: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.listening") ?? "Listening"}
                      inputMode="decimal"
                      value={reopenIeltsForm.listening}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          listening: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.writing") ?? "Writing"}
                      inputMode="decimal"
                      value={reopenIeltsForm.writing}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          writing: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.speaking") ?? "Speaking"}
                      inputMode="decimal"
                      value={reopenIeltsForm.speaking}
                      onChange={(e) =>
                        setReopenIeltsForm((prev) => ({
                          ...prev,
                          speaking: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Controller
                    name="ielts_certificate_attachment_id"
                    control={reopenControl}
                    render={({ field }) => (
                      <MultiAttachmentPicker
                        value={toUploads(field.value)}
                        onChange={(next) => field.onChange(next)}
                        setUploadedFiles={() => {}}
                        uploadedFiles={[]}
                        uploadUrl={attachmentUploadUrl}
                        filesFieldName="files[]"
                        placeHoleder={t("students.testScore.fields.uploadPdf") ?? "Upload PDF"}
                        label={t("students.testScore.fields.certificate") ?? "Certificate (PDF)"}
                        accept="application/pdf"
                        maxCount={1}
                      />
                    )}
                  />
                </div>
              )}

              {reopenTestType === "sat" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Input
                      label={t("students.testScore.fields.registrationNumber") ?? "Registration Number"}
                      value={reopenSatForm.registration_no}
                      onChange={(e) =>
                        setReopenSatForm((prev) => ({
                          ...prev,
                          registration_no: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.overallScore") ?? "Overall Score"}
                      inputMode="numeric"
                      value={reopenSatForm.score}
                      onChange={(e) =>
                        setReopenSatForm((prev) => ({
                          ...prev,
                          score: e.target.value,
                        }))
                      }
                    />
                    <DatePicker
                      selected={parseInputDate(reopenSatForm.test_date)}
                      onChange={(date: Date | null) =>
                        setReopenSatForm((prev) => ({
                          ...prev,
                          test_date: date ? toInputDate(date.toISOString()) : "",
                        }))
                      }
                      dateFormat="dd.MM.yyyy"
                      inputProps={{
                        label: t("students.testScore.fields.testDate") ?? "Test Date",
                        inputClassName: "bg-white",
                      }}
                    />
                    <Input
                      label={t("students.testScore.fields.math") ?? "Math"}
                      inputMode="numeric"
                      value={reopenSatForm.math}
                      onChange={(e) =>
                        setReopenSatForm((prev) => ({
                          ...prev,
                          math: e.target.value,
                        }))
                      }
                    />
                    <Input
                      label={t("students.testScore.fields.english") ?? "English"}
                      inputMode="numeric"
                      value={reopenSatForm.english}
                      onChange={(e) =>
                        setReopenSatForm((prev) => ({
                          ...prev,
                          english: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Controller
                    name="sat_certificate_attachment_id"
                    control={reopenControl}
                    render={({ field }) => (
                      <MultiAttachmentPicker
                        value={toUploads(field.value)}
                        onChange={(next) => field.onChange(next)}
                        setUploadedFiles={() => {}}
                        uploadedFiles={[]}
                        uploadUrl={attachmentUploadUrl}
                        filesFieldName="files[]"
                        placeHoleder={t("students.testScore.fields.uploadPdf") ?? "Upload PDF"}
                        label={t("students.testScore.fields.certificate") ?? "Certificate (PDF)"}
                        accept="application/pdf"
                        maxCount={1}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Text className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <PiPaperclip className="h-4 w-4" />
              {t("profile.rating.reopen.attachmentsLabel", {
                default: "Attachments (optional)",
              })}
            </Text>
            <label
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm font-semibold transition ${isDraggingFiles ? "border-[#123271] text-[#123271] bg-slate-50" : "border-slate-300 text-slate-600 hover:border-[#123271] hover:text-[#123271]"}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingFiles(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingFiles(false);
              }}
              onDrop={handleDrop}
            >
              <PiUploadSimple className="h-5 w-5" />
              <span>
                {t("profile.rating.reopen.attachPrompt", {
                  default: "Upload files",
                })}
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />
            </label>

            {reopenFiles.length > 0 && (
              <div className="flex flex-col gap-2">
                {reopenFiles.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-gray-300 dark:bg-white"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">
                        {file.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {(file.type ||
                          t("profile.rating.reopen.fileTypeFallback", {
                            default: "File",
                          })) +
                          " · " +
                          formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFileAt(idx)}
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
                    >
                      {t("profile.rating.reopen.remove", { default: "Remove" })}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="text-xs text-red-500 max-w-sm">
            {t("profile.rating.reopen.notice", {
              default:
                "Select all the new documents that need to be reviewed, then click submit. You cannot make changes until administrators have reviewed them.",
            })}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={closeReopenModal}
              disabled={reopenSubmitting}
            >
              {t("profile.rating.reopen.cancel", { default: "Cancel" })}
            </Button>
            <Button
              onClick={submitReopen}
              isLoading={reopenSubmitting}
              disabled={!onReopenRating}
            >
              {t("profile.rating.reopen.submit", { default: "Send" })}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === "history" && historyModal.open}
        onClose={closeHistoryModal}
        size="lg"
        overlayClassName="bg-black/40 "
      >
        <div className="fle min-w-[500px] flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-100">
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-gray-300">
            <div className="space-y-1">
              <Title as="h3" className="text-lg font-semibold text-slate-900">
                {t("profile.rating.history.title", { default: "History" })}
              </Title>
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                {historyModal.rating?.category?.label ??
                  t("profile.rating.labels.unknownCategory", {
                    default: "Category",
                  })}
              </Text>
            </div>
            <button
              type="button"
              onClick={closeHistoryModal}
              className="rounded-lg p-1 text-slate-500 transition hover:bg-gray-100 hover:text-slate-700 dark:hover:bg-gray-200"
              aria-label={t("profile.rating.history.closeAria") ?? "Close history modal"}
            >
              <PiX className="size-5" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto px-5 py-4">
            {/* {historyModal.rating?.progresses?.length ? (
              <div className="text-xs text-slate-500">
                {t("profile.rating.history.count", {
                  count: historyModal.rating?.progresses?.length,
                  defaultValue: "{{count}} updates",
                })}
              </div>
            ) : null} */}
            {renderHistoryList(historyModal.rating?.progresses, t)}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
