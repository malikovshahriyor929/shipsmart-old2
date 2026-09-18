// // "use client";

// // import { PiTextColumns } from "react-icons/pi";
// // import { ActionIcon, Checkbox, Popover, Title } from "rizzui";
// // import { type Table as ReactTableType } from "@tanstack/react-table";

// // export default function ToggleColumns<TData extends Record<string, any>>({
// //   table,
// // }: {
// //   table: ReactTableType<TData>;
// // }) {
// //   return (
// //     <Popover shadow="sm" placement="bottom-end">
// //       <Popover.Trigger>
// //         <ActionIcon
// //           variant="outline"
// //           title="Toggle Columns"
// //           className="h-9 p-1"
// //         >
// //           <PiTextColumns strokeWidth={3} className="size-6" />
// //         </ActionIcon>
// //       </Popover.Trigger>
// //       <Popover.Content className="z-0">
// //         <div className="p-2 text-left rtl:text-right">
// //           <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
// //             Toggle Columns
// //           </Title>
// //           <div className="grid grid-cols-2 gap-6">
// //             {table.getAllLeafColumns().map((column) => {
// //               return (
// //                 typeof column.columnDef.header === "string" &&
// //                 column.columnDef.header.length > 0 && (
// //                   <Checkbox
// //                     key={column.id}
// //                     label={<>{column.columnDef.header}</>}
// //                     checked={column.getIsVisible()}
// //                     onChange={column.getToggleVisibilityHandler()}
// //                   />
// //                 )
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </Popover.Content>
// //     </Popover>
// //   );
// // }

// 'use client';

// import { useEffect, useMemo, useRef } from 'react';
// import { PiTextColumns } from 'react-icons/pi';
// import { ActionIcon, Checkbox, Popover, Title } from 'rizzui';
// import { type Table as ReactTableType } from '@tanstack/react-table';

// type Props<TData extends Record<string, any>> = {
//   table: ReactTableType<TData>;
//   /** Optional key for localStorage; otherwise derived from column ids */
//   storageKey?: string;
// };
// const DEFAULT_LABELS: Record<string, string> = {
//   student: 'Student',
//   ieltsOverall: 'IELTS Overall',
//   ieltsListening: 'IELTS Listening',
//   ieltsReading: 'IELTS Reading',
//   ieltsWriting: 'IELTS Writing',
//   ieltsSpeaking: 'IELTS Speaking',
//   satOverall: 'SAT Overall',
//   satMath: 'SAT Math',
//   satEnglish: 'SAT English',
// };
// export default function ToggleColumns<TData extends Record<string, any>>({
//   table,
//   storageKey,
// }: Props<TData>) {
//   // Build a stable key (per table/column set) if not provided
//   const columnIdsSig = useMemo(
//     () => table.getAllLeafColumns().map((c) => c.id).sort().join('|'),
//     [table]
//   );
//   const lsKey = useMemo(
//     () => storageKey ?? `table:columns:visibility:${columnIdsSig}`,
//     [storageKey, columnIdsSig]
//   );

//   // Apply saved visibility only once after mount
//   const appliedFromStorage = useRef(false);
//   useEffect(() => {
//     if (appliedFromStorage.current) return;
//     if (typeof window === 'undefined') return;

//     try {
//       const raw = localStorage.getItem(lsKey);
//       if (!raw) {
//         appliedFromStorage.current = true;
//         return;
//       }
//       const saved = JSON.parse(raw) as Record<string, boolean>;
//       if (saved && typeof table.setColumnVisibility === 'function') {
//         table.setColumnVisibility(saved);
//       } else {
//         // Fallback: toggle individually
//         table.getAllLeafColumns().forEach((col) => {
//           if (typeof saved?.[col.id] === 'boolean') {
//             col.toggleVisibility(saved[col.id]);
//           }
//         });
//       }
//     } catch {
//       // ignore parse errors; proceed with defaults
//     } finally {
//       appliedFromStorage.current = true;
//     }
//   }, [lsKey, table]);

//   // Persist on every visibility change (after initial apply)
//   const visibilityJSON = useMemo(
//     () => JSON.stringify(table.getState().columnVisibility ?? {}),
//     [table.getState().columnVisibility]
//   );
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     if (!appliedFromStorage.current) return; // wait until loaded
//     localStorage.setItem(lsKey, visibilityJSON);
//   }, [visibilityJSON, lsKey]);

