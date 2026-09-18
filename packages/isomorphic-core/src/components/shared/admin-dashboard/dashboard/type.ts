// types/advisorStatistics.ts

import { Attachment } from '@core/types';

/** Common */
export type ISODateTimeString = string;
export type Nullable<T> = T | null;

export interface Student {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: Nullable<ISODateTimeString>;
  online: boolean;
  avatar: Attachment;
  student_no: string;
}

export type WithStudent<T> = { student: Student } & T;

/** ---------- Root summary (aggregated across everything) ---------- */
export interface AdvisorRootSummary {
  total_students: number;
  total_courses: number;
  active_courses: number;
  completed_courses: number;
  average_course_progress: number;

  total_tasks: number;
  average_completion_rate: number;

  total_tests: number;
  average_score: number;
  average_accuracy: number;

  total_lessons: number;
  average_lesson_progress: number;

  total_sessions: number;
  average_attendance_rate: number;
  average_session_duration: number;

  total_enrollments: number;
  average_progress: number;
  most_recent_activity_at: string;
  total_spent_time: number;
  average_spent_time: number;
}

/** ---------- Courses block ---------- */
export interface CoursesSummary {
  total_courses: number;
  completed_courses: number;
  active_courses: number;
  average_progress: number;
  /** e.g. "all-time" */
  period: string;
}

export type CoursesStudent = WithStudent<{
  /** Average course progress across this student's courses (0..100) */
  student: Student;
  enrolled_courses_count: number;
  learned_lessons: number;
  total_lessons: number;
  last_lesson: string | null;
  last_viewed_at: string | null;
  total_spent_time: number;
}>;

export interface CoursesSection {
  summary: CoursesSummary;
  students: CoursesStudent[];
}

/** ---------- Tasks block ---------- */
export interface TasksSummary {
  total_tasks: number;
  assigned_students: number;
  completed: number;
  pending: number;
  average_completion_rate: number;
}

export type TasksStudent = WithStudent<{
  total_tasks: number;
  completed: number;
  pending: number;
  /** 0..100 */
  completion_rate: number;
}>;

export interface TasksSection {
  summary: TasksSummary;
  students: TasksStudent[];
}

/** ---------- Lessons block ---------- */
export interface LessonsSummary {
  total_students: number;
  total_lessons: number;
  completed_lessons: number;
  in_progress_lessons: number;
  average_progress: number;
}

export type LessonsStudent = WithStudent<{
  total_lessons: number;
  completed: number;
  in_progress: number;
  avg_progress: number;
  /** 0..100 */
  completion_rate: number;
  last_seen_at: Nullable<ISODateTimeString>;
  last_lesson: Nullable<string>;
}>;

export interface LessonsSection {
  summary: LessonsSummary;
  students: LessonsStudent[];
}

/** ---------- Tests / Practice block ---------- */
export interface TestsSummary {
  total_tests: number;
  average_score: number;
  average_accuracy: number;
}

export type TestPerformer = WithStudent<{
  /** 0..100 */
  average_score: number;
  /** 0..100 */
  accuracy: number;
  total_tests: number;
  /** average time (minutes or whatever unit your API uses) */
  avg_time: number;
  rank: number;
  last_test_score: Nullable<number>;
  last_test_date: Nullable<ISODateTimeString>;
}>;

export interface TestsSection {
  summary: TestsSummary;
  top_performers: TestPerformer[];
  lowest_performers: TestPerformer[];
  /** Same shape per-student as performers */
  students: TestPerformer[];
}

/** ---------- Sessions block ---------- */
export interface SessionsSummary {
  total_sessions: number;
  total_students: number;
  /** 0..100 */
  avg_attendance_rate: number;
  /** average duration (in your API's time unit) */
  avg_duration: number;
}

export type SessionsStudent = WithStudent<{
  total_sessions: number;
  joined_sessions: number;
  missed_sessions: number;
  /** 0..100 */
  attendance_rate: number;
  /** average duration (same unit as summary) */
  avg_duration: number;
}>;

export interface SessionsSection {
  summary: SessionsSummary;
  students: SessionsStudent[];
}

