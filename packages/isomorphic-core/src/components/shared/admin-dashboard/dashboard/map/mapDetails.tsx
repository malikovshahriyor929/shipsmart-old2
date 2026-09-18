import React from 'react';
import { Avatar, Badge, Text, Title } from 'rizzui';
import { Region, RegionReport } from '@core/components/shared/admin-dashboard/dashboard/type';
import cn from '@core/utils/class-names';
import { Stat } from '@core/components/shared/admin-dashboard/dashboard/map/index';
import { X } from 'lucide-react';
import { useModal } from '@core/components/shared/modal-views/use-modal';
import { t } from 'i18next';

type MapDetailsProps = {
  region?: Region | null;
  report?: RegionReport | null;
};

type StatItem = {
  label: string;
  value: number | string | null | undefined;
  decimals?: number;
  suffix?: string;
};

const formatValue = (item: StatItem) => {
  const { value, decimals, suffix } = item;
  if (value === null || value === undefined) return '-';
  if (typeof value === 'number') {
    const formatted =
      decimals !== undefined
        ? Number(value).toFixed(decimals)
        : value.toLocaleString();
    return suffix ? `${formatted}${suffix}` : formatted;
  }
  return value;
};

const StatSection = ({
  title,
  items,
}: {
  title: string;
  items: StatItem[];
}) => {
  const filtered = items.filter(
    (item) => item.value !== undefined && item.value !== null
  );
  if (!filtered.length) return null;

  return (
    <div className="rounded-lg bg-[#f1f5f9] p-4">
      <p className="mb-3 text-sm font-semibold text-gray-700">{title}</p>
      <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        {filtered.map((item) => (
          <Stat
            key={item.label}
            label={item.label}
            value={formatValue(item)}
            className="bg-white"
          />
          //   <div
          //     key={item.label}
          //     className="flex flex-col rounded-md bg-white p-3 text-gray-700"
          //   >
          //     <span className="text-xs uppercase text-gray-500">
          //       {item.label}
          //     </span>
          //     <span className="text-lg font-semibold text-mainBlue">
          //       {formatValue(item)}
          //     </span>
          //   </div>
        ))}
      </div>
    </div>
  );
};