//   return (
//     <Popover shadow="sm" placement="bottom-end">
//       <Popover.Trigger>
//         <ActionIcon variant="outline" title="Toggle Columns" className="h-9 p-1">
//           <PiTextColumns strokeWidth={ 3 } className="size-6" />
//         </ActionIcon>
//       </Popover.Trigger>
//       <Popover.Content className="z-0">
//         <div className="p-2 text-left rtl:text-right">
//           <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
//             Toggle Columns
//           </Title>
//           <div className="grid grid-cols-2 gap-6">
//             { table.getAllLeafColumns().map((column) =>
//               typeof column.columnDef.header === 'string' &&
//                 column.columnDef.header.length > 0 ? (
//                 <Checkbox
//                   key={ column.id }
//                   label={ <>{ column.columnDef.header }</> }
//                   checked={ column.getIsVisible() }
//                   onChange={ column.getToggleVisibilityHandler() }
//                 />
//               ) : null
//             ) }
//           </div>
//         </div>
//       </Popover.Content>
//     </Popover>
//   );
// }

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { PiTextColumns } from 'react-icons/pi';
import { ActionIcon, Checkbox, Popover, Title } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { t } from 'i18next';

type Props<T extends Record<string, any>> = {
  table: ReactTableType<T>;
  storageKey?: string;
  /** Optional: custom labels by column id (overrides auto label) */
  labelMap?: Record<string, string>;
};

function humanize(id: string) {
  const base = id
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, c => c.toUpperCase());

  // keep common acronyms uppercase
  const ACR = new Set(['ID', 'URL', 'GPA', 'IELTS', 'SAT', 'OTP', 'API', 'PDF']);
  return base.split(' ').map(w => (ACR.has(w.toUpperCase()) ? w.toUpperCase() : w)).join(' ');
}

export default function ToggleColumns<TData extends Record<string, any>>({
  table,
  storageKey,
  labelMap,
}: Props<TData>) {
  // stable per-table storage key
  const columnIdsSig = useMemo(
    () => table.getAllLeafColumns().map(c => c.id).sort().join('|'),
    [table]
  );
  const lsKey = useMemo(
    () => storageKey ?? `table:columns:visibility:${columnIdsSig}`,
    [storageKey, columnIdsSig]
  );

  // load once
  const appliedFromStorage = useRef(false);
  useEffect(() => {
    if (appliedFromStorage.current || typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) return;
      const saved = JSON.parse(raw) as Record<string, boolean>;
      if (saved && typeof table.setColumnVisibility === 'function') {
        table.setColumnVisibility(saved);
      } else {
        table.getAllLeafColumns().forEach(col => {
          if (typeof saved?.[col.id] === 'boolean') col.toggleVisibility(saved[col.id]);
        });
      }
    } catch {/* ignore */ }
    finally { appliedFromStorage.current = true; }
  }, [lsKey, table]);

  // save on change
  const visibilityJSON = useMemo(
    () => JSON.stringify(table.getState().columnVisibility ?? {}),
    [table.getState().columnVisibility]
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !appliedFromStorage.current) return;
    localStorage.setItem(lsKey, visibilityJSON);
  }, [visibilityJSON, lsKey]);

  const labelFor = (col: any): string => {
    if (labelMap?.[col.id]) return labelMap[col.id];
    const metaLabel = col.columnDef?.meta?.label;
    if (typeof metaLabel === 'string' && metaLabel.trim()) return metaLabel.trim();
    const header = col.columnDef?.header;
    if (typeof header === 'string' && header.trim()) return header.trim();
    // Many columns define header as a function returning a translated string
    // (e.g. `() => t('...')`). Call it defensively and use the result if it's a
    // plain string, so the toggle list shows localized labels.
    if (typeof header === 'function') {
      try {
        const rendered = (header as any)({ column: col, table });
        if (typeof rendered === 'string' && rendered.trim()) return rendered.trim();
      } catch {/* header needs render context; fall through */ }
    }
    const accessorKey = col.columnDef?.accessorKey;
    if (typeof accessorKey === 'string' && accessorKey) return humanize(accessorKey);
    return humanize(col.id);
  };

  return (
    <Popover shadow="sm" placement="bottom-end">
      <Popover.Trigger>
        <ActionIcon variant="outline" title={t('commons.toggle-columns') ?? 'Toggle Columns'} className="h-9 p-1 hover:border-primary hover:text-primary dark:hover:text-white dark:hover:border-white dark:text-gray-600 dark:border-gray-600">
          <PiTextColumns strokeWidth={ 3 } className="size-6" />
        </ActionIcon>
      </Popover.Trigger>
      <Popover.Content className="z-0 dark:!bg-gray-100/50">
        <div className="p-2 text-left rtl:text-right">
          <Title as="h6" className="mb-6 px-0.5 text-sm font-semibold">
            { t('commons.toggle-columns') }
          </Title>
          <div className="grid grid-cols-2 gap-6">
            { table
              .getAllLeafColumns()
              .filter(c => c.getCanHide() !== false) // respects enableHiding: false
              .map(column => (
                <Checkbox
                  key={ column.id }
                  label={ <>{ labelFor(column) }</> }
                  checked={ column.getIsVisible() }
                  onChange={ column.getToggleVisibilityHandler() }
                />
              )) }
          </div>
        </div>
      </Popover.Content>
    </Popover>
  );
}
