"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Input,
  Text,
  Textarea,
  Title,
  Tooltip,
} from "rizzui";
import { PiArrowLeft, PiCheckBold, PiXBold } from "react-icons/pi";
import toast from "react-hot-toast";
import {
  ReviewStudentRatingPayload,
  StudentRating,
  StudentRatingCompletionMap,
  StudentRatingDetailsResponse,
} from "@core/types/student-ratings";
import AttachmentCard from "@core/components/cards/attachment-card";
import ProgressTimeline from "@core/components/student-ratings/progress-timeline";
import {
  Hash,
  Loader,
  Mail,
  Paperclip,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import cn from "@core/utils/class-names";
import { fullName, thumbUrl } from "@core/utils/course-utils";
import StudentRatingCertificateCard from "@core/components/student-ratings/certificate-card";
import { formatDate } from "@core/utils/format-date";

type ReviewAction = "approve" | "reject";
type CourseCompletionKey = "sat_math" | "sat_english" | "ielts";

type RequestDetailsProps = {
  id: string;
  fetchRatingById: (
    id: string | number,
  ) => Promise<StudentRatingDetailsResponse>;
  submitReview: (payload: ReviewStudentRatingPayload) => Promise<any>;
  completeCourse?: (payload: {
    course_id: number;
    student_id: number;
    key?: CourseCompletionKey;
  }) => Promise<any>;
  uncompleteCourse?: (payload: {
    course_id: number;
    student_id: number;
    key?: CourseCompletionKey;
  }) => Promise<any>;
  onBack: () => void;
  onReviewSuccess: () => void;
};

// Map known API status labels for display while keeping color logic on the raw label
function translateStatus(
  statusLabel: string | undefined,
  t: (key: string) => string | undefined,
): string {
  if (!statusLabel) return "";
  const map: Record<string, string> = {
    Approved: t("studentRatings.status-approved") ?? "Approved",
    Rejected: t("studentRatings.status-rejected") ?? "Rejected",
    Review: t("studentRatings.status-review") ?? "Review",
    Pending: t("studentRatings.status-pending") ?? "Pending",
  };
  return map[statusLabel] ?? statusLabel;
}

function getStatusColors(statusLabel: string) {
  if (statusLabel.includes("Approved")) {
    return { bg: "bg-green-50", text: "text-green-600", dot: "bg-green-600" };
  }
  if (statusLabel.includes("Rejected")) {
    return { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-600" };
  }
  if (statusLabel.includes("Review")) {
    return { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-600" };
  }
  return { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-600" };
}

export default function StudentRatingRequestDetails({
  id,
  fetchRatingById,
  submitReview,
  completeCourse,
  uncompleteCourse,
  onBack,
  onReviewSuccess,
}: RequestDetailsProps) {
  const t = useTranslations();
  const [data, setData] = useState<StudentRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null);
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completedCourseIds, setCompletedCourseIds] = useState<number[]>([]);
  const [completionLoadingCourseId, setCompletionLoadingCourseId] = useState<
    number | null
  >(null);

  useEffect(() => {
    let alive = true;

    async function fetchDetails() {
      try {
        setLoading(true);
        const res = await fetchRatingById(id);
        if (alive && res.success) {
          setData(res.data);
          setCompletedCourseIds([]);
        }
      } catch (error) {
        console.error("Failed to fetch rating details:", error);
        toast.error(
          t("studentRatings.load-details-failed") ?? "Failed to load request details"
        );
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchDetails();

    return () => {
      alive = false;
    };
  }, [id, fetchRatingById, t]);

  const handleApprove = () => {
    setReviewAction("approve");
    setScore("");
    setComment("");
  };

  const handleReject = () => {
    setReviewAction("reject");
    setScore("");
    setComment("");
  };

  const handleReviewSubmit = async () => {
    if (!data || !reviewAction) return;

    const normalizedScore =
      reviewAction === "reject"
        ? 0
        : score.trim() === ""
          ? Number.NaN
          : Number(score.trim());

    if (
      reviewAction === "approve" &&
      (!Number.isFinite(normalizedScore) || normalizedScore < 0)
    ) {
      toast.error(t("rating.edit.invalidScore") ?? "Please enter a valid score");
      return;
    }

    try {
      setSubmitting(true);
      await submitReview({
        student_rating_id: data.id,
        is_accepted: reviewAction === "approve",
        score: normalizedScore,
        comment: comment.trim(),
      });

      toast.success(
        t("studentRatings.review-submitted") ?? "Review submitted successfully"
      );
      onReviewSuccess();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (t("studentRatings.review-submit-failed") ?? "Failed to submit review")
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleCourseCompletion = async (
    courseId: number,
    nextCompleted: boolean,
    key?: CourseCompletionKey
  ) => {
    const targetStudentId = data?.student?.id;

    if (!targetStudentId) {
      toast.error(t("studentRatings.student-not-found") ?? "Student not found");
      return;
    }

    try {
      setCompletionLoadingCourseId(courseId);

      const payload = {
        course_id: Number(courseId),
        student_id: Number(targetStudentId),
        key,
      };

      if (nextCompleted) {
        await completeCourse?.(payload);
      } else {
        await uncompleteCourse?.(payload);
      }

      const completionKey =
        key ?? (courseId === 3 ? "ielts" : courseId === 1 ? "sat_math" : "sat_english");

      setCompletedCourseIds((prev) => {
        if (nextCompleted) {
          return prev.includes(courseId) ? prev : [...prev, courseId];
        }

        return prev.filter((id) => id !== courseId);
      });

      setData((prev) => {
        if (!prev) return prev;

        const currentMap = prev.mark_as_completed ?? {};
        const currentEntry = currentMap[completionKey];

        return {
          ...prev,
          mark_as_completed: {
            ...currentMap,
            [completionKey]: currentEntry
              ? { ...currentEntry, completed: nextCompleted }
              : {
                  label:
                    courseId === 3
                      ? "IELTS"
                      : courseId === 1
                        ? "SAT Math"
                        : "SAT English",
                  completed: nextCompleted,
                },
          },
        };
      });

      toast.success(
        nextCompleted
          ? (t("studentRatings.course-completed") ?? "Course marked as completed")
          : (t("studentRatings.course-uncompleted") ?? "Course marked as uncompleted")
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          (t("studentRatings.course-completion-failed") ?? "Failed to update course completion")
      );
    } finally {
      setCompletionLoadingCourseId(null);
    }
  };

  const certificateCompletionActions = useMemo(() => {
    if (!data?.category?.value) {
      return [];
    }

    const completionMap: StudentRatingCompletionMap = data.mark_as_completed ?? {};

    if (data.category.value === 2) {
      const ielts = completionMap.ielts;
      return [
        {
          courseId: 3,
          label: ielts?.label || "IELTS",
          completed: ielts?.completed ?? completedCourseIds.includes(3),
          loading: completionLoadingCourseId === 3,
          onToggle: (selectedCourseId: number, nextCompleted: boolean) =>
            handleToggleCourseCompletion(selectedCourseId, nextCompleted),
        },
      ];
    }

    if (data.category.value === 1) {
      const satMath = completionMap.sat_math;
      const satEnglish = completionMap.sat_english;
      return [
        {
          courseId: 1,
          label: satMath?.label || "SAT Math",
          completed: satMath?.completed ?? completedCourseIds.includes(1),
          loading: completionLoadingCourseId === 1,
          onToggle: (selectedCourseId: number, nextCompleted: boolean) =>
            handleToggleCourseCompletion(selectedCourseId, nextCompleted, "sat_math"),
        },
        {
          courseId: 2,
          label: satEnglish?.label || "SAT English",
          completed: satEnglish?.completed ?? completedCourseIds.includes(2),
          loading: completionLoadingCourseId === 2,
          onToggle: (selectedCourseId: number, nextCompleted: boolean) =>
            handleToggleCourseCompletion(selectedCourseId, nextCompleted, "sat_english"),
        },
      ];
    }

    return [];
  }, [
    completedCourseIds,
    completionLoadingCourseId,
    data?.category?.value,
    data?.mark_as_completed,
  ]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <Loader className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center">
        {t("studentRatings.request-not-found") ?? "Request not found."}
      </div>
    );
  }

  const statusColors = getStatusColors(data.status?.label ?? "");
  const student = data.student;
  const studentIdLabel = student?.student_no ?? student?.id;
  const category =
    data.category?.label ?? (t("studentRatings.uncategorized") ?? "Uncategorized");
  const attachmentCount = data.attachments?.length ?? 0;

  return (
    <div className="sm:p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ActionIcon
            variant="outline"
            size="sm"
            onClick={onBack}
            className="cursor-pointer"
          >
            <PiArrowLeft className="h-4 w-4" />
          </ActionIcon>
          <div>
            <Title
              as="h2"
              className="text-lg font-bold text-mainBlue dark:text-gray-800"
            >
              {t("studentRatings.request") ?? "Request"} #{data.id}
            </Title>
            <Tooltip
              content={t("rating.filters.category") ?? "Category"}
              size="sm"
              placement="right"
            >
              <Badge
                variant="flat"
                rounded="md"
                size="sm"
                className="mt-1 bg-indigo-100 text-xs text-indigo-700"
              >
                {category}
              </Badge>
            </Tooltip>
          </div>
        </div>

        <Tooltip
          content={t("studentRatings.current-status") ?? "Current Status"}
          placement="top"
          size="sm"
        >
          <Badge
            rounded="lg"
            variant="flat"
            size="lg"
            className={cn(statusColors.bg, statusColors.text)}
          >
            <Badge
              renderAsDot
              size="sm"
              className={cn(statusColors.dot, "me-1")}
            />
            {translateStatus(data.status?.label, t)}
          </Badge>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#003b71]/15 bg-white shadow-[0_8px_18px_-16px_rgba(0,59,113,0.18)]">
            <div className="border-b border-[#003b71]/10 bg-white px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003b71] text-white">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <Title
                    as="h3"
                    className="text-base font-semibold text-[#003b71]"
                  >
                    {t("studentRatings.student-information") ?? "Student Information"}
                  </Title>
                  <Text className="mt-0.5 text-xs text-slate-500">
                    {t("studentRatings.student-info-subtitle") ??
                      "Profile summary for this rating request"}
                  </Text>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex items-start gap-4">
                  <Avatar
                    src={thumbUrl(student?.avatar, "avatar")}
                    name={fullName(student)}
                    size="xl"
                    rounded="md"
                    className="ring-2 ring-white"
                  />
                  <div className="min-w-0 flex-1">
                    <Text className="truncate text-lg font-bold text-slate-900">
                      {fullName(student)}
                    </Text>
                    <div className="mt-0.5 flex flex-wrap gap-2">
                      <Badge
                        variant="flat"
                        rounded="pill"
                        className="inline-flex bg-indigo-50 text-xs font-semibold text-indigo-600"
                      >
                        {t("studentRatings.last-seen-at") ?? "Last seen at"}:{" "}
                        {student?.last_seen_at
                          ? formatDate(
                              new Date(student.last_seen_at),
                              "DD.MM.YYYY hh:mm",
                            )
                          : "-"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <Hash className="h-3.5 w-3.5 text-[#003b71]" />
                    {t("students.student-id") ?? "Student ID"}
                  </div>
                  <Text className="truncate text-sm font-semibold text-slate-900">
                    {studentIdLabel ? String(studentIdLabel) : "—"}
                  </Text>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-[#003b71]" />
                    {t("profile.advisor.email") ?? "Email"}
                  </div>
                  <Text className="truncate text-sm font-semibold text-slate-900">
                    {student?.email || "—"}
                  </Text>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-[#003b71]" />
                    {t("profile.advisor.phone") ?? "Phone"}
                  </div>
                  <Text className="truncate text-sm font-semibold text-slate-900">
                    {student?.phone_number || "—"}
                  </Text>
                </div>
              </div>
            </div>
          </div>

          <StudentRatingCertificateCard
            category={data.category}
            completionActions={certificateCompletionActions}
          />

          <div className="overflow-hidden rounded-2xl border border-[#003b71]/15 bg-white shadow-[0_8px_18px_-16px_rgba(0,59,113,0.18)]">
            <div className="border-b border-[#003b71]/10 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003b71] text-white">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Title
                      as="h3"
                      className="text-base font-semibold text-[#003b71]"
                    >
                      {t("studentRatings.attachments") ?? "Attachments"}
                    </Title>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {t("studentRatings.attachments-subtitle") ??
                        "Supporting files submitted with this request"}
                    </Text>
                  </div>
                </div>
                <Badge
                  variant="flat"
                  rounded="md"
                  className="border border-[#003b71]/15 bg-[#003b71]/10 px-2.5 py-1 text-xs font-semibold text-[#003b71]"
                >
                  {attachmentCount} {t("studentRatings.files-word") ?? "file(s)"}
                </Badge>
              </div>
            </div>

            <div className="p-5">
              {attachmentCount > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 whitespace-pre-wrap rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                  {data.attachments.map((item) => (
                    <AttachmentCard
                      key={item.id}
                      attachment={item.attachment}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
                  <Paperclip className="mx-auto mb-2 h-5 w-5 text-slate-400" />
                  <Text className="text-sm font-medium text-slate-600">
                    {t("studentRatings.no-attachments-found") ?? "No attachments found"}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-500">
                    {t("studentRatings.no-attachments-desc") ??
                      "Advisor did not upload supporting files for this request."}
                  </Text>
                </div>
              )}
            </div>
          </div>

          {data.status.value === 1 && (
            <div className="overflow-hidden rounded-2xl border border-[#003b71]/15 bg-white shadow-[0_8px_18px_-16px_rgba(0,59,113,0.18)]">
              <div className="border-b border-[#003b71]/10 bg-white px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#003b71] text-white">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <Title
                        as="h3"
                        className="text-base font-semibold text-[#003b71]"
                      >
                        {t("studentRatings.review-action") ?? "Review Action"}
                      </Title>
                      <Text className="mt-0.5 text-xs text-slate-500">
                        {t("studentRatings.review-action-subtitle") ??
                          "Select an action and complete the review form"}
                      </Text>
                    </div>
                  </div>
                  <Badge
                    variant="flat"
                    rounded="md"
                    className="border border-[#003b71]/15 bg-[#003b71]/10 px-2.5 py-1 text-xs font-semibold text-[#003b71]"
                  >
                    {reviewAction === "approve"
                      ? (t("studentRatings.approve-mode") ?? "Approve mode")
                      : reviewAction === "reject"
                        ? (t("studentRatings.reject-mode") ?? "Reject mode")
                        : (t("studentRatings.pending-action") ?? "Pending action")}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    color="primary"
                    variant="outline"
                    className="justify-center"
                    onClick={handleApprove}
                  >
                    <PiCheckBold className="me-2 h-4 w-4" />
                    {t("studentRatings.approve") ?? "Approve"}
                  </Button>

                  <Button
                    color="danger"
                    variant="outline"
                    className="justify-center"
                    onClick={handleReject}
                  >
                    <PiXBold className="me-2 h-4 w-4" />
                    {t("studentRatings.reject") ?? "Reject"}
                  </Button>
                </div>

                {reviewAction && (
                  <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        disabled={reviewAction === "reject"}
                        label={
                          <>
                            {t("rating.columns.score") ?? "Score"}{" "}
                            {reviewAction === "approve" && (
                              <span className="text-red-500">*</span>
                            )}
                          </>
                        }
                        type="text"
                        placeholder={t("studentRatings.score-placeholder") ?? "Enter score (0-100)"}
                        value={score}
                        onChange={(e) =>
                          setScore(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        className="w-full"
                      />
                    </div>

                    <Textarea
                      label={t("rating.comment") ?? "Comment"}
                      placeholder={t("studentRatings.comment-placeholder") ?? "Add a comment or feedback..."}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                    />

                    <div className="flex justify-end gap-3 pt-1">
                      <Button
                        variant="outline"
                        type="button"
                        disabled={submitting}
                        onClick={() => {
                          setReviewAction(null);
                          setScore("");
                          setComment("");
                        }}
                      >
                        {t("commons.cancel") ?? "Cancel"}
                      </Button>

                      <Button
                        type="button"
                        isLoading={submitting}
                        disabled={submitting}
                        color={
                          reviewAction === "approve" ? "primary" : "danger"
                        }
                        onClick={handleReviewSubmit}
                      >
                        {reviewAction === "approve"
                          ? (t("studentRatings.submit-approval") ?? "Submit Approval")
                          : (t("studentRatings.submit-rejection") ?? "Submit Rejection")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <ProgressTimeline data={data.progresses} />
          </div>
        </div>
      </div>
    </div>
  );
}
