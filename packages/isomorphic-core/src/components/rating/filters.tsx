'use client';

import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Flex, Input, Select } from 'rizzui';
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiMapPinBold,
  PiStackDuotone,
  PiTrashDuotone,
} from 'react-icons/pi';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { FilterDrawerView } from '@core/components/controlled-table/table-filter';

type Option = { label: string; value: string | number };

type RatingFiltersProps<T extends Record<string, any>> = {
  table: ReactTableType<T>;
  regionId: string;
  categoryId: string;
  statusId: string;
  progressId: string;
  regionOptions: Option[];
  categoryOptions: Option[];
  statusOptions: Option[];
  progressOptions: Option[];
  onRegionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onProgressChange: (value: string) => void;
  onReset: () => void;
  isFiltering: boolean;
  loading?: boolean;
};

export default function RatingFilters<TData extends Record<string, any>>({
  table,
  regionId,
  categoryId,
  statusId,
  progressId,
  regionOptions,
  categoryOptions,
  statusOptions,
  progressOptions,
  onRegionChange,
  onCategoryChange,
  onStatusChange,
  onProgressChange,
  onReset,
  isFiltering,
  loading,
}: RatingFiltersProps<TData>) {
  const t = useTranslations();
  const [openDrawer, setOpenDrawer] = useState(false);
  const globalFilter = (table.getState().globalFilter as string) ?? '';
  const selectedCategory = categoryOptions.find(
    (opt) => opt.value === Number(categoryId)
  );
  const selectedRegion = regionOptions.find(
    (opt) => opt.value === Number(regionId)
  );
  const selectedStatus = statusOptions.find(
    (opt) => opt.value === Number(statusId)
  );
  const selectedProgress = progressOptions.find(
    (opt) => opt.value === Number(progressId)
  );
  const filtersLabel =
    t('rating.filters.title', { default: 'Filters' }) ||
    t('commons.filters', { default: 'Filters' }) ||
    'Filters';

  return (
    <div className="mb-4 flex w-full items-center justify-between gap-3">
      <div className='flex items-center gap-3'>
        <Input
          type="search"
          value={globalFilter}
          onClear={() => table.setGlobalFilter('')}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder={t('rating.filters.search', {
            default: 'Search by student or school',
          })}
          clearable
          inputClassName="h-9"
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          className="w-full min-w-[220px] sm:w-72"
        />
        <Select
          options={regionOptions}
          value={selectedRegion}
          onChange={(val) => {
            const next =
              typeof val === 'object' && val !== null && 'value' in val
                ? (val as Option).value
                : val;
            onRegionChange(
              next === undefined || next === null || next === ''
                ? ''
                : String(next)
            );
          }}
          displayValue={(val: any) => {
            const current = regionOptions.find(
              (opt) => opt.value === (val?.value ?? val)
            );
            return (
              current?.label ??
              t('rating.filters.region', { default: 'Region' })
            );
          }}
          className="w-full max-w-[220px]"
          selectClassName="h-9"
          placeholder={t('rating.filters.region', { default: 'Region' })}
          prefix={<PiMapPinBold className="h-4 w-4 text-gray-500" />}
          clearable
          onClear={() => onRegionChange('')}
          disabled={loading}
        />

        <Select
          options={categoryOptions}
          value={selectedCategory}
          onChange={(val) => {
            const next =
              typeof val === 'object' && val !== null && 'value' in val
                ? (val as Option).value
                : val;
            onCategoryChange(
              next === undefined || next === null || next === ''
                ? ''
                : String(next)
            );
          }}
          displayValue={(val: any) => {
            const current = categoryOptions.find(
              (opt) => opt.value === (val?.value ?? val)
            );
            return (
              current?.label ??
              t('rating.filters.category', { default: 'Category' })
            );
          }}
          className="w-full"
          selectClassName='h-9'
          placeholder={t('rating.filters.category', { default: 'Category' })}
          prefix={<PiStackDuotone className="h-4 w-4 text-gray-500" />}
          clearable
          onClear={() => onCategoryChange('')}
          disabled={loading}
        />
      </div>
      <div>
        <Flex align="center" className="gap-2">
          {/* <Button
          variant="outline"
          size="sm"
          onClick={() => setOpenDrawer(true)}
          className="h-9"
        >
          <PiFunnel className="me-1.5 h-4 w-4" />
          {filtersLabel}
        </Button> */}
          <ToggleColumns table={table} />
        </Flex>
      </div>

      {/* <FilterDrawerView
      isOpen={openDrawer}
      setOpenDrawer={setOpenDrawer}
      drawerTitle={filtersLabel}
    >
        <div className="grid grid-cols-1 gap-4">
   

          <Select
            options={statusOptions}
            value={selectedStatus}
          onChange={(val) => {
            const next =
              typeof val === 'object' && val !== null && 'value' in val
                ? (val as Option).value
                : val;
            onStatusChange(
              next === undefined || next === null || next === ''
                ? ''
                : String(next)
            );
          }}
            displayValue={(val: any) => {
              const current = statusOptions.find(
                (opt) => opt.value === (val?.value ?? val)
              );
              return (
                current?.label ??
                t('rating.filters.status', { default: 'Status' })
              );
            }}
            className="w-full"
            placeholder={t('rating.filters.status', { default: 'Status' })}
          clearable
          onClear={() => onStatusChange('')}
          disabled={loading}
        />

          <Select
            options={progressOptions}
            value={selectedProgress}
          onChange={(val) => {
            const next =
              typeof val === 'object' && val !== null && 'value' in val
                ? (val as Option).value
                : val;
            onProgressChange(
              next === undefined || next === null || next === ''
                ? ''
                : String(next)
            );
          }}
            displayValue={(val: any) => {
              const current = progressOptions.find(
                (opt) => opt.value === (val?.value ?? val)
              );
              return (
                current?.label ??
                t('rating.filters.progress', { default: 'Progress status' })
              );
            }}
            className="w-full"
            placeholder={t('rating.filters.progress', {
              default: 'Progress status',
            })}
          clearable
          onClear={() => onProgressChange('')}
          disabled={loading}
        />

          {isFiltering ? (
            <Button
              size="sm"
              variant="flat"
              onClick={onReset}
              className="h-10 bg-gray-200/70 hover:text-white"
            >
              <PiTrashDuotone className="me-1.5 h-4 w-4" />
              {t('rating.filters.clear', { default: 'Clear filters' })}
            </Button>
          ) : null}
        </div>
      </FilterDrawerView> */}
    </div>
  );
}
