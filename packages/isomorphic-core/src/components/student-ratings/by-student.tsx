"use client";

import { type ComponentType, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { createColumnHelper } from "@tanstack/react-table";
import { ActionIcon, Badge, Button, Text, Title, Tooltip } from "rizzui";
import cn from "@core/utils/class-names";
import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import { TableSkeleton } from "@core/ui/skeletons/skeletons";
import { formatDate } from "@core/utils/format-date";
import { fullName } from "@core/utils/course-utils";
import { StudentRating, StudentRatingResponse } from "@core/types/student-ratings";
import { _Meta } from "@core/types";
import {
  PiArrowLeftBold,
  PiCheckCircleBold,
  PiClockCountdownBold,
  PiEye,
  PiPaperclip,
  PiXCircleBold,
} from "react-icons/pi";
import AvatarCard from "@core/ui/avatar-card";

type RatingStatusCode = 1 | 2 | 3;

type GetStudentRatingsByStudentParams = {
  page?: number;
  per_page?: number;
  status?: number;
  category?: number;
};

export type FetchRatingsByStudentFn = (
  studentId: number | string,
  params?: GetStudentRatingsByStudentParams
) => Promise<StudentRatingResponse>;

type TabItem = {
  status: RatingStatusCode;
  titleKey: string;
  title: string;
  subtitleKey: string;
  subtitle: string;
  color: "warning" | "success" | "danger";
  icon: ComponentType<{ className?: string }>;
};

type RatingsByStudentProps = {
  studentId: string;
  fetchRatingsByStudent: FetchRatingsByStudentFn;
  onBackToTable: () => void;
  onOpenRatingDetails: (ratingId: number | string) => void;
};

const STATUS_ORDER: RatingStatusCode[] = [1, 2, 3];
const DEFAULT_PER_PAGE = 200;

const EMPTY_ROWS: Record<RatingStatusCode, StudentRating[]> = {
  1: [],
  2: [],
  3: [],
};

const EMPTY_COUNTS: Record<RatingStatusCode, number> = {
  1: 0,
  2: 0,
  3: 0,
};

const DEFAULT_META: _Meta = {
  total: 0,
  page: 1,
  per_page: DEFAULT_PER_PAGE,
  total_pages: 0,
};

const TAB_ITEMS: TabItem[] = [
  {
    status: 1,
    titleKey: "studentRatings.tab-in-review",
    title: "In Review",
    subtitleKey: "studentRatings.tab-in-review-subtitle",
    subtitle: "Waiting for decision",
    color: "warning",
    icon: PiClockCountdownBold,
  },
  {
    status: 2,
    titleKey: "studentRatings.tab-approved",
    title: "Approved",
    subtitleKey: "studentRatings.tab-approved-subtitle",
    subtitle: "Accepted ratings",
    color: "success",
    icon: PiCheckCircleBold,
  },
  {
    status: 3,
    titleKey: "studentRatings.tab-rejected",
    title: "Rejected",
    subtitleKey: "studentRatings.tab-rejected-subtitle",
    subtitle: "Declined ratings",
    color: "danger",
    icon: PiXCircleBold,
  },
];

const columnHelper = createColumnHelper<StudentRating>();

function normalizeListResponse(raw: StudentRatingResponse): {
  rows: StudentRating[];
  meta: _Meta;
} {
  if (raw && Array.isArray(raw.data)) {
    return {
      rows: raw.data,
      meta: raw._meta ?? DEFAULT_META,
    };
  }

  return {
    rows: [],
    meta: DEFAULT_META,
  };
}

function parseDateTime(value?: string): Date | null {
  if (!value) return null;
  const parsed = new Date(value.includes(" ") ? value.replace(" ", "T") : value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getScoreColor(score: number | null): "success" | "warning" | "danger" | "info" {
  const normalized = Number(score ?? 0);
  if (normalized >= 20) return "success";
  if (normalized >= 10) return "warning";
  return "danger";
}

function getStatusColor(statusLabel: string): "success" | "warning" | "danger" | "info" {
  if (statusLabel === "Approved") return "success";
  if (statusLabel === "Rejected") return "danger";
  if (statusLabel === "Review") return "warning";
  return "info";
}

function getCategoryColor(categoryValue?: number): string {
  const colors: Record<number, string> = {
    1: "bg-indigo-100 text-indigo-700",
    2: "bg-emerald-100 text-emerald-700",
    3: "bg-orange-100 text-orange-700",
    4: "bg-rose-100 text-rose-700",
    5: "bg-sky-100 text-sky-700",
    6: "bg-slate-100 text-slate-700",
    7: "bg-violet-100 text-violet-700",
    8: "bg-teal-100 text-teal-700",
    9: "bg-pink-100 text-pink-700",
    10: "bg-amber-100 text-amber-700",
  };

  if (categoryValue === null || categoryValue === undefined) {
    return "bg-gray-100 text-gray-700";
  }
  return colors[categoryValue] || "bg-gray-100 text-gray-700";
}

function getByStudentColumns(
  onOpenRatingDetails: (ratingId: number | string) => void,
  t: (key: string) => string
) {
  return [
    columnHelper.accessor("id", {
      id: "id",
      size: 80,
      header: () => (
        <Text className="font-semibold text-gray-500">
          {t("rating.columns.studentId") ?? "ID"}
        </Text>
      ),
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">#{row.original.id}</Text>
      ),
    }),

    columnHelper.accessor("category.label", {
      id: "category",
      size: 200,
      header: () => (
        <Text className="font-semibold text-gray-500">
          {t("rating.filters.category") ?? "Category"}
        </Text>
      ),
      cell: ({ row }) => (
        <Badge
          variant="flat"
          className={cn("font-medium", getCategoryColor(row.original.category?.value))}
        >
          {row.original.category?.label}
        </Badge>
      ),
    }),

    columnHelper.accessor("score", {
      id: "score",
      size: 110,
      header: () => (
        <Text className="font-semibold text-gray-500">
          {t("rating.columns.score") ?? "Score"}
        </Text>
      ),
      cell: ({ row }) => (
        <Badge color={getScoreColor(row.original.score)} variant="flat">
          {row.original.score ?? 0}
        </Badge>
      ),
    }),

    columnHelper.accessor("status.label", {
      id: "status",
      size: 150,
      header: () => (
        <Text className="font-semibold text-gray-500">
          {t("commons.status") ?? "Status"}
        </Text>
      ),
      cell: ({ row }) => {
        const statusLabel =
          row.original.status?.label ?? (t("studentRatings.status-unknown") ?? "Unknown");
        const color = getStatusColor(statusLabel);
        const textColorClass =
          color === "success"
            ? "text-green-600"
            : color === "warning"
              ? "text-yellow-600"
              : color === "danger"
                ? "text-red-600"
                : "text-blue-600";

        return (
          <div className="flex items-center gap-1">
            <Badge renderAsDot color={color} />
            <Text className={cn(textColorClass, "font-medium")}>{statusLabel}</Text>
          </div>
        );
      },
    }),

    columnHelper.accessor((row) => row.attachments?.length, {
      id: "attachments",
      size: 120,
      header: () => (
        <Text className="w-full text-center font-semibold text-gray-500">
          {t("commons.files") ?? "Files"}
        </Text>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1 text-gray-600">
          <PiPaperclip className="h-4 w-4" />
          <Text>{row.original.attachments?.length ?? 0}</Text>
        </div>
      ),
    }),

    columnHelper.accessor("updated_at", {
      id: "updated_at",
      size: 180,
      header: () => (
        <Text className="font-semibold text-gray-500">
          {t("commons.updated-at") ?? "Updated At"}
        </Text>
      ),
      cell: ({ row }) => {
        const dt = parseDateTime(row.original.updated_at);
        return (
          <Text className="text-gray-600">{dt ? formatDate(dt, "D MMMM, YYYY") : "—"}</Text>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      size: 90,
      header: () => (
        <Text className="w-full text-end font-semibold text-gray-500">
          {t("commons.actions") ?? "Actions"}
        </Text>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <Tooltip
            color="invert"
            size="sm"
            content={t("studentRatings.tooltip-view-details") ?? "View Rating Details"}
            placement="top"
          >
            <ActionIcon
              size="sm"
              variant="outline"
              aria-label={t("studentRatings.tooltip-view-details") ?? "View Rating Details"}
              className="cursor-pointer hover:border-primary hover:text-primary"
              onClick={() => onOpenRatingDetails(row.original.id)}
            >
              <PiEye className="h-4 w-4" />
            </ActionIcon>
          </Tooltip>
        </div>
      ),
    }),
  ];
}

export default function RatingsByStudent({
  studentId,
  fetchRatingsByStudent,
  onBackToTable,
  onOpenRatingDetails,
}: RatingsByStudentProps) {
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<RatingStatusCode>(1);
  const [rowsByStatus, setRowsByStatus] = useState<Record<RatingStatusCode, StudentRating[]>>(
    EMPTY_ROWS
  );
  const [countsByStatus, setCountsByStatus] = useState<Record<RatingStatusCode, number>>(
    EMPTY_COUNTS
  );

  const columns = useMemo(
    () => getByStudentColumns(onOpenRatingDetails, t),
    [onOpenRatingDetails, t]
  );

  const { table, setData } = useTanStackTable<StudentRating>({
    tableData: [],
    columnConfig: columns,
    options: {
      enableColumnResizing: false,
      enableSorting: false,
      initialState: {
        pagination: { pageIndex: 0, pageSize: 10 },
      },
    },
  });

  useEffect(() => {
    let alive = true;

    const fetchByStudent = async () => {
      setLoading(true);
      setActiveStatus(1);
      setRowsByStatus({ 1: [], 2: [], 3: [] });
      setCountsByStatus({ 1: 0, 2: 0, 3: 0 });

      try {
        const responses = await Promise.all(
          STATUS_ORDER.map(async (status) => {
            const response = await fetchRatingsByStudent(studentId, {
              page: 1,
              per_page: DEFAULT_PER_PAGE,
              status,
            });
            return { status, response };
          })
        );

        if (!alive) return;

        const nextRows: Record<RatingStatusCode, StudentRating[]> = {
          1: [],
          2: [],
          3: [],
        };
        const nextCounts: Record<RatingStatusCode, number> = {
          1: 0,
          2: 0,
          3: 0,
        };

        responses.forEach(({ status, response }) => {
          const { rows, meta } = normalizeListResponse(response);
          nextRows[status] = rows;
          nextCounts[status] = meta?.total ?? rows.length;
        });

        setRowsByStatus(nextRows);
        setCountsByStatus(nextCounts);
      } catch (err: any) {
        if (!alive) return;
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            (t("studentRatings.load-ratings-failed") ?? "Failed to load ratings for this student.")
        );
        setRowsByStatus({ 1: [], 2: [], 3: [] });
        setCountsByStatus({ 1: 0, 2: 0, 3: 0 });
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchByStudent();

    return () => {
      alive = false;
    };
  }, [studentId, fetchRatingsByStudent, t]);

  const tabItems = useMemo(
    () =>
      TAB_ITEMS.map((tab) => ({
        ...tab,
        title: t(tab.titleKey) ?? tab.title,
        subtitle: t(tab.subtitleKey) ?? tab.subtitle,
        count: countsByStatus[tab.status] ?? 0,
      })),
    [countsByStatus, t]
  );

  const activeRows = useMemo(() => {
    const rows = [...(rowsByStatus[activeStatus] ?? [])];
    rows.sort((a, b) => {
      const left = parseDateTime(a.updated_at)?.getTime() ?? 0;
      const right = parseDateTime(b.updated_at)?.getTime() ?? 0;
      return right - left;
    });
    return rows;
  }, [rowsByStatus, activeStatus]);

  useEffect(() => {
    setData(activeRows);
    table.setPageIndex(0);
  }, [activeRows, setData, table]);

  const student = useMemo(() => {
    for (const status of STATUS_ORDER) {
      const rows = rowsByStatus[status];
      if (rows?.length) return rows[0].student;
    }
    return null;
  }, [rowsByStatus]);

  const totalRequests = useMemo(
    () => STATUS_ORDER.reduce((sum, status) => sum + (countsByStatus[status] ?? 0), 0),
    [countsByStatus]
  );

  const currentTab = useMemo(
    () => tabItems.find((tab) => tab.status === activeStatus) ?? tabItems[0],
    [tabItems, activeStatus]
  );

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-muted bg-gradient-to-r from-slate-50 via-white to-blue-50 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start justify-start gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-muted bg-white/70 text-gray-700 hover:bg-white"
              onClick={onBackToTable}
            >
              <PiArrowLeftBold className="me-1.5 h-4 w-4" />
              {t("studentRatings.back-to-table") ?? "Back to table"}
            </Button>

            <Text className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              {t("studentRatings.rating-request-timeline") ?? "Rating Request Timeline"}
            </Text>
            <AvatarCard
              src={student?.avatar?.url ?? ""}
              name={
                student
                  ? fullName(student)
                  : `${t("commons.role.student") ?? "Student"} #${studentId}`
              }
              nameClassName="text-lg font-medium"
              description={
                <Text className="text-sm text-gray-600">
                  {student?.student_no
                    ? `${t("studentRatings.student-no") ?? "Student No"}: ${student.student_no}`
                    : `${t("students.student-id") ?? "Student ID"}: ${studentId}`}
                </Text>
              }
              isOnline={student?.online}
              avatarProps={{
                name: student
                  ? fullName(student)
                  : `${t("commons.role.student") ?? "Student"} #${studentId}`,
                size: "lg",
                rounded: "md",
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="flat" color="info" className="px-3 py-1 text-white">
              {totalRequests}{" "}
              {t("studentRatings.total-requests-suffix") ?? "total requests"}
            </Badge>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label={t("studentRatings.tabs-aria-label") ?? "Rating status tabs"}
        className="grid gap-3 md:grid-cols-3"
      >
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          const active = tab.status === activeStatus;

          return (
            <button
              key={tab.status}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveStatus(tab.status)}
              className={cn(
                "rounded-xl border p-3 text-left transition",
                active
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-muted bg-white hover:border-gray-300"
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-700" />
                  <Text className="font-semibold text-gray-900">{tab.title}</Text>
                </div>
                <Badge color={tab.color} variant={active ? "solid" : "flat"}>
                  {tab.count}
                </Badge>
              </div>
              <Text className="text-xs text-gray-500">{tab.subtitle}</Text>
            </button>
          );
        })}
      </div>

      {loading ? (
        <TableSkeleton withFooter={false} rows={10} columns={7} />
      ) : activeRows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-muted bg-gray-50 p-10 text-center">
          <Title as="h5" className="mb-1 text-gray-800">
            {t("studentRatings.no-requests-found") ?? "No requests found"}
          </Title>
          <Text className="text-sm text-gray-500">
            {t("studentRatings.empty-requests-desc") ??
              "This student has no ratings in the selected status."}
          </Text>
        </div>
      ) : (
        <>
          <Table
            table={table}
            variant="modern"
            classNames={{
              container: "border border-muted dark:border-gray-200 rounded-md",
              rowClassName: "last:border-0 hover:bg-gray-50",
            }}
          />
          <TablePagination table={table} className="py-4" />
        </>
      )}
    </div>
  );
}