const TopStudents = ({
  students,
}: {
  students: RegionReport['login_stats']['top_students'];
}) => {
  if (!students?.length) return null;

  return (
    <div className="rounded-lg bg-[#f1f5f9] p-4">
      <p className="mb-3 text-sm font-semibold text-gray-700">{t('dashboard.topStudents') ?? 'Top students'}</p>
      <div className="space-y-3">
        {students.map((student, idx) => (
          <div
            key={student.student.id}
            className="flex items-center justify-between gap-3 rounded-md bg-gray-50 p-3"
          >
            <div className="flex items-center gap-3">
              <Badge
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                  idx === 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : idx === 1
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                )}
              >
                {idx + 1}
              </Badge>
              <Avatar
                src={student.student.avatar?.url || ''}
                name={student.student.first_name}
                className="h-10 w-10"
              />
              <div>
                <Text className="text-sm font-semibold text-gray-900">
                  {student.student.first_name} {student.student.last_name}
                </Text>
                <Text className="text-xs text-gray-500">
                  #{student.student.student_no}
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-700">
              <span className="text-xs">{t('dashboard.loginsLabel') ?? 'Logins'}: {student.login_count}</span>
              <span className="text-xs text-gray-500">
                {t('dashboard.lastLabel') ?? 'Last'}: {student.last_login.slice(0, 10)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MapDetails = ({ region, report }: MapDetailsProps) => {
  const { closeModal } = useModal();
  const regionName =
    report?.region?.name ||
    region?.info?.name ||
    (t('dashboard.regionInformation') ?? 'Region information');
  const soato = report?.region?.soato_id || region?.info?.soato_id;
  const regionStats = region?.statistics;
  const regionalMetricItems = regionStats
    ? [
        {
          label: t('dashboard.students'),
          value: regionStats.total_students,
        },
        {
          label: t('dashboard.advisors'),
          value: regionStats.total_advisors,
        },
        {
          label: t('dashboard.practiceSessions'),
          value: regionStats.total_practice_sessions,
        },
        {
          label: t('dashboard.completedPracticeSessions'),
          value: regionStats.passed_practice_tests,
        },
        {
          label: t('dashboard.avgPracticeScore'),
          value: regionStats.avg_practice_score,
          decimals: 2,
        },
        {
          label: t('dashboard.lessonsCompleted') ?? 'Lessons completed',
          value: regionStats.lessons_completed,
        },
        {
          label: t('dashboard.avgLessonsCompleted') ?? 'Avg lessons completed',
          value: regionStats.avg_lessons_completed,
          decimals: 2,
        },
        {
          label: t('dashboard.courseEnrollments') ?? 'Course enrollments',
          value: regionStats.course_enrollments,
        },
        {
          label: t('dashboard.avgCourseEnrollments') ?? 'Avg course enrollments',
          value: regionStats.avg_enrollments,
          decimals: 2,
        },
        {
          label: t('dashboard.satCount') ?? 'SAT count',
          value: regionStats.sat_count,
        },
        {
          label: t('dashboard.satStudentsCount'),
          value: regionStats.sat_students_count,
        },
        {
          label: t('dashboard.avgSatScore') ?? 'Avg SAT score',
          value: regionStats.avg_sat_score,
          decimals: 2,
        },
        {
          label: t('dashboard.ieltsCount') ?? 'IELTS count',
          value: regionStats.ielts_count,
        },
        {
          label: t('dashboard.ieltsStudentsCount'),
          value: regionStats.ielts_students_count,
        },
        {
          label: t('dashboard.avgIeltsScore') ?? 'Avg IELTS score',
          value: regionStats.avg_ielts_score,
          decimals: 2,
        },
        {
          label: t('dashboard.renessansStudentsCount'),
          value: regionStats.renessans_students_count,
        },
        {
          label: t('dashboard.avgTimeWatching') ?? 'Avg time watching (s)',
          value: regionStats.avg_time_on_watching,
        },
        {
          label: t('dashboard.avgTimeOnTest') ?? 'Avg time on test (s)',
          value: regionStats.avg_time_on_test,
        },
      ]
    : [];

  return (
    <div className="relative max-h-[80vh] w-full space-y-4 overflow-y-auto rounded-lg bg-white p-5">
      <div className="relative  rounded-lg bg-mainBlue p-4  text-white shadow-sm">
        <div
          onClick={closeModal}
          className="absolute right-0 top-0 cursor-pointer p-2 text-white"
        >
          <X />
        </div>
        <Title
          as="h3"
          className="text-lg font-semibold leading-tight text-white"
        >
          {regionName}
        </Title>
        {soato && <p className="text-xs text-gray-100">SOATO: {soato}</p>}
      </div>

      {/* <StatSection
        title="Summary"
        items={[
          { label: 'Students', value: report?.summary?.total_students },
          { label: 'Advisors', value: report?.summary?.total_advisors },
          { label: 'Schools', value: report?.summary?.total_schools },
          { label: 'Active students', value: report?.summary?.active_students },
        ]}
      /> */}

      {!!regionalMetricItems.length && (
        <StatSection
          title={t('dashboard.regionalMetrics') ?? 'Regional metrics'}
          items={regionalMetricItems}
        />
      )}

      {report?.practice_stats?.summary && (
        <StatSection
          title={t('dashboard.practiceStats') ?? 'Practice stats'}
          items={[
            {
              label: t('dashboard.studentsWithSessions') ?? 'Students with sessions',
              value: report.practice_stats.summary.students_with_sessions,
            },
            {
              label: t('dashboard.studentsWithoutSessions') ?? 'Students without sessions',
              value: report.practice_stats.summary.students_without_sessions,
            },
            {
              label: t('dashboard.totalSessions') ?? 'Total sessions',
              value: report.practice_stats.summary.total_sessions,
            },
            {
              label: t('dashboard.completedSessions') ?? 'Completed sessions',
              value: report.practice_stats.summary.completed_sessions,
            },
            {
              label: t('dashboard.inProgressSessions') ?? 'In-progress sessions',
              value: report.practice_stats.summary.in_progress_sessions,
            },
            {
              label: t('dashboard.avgPracticeScore') ?? 'Average score',
              value: report.practice_stats.summary.average_score,
              decimals: 2,
            },
          ]}
        />
      )}

      {report?.lesson_stats?.summary && (
        <StatSection
          title={t('dashboard.lessonStats') ?? 'Lesson stats'}
          items={[
            {
              label: t('dashboard.lessonsWatched') ?? 'Lessons watched',
              value: report.lesson_stats.summary.lessons_watched,
            },
            {
              label: t('dashboard.lessonsCompleted') ?? 'Lessons completed',
              value: report.lesson_stats.summary.lessons_completed,
            },
            {
              label: t('dashboard.completionRate') ?? 'Completion rate (%)',
              value: report.lesson_stats.summary.completion_rate,
              decimals: 2,
            },
            {
              label: t('dashboard.totalViewingTime') ?? 'Total viewing time',
              value: report.lesson_stats.summary.total_viewing_time,
            },
            {
              label: t('dashboard.recentActivity') ?? 'Recent activity',
              value: report.lesson_stats.summary.recent_activity_count,
            },
          ]}
        />
      )}

      {report?.login_stats?.summary && (
        <StatSection
          title={t('dashboard.loginStats') ?? 'Login stats'}
          items={[
            {
              label: t('dashboard.totalLogins') ?? 'Total logins',
              value: report.login_stats.summary.total_logins,
            },
            {
              label: t('dashboard.averageLogins') ?? 'Average logins',
              value: report.login_stats.summary.average_logins,
              decimals: 2,
            },
            {
              label: t('dashboard.activeStudents') ?? 'Active students',
              value: report.login_stats.summary.active_students,
            },
            {
              label: t('dashboard.inactiveStudents') ?? 'Inactive students',
              value: report.login_stats.summary.inactive_students,
            },
          ]}
        />
      )}

      {/* {report?.login_stats?.top_students?.length ? (
        <TopStudents students={report.login_stats.top_students} />
      ) : null} */}
    </div>
  );
};

export default MapDetails;