/** ---------- Root response ---------- */
export interface AdvisorStatisticsResponse {
  summary: AdvisorRootSummary;
  courses: CoursesSection;
  tasks: TasksSection;
  lessons: LessonsSection;
  tests: TestsSection;
  sessions: SessionsSection;
}

// Root
export interface DashboardData {
  summary: Summary;
  regions: Region[];
  best_districts?: BestDistrictRow[];
  lowest_districts?: BestDistrictRow[];
  best_students?: BestStudentRow[];
  lowest_students?: BestStudentRow[];
}

export interface Summary {
  // total_advisors: number;
  // total_students: number;
  // total_practice_sessions: number;
  // total_passed_tests: number;
  // average_practice_score: number;
  // total_lessons_completed: number;
  // average_lessons_completed: number;
  // total_course_enrollments: number;
  // average_course_enrollments: number;
  // total_sat_count: number;
  // total_ielts_count: number;
  // average_sat_score: number;
  // average_ielts_score: number;
  // average_time_on_watching: number;
  // average_time_on_test: number;
  total_advisors: number;
  total_students: number;
  total_practice_sessions: number;
  total_passed_tests: number;
  average_practice_score: number;
  total_lessons_completed: number;
  average_lessons_completed: number;
  total_course_enrollments: number;
  average_course_enrollments: number;
  total_sat_count: number;
  total_ielts_count: number;
  average_sat_score: number;
  average_ielts_score: number;
  average_time_on_watching: number; // seconds?
  average_time_on_test: number; // seconds?
}

export interface Region {
  info: RegionInfo;
  statistics: RegionStatistics;
}

export interface RegionInfo {
  id: number; // e.g., 13, 5723
  soato_id: string; // e.g., "1730"
  name: string; // e.g., "Farg'ona viloyati"
  translations: Translations;
}

export interface Translations {
  en: string;
  ru: string;
  uz: string;
  oz: string;
}

export interface RegionStatistics {
  total_advisors: number;
  total_students: number;
  total_practice_sessions: number;
  passed_practice_tests: number;
  avg_practice_score: number;
  lessons_completed: number;
  avg_lessons_completed: number;
  course_enrollments: number;
  avg_enrollments: number;
  sat_count: number;
  avg_sat_score: number;
  ielts_count: number;
  avg_ielts_score: number;
  avg_time_on_watching: number;
  avg_time_on_test: number;
  sat_students_count: number;
  ielts_students_count: number;
  renessans_students_count: number;
}

export interface CourseProgressByRegion {
  region: RegionInfo; // same shape as Region.info
  courses: CourseProgress[];
}

export interface CourseProgressAllRegions {
  region: string; // e.g. "All Regions"
  courses: CourseProgress[];
}

export interface CourseProgress {
  course_id?: number;
  course_name: string;
  total_lessons?: number;
  total_completed_now?: number;
  total_completed_week_ago?: number;
  weekly_diff?: number;
  lessons: LessonProgress[];
  weekly_diffs: {
    total_diff: number;
    percentage_change: number;
  };
}

export interface LessonProgress {
  lesson_id?: number;
  lesson_title: string;
  lesson_order?: number;
  completed_count: number;
  all_completed?: number;
  completed_week_ago?: number;
  weekly_diff?: number;
}

export interface CourseReview {
  course: {
    id: number;
    course_name: string;
  };
  total_reviews: number;
  rating_distribution: Record<string, number>;
  overall: {
    average_rating: number;
    quality_score: number;
  };
}

export interface RegionChartData {
  visitors?: {
    total_visitors: number;
    total_visits: number;
    average_visits_per_visitor: number;
    daily_visitors: Array<{
      date: string; // DD.MM.YYYY
      unique_visitors: number;
      total_sessions: number;
    }>;
  };
  platform_usage_time?: {
    daily: Array<{
      period: string; // YYYY-MM-DD
      seconds: number;
    }>;
    monthly: Array<{
      period: string; // YYYY-MM
      seconds: number;
    }>;
  };
  viewing_time_by_period?: {
    daily: Array<{
      period: string; // YYYY-MM-DD
      seconds: number;
    }>;
    monthly: Array<{
      period: string; // YYYY-MM
      seconds: number;
    }>;
  };
}

