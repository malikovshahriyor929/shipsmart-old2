'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Badge, Progressbar, Text, Tooltip } from 'rizzui';
import { PiCaretDownBold, PiCaretUpBold, PiMapPinBold } from 'react-icons/pi';
import Avatar from '@core/components/avatar';

export type RatingRow = {
  student?: {
    id: number;
    username: string | null;
    email: string | null;
    phone_number: string | null;
    first_name: string | null;
    last_name: string | null;
    last_seen_at: string | null;
    online: boolean | null;
    student_no: number | null;
    role?: { value: number; label: string };
    avatar?: {
      public_id?: string;
      file_name?: string;
      extension?: string;
      file_size?: number;
      url?: string;
      created_at?: string;
    };
  };
  rank: number;
  student_id: number;
  first_name: string;
  last_name: string;
  total_score: number;
  approved_count: number;
  region_id: number | null;
  region_name: string | null;
  school_id: number | null;
  school_name: string | null;
};

const columnHelper = createColumnHelper<RatingRow>();

export function createRatingColumns(
  t: (key: string, opts?: Record<string, any>) => string
) {
  const rankLabel = '#';
  // t('rating.columns.rank', { default: 'Rank' }) || 'Rank';
  const studentLabel =
    t('rating.columns.student', { default: 'Student' }) || 'Student';
  const regionLabel =
    t('rating.columns.region', { default: 'Region' }) || 'Region';
  const schoolLabel =
    t('rating.columns.school', { default: 'School' }) || 'School';
  const approvedLabel =
    t('rating.columns.approved', { default: 'Approved' }) || 'Approved';
  const scoreLabel = t('rating.columns.score', { default: 'Score' }) || 'Score';
  const pointLabel = t('rating.point', { default: 'point' });

  const expandCol = columnHelper.display({
    id: 'expand',
    size: 50,
    maxSize: 50,
    meta: { label: t('rating.columns.expand') ?? 'Expand' } as any,
    cell: ({ row }) =>
      row.getCanExpand() ? (
        <ActionIcon
          size="sm"
          rounded="full"
          aria-label={t('rating.columns.expandRow') ?? 'Expand row'}
          variant={row.getIsExpanded() ? 'solid' : 'outline'}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <PiCaretUpBold className="size-3.5" />
          ) : (
            <PiCaretDownBold className="size-3.5" />
          )}
        </ActionIcon>
      ) : null,
  });

  return [
    expandCol,
    columnHelper.accessor('rank', {
      id: 'rank',
      header: ()=><p className='w-fit max-w-[10px] p-0'>#</p>,
      meta: { label: t('rating.columns.rank') ?? 'Rank' } as any,
      enableSorting: false,
      size: 30,
      minSize: 30,
      maxSize: 30,
      cell: ({ row }) => (
        <Text className="w-fit font-semibold text-gray-900">
          {row.original.rank}
        </Text>
      ),
    }),

    columnHelper.display({
      id: 'student',
      header: () => studentLabel,
      size: 210,
      cell: ({ row }) => {
        const fullName = [row.original.first_name, row.original.last_name]
          .filter(Boolean)
          .join(' ')
          .trim();

        return (
          <div className="flex w-full items-center gap-2">
            <Avatar
              src={row.original.student?.avatar?.url ?? '/default-avatar.png'}
              name={fullName || '—'}
              className="size-10 min-h-10 min-w-10"
            />
            <div className="flex flex-col">
              <Text className="font-semibold text-gray-900">
                {fullName || '—'}
              </Text>
              <Text className="text-xs text-gray-500">
                # {row.original.student?.student_no}
              </Text>
            </div>
          </div>
        );
      },
    }),

    columnHelper.accessor('region_name', {
      id: 'region',
      enableSorting: false,
      header: () => regionLabel,
      size: 100,
      cell: ({ getValue }) => (
        <Tooltip content={getValue() || '—'}>
          <div className="flex items-center gap-1">
            <PiMapPinBold className="h-4 w-4 text-gray-400" />
            <Text className="text-sm text-gray-900">{getValue() || '—'}</Text>
          </div>
        </Tooltip>
      ),
    }),

    // columnHelper.accessor('school_name', {
    //   id: 'school',
    //   header: () => schoolLabel,
    //   size: 300,
    //   enableSorting: false,
    //   cell: ({ getValue }) => (
    //     <Tooltip content={getValue() || '—'}>
    //       <div className="flex items-center gap-1">
    //         <PiGraduationCapBold className="h-4 w-4 min-w-4 text-gray-400" />
    //         <Text className="text-sm text-gray-900 line-clamp-1">{getValue() || '—'}</Text>
    //       </div>
    //     </Tooltip>
    //   ),
    // }),

    columnHelper.accessor('total_score', {
      id: 'score',
      header: () => scoreLabel,
      size: 200,
      cell: ({ getValue }) => (
        <div className="w-full">
          <Badge
            color="primary"
            variant="flat"
            className="flex w-full items-center gap-1 text-nowrap rounded-md bg-transparent text-[16px] text-base text-[#64748b] dark:text-gray-700"
          >
            <Progressbar
              value={getValue() ?? 0}
              size="sm"
              className=""
              barClassName="bg-[linear-gradient(90deg,#b3eda4_0%,#53d483_100%)] w-full"
            />
            {getValue() ?? 0} {pointLabel}
          </Badge>
        </div>
      ),
    }),
  ];
}
