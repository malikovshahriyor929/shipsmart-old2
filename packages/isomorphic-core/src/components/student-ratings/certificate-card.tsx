"use client";

import { Button, Text, Title } from "rizzui";
import {
  PiCertificateBold,
  PiDownload,
  PiCalendarBlank,
  PiIdentificationCard,
} from "react-icons/pi";
import {
  MdHeadphones,
  MdMenuBook,
  MdEdit,
  MdRecordVoiceOver,
  MdCalculate,
  MdTranslate,
} from "react-icons/md";
import cn from "@core/utils/class-names";
import forceDownload from "@core/utils/downlaod";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { StudentRatingCategory } from "@core/types/student-ratings";
import { parseCategoryCertificate } from "@core/components/student-ratings/certificate-utils";

type CertificateCardProps = {
  category?: StudentRatingCategory | null;
  className?: string;
  completionActions?: Array<{
    courseId: number;
    label: string;
    completed: boolean;
    loading?: boolean;
    onToggle: (courseId: number, nextCompleted: boolean) => void | Promise<void>;
  }>;
};

function valueOrDash(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function toDownloadName(fileName?: string, extension?: string) {
  const safeName = (fileName || "certificate").trim();
  const safeExt = (extension || "").trim().replace(/^\./, "");
  if (!safeExt) return safeName;
  if (safeName.toLowerCase().endsWith(`.${safeExt.toLowerCase()}`)) {
    return safeName;
  }
  return `${safeName}.${safeExt}`;
}

export default function StudentRatingCertificateCard({
  category,
  className,
  completionActions = [],
}: CertificateCardProps) {
  const t = useTranslations();
  const certificateInfo = parseCategoryCertificate(category);

  if (!certificateInfo.kind || !certificateInfo.result) {
    return null;
  }

  const result = certificateInfo.result;

  const headerTitle =
    certificateInfo.kind === "ielts"
      ? t("rating.certificate.ieltsTitle") ?? "IELTS Academic"
      : t("rating.certificate.satTitle") ?? "SAT Exam";
  const headerSubtitle =
    certificateInfo.kind === "ielts"
      ? "International English Language Testing System"
      : "College Board";
  const scoreLabel =
    certificateInfo.kind === "ielts"
      ? t("rating.certificate.band") ?? "Band"
      : t("rating.certificate.total") ?? "Total";
  const scoreValue = valueOrDash(
    certificateInfo.kind === "ielts" ? result?.overall : result?.total_score
  );
  const candidateLabel =
    certificateInfo.kind === "ielts"
      ? t("students.testScore.fields.trfNumber") ?? "TRF Number"
      : t("students.testScore.fields.registrationNumber") ?? "Registration Number";
  const candidateValue =
    certificateInfo.kind === "ielts" ? result?.trf_number : result?.registration_no;
  const testDate = result?.test_date;

  const scoreItems =
    certificateInfo.kind === "ielts"
      ? [
          {
            key: "listening",
            label: t("profile.tests.labels.listening") ?? "Listening",
            value: result?.listening,
            Icon: MdHeadphones,
          },
          {
            key: "reading",
            label: t("profile.tests.labels.reading") ?? "Reading",
            value: result?.reading,
            Icon: MdMenuBook,
          },
          {
            key: "writing",
            label: t("profile.tests.labels.writing") ?? "Writing",
            value: result?.writing,
            Icon: MdEdit,
          },
          {
            key: "speaking",
            label: t("profile.tests.labels.speaking") ?? "Speaking",
            value: result?.speaking,
            Icon: MdRecordVoiceOver,
          },
        ]
      : [
          {
            key: "math",
            label: t("profile.tests.labels.math") ?? "Math",
            value: result?.math_score,
            Icon: MdCalculate,
          },
          {
            key: "english",
            label: t("profile.tests.labels.english") ?? "English",
            value: result?.english_score,
            Icon: MdTranslate,
          },
        ];

  return (
    <div
      className={cn(
        "w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[#003b71] px-5 py-5 text-white">
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/15">
              <PiCertificateBold className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <Title as="h3" className="text-lg font-bold text-white">
                {headerTitle}
              </Title>
              <Text className="mt-0.5 text-xs text-blue-100">
                {headerSubtitle}
              </Text>
            </div>
          </div>
          <div className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-center">
            <Text className="text-[11px] font-semibold uppercase tracking-wide text-blue-100">
              {scoreLabel}
            </Text>
            <Text className="text-2xl font-bold leading-none text-white">
              {scoreValue}
            </Text>
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-end justify-between gap-4">
          <div>
            <Text className="text-[11px] text-blue-100">{candidateLabel}</Text>
            <Text className="mt-1 font-mono text-sm font-medium text-white">
              {valueOrDash(candidateValue)}
            </Text>
          </div>
          <div className="text-right">
            <Text className="text-[11px] text-blue-100">
              {t("students.testScore.fields.testDate") ?? "Test Date"}
            </Text>
            <Text className="mt-1 text-sm font-medium text-white">
              {valueOrDash(testDate)}
            </Text>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-md" />
        <div className="pointer-events-none absolute bottom-2 right-14 h-12 w-12 rounded-full bg-blue-300/20 blur-lg" />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <PiCalendarBlank className="h-4 w-4" />
          {t("rating.certificate.componentScores") ?? "Component Scores"}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {scoreItems.map(({ key, label, value, Icon }) => (
            <div
              key={key}
              className="rounded-lg border border-blue-100 bg-blue-50 p-3 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[#003b71] dark:bg-blue-900/40 dark:text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <Text className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
              </Text>
              <Text className="mt-1 text-xl font-bold text-[#003b71] dark:text-white">
                {valueOrDash(value)}
              </Text>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {certificateInfo.certificate?.url ? (
            <button
              onClick={async () => {
                try {
                  await forceDownload(
                    certificateInfo.certificate?.url ?? "",
                    toDownloadName(
                      certificateInfo.certificate?.file_name,
                      certificateInfo.certificate?.extension
                    )
                  );
                } catch (error) {
                  console.error("Failed to download certificate:", error);
                  toast.error(
                    t("rating.certificate.downloadFailed") ??
                      "Failed to download certificate"
                  );
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#003b71] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0f518e]"
            >
              <PiDownload className="h-4 w-4" />
              {t("profile.tests.actions.download-certificate") ??
                "Download Certificate"}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-gray-600 dark:text-slate-400">
              <PiIdentificationCard className="h-4 w-4" />
              {t("rating.certificate.fileUnavailable") ??
                "Certificate file is not available."}
            </div>
          )}

          {completionActions.length > 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-1">
              {completionActions.map((action) => (
                <Button
                  key={action.courseId}
                  variant={action.completed ? "outline" : "solid"}
                  color={action.completed ? "danger" : "primary"}
                  isLoading={action.loading}
                  disabled={action.loading}
                  onClick={() =>
                    action.onToggle(action.courseId, !action.completed)
                  }
                  className="w-full justify-center"
                >
                  {action.completed
                    ? `${action.label}: ${
                        t("rating.certificate.markUncompleted") ??
                        "Mark as uncompleted"
                      }`
                    : `${action.label}: ${
                        t("rating.certificate.markCompleted") ??
                        "Mark as completed"
                      }`}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
