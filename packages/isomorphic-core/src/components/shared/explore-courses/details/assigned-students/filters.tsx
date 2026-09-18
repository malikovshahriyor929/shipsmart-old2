'use client';

import StatusField from '@core/components/controlled-table/status-field';
import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { t } from 'i18next';
import { useState } from 'react';
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrashDuotone,
} from 'react-icons/pi';
import { Badge, Button, Flex, Input, Text } from 'rizzui';

const getEnrollmentStatusOptions = () => [
  {
    value: 'enrolled',
    label: t('courses.filter-enrollment-enrolled') ?? 'Enrolled',
  },
  {
    value: 'pending',
    label: t('courses.filter-enrollment-pending') ?? 'Pending',
  },
  {
    value: 'not-enrolled',
    label: t('courses.card-not-enrolled') ?? 'Not Enrolled',
  },
];

const groupOptions = [
  {
    value: 'UG-22',
    label: 'UG-22',
  },
  {
    value: 'UG-23',
    label: 'UG-23',
  },
  {
    value: 'UG-24',
    label: 'UG-24',
  },
];

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function CourseStudentsFilters<
  TData extends Record<string, any>,
>({ table }: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    options: { meta },
  } = table;

  return (
    <Flex align="center" justify="between" className="mb-4">
      <Input
        type="search"
        placeholder={t('courses.filter-search-students') ?? 'Search students...'}
        value={table.getState().globalFilter ?? ''}
        onClear={() => table.setGlobalFilter('')}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        inputClassName="h-9"
        clearable={true}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />

      <FilterDrawerView
        isOpen={openDrawer}
        drawerTitle={t('courses.filter-students-drawer-title') ?? 'Students Filter'}
        setOpenDrawer={setOpenDrawer}
      >
        <div className="grid grid-cols-1 gap-6">
          <FilterElements table={table} />
        </div>
      </FilterDrawerView>

      <Flex align="center" gap="3" className="w-auto">
        <Button
          variant={'outline'}
          onClick={() => setOpenDrawer(!openDrawer)}
          className="h-9 pe-3 ps-2.5"
        >
          <PiFunnel className="me-1.5 size-[18px]" strokeWidth={1.7} />
          {t('commons.toggle-show') ?? 'Filters'}
        </Button>

        <ToggleColumns table={table} />
      </Flex>
    </Flex>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
}: TableToolbarProps<T>) {
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  return (
    <>
      <StatusField
        options={getEnrollmentStatusOptions()}
        value={table.getColumn('status')?.getFilterValue() ?? []}
        onChange={(e) => table.getColumn('status')?.setFilterValue(e)}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option: { value: any }) =>
          renderEnrollmentStatusDisplayValue(option.value as string)
        }
        displayValue={(selected: string) =>
          renderEnrollmentStatusDisplayValue(selected)
        }
        dropdownClassName="!z-20 h-auto"
        className={'w-auto'}
        label={t('courses.filter-enrollment-status') ?? 'Enrollment Status'}
      />

      <StatusField
        options={groupOptions}
        value={table.getColumn('groupCode')?.getFilterValue() ?? []}
        onChange={(e) => table.getColumn('groupCode')?.setFilterValue(e)}
        getOptionValue={(option: { value: any }) => option.value}
        getOptionDisplayValue={(option: { value: any }) =>
          renderGroupDisplayValue(option.value as string)
        }
        displayValue={(selected: string) => renderGroupDisplayValue(selected)}
        dropdownClassName="!z-20 h-auto"
        className={'w-auto'}
        label={t('courses.col-group') ?? 'Group'}
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
          <PiTrashDuotone className="me-1.5 h-[17px] w-[17px]" /> {t('courses.filter-clear') ?? 'Clear'}
        </Button>
      )}
    </>
  );
}

function renderEnrollmentStatusDisplayValue(value: string) {
  switch (value.toLowerCase()) {
    case 'enrolled':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-green-dark">
            {value}
          </Text>
        </div>
      );
    case 'pending':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="text-yellow-dark ms-2 font-medium capitalize">
            {value}
          </Text>
        </div>
      );
    case 'not-enrolled':
      return (
        <div className="flex items-center">
          <Badge color="secondary" renderAsDot />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium capitalize text-gray-600">
            {value}
          </Text>
        </div>
      );
  }
}

function renderGroupDisplayValue(value: string) {
  return (
    <div className="flex items-center">
      <Badge variant="outline" className="border-mainBlue text-mainBlue">
        {value}
      </Badge>
    </div>
  );
}
