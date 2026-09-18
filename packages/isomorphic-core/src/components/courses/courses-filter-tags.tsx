'use client';

import { Badge, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { useFilterControls } from '@core/hooks/use-filter-control';
import { useMemo } from 'react';
import { t } from 'i18next';

type Counts = { all: number; ielts: number; sat: number };

interface TagProps {
  name: 'All' | 'SAT' | 'IELTS' | string;
  count: number;
}

function Tag({ name, count }: TagProps) {
  const initialState = useMemo(() => ({ tag: '' as string }), []);
  const { state, applyFilter } = useFilterControls<typeof initialState, any>(
    initialState
  );

  const isActive = state['tag'] === name || (name === 'All' && !state['tag']);

  return (
    <Button
      rounded="pill"
      variant={isActive ? 'solid' : 'outline'}
      className={cn(
        'group flex h-fit cursor-pointer items-center gap-2 px-2 py-1.5 text-xs transition-colors duration-200',
        isActive
          ? 'bg-mainBlue text-white hover:bg-mainBlue/90'
          : 'hover;border-mainBlue hover:text-mainBlue'
      )}
      onClick={() => applyFilter('tag', name === 'All' ? '' : name)}
    >
      {name}
      <Badge
        size="sm"
        rounded="lg"
        variant="flat"
        className={cn(
          'bg-gray-900/10 text-gray-600 transition duration-150 dark:bg-gray-900/20',
          isActive && 'bg-white/20 text-white'
        )}
      >
        {count}
      </Badge>
    </Button>
  );
}

export function CoursesFilterTags({
  className,
  title,
  counts,
}: {
  className?: string;
  title?: string;
  counts: Counts;
}) {
  const tags = [
    { name: t("courses.filterTags-all") ?? "All" as const, count: counts?.all ?? 0 },
    { name: t("courses.filterTags-sat") ?? "SAT" as const, count: counts?.sat ?? 0 },
    { name: t("courses.filterTags-ielts") ?? "IELTS" as const, count: counts?.ielts ?? 0 },
  ];

  return (
    <div>
      {title && <p className="mb-1.5">{title}</p>}
      <div className={cn('flex gap-3 overflow-auto py-1', className)}>
        {tags.map((t) => (
          <Tag key={`tag-${t.name}`} name={t.name} count={t.count} />
        ))}
      </div>
    </div>
  );
}