//  ------------------ Dashboard ---------------------------
export interface RegionReport {
  region: {
    id: number;
    soato_id: string;
    name: string;
    translations: {
      en: string;
      ru: string;
      uz: string;
      oz: string;
    };
  };

  summary: {
    total_advisors: number;
    total_students: number;
    total_schools: number;
    active_students: number;
  };

  advisors: {
    summary: {
      total: number;
      with_students: number;
    };
    details: AdvisorStats[];
  };

  students: {
    summary: {
      total: number;
      active: number;
      inactive: number;
    };
  };

  login_stats: {
    summary: {
      total_students: number;
      active_students: number;
      inactive_students: number;
      total_logins: number;
      average_logins: number;
    };
    by_date: Array<{
      login_date: string; // YYYY-MM-DD
      unique_users: number;
      total_sessions: number;
    }>;
    top_students: TopStudent[];
  };

  practice_stats: {
    summary: {
      total_students: number;
      students_with_sessions: number;
      students_without_sessions: number;
      total_sessions: number;
      completed_sessions: number;
      in_progress_sessions: number;
      average_score: number;
    };
  };

  lesson_reviews?: CourseReview[];

  lesson_stats: {
    summary: {
      total_students: number;
      lessons_watched: number;
      lessons_completed: number;
      completion_rate: number;
      total_viewing_time: number; // seconds
      recent_activity_count: number;
    };
  };

  /** Courses with lesson completion counts:
   * - region endpoint: CourseProgressByRegion[]
   * - /all endpoint: CourseProgressAllRegions
   */
  course_info?: CourseProgressByRegion[] | CourseProgressAllRegions;

  best_districts?: BestDistrictRow[];
  lowest_districts?: BestDistrictRow[];
  best_students?: BestStudentRow[];
  lowest_students?: BestStudentRow[];

  schools: SchoolRow[];

  chart_data?: RegionChartData;
}

// ---------- Users / Roles ----------

export interface Role {
  value: number;
  label: string;
}

export interface BaseUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: string | null; // "YYYY-MM-DD HH:mm:ss" or null
  online: boolean;
  student_no: number | null;
  role: Role;
  avatar: Avatar | null;
}

export interface AdvisorUser extends Omit<BaseUser, 'student_no'> {
  student_no: number | null; // advisors have null student_no in given data
}

export interface StudentUser extends BaseUser {
  student_no: number; // students have a number
}

export interface Avatar {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number; // bytes
  url: string;
  created_at: string; // ISO8601
}

// ---------- Advisors ----------

export interface AdvisorStats {
  advisor: AdvisorUser;
  student_count: number;
  active_students: number;
  inactive_students: number;
  total_logins: number;
  practice_sessions: number;
  lessons_completed: number;
}

// ---------- Login stats: top students ----------

export interface TopStudent {
  student: StudentUser;
  login_count: number;
  last_login: string; // "DD.MM.YYYY HH:mm:ss"
}

// ---------- Schools ----------

export type SchoolTypeLabel =
  | 'Presidential School'
  | 'Specialized School'
  | 'Ijod maktabi'
  | 'Vocational School'
  | 'Private School'
  | 'Public (State) School'
  | 'Other';

export type SchoolTypeValue = 1 | 2 | 3 | 4 | 7 | 8 | 9;

export interface LabeledValue<T = number> {
  value: T;
  label: string;
}

export interface School {
  id: number;
  name: string;
  type: LabeledValue<SchoolTypeValue> & { label: SchoolTypeLabel };
  region: LabeledValue<number>;
  district: LabeledValue<number>;
  address: string;
  postal_code: string | null;
  phone_number: string;
  website_url: string | null;
}

// Note: the payload wraps each school in an object keyed by "0" plus advisor_count.
export interface SchoolRow {
  '0': School;
  advisor_count: number;
}

export interface BestDistrictRow {
  school_id: number;
  school_name: string;
  total_lessons_completed: number;
  student_count: number;
  avg_lessons_completed: number;
}

export interface BestStudentRow {
  student_id: number;
  name: string;
  lessons_completed: number;
}
