import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    persistPagination?: boolean;
    tableId?: string;
    persistTtlMs?: number;
    handleDeleteRow?: (row: Row<TData>) => void;
    handleMultipleDelete?: (row: Row<TData>) => void;
  }
  interface ColumnMeta<TData extends RowData, TValue> {
    isColumnDraggable?: boolean;
  }
}
