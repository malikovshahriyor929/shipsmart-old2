"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useDebounce } from "react-use";
import {
  getFilteredRowModel,
  getSortedRowModel,
  type FilterFn,
} from "@tanstack/react-table";
import {
  Button,
  Checkbox,
  Drawer,
  Input,
  Loader,
  Modal,
  Text,
  Textarea,
} from "rizzui";

import Table from "@core/components/table";
import TablePagination from "@core/components/table/pagination";
import { useTanStackTable } from "@core/components/table/custom/use-TanStack-Table";
import RatingFilters from "./filters";
import { createRatingColumns, type RatingRow } from "./columns";
import { TableSkeleton } from "@core/ui/skeletons/skeletons";
import type { ReviewStudentRatingPayload } from "@core/types/student-ratings";
import { Pen, X } from "lucide-react";

export type RatingResponse = {
  data?: RatingRow[];
  _meta?: {
    total_count?: number;
    page?: number;
    per_page?: number;
    total_pages?: number;
  };
};

export type LookupOption = { value: number; label: string };
export type LookupResponse = {
  rating_status?: LookupOption[];
  rating_category?: LookupOption[];
  rating_progress_status?: LookupOption[];
  region?: LookupOption[];
};

export type StudentCategory = {
  id: number;
  student_id: number;
  category: { value: number; label: string };
  score: number;
  comment?: string | null;
  status: { value: number; label: string };
  attachments: any[];
  created_at: string;
  updated_at: string;
};

export type RatingQueryParams = {
  page: number;
  per_page: number;
  search?: string;
  region_id?: number;
  category_id?: number;
  rating_status?: number;
  rating_progress_status?: number;
};

type RatingTableProps = {
  fetchLookup: () => Promise<LookupResponse>;
  fetchRatings: (params: RatingQueryParams) => Promise<RatingResponse>;
  fetchStudentDetails: (id: string) => Promise<StudentCategory[]>;
  submitReview?: (payload: ReviewStudentRatingPayload) => Promise<any>;
};

const ratingGlobalFilter: FilterFn<RatingRow> = (
  row,
  _columnId,
  filterValue,
) => {
  const search = String(filterValue ?? "")
    .toLowerCase()
    .trim();
  if (!search) return true;

  const haystack = [
    row.original.first_name,
    row.original.last_name,
    row.original.region_name,
    row.original.school_name,
    row.original.student_id,
  ]
    .filter(Boolean)
    .map((item) => String(item).toLowerCase())
    .join(" ");

  return haystack.includes(search);
};

