"use client";

import React from "react";
import {
  Title,
  Text,
  Badge,
  Tooltip,
  EmptyProductBoxIcon,
  Empty,
} from "rizzui";
import {
  PiMedalBold,
  PiCertificateBold,
  PiEye,
  PiDownload,
  PiFilePdfBold,
  PiFileDocBold,
  PiFileXlsBold,
  PiFileImageBold,
  PiFileBold,
  PiStar,
} from "react-icons/pi";
import cn from "@core/utils/class-names";
import { EmptyFallback } from "@core/ui/empty-fallback";
import forceDownload from "@core/utils/downlaod";
import { StudentDataType } from "@core/types";
import { t } from "i18next";

/* ---------------------------
 * Types (matches your payload)
 * --------------------------- */
export type AchievementItem = {
  id: number | string;
  title: string;
  subject?: string | null;
  level_id?: { value: number; label: string } | null;
  award?: string | null;
  description?: string | null;
  date_awarded?: string | null;
  certificate?: {
    public_id?: string;
    file_name?: string;
    extension?: string;
    file_size?: number;
    url?: string;
    created_at?: string;
  } | null;
};

export type AchievementsTabProps =
  | { items: AchievementItem[] | [] }
  | { achievements: StudentDataType["related_data"]["achievement"] };

/* ---------------------------
 * Helpers
 * --------------------------- */
function asStr(v: any, fb = "—") {
  return v != null && v !== "" ? String(v) : fb;
}

function getFileIconByExt(ext?: string) {
  const e = (ext || "").toLowerCase();
  if (e === "pdf") return <PiFilePdfBold className="h-10 w-10 text-red-500" />;
  if (e === "doc" || e === "docx")
    return <PiFileDocBold className="h-10 w-10 text-blue-500" />;
  if (e === "xls" || e === "xlsx" || e === "csv")
    return <PiFileXlsBold className="h-10 w-10 text-green-500" />;
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(e))
    return <PiFileImageBold className="h-10 w-10 text-purple-500" />;
  return <PiFileBold className="h-10 w-10 text-gray-500" />;
}

const LEVEL_THEMES: Record<string, any> = {
  International: {
    gradient:
      "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
    border: "border-purple-200 dark:border-purple-700/50",
    badgeBg: "bg-purple-50 dark:bg-purple-900/30",
    badgeText: "text-purple-700 dark:text-purple-300",
    badgeBorder: "border-purple-200 dark:border-purple-700",
    iconBg: "bg-purple-100 dark:bg-purple-800/30",
    iconColor: "text-purple-600",
  },
  National: {
    gradient:
      "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    border: "border-blue-200 dark:border-blue-700/50",
    badgeBg: "bg-blue-50 dark:bg-blue-900/30",
    badgeText: "text-blue-700 dark:text-blue-300",
    badgeBorder: "border-blue-200 dark:border-blue-700",
    iconBg: "bg-blue-100 dark:bg-blue-800/30",
    iconColor: "text-blue-600",
  },
  Regional: {
    gradient:
      "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
    border: "border-emerald-200 dark:border-emerald-700/50",
    badgeBg: "bg-emerald-50 dark:bg-emerald-900/30",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    badgeBorder: "border-emerald-200 dark:border-emerald-700",
    iconBg: "bg-emerald-100 dark:bg-emerald-800/30",
    iconColor: "text-emerald-600",
  },
  District: {
    gradient:
      "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    border: "border-amber-200 dark:border-amber-700/50",
    badgeBg: "bg-amber-50 dark:bg-amber-900/30",
    badgeText: "text-amber-700 dark:text-amber-300",
    badgeBorder: "border-amber-200 dark:border-amber-700",
    iconBg: "bg-amber-100 dark:bg-amber-800/30",
    iconColor: "text-amber-600",
  },
  School: {
    gradient:
      "from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    border: "border-rose-200 dark:border-rose-700/50",
    badgeBg: "bg-rose-50 dark:bg-rose-900/30",
    badgeText: "text-rose-700 dark:text-rose-300",
    badgeBorder: "border-rose-200 dark:border-rose-700",
    iconBg: "bg-rose-100 dark:bg-rose-800/30",
    iconColor: "text-rose-600",
  },
  DEFAULT: {
    gradient:
      "from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20",
    border: "border-slate-200 dark:border-slate-700/50",
    badgeBg: "bg-slate-50 dark:bg-slate-900/30",
    badgeText: "text-slate-700 dark:text-slate-300",
    badgeBorder: "border-slate-200 dark:border-slate-700",
    iconBg: "bg-slate-100 dark:bg-slate-800/30",
    iconColor: "text-slate-600",
  },
};

function getTheme(level?: string | null) {
  if (!level) return LEVEL_THEMES.DEFAULT;
  return LEVEL_THEMES[level] || LEVEL_THEMES.DEFAULT;
}

