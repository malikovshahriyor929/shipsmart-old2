'use client';

import { PiTextColumns, PiTrashDuotone } from 'react-icons/pi';
import { useTranslations } from 'next-intl';
import { type Table as ReactTableType } from '@tanstack/react-table';
import StatusField from '@core/components/controlled-table/status-field';
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Popover,
  Text,
  Title,
} from 'rizzui';
import cn from '@core/utils/class-names';

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  className?: string;
}

export default function ProjectSummaryToolbar<
  TData extends Record<string, any>,
>({ table, className }: TableToolbarProps<TData>) {
  const tc = useTranslations('commons');
  return (
    <div className={cn('flex items-center justify-end gap-4', className)}>
      <FilterElements table={table} />
      {table && (
        <Popover shadow="sm" placement="bottom-end">
          <Popover.Trigger>
            <ActionIcon
              variant="outline"
              title={tc('toggle-columns') ?? 'Toggle Columns'}
              className="h-auto w-auto p-1"
            >
              <PiTextColumns strokeWidth={3} className="size-6" />
            </ActionIcon>
          </Popover.Trigger>
          <Popover.Content className="z-0">
            <div className="px-0.5 pt-2 text-left rtl:text-right">
              <Title as="h6" className="mb-1 px-0.5 text-sm font-semibold">
                {tc('toggle-columns') ?? 'Toggle Columns'}
              </Title>
              <div className="grid grid-cols-2 gap-x-0 gap-y-5 px-1.5 pb-3.5 pt-4">
                {table.getAllLeafColumns().map((column) => {
                  return (
                    typeof column.columnDef.header === 'string' &&
                    column.columnDef.header.length > 0 && (
                      <Checkbox
                        key={column.id}
                        label={<>{column.columnDef.header}</>}
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                      />
                    )
                  );
                })}
              </div>
            </div>
          </Popover.Content>
        </Popover>
      )}
    </div>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
}: TableToolbarProps<T>) {
  const t = useTranslations('dashboard');
  const tc = useTranslations('commons');

  const statusOptions = [
    {
      label: t('project-summary-status-completed') ?? 'Completed',
      value: 'completed',
    },
    {
      label: t('project-summary-status-on-going') ?? 'On Going',
      value: 'onGoing',
    },
    {
      label: t('project-summary-status-delayed') ?? 'Delayed',
      value: 'delayed',
    },
    {
      label: t('project-summary-status-at-risk') ?? 'At Risk',
      value: 'atRisk',
    },
  ];

  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;
  return (
    <>
      <StatusField
        options={statusOptions}
        value={table.getColumn('status')?.getFilterValue() ?? []}
        onChange={(e) => table.getColumn('status')?.setFilterValue(e)}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option) =>
          renderOptionDisplayValue(option.value as string, t)
        }
        displayValue={(selected: string) =>
          renderOptionDisplayValue(selected, t)
        }
        dropdownClassName="!z-20 h-auto"
        className="w-auto"
      />

      {isFiltered && (
        <Button
          size="sm"
          onClick={() => {
            table.resetGlobalFilter();
            table.resetColumnFilters();
          }}
          variant="flat"
          className="h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" />{' '}
          {tc('clear') ?? 'Clear'}
        </Button>
      )}
    </>
  );
}

function renderOptionDisplayValue(
  value: string,
  t: ReturnType<typeof useTranslations>
) {
  switch (value.toString()) {
    case 'onGoing':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-orange-dark">
            {t('project-summary-status-on-going') ?? 'On Going'}
          </Text>
        </div>
      );
    case 'completed':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {t('project-summary-status-completed') ?? 'Completed'}
          </Text>
        </div>
      );
    case 'atRisk':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-red-dark">
            {t('project-summary-status-at-risk') ?? 'At Risk'}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {t('project-summary-status-delayed') ?? 'Delayed'}
          </Text>
        </div>
      );
  }
}
