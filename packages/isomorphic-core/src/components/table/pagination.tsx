"use client";

import { type Table as ReactTableType } from "@tanstack/react-table";
import {
  ActionIcon,
  Box,
  Flex,
  Grid,
  Select,
  SelectOption,
  Text,
} from "rizzui";
import {
  PiCaretLeftBold,
  PiCaretRightBold,
  PiCaretDoubleLeftBold,
  PiCaretDoubleRightBold,
} from "react-icons/pi";
import cn from "@core/utils/class-names";
import { t } from "i18next";

const options = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 15, label: "15" },
  { value: 20, label: "20" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

export default function TablePagination<TData extends Record<string, any>>({
  table,
  showSelectedCount = false,
  className,
  expandRowsCount = true,
}: {
  table: ReactTableType<TData>;
  showSelectedCount?: boolean;
  className?: string;
  expandRowsCount?: boolean;
}) {
  return (
    <Flex
      gap="6"
      align="center"
      justify="between"
      className={cn("@container", className)}
    >
      <Flex align="center" className={cn("w-auto shrink-0")}>
        <Text className="hidden font-normal text-gray-600 @md:block">
          {t("commons.pagination.rows-per-page")}
        </Text>
        <Select
          size="sm"
          variant="flat"
          options={options}
          className="w-12 dark:text-white"
          disabled={!expandRowsCount}
          value={table.getState().pagination.pageSize}
          onChange={(v: SelectOption) => {
            const nextSize = Number(v.value);
            table.setPageSize(nextSize);
            table.setPageIndex(0);
          }}
          suffixClassName="[&>svg]:size-3"
          selectClassName="font-semibold text-xs ring-0 shadow-sm h-7 dark:bg-gray-100"
          dropdownClassName="!z-[9999]"
          optionClassName="font-medium text-xs px-2 justify-center"
        />
      </Flex>

      {showSelectedCount && (
        <Box className="hidden @2xl:block w-full">
          <Text>
            {t("commons.pagination.selected-count", {
              selected: table.getFilteredSelectedRowModel().rows.length,
              total: table.getFilteredRowModel().rows.length,
            })}
          </Text>
        </Box>
      )}

      <Flex justify="end" align="center">
        <Text className="hidden font-normal text-gray-600 @3xl:block">
          {t("commons.pagination.page-x-of-y", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount().toLocaleString(),
          })}
        </Text>

        <Grid gap="2" columns="4">
          <ActionIcon
            size="sm"
            rounded="lg"
            variant="outline"
            type="button"
            aria-label={t("commons.pagination.aria-first") ?? "Go to first page"}
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
          >
            <PiCaretDoubleLeftBold className="size-3.5" />
          </ActionIcon>

          <ActionIcon
            size="sm"
            rounded="lg"
            variant="outline"
            type="button"
            aria-label={t("commons.pagination.aria-prev") ?? "Go to previous page"}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
          >
            <PiCaretLeftBold className="size-3.5" />
          </ActionIcon>

          <ActionIcon
            size="sm"
            rounded="lg"
            variant="outline"
            type="button"
            aria-label={t("commons.pagination.aria-next") ?? "Go to next page"}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
          >
            <PiCaretRightBold className="size-3.5" />
          </ActionIcon>

          <ActionIcon
            size="sm"
            rounded="lg"
            variant="outline"
            type="button"
            aria-label={t("commons.pagination.aria-last") ?? "Go to last page"}
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            className="text-gray-900 shadow-sm disabled:text-gray-400 disabled:shadow-none dark:bg-gray-100 dark:border-gray-100"
          >
            <PiCaretDoubleRightBold className="size-3.5" />
          </ActionIcon>
        </Grid>
      </Flex>
    </Flex>
  );
}
