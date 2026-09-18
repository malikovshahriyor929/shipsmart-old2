"use client";

import React from "react";
import { Title, Text } from "rizzui";
import { PiBrain, PiDownload, PiGlobe } from "react-icons/pi";
import cn from "@core/utils/class-names";
import forceDownload from "@core/utils/downlaod";
import type { CertificateFile, StudentDataType } from "@core/types";
import { t } from "i18next";

export type TestScoreItem = {
  name: "IELTS" | "SAT" | (string & {});
  date?: string | null;
  score?: string | number | null;
  breakdown?: Record<string, string | number>;
  file?: CertificateFile | null | undefined;
  difficultyLabel?: string;
};

export type TestScoresTabProps =
  | { items: TestScoreItem[]; testScore?: never }
  | { testScore: StudentDataType["related_data"]; items?: never };

const testThemes: Record<string, any> = {
  IELTS: {
    gradient: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20",
    border: "border-red-200 dark:border-red-700",
    badgeBg: "bg-red-50 dark:bg-red-900/30",
    badgeText: "text-red-600 dark:text-red-400",
    badgeBorder: "border-red-200 dark:border-red-700",
    icon: <PiGlobe className="h-6 w-6 text-red-500" />,
    iconBg: "bg-red-100 dark:bg-red-800/30",
    scoreColor: "text-red-600 dark:text-red-400",
  },
  SAT: {
    gradient: "from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20",
    border: "border-sky-200 dark:border-sky-700/50",
    badgeBg: "bg-sky-50 dark:bg-sky-900/30",
    badgeText: "text-sky-600 dark:text-sky-400",
    badgeBorder: "border-sky-200 dark:border-sky-700",
    icon: <PiBrain className="h-6 w-6 text-sky-500" />,
    iconBg: "bg-sky-100 dark:bg-sky-800/30",
    scoreColor: "text-sky-600 dark:text-sky-400",
  },
  DEFAULT: {
    gradient:
      "from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20",
    border: "border-slate-200 dark:border-slate-700/50",
    badgeBg: "bg-slate-50 dark:bg-slate-900/30",
    badgeText: "text-slate-600 dark:text-slate-400",
    badgeBorder: "border-slate-200 dark:border-slate-700",
    iconBg: "bg-slate-100 dark:bg-slate-800/30",
    scoreColor: "text-slate-700 dark:text-slate-300",
  },
};

const asStr = (v: any, fallback = "—") =>
  v != null && v !== "" ? String(v) : fallback;

function normalizeFromRelatedData(
  related?: StudentDataType["related_data"],
): TestScoreItem[] {
  if (!related) return [];
  const out: TestScoreItem[] = [];

  if (
    related.ielts &&
    (related.ielts.overall ||
      related.ielts.listening ||
      related.ielts.reading ||
      related.ielts.writing ||
      related.ielts.speaking)
  ) {
    out.push({
      name: "IELTS",
      date: asStr(related.ielts.test_date, ""),
      score: asStr(related.ielts.overall, ""),
      breakdown: {
        Listening: asStr(related.ielts.listening, ""),
        Reading: asStr(related.ielts.reading, ""),
        Writing: asStr(related.ielts.writing, ""),
        Speaking: asStr(related.ielts.speaking, ""),
      },
      file: related.ielts.certificate,
    });
  }

  if (
    related.sat &&
    (related.sat.total_score ||
      related.sat.math_score ||
      related.sat.english_score)
  ) {
    const overall =
      typeof related.sat.total_score === "number"
        ? related.sat.total_score
        : (related.sat.math_score ?? 0) + (related.sat.english_score ?? 0);

    out.push({
      name: "SAT",
      date: asStr(related.sat.test_date, ""),
      score: asStr(overall || ""),
      breakdown: {
        Math: asStr(related.sat.math_score ?? "", ""),
        English: asStr(related.sat.english_score ?? "", ""),
      },
      file: related.sat.certificate,
    });
  }

  return out;
}

function useNormalizedItems(props: TestScoresTabProps): TestScoreItem[] {
  if ("items" in props && props.items) return props.items;
  if ("testScore" in props && props.testScore)
    return normalizeFromRelatedData(props.testScore);
  return [];
}

const TestScoresTab: React.FC<TestScoresTabProps> = (props) => {
  const items = useNormalizedItems(props);

  if (!items.length) {
    return (
      <div className="rounded-xl border border-slate-200 p-6 text-center text-slate-500 dark:border-slate-700/60 dark:text-slate-400">
        {t("profile.tests.empty")}
      </div>
    );
  }

  // Localize breakdown labels and test names (keeps raw values as fallback)
  const lzName = (raw: string) =>
    t(`profile.tests.name.${raw}`, { defaultValue: raw });
  const lzBreakdown = (k: string) =>
    (
      ({
        Listening: t("profile.tests.labels.listening"),
        Reading: t("profile.tests.labels.reading"),
        Writing: t("profile.tests.labels.writing"),
        Speaking: t("profile.tests.labels.speaking"),
        Math: t("profile.tests.labels.math"),
        English: t("profile.tests.labels.english"),
      }) as Record<string, string>
    )[k] ?? k;

  return (
    <div className="grid grid-cols-1 gap-6 min-[890px]:grid-cols-2">
      {items.map((test, index) => {
        const theme = testThemes[test.name] || testThemes.DEFAULT;

        return (
          <div
            key={index}
            className={cn(
              "flex flex-col overflow-hidden  rounded-xl border shadow-sm transition-all ",
              theme.border,
              theme.gradient,
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between border-b border-gray-200/50 p-5 dark:border-gray-700/50",
                theme.badgeBorder,
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2.5", theme.iconBg)}>
                  {theme.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <Title
                    as="h3"
                    className="text-base font-bold text-gray-900 dark:text-gray-900"
                  >
                    {lzName(test.name)}
                  </Title>
                  <Text className="text-xs text-gray-500 dark:text-gray-600">
                    {test.date}
                  </Text>
                </div>
              </div>
              <Title
                as="h4"
                className={cn("text-4xl font-bold", theme.scoreColor)}
              >
                {test.score}
              </Title>
            </div>

            <div className="flex-1 p-5">
              <div className="mb-3">
                <Text className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-600">
                  {t("profile.tests.score-breakdown")}
                </Text>
              </div>
              <div className="grid grid-cols-4 gap-2 max-[450px]:grid-cols-2">
                {Object.entries(test?.breakdown || {}).map(([skill, score]) =>
                  score ? (
                    <div
                      key={skill}
                      className={cn(
                        "flex flex-col items-center gap-0.5 rounded-lg border px-2.5 py-3 transition-all",
                        theme.badgeBg,
                        theme.badgeBorder,
                      )}
                    >
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-2xl font-bold",
                          theme.scoreColor,
                          "dark:!text-white",
                        )}
                      >
                        {score}
                      </span>
                      <span
                        className={cn(
                          "text-sm font-normal text-gray-700 dark:text-gray-800 ",
                        )}
                      >
                        {lzBreakdown(skill)}
                      </span>
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            {test.file && (
              <div
                className={cn(
                  "border-t border-gray-200/50 px-5 py-3 dark:border-gray-700/50",
                  theme.badgeBorder,
                )}
              >
                <button
                  onClick={async () =>
                    await forceDownload(
                      test?.file?.url ?? "",
                      test?.file?.file_name,
                    )
                  }
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
                    theme.badgeBg,
                    theme.badgeText,
                    "hover:opacity-80 dark:text-white",
                  )}
                >
                  <PiDownload className="h-4 w-4" />
                  {t("profile.tests.actions.download-certificate")}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestScoresTab;