function placeTone(award?: string | null) {
  const p = (award || "").toLowerCase();
  if (p.includes("1") || p.includes("gold"))
    return "text-amber-600 dark:text-amber-400";
  if (p.includes("2") || p.includes("silver"))
    return "text-gray-600 dark:text-gray-300";
  if (p.includes("3") || p.includes("bronze"))
    return "text-orange-700 dark:text-orange-400";
  return "text-slate-600 dark:text-slate-300";
}

function useItems(props: AchievementsTabProps): any[] {
  if ("items" in props && props.items) return props.items;
  if ("achievements" in props && props.achievements) return props.achievements;
  return [];
}

/* ---------------------------
 * Component
 * --------------------------- */
export default function AchievementsTab(props: AchievementsTabProps) {
  const items = useItems(props);

  if (!items?.length) {
    return (
      <EmptyFallback
        className="md:col-span-2  mx-auto"
        text={t("profile.fallbacks.no-data")}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((a) => {
        const level = a.level_id?.label || "";
        const theme = getTheme(level);
        const isMedal = [
          "International",
          "National",
          "Regional",
          "District",
          "School",
        ].includes(level);

        return (
          <div
            key={String(a.id)}
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300",
              theme.border,
              theme.gradient,
            )}
          >
            {/* Decorative Background */}
            <div
              className={cn(
                "absolute -top-8 -right-8 opacity-10 transition-all duration-300 group-hover:opacity-20",
                theme.iconColor,
              )}
            >
              {isMedal ? (
                <PiMedalBold className="h-24 w-24" />
              ) : (
                <PiCertificateBold className="h-24 w-24" />
              )}
            </div>

            {/* Header Section */}
            <div className="relative z-10 flex items-start justify-between gap-3 border-b border-white/20 p-5 dark:border-white/10">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={cn(
                    "rounded-lg p-2.5 shadow-sm shrink-0",
                    theme.iconBg,
                  )}
                >
                  {isMedal ? (
                    <PiMedalBold className={cn("h-5 w-5", theme.iconColor)} />
                  ) : (
                    <PiCertificateBold
                      className={cn("h-5 w-5", theme.iconColor)}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Tooltip content={a.title}>
                    <Title
                      as="h3"
                      className="truncate text-base max-[]: font-bold text-gray-900 dark:text-gray-900"
                    >
                      {a.title}
                    </Title>
                  </Tooltip>
                  <Text className="text-xs text-gray-500 dark:text-gray-600 mt-1">
                    {asStr(a.date_awarded, "—")}
                  </Text>
                </div>
              </div>
              {a.subject && (
                <Tooltip content={a.subject}>
                  <Badge
                    variant="flat"
                    className="!text-xs font-semibold !text-white  "
                    color="info"
                  >
                    <p className="truncate max-w-20">{a.subject}</p>
                  </Badge>
                </Tooltip>
              )}
            </div>

            {/* Body Section */}
            <div className="relative z-10 flex-1 p-5 space-y-3">
              {a.award && (
                <div className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-transparent">
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-600">
                    {t("tests.award")}
                  </Text>
                  <div className="flex items-center gap-1 max-w-[200px]">
                    <PiStar className={cn("h-4 w-4", placeTone(a?.award))} />
                    <Text className={cn("font-bold", placeTone(a?.award))}>
                      {(a.award?.[0] ?? "").toUpperCase() + a?.award?.slice(1)}
                    </Text>
                  </div>
                </div>
              )}

              {a.level_id?.label && (
                <div className="flex items-center justify-between  rounded-lg bg-white/50 dark:bg-transparent">
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-600">
                    {t("tests.level")}
                  </Text>
                  <div
                    // variant="flat"
                    className={cn(
                      "!text-mainBlue   font-semibold truncate dark:!text-white ",
                      placeTone(a.award),
                    )}
                    // color="secondary"
                  >
                    {level}
                  </div>
                </div>
              )}

              {a.description && (
                <div className=" rounded-lg bg-white/50 dark:bg-transparent">
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-600 mb-1">
                    {t("profile.description")}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-700 line-clamp-2 truncate">
                    {a.description}
                  </Text>
                </div>
              )}
            </div>

            {/* Certificate Section */}
            {a.certificate?.url && (
              <div
                className={cn(
                  "relative z-10 border-t px-5 py-3",
                  theme.badgeBorder,
                  "border-white/20 dark:border-white/10",
                )}
              >
                <button
                  onClick={async () => {
                    try {
                      await forceDownload(
                        a.certificate?.url ?? "",
                        `${a.certificate?.file_name ?? "certificate"}.${a.certificate?.extension ?? "pdf"}`,
                      );
                    } catch (err) {
                      console.error("Download error:", err);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300",
                    theme.badgeBg,
                    theme.badgeText,
                    // 'hover:shadow-md hover:scale-105 active:scale-95'
                  )}
                >
                  <PiDownload className="h-4 w-4" />
                  {t("profile.download")}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
