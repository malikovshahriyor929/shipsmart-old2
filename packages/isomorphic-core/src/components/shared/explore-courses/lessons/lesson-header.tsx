'use client';

import { Button, Badge, ActionIcon } from 'rizzui';
import { PiArrowLeft, PiListBullets } from 'react-icons/pi';
import { t } from 'i18next';
import { useDrawer } from '@core/components/shared/drawer-views/use-drawer';
import LessonSidebar from '@core/components/courses/lessons/lesson-sidebar';
import {
  useLessonLearning,
  LessonLearningProvider,
} from '@core/providers/lesson-learning-provider';
import { useMedia } from 'react-use';

export default function LessonHeader({ onBack }: { onBack: () => void }) {
  const { openDrawer, closeDrawer } = useDrawer();
  const ctx = useLessonLearning(); // <-- get the current page context value
  const course = ctx.course;

  const title = course?.name || 'Course';
  const subtitle = course?.subject?.label || '';
  const durationMonths = course?.duration_months;
  const lessonCount = course?.lesson_counts;
  const isMobile = useMedia('(max-width: 640px)');

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-transparent">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <Button
            rounded="md"
            size="sm"
            variant="flat"
            className="mr-4 border border-gray-200 bg-white text-gray-700 hover:bg-gray-300 hover:text-gray-700 dark:bg-gray-100"
            onClick={onBack}
          >
            <PiArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-xl font-bold text-mainBlue dark:text-gray-700">
              {title}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
              {subtitle && (
                <Badge rounded="md" variant="outline">
                  {subtitle}
                </Badge>
              )}
              {durationMonths && (
                <Badge
                  rounded="md"
                  variant="flat"
                  className="bg-indigo-50 text-indigo-700 dark:bg-indigo-200"
                >
                  {durationMonths}
                </Badge>
              )}
              {typeof lessonCount === 'number' && (
                <Badge
                  rounded="md"
                  variant="flat"
                  className="bg-emerald-50 text-emerald-700 dark:bg-emerald-200"
                >
                  {lessonCount} {t('courses.card-lessons')}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button
          className="flex items-center gap-2 lg:hidden"
          rounded="md"
          size={isMobile ? 'sm' : 'md'}
          variant="outline"
          onClick={() =>
            openDrawer({
              view: (
                <LessonLearningProvider value={ctx}>
                  <LessonSidebar onClose={closeDrawer} />
                </LessonLearningProvider>
              ),
              placement: 'right',
              withIcon: true,
              containerClassName: 'p-5 pb-0',
            })
          }
        >
          <PiListBullets className="size-5" />
          <span className="hidden sm:inline-block">Lessons</span>
        </Button>
      </div>
    </header>
  );
}
