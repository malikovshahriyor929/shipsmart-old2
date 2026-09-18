'use client';

import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import { PiCalendar } from 'react-icons/pi';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
function dateToYMD(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}
function ymdToDate(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return null;
  const y = Number(m[1]), mo = Number(m[2]) - 1, da = Number(m[3]);
  // 12:00 UTC hack — off-by-one ni oldini oladi
  return new Date(Date.UTC(y, mo, da, 12, 0, 0));
}
function ageFromYMD(ymd?: string): number | null {
  if (!ymd) return null;
  const d = ymdToDate(ymd);
  if (!d) return null;
  const today = new Date();
  let age = today.getUTCFullYear() - d.getUTCFullYear();
  const m = today.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && today.getUTCDate() < d.getUTCDate())) age--;
  return age;
}

type DateButtonProps = {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  error?: boolean;
  badge?: string | null;
  isBadge?: boolean // age ko'rsatish uchun
};
const DateButton = forwardRef<HTMLButtonElement, DateButtonProps>(
  ({ value, onClick, placeholder = 'Sanani tanlang', error, badge, isBadge }, ref) => (
    <button
      type="button"
      ref={ ref }
      onClick={ onClick }
      className={ [
        'group inline-flex items-center justify-between w-full',
        'rounded-lg border-[1.5px] px-3 py-2 pt-2.5 text-sm transition',
        'bg-white dark:bg-gray-900',
        error
          ? 'border-red-500 text-red-600 focus:ring-4 focus:ring-red-100 dark:focus:ring-red-900/30'
          : 'border-gray-300 text-gray-900 dark:border-gray-700 dark:text-gray-100 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30',
        'hover:shadow-sm',
      ].join(' ') }
    >
      <span className="flex items-center gap-2">
        <PiCalendar className="h-5 w-5 opacity-80" />
        <span className={ value ? '' : 'text-gray-500 dark:text-gray-400' }>
          { value || placeholder }
        </span>
      </span>

      { isBadge && badge ? (
        <span className="ml-3 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700
                          dark:bg-blue-900/30 dark:text-blue-200">
          { badge }
        </span>
      ) : null }
    </button>
  )
);
DateButton.displayName = 'DateButton';

type Props = {
  control: any;
  name?: string;        
  label?: string;
  errors?: any;
  disabled?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  lang: string;
  isBadge?: boolean
};

export default function DOBPicker({
  control,
  name = 'dateOfBirth',
  label = 'Date of Birth',
  errors,
  disabled,
  helperText,
  minDate,
  maxDate = new Date(),
  lang = "uz",
  isBadge
}: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      { label && (
        <label className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">
          { label } <span className="text-red-500">*</span>
        </label>
      ) }

      <Controller
        name={ name }
        control={ control }
        render={ ({ field, fieldState }) => {
          const selected: Date | null =
            typeof field.value === 'string' ? ymdToDate(field.value) :
              field.value instanceof Date ? field.value : null;

          const valueForButton =
            selected ? format(selected, 'dd.MM.yyyy', { locale: enUS }) : '';

          const age = ageFromYMD(typeof field.value === 'string' ? field.value : undefined);
          const badge = age !== null ? `${age} yo.` : null;

          return (
            <>
              <ReactDatePicker
                selected={ selected }
                onChange={ (d: Date | null) => field.onChange(d ? dateToYMD(d) : '') }
                disabled={ disabled }
                locale={ enUS }
                dateFormat="dd.MM.yyyy"
                placeholderText="Choose date"
                shouldCloseOnSelect
                maxDate={ maxDate }
                minDate={ minDate }
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                // input o'rniga tugma + badge
                customInput={ <DateButton error={ !!fieldState.error } badge={ badge } isBadge={ isBadge } /> }
                // Popper & calendar styling (Tailwind-like)
                popperClassName="z-50"
                calendarClassName="!rounded-lg !border !border-gray-200 !bg-white !p-2 !shadow-xl
                                   dark:!border-gray-700 dark:!bg-gray-900"
                dayClassName={ () =>
                  'rounded-md hover:!bg-blue-50 hover:!text-blue-700 rounded-lg dark:hover:!bg-blue-900/30'
                }
                weekDayClassName={ () => 'text-gray-500 rounded-lg  dark:text-gray-400' }
                // prevent clipping
                monthClassName={ () => "rounded-lg" }
                popperPlacement="bottom-start"
              />

              { helperText && !fieldState.error && (
                <p className="mt-1 text-xs text-gray-500">{ helperText }</p>
              ) }
              { fieldState.error && (
                <p className="mt-1 text-xs text-red-500">{ fieldState.error.message }</p>
              ) }
            </>
          );
        } }
      />
    </div>
  );
}
