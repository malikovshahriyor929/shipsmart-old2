'use client';

import { FilterDrawerView } from '@core/components/controlled-table/table-filter';
import cn from '@core/utils/class-names';
import { type Table as ReactTableType } from '@tanstack/react-table';
import { useState } from 'react';
import {
  PiFunnel,
  PiMagnifyingGlassBold,
  PiTrashDuotone,
  PiCalendarBold,
  PiCaretDownBold,
} from 'react-icons/pi';
import { useMedia } from 'react-use';
import { Button, Flex, Input, Select } from 'rizzui';
import ToggleColumns from '@core/components/table-utils/toggle-columns';
import { t } from 'i18next';

// // Define SelectOption type
// interface SelectOption {
//   label: string;
//   value: string | number;
// }
// // Define subject options
// const subjectOptions = [
//   { label: 'All Subjects', value: 'all' },
//   { label: 'IELTS Preparation', value: 'IELTS Preparation' },
//   { label: 'SAT Preparation', value: 'SAT Preparation' },
//   { label: 'Academic English', value: 'Academic English' },
//   { label: 'TOEFL Preparation', value: 'TOEFL Preparation' },
//   { label: 'Academic Writing', value: 'Academic Writing' },
// ];
// // Define task type options
// const taskTypeOptions = [
//   { label: 'All Types', value: 'all' },
//   { label: 'Assignment', value: 'assignment' },
//   { label: 'Quiz', value: 'quiz' },
//   { label: 'Project', value: 'project' },
//   { label: 'Exam', value: 'exam' },
// ];

// Define status options
// const statusOptions = [
//   { label: 'Active', value: 'Active' },
//   { label: 'Inactive', value: 'Inactive' },
//   { label: 'Archived', value: 'Archived' },
// ];

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
}

export default function TaskFilters<TData extends Record<string, any>>({
  table,
}: TableToolbarProps<TData>) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const isLarge = useMedia('(min-width: 3920px)', false);

  return (
    <Flex align="center" justify="between" className="mb-4 gap-0">
      <Flex align="center" className="w-auto flex-wrap">
        <Input
          type="search"
          placeholder={ t('tasks.filters.search-ph') ?? 'Search tasks...' }
          value={ (table.getState().globalFilter as string) ?? '' }
          onClear={ () => table.setGlobalFilter('') }
          onChange={ (e) => table.setGlobalFilter(e.target.value) }
          inputClassName="h-9"
          clearable={ true }
          prefix={ <PiMagnifyingGlassBold className="h-4 w-4" /> }
        />
        { isLarge && showFilters && <FilterElements table={ table } /> }
      </Flex>
      <Flex align="center" className="w-auto">
        <Button
          { ...(!isLarge
            ? {
              onClick: () => {
                setOpenDrawer(() => !openDrawer);
              },
            }
            : { onClick: () => setShowFilters(() => !showFilters) }) }
          variant={ 'outline' }
          className={ cn(
            'h-[34px] pe-3 ps-2.5 dark:hover:text-white dark:hover:border-white dark:text-gray-600 dark:border-gray-600',
            isLarge && showFilters && 'border-dashed border-gray-700'
          ) }
        >
          <PiFunnel className="me-1.5 size-[18px]" strokeWidth={ 1.7 } />
          { isLarge && showFilters
            ? t('commons.toggle-hide') ?? 'Hide'
            : t('commons.toggle-show') ?? 'Filters' }
        </Button>

        { !isLarge && (
          <FilterDrawerView
            drawerTitle={ t('tasks.filters.drawer-title') ?? 'Task Filters' }
            isOpen={ openDrawer }
            setOpenDrawer={ setOpenDrawer }
          >
            <div className="grid grid-cols-1 gap-6">
              <FilterElements table={ table } />
            </div>
          </FilterDrawerView>
        ) }

        <ToggleColumns table={ table } />
      </Flex>
    </Flex>
  );
}

function FilterElements<T extends Record<string, any>>({
  table,
}: TableToolbarProps<T>) {
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;
  const statusOptions = [
    { label: t('tasks.filters.statusOptions.active') ?? 'Active', value: 'Active' },
    { label: t('tasks.filters.statusOptions.inactive') ?? 'Inactive', value: 'Inactive' },
    { label: t('tasks.filters.statusOptions.archived') ?? 'Archived', value: 'Archived' },
  ];
  return (
    <>
      {/* <StatusField
        options={ subjectOptions }
        value={ table.getColumn('subject')?.getFilterValue() ?? [] }
        onChange={ (value) => table.getColumn('subject')?.setFilterValue(value) }
        getOptionValue={ (option: SelectOption) => option.value as string }
        getOptionDisplayValue={ (option: SelectOption) => option.label }
        displayValue={ (selected: string) => selected }
        dropdownClassName="!z-20 h-auto"
        className="ms-2 w-40"
        placeholder="Subject"
        clearable={ true }
      /> */}

      {/* <Select
        options={ taskTypeOptions }
        value={ table.getColumn('taskType')?.getFilterValue() ?? '' }
        onChange={ (value) => {
          table.getColumn('taskType')?.setFilterValue(value);
        } }
        className="ms-2 w-48"
        placeholder="Task Type"
        prefix={ <PiGraduationCapBold className="h-4 w-4 text-gray-500" /> }
        clearable={ true }
      /> */}

      <Select
        options={ statusOptions }
        value={ table.getColumn("status")?.getFilterValue() ?? '' }
        onChange={ (value) => {
          table.getColumn('status')?.setFilterValue(value);

        } }
        className="ms-2 w-full"
        placeholder={ t('commons.status') ?? 'Status' }
        prefix={ <PiCalendarBold className="h-4 w-4 text-gray-500" /> }
        clearable={ table.getColumn('status')?.getFilterValue() !== undefined }
        onClear={ () => table.getColumn('status')?.setFilterValue(undefined) }
      />

      { isFiltered && (
        <Button
          size="sm"
          onClick={ () => {
            table.resetGlobalFilter();
            table.resetColumnFilters();
          } }
          variant="flat"
          className="ms-2 h-9 bg-gray-200/70"
        >
          <PiTrashDuotone className="me-1.5 size-[17px]" />  { t('commons.clear') ?? 'Clear' }
        </Button>
      ) }
    </>
  );
}

export function TaskTabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button
        variant={ activeTab === 'submitted' ? 'solid' : 'outline' }
        className={ activeTab === 'submitted' ? 'bg-mainBlue text-white' : '' }
        onClick={ () => setActiveTab('submitted') }
      >
        { t('tasks.tabs.submitted') ?? 'Submitted' }
      </Button>

      <Button
        variant={ activeTab === 'graded' ? 'solid' : 'outline' }
        className={ activeTab === 'graded' ? 'bg-mainBlue text-white' : '' }
        onClick={ () => setActiveTab('graded') }
      >
        { t('tasks.tabs.graded') ?? 'Graded' }
      </Button>
    </div>
  );
}