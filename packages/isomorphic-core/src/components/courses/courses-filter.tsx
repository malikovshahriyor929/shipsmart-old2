'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFilterControls } from '@core/hooks/use-filter-control';
import { Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { PiTrashDuotone } from 'react-icons/pi';
import { CoursesFilterTags } from './courses-filter-tags';
import type { Course } from '@core/types';
import { t } from 'i18next';

interface Props {
  courses: Course[];
}

type Counts = { all: number; ielts: number; sat: number };

export default function CoursesFilter({ courses }: Props) {
  // Keep filter-controls; make sure the key we use is `tag`
  const initialState = useMemo(() => ({ tag: '' as string }), []);
  const { state, reset } = useFilterControls<typeof initialState, any>(
    initialState
  );

  // Counters
  const [counts, setCounts] = useState<Counts>({ all: 0, ielts: 0, sat: 0 });

  // Show "Clear" if any filter is active in the state (no need to read URL in core)
  const hasActiveFilters = useMemo(
    () => Object.values(state ?? {}).some((v) => !!v),
    [state]
  );

  // Robust subject detection
  const getSubjectKey = (c: Course): 'IELTS' | 'SAT' | null => {
    const v = (c?.subject_id?.value ?? c?.subject?.value ?? '') as
      | string
      | number;
    const l = (c?.subject_id?.label ?? c?.subject?.label ?? '')
      .toString()
      .toLowerCase();

    // numeric ids (common)
    if (v === 1 || v === '1') return 'IELTS';
    if (v === 2 || v === '2') return 'SAT';

    // label-based fallback
    if (l.includes('ielts')) return 'IELTS';
    if (l.includes('sat')) return 'SAT';

    return null;
    // If your API uses different ids, extend this mapping.
  };

  // Recompute counters whenever courses change
  useEffect(() => {
    if (!Array.isArray(courses) || courses.length === 0) {
      setCounts({ all: 0, ielts: 0, sat: 0 });
      return;
    }

    let ielts = 0;
    let sat = 0;
    for (const c of courses) {
      const key = getSubjectKey(c);
      if (key === 'IELTS') ielts += 1;
      else if (key === 'SAT') sat += 1;
    }
    setCounts({ all: courses.length, ielts, sat });
  }, [courses]);

  return (
    <div className={ cn('flex items-center justify-between pb-5') }>
      <div className="px-1">
        <CoursesFilterTags counts={ counts } />
      </div>

      <div className="flex items-center gap-3">
        { hasActiveFilters && (
          <Button
            type="button"
            className="h-9 rounded-full hover:text-mainBlue"
            variant="outline"
            onClick={ () => reset() }
          >
            <PiTrashDuotone className="me-2 h-4 w-4" />
            {t('courses.filter-clear') }
          </Button>
        ) }
      </div>
    </div>
  );
}