export default function RatingTable({
  fetchLookup,
  fetchRatings,
  fetchStudentDetails,
  submitReview,
}: RatingTableProps) {
  const t = useTranslations();
  const columns = useMemo(() => createRatingColumns(t), [t]);

  const [rows, setRows] = useState<RatingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const [regionId, setRegionId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [progressId, setProgressId] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [details, setDetails] = useState<
    Record<
      string,
      { loading?: boolean; data?: StudentCategory[] | null; error?: string }
    >
  >({});
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editScore, setEditScore] = useState("");
  const [editComment, setEditComment] = useState("");
  const [editIsAccepted, setEditIsAccepted] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lookup, setLookup] = useState<LookupResponse>({
    rating_status: [],
    rating_category: [],
    rating_progress_status: [],
    region: [],
  });

  const fetchDetails = useCallback(
    async (id: string) => {
      try {
        setDetails((prev) => ({
          ...prev,
          [id]: { ...(prev[id] ?? {}), loading: true, error: undefined },
        }));

        const list = await fetchStudentDetails(id);

        setDetails((prev) => ({
          ...prev,
          [id]: { loading: false, data: list },
        }));
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t("rating.loadFailed", { default: "Failed to load rating" });
        toast.error(msg);
        setDetails((prev) => ({
          ...prev,
          [id]: { loading: false, error: msg, data: [] },
        }));
      }
    },
    [fetchStudentDetails, t],
  );

  const { table, setData } = useTanStackTable<RatingRow>({
    tableData: [],
    columnConfig: columns,
    options: {
      state: { expanded },
      onExpandedChange: (updater) => {
        setExpanded((prev) => {
          const nextState = (
            typeof updater === "function" ? updater(prev) : updater || {}
          ) as Record<string, boolean>;

          // figure out which row changed compared to previous state
          const mergedKeys = new Set([
            ...Object.keys(prev),
            ...Object.keys(nextState),
          ]);
          const changedKey = Array.from(mergedKeys).find(
            (key) => (prev[key] ?? false) !== (nextState[key] ?? false),
          );

          // enforce single open row
          const openEntries = Object.entries(nextState).filter(([, isOpen]) =>
            Boolean(isOpen),
          );

          if (!openEntries.length) return {};

          // prefer the recently changed row if it is now open, else fall back to last open entry
          const targetId =
            (changedKey && nextState[changedKey] && changedKey) ||
            openEntries[openEntries.length - 1][0];

          return { [targetId]: true };
        });
      },
      manualPagination: true,
      pageCount,
      enableRowSelection: false,
      enableColumnResizing: false,
      meta: {
        persistPagination: true,
        tableId: "ratingStudent",
        persistTtlMs: 30 * 60 * 1000,
      },
      getRowCanExpand: () => true,
      globalFilterFn: ratingGlobalFilter,
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      getRowId: (row) =>
        String(
          row.student?.id ??
            row.student_id ??
            row.rank ??
            `${row.first_name}-${row.last_name}`,
        ),
    },
  });

  const globalFilter = (table.getState().globalFilter as string) ?? "";
  const { pageIndex, pageSize } = table.getState().pagination;
  const [debouncedSearch, setDebouncedSearch] = useState(globalFilter);
  const didRunInitialSearchDebounce = useRef(false);

  useDebounce(
    () => {
      setDebouncedSearch(globalFilter);
      if (!didRunInitialSearchDebounce.current) {
        didRunInitialSearchDebounce.current = true;
        return;
      }
      table.setPageIndex(0);
    },
    400,
    [globalFilter],
  );

  useEffect(() => {
    let ignore = false;
    const fetchLookupData = async () => {
      try {
        const res = await fetchLookup();
        if (ignore) return;
        setLookup(res ?? {});
      } catch (err: any) {
        if (ignore) return;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t("rating.lookupFailed", { default: "Failed to load filters" });
        toast.error(msg);
      }
    };

    fetchLookupData();
    return () => {
      ignore = true;
    };
  }, [fetchLookup, t]);

  // fetch details whenever an entry is opened (force fetch to avoid stale/missed)
  useEffect(() => {
    const openId =
      Object.entries(expanded).find(([, isOpen]) => isOpen)?.[0] ?? null;
    if (!openId) return;

    fetchDetails(openId);
  }, [expanded, fetchDetails]);

  useEffect(() => {
    let ignore = false;
    const loadRatings = async () => {
      try {
        setLoading(true);
        const params: RatingQueryParams = {
          page: pageIndex + 1,
          per_page: pageSize,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (regionId) params.region_id = Number(regionId);
        if (categoryId) params.category_id = Number(categoryId);
        if (statusId) params.rating_status = Number(statusId);
        if (progressId) params.rating_progress_status = Number(progressId);

        const res = await fetchRatings(params);

        if (ignore) return;

        const payload: RatingResponse = res ?? {};
        const list = payload.data ?? [];
        const meta = payload._meta ?? {};

        setRows(list);
        setData(list);

        const perPage = meta.per_page ?? pageSize;
        const totalPages =
          meta.total_pages ??
          (meta.total_count && perPage
            ? Math.ceil((meta.total_count as number) / perPage)
            : 0);

        setPageCount(totalPages || 1);
      } catch (err: any) {
        if (ignore) return;
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          t("rating.loadFailed", { default: "Failed to load rating" });
        toast.error(msg);
        setRows([]);
        setData([]);
        setPageCount(0);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadRatings();

    return () => {
      ignore = true;
    };
  }, [
    pageIndex,
    pageSize,
    debouncedSearch,
    regionId,
    categoryId,
    statusId,
    progressId,
    refreshKey,
    setData,
    fetchRatings,
    t,
  ]);

  const isFiltering = Boolean(
    regionId || categoryId || statusId || progressId || globalFilter,
  );

  const handleRegionChange = (value: string) => {
    setRegionId(value);
    table.setPageIndex(0);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    table.setPageIndex(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusId(value);
    table.setPageIndex(0);
  };

  const handleProgressChange = (value: string) => {
    setProgressId(value);
    table.setPageIndex(0);
  };

  const handleReset = () => {
    setRegionId("");
    setCategoryId("");
    setStatusId("");
    setProgressId("");
    setExpanded({});
    table.resetGlobalFilter();
    table.setPageIndex(0);
  };

  const handleStartEdit = (item: StudentCategory) => {
    setEditingItemId(item.id);
    setEditScore(String(item.score ?? ""));
    setEditComment(item.comment ?? "");
    setEditIsAccepted(true);
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditScore("");
    setEditComment("");
    setEditIsAccepted(true);
  };

  const handleSubmitEdit = async (
    studentId: string,
    item: StudentCategory,
    isAccepted: boolean = true,
  ) => {
    if (!submitReview) return;

    const normalizedScore =
      editScore.trim() === "" ? Number.NaN : Number(editScore.trim());

    if (!Number.isFinite(normalizedScore) || normalizedScore < 0) {
      toast.error(
        t("rating.edit.invalidScore", {
          default: "Please enter a valid score",
        }),
      );
      return;
    }

    try {
      setReviewSubmitting(true);
      await submitReview({
        student_rating_id: item.id,
        is_accepted: isAccepted,
        score: normalizedScore,
        comment: editComment.trim(),
      });

      setDetails((prev) => {
        const current = prev[studentId]?.data ?? [];
        return {
          ...prev,
          [studentId]: {
            ...prev[studentId],
            data: current.map((row) =>
              row.id === item.id
                ? {
                    ...row,
                    score: normalizedScore,
                    comment: editComment.trim(),
                  }
                : row,
            ),
          },
        };
      });

      toast.success(
        t("rating.edit.success", { default: "Rating updated successfully" }),
      );
      setRefreshKey((prev) => prev + 1);
      await fetchDetails(studentId);
      handleCancelEdit();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          t("rating.edit.failed", { default: "Failed to update rating" }),
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderExpanded = (row: any) => {
    const id = row?.id as string;
    const detail = details[id];
    const items = detail?.data ?? [];

    if (detail?.loading) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader />
        </div>
      );
    }

    if (detail?.error) {
      return (
        <Text className="px-4 py-4 text-sm text-red-600">{detail.error}</Text>
      );
    }

    if (!items.length) {
      return (
        <Text className="px-4 py-4 text-sm text-gray-500">
          {t("rating.empty", { default: "No rating data." })}
        </Text>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <Text className="text-sm font-semibold text-gray-900">
                  {item.category?.label ?? "—"}
                </Text>
                <Text className="text-xs text-gray-500">
                  {item.updated_at ?? "—"}
                </Text>
              </div>
              <div className="flex items-center gap-4">
                <Text className="text-lg font-bold text-green-500">
                  {item.score ?? 0} {t("rating.point", { default: "point" })}
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    handleStartEdit(item);
                  }}
                  className="flex items-center gap-1"
                >
                  <Pen size={14} />  {t("commons.edit", { default: "Edit" })}
                </Button>
              </div>
            </div>
            {/* Edit Rating Modal - Moved outside of expanded row to avoid state issues */}
            {editingItemId === item.id && (
              <Modal
                onClose={handleCancelEdit}
                isOpen={editingItemId !== null}
                overlayClassName="bg-black/10 backdrop-blur-sm flex items-center justify-center p-4"
                // className="max-w-2xl"
                size="lg"
              >
                <div className="px-6 md:min-w-[600px] mt-3 space-y-4 rounded-lg border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between border-b border-gray-200 py-4">
                    <h1 className="text-lg font-semibold">
                      {" "}
                      {t("rating.edit.title", { default: "Edit Rating" })}{" "}
                    </h1>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-3 ">
                    <Input
                      type="text"
                      label={t("rating.columns.score", { default: "Score" })}
                      value={editScore}
                      onChange={(e) =>
                        setEditScore(e.target.value.replace(/[^0-9]/g, ""))
                      }
                      placeholder="0"
                      className="w-full"
                    />
                    <Textarea
                      label={t("rating.comment", { default: "Comment" })}
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      placeholder={t("rating.edit.commentPlaceholder", {
                        default: "Add comment",
                      })}
                      rows={3}
                      className="w-full"
                    />
                    <Checkbox
                      label={t("rating.edit.isAccepted", {
                        default: "Is accepted",
                      })}
                      checked={editIsAccepted}
                      onChange={(e) => setEditIsAccepted(e.target.checked)}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={reviewSubmitting}
                      >
                        {t("commons.cancel", { default: "Cancel" })}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleSubmitEdit(id, item, editIsAccepted)
                        }
                        isLoading={reviewSubmitting}
                        disabled={reviewSubmitting}
                      >
                        {t("commons.save", { default: "Save" })}
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
            {/* {submitReview && editingItemId === item.id ? (
              <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-white p-3">
                <Input
                  type="text"
                  label={t('rating.columns.score', { default: 'Score' })}
                  value={editScore}
                  onChange={(e) =>
                    setEditScore(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="0"
                />
                <Textarea
                  label={t('rating.comment', { default: 'Comment' })}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder={t('rating.edit.commentPlaceholder', {
                    default: 'Add comment',
                  })}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={reviewSubmitting}
                  >
                    {t('commons.cancel', { default: 'Cancel' })}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmitEdit(id, item)}
                    isLoading={reviewSubmitting}
                    disabled={reviewSubmitting}
                  >
                    {t('commons.save', { default: 'Save' })}
                  </Button>
                </div>
              </div>
            ) : submitReview ? (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                <Text className="text-xs text-gray-500">
                  {t('rating.columns.score', { default: 'Score' })}
                </Text>
                <Text className="text-base font-bold text-green-500">
                  {item.score ?? 0} {t('rating.point', { default: 'point' })}
                </Text>
              </div>
            ) : null} */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="">
      <RatingFilters
        table={table}
        regionId={regionId}
        categoryId={categoryId}
        statusId={statusId}
        progressId={progressId}
        categoryOptions={lookup.rating_category ?? []}
        statusOptions={lookup.rating_status ?? []}
        progressOptions={lookup.rating_progress_status ?? []}
        regionOptions={lookup.region ?? []}
        onRegionChange={handleRegionChange}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onProgressChange={handleProgressChange}
        onReset={handleReset}
        isFiltering={isFiltering}
        loading={loading}
      />

      {loading && rows.length === 0 ? (
        // <div className="flex items-center justify-center py-10">
        // {/* <Loader /> */}
        <TableSkeleton withFooter withHeader rows={10} columns={5} />
      ) : (
        // </div>
        <>
          <Table
            table={table}
            variant="modern"
            components={{ expandedComponent: renderExpanded }}
            classNames={{
              container: "border border-muted rounded-md",
              rowClassName:
                "last:border-0 hover:bg-gray-50 cursor-pointer transition-colors",
            }}
          />
          <TablePagination table={table} className="py-4" />
        </>
      )}

      {!loading && rows.length === 0 ? (
        <Text className="text-sm text-gray-500">
          {t("rating.empty", { default: "No rating data." })}
        </Text>
      ) : null}
    </div>
  );
}
