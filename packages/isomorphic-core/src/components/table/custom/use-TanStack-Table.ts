"use client";

import {
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arraySwap } from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  RowPinningState,
  SortingState,
  TableOptions,
  Updater,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { usePathname } from "next/navigation";

interface ExtendTableOptions<T extends Record<string, unknown>>
  extends Omit<
    TableOptions<T>,
    "data" | "columns" | "getCoreRowModel" | "state"
  > {
  state?: Partial<TableOptions<T>["state"]>;
  initialState?: Partial<TableOptions<T>["initialState"]>;
  meta?: {
    handleDeleteRow?: (row: T) => void;
    handleMultipleDelete?: (rows: T[]) => void;
    persistPagination?: boolean;
    persistTtlMs?: number;
    persistenceKey?: string;
    tableId?: string;
    [key: string]: unknown;
  };
}

type PersistConfig = {
  /** enable/disable persistence for pagination */
  enabled?: boolean;
  /** unique key for storage; if not provided, derived from pathname */
  key?: string;
  /** how long to keep pagination (ms) */
  ttlMs?: number;
};

/**
 * Small persisted-state helpers (sessionStorage + TTL)
 */
function readPersisted<T>(storageKey: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { value: T; expiresAt: number };
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(storageKey);
      return null;
    }
    return parsed.value ?? null;
  } catch {
    sessionStorage.removeItem(storageKey);
    return null;
  }
}

function writePersisted<T>(storageKey: string, value: T, ttlMs: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    storageKey,
    JSON.stringify({ value, expiresAt: Date.now() + ttlMs }),
  );
}

type PersistPaginationMeta = {
  persistPagination?: boolean;
  tableId?: string;
  persistTtlMs?: number;
};

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater;
}

function getPaginationStorageKey(tableId: string) {
  return `tanstack-pagination:${tableId}`;
}

function isSamePagination(left: PaginationState, right: PaginationState) {
  return left.pageIndex === right.pageIndex && left.pageSize === right.pageSize;
}

function readPersistedPagination(
  tableId: string,
  fallback: PaginationState,
  ttlMs?: number
): PaginationState {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(getPaginationStorageKey(tableId));
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as {
      pagination?: PaginationState;
      savedAt?: number;
    };

    if (
      ttlMs &&
      parsed?.savedAt &&
      Date.now() - parsed.savedAt > ttlMs
    ) {
      window.localStorage.removeItem(getPaginationStorageKey(tableId));
      return fallback;
    }

    const persisted = parsed?.pagination;
    if (
      persisted &&
      Number.isFinite(persisted.pageIndex) &&
      Number.isFinite(persisted.pageSize)
    ) {
      return {
        pageIndex: Math.max(0, persisted.pageIndex),
        pageSize: Math.max(1, persisted.pageSize),
      };
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function useTanStackTable<T extends Record<string, any>>({
  options,
  tableData,
  columnConfig,
  persistPagination,
}: {
  tableData: T[];
  options?: ExtendTableOptions<T>;
  columnConfig: ColumnDef<T, any>[];
  persistPagination?: PersistConfig;
}) {
  const pathname = usePathname();

  const [data, setData] = React.useState<T[]>([...tableData]);
  const [columns] = React.useState(() => [...columnConfig]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [internalExpanded, setInternalExpanded] = React.useState<ExpandedState>(
    options?.state?.expanded ?? {},
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!),
  );
  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowPinning, setRowPinning] = React.useState<RowPinningState>({
    top: [],
    bottom: [],
  });

  // ===================================================================================================
  // DnD
  const handleDragEndColumn = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arraySwap(columnOrder, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragEndRow = React.useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.findIndex((item) => item.id === active.id);
        const newIndex = prevData.findIndex((item) => item.id === over.id);
        return arraySwap(prevData, oldIndex, newIndex);
      });
    }
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );
  // ===================================================================================================

  const isExpandedControlled = options?.state?.expanded !== undefined;
  const resolvedExpanded = isExpandedControlled
    ? (options?.state?.expanded as ExpandedState)
    : internalExpanded;

  const handleExpandedChange: TableOptions<T>["onExpandedChange"] = (
    updater,
  ) => {
    if (!isExpandedControlled) {
      setInternalExpanded(updater);
    }
    options?.onExpandedChange?.(updater);
  };

  // Pagination persistence
  const callerControlsPagination = options?.state?.pagination !== undefined;

  const persistEnabled =
    persistPagination?.enabled ?? options?.meta?.persistPagination ?? false;

  const persistTtlMs =
    persistPagination?.ttlMs ?? options?.meta?.persistTtlMs ?? 30 * 60 * 1000; // 30 min default

  const persistKeyBase =
    persistPagination?.key ??
    options?.meta?.persistenceKey ??
    options?.meta?.tableId ??
    "table";

  const persistStorageKey = React.useMemo(() => {
    return `tanstack:pagination:${pathname}:${persistKeyBase}`;
  }, [pathname, persistKeyBase]);

  const fallbackPagination: PaginationState = (options?.state
    ?.pagination as PaginationState) ||
    (options?.initialState?.pagination as PaginationState) || {
      pageIndex: 0,
      pageSize: 10,
    };

  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>(() => {
      if (!persistEnabled || callerControlsPagination)
        return fallbackPagination;
      const saved = readPersisted<PaginationState>(persistStorageKey);
      return saved ?? fallbackPagination;
    });

  React.useEffect(() => {
    if (!persistEnabled || callerControlsPagination) return;
    const saved = readPersisted<PaginationState>(persistStorageKey);
    setInternalPagination(saved ?? fallbackPagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistStorageKey]);

  React.useEffect(() => {
    if (!persistEnabled || callerControlsPagination) return;
    writePersisted(persistStorageKey, internalPagination, persistTtlMs);
  }, [
    persistEnabled,
    callerControlsPagination,
    internalPagination,
    persistStorageKey,
    persistTtlMs,
  ]);

  const resolvedPagination = callerControlsPagination
    ? (options?.state?.pagination as PaginationState)
    : internalPagination;

  const handlePaginationChange: TableOptions<T>["onPaginationChange"] = (
    updater,
  ) => {
    if (callerControlsPagination) {
      options?.onPaginationChange?.(updater);
      return;
    }

    setInternalPagination((old) => {
      const next = typeof updater === "function" ? updater(old) : updater;
      return next;
    });
  };

  const table = useReactTable({
    data,
    columns,
    ...options,
    state: {
      ...options?.state,
      pagination: resolvedPagination,
      sorting,
      expanded: resolvedExpanded,
      rowPinning,
      columnOrder,
      globalFilter,
      columnFilters,
      // pagination: resolvedPagination,
    },

    onPaginationChange: handlePaginationChange,

    getRowCanExpand: () => true,
    onSortingChange: setSorting,
    // onPaginationChange: handlePaginationChange,
    onExpandedChange: handleExpandedChange,
    onRowPinningChange: setRowPinning,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return {
    table,
    dataIds,
    setData,
    sensors,
    tableData: data,
    rowPinning,
    columnOrder,
    globalFilter,
    setRowPinning,
    setColumnOrder,
    setGlobalFilter,
    handleDragEndRow,
    handleDragEndColumn,
  };
}
