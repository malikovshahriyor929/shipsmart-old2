import {
  ApiOption,
  CalendarDTO,
  CreateAdvisorPayload,
  CreateCounselorPayload,
  CreateSessionPayload,
  Id,
  NotificationResponse,
  School,
  SchoolFilter,
  SessionDTO,
  StudentLookup,
  SupportLookup,
  UploadResult,
} from '@core/types';
import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { getStoredStudentYear } from '@/config/student-year';

export const baseURL =
  (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '') + '/en';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: false,
  timeout: 30_000,
});

// Public (no-auth) client for endpoints like request-reset, reset-password, register, login
export const axiosPublic = axios.create({
  baseURL,
  withCredentials: false,
  timeout: 30_000,
});

export const axiosInstanceWithoutTimer = axios.create({
  baseURL,
  withCredentials: false,
});

const SESSION_TOKEN_CACHE_TTL = 60_000;
let sessionTokenCache: { token?: string; expiresAt: number } | null = null;
let sessionTokenRequest: Promise<string | undefined> | null = null;
const API_CACHE_TTL = 60_000;
let profileCache: { data: any; expiresAt: number } | null = null;
let profileRequest: Promise<any> | null = null;
let notificationsCache: {
  data: NotificationResponse;
  expiresAt: number;
} | null = null;
let notificationsRequest: Promise<NotificationResponse> | null = null;

function isDevAccessToken(token?: string) {
  return process.env.NODE_ENV !== 'production' && token === 'dev-admin-access-token';
}

async function getCachedSessionToken() {
  if (typeof window === 'undefined') return undefined;

  const now = Date.now();
  if (sessionTokenCache && sessionTokenCache.expiresAt > now) {
    return sessionTokenCache.token;
  }

  if (!sessionTokenRequest) {
    sessionTokenRequest = getSession()
      .then((session) => {
        const token = session?.user?.accessToken;
        const accessTokenExpiry = session?.user?.accessTokenExpiry;
        const safeTtl =
          typeof accessTokenExpiry === 'number'
            ? Math.max(
                0,
                Math.min(
                  SESSION_TOKEN_CACHE_TTL,
                  accessTokenExpiry - Date.now() - 15_000
                )
              )
            : SESSION_TOKEN_CACHE_TTL;

        sessionTokenCache = {
          token,
          expiresAt: Date.now() + safeTtl,
        };
        return token;
      })
      .finally(() => {
        sessionTokenRequest = null;
      });
  }

  return sessionTokenRequest;
}

export interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = await getCachedSessionToken();
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }

      const studentYear = getStoredStudentYear();
      if (studentYear) {
        config.headers = config.headers ?? {};
        (config.headers as any).student_year = studentYear;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      typeof window !== 'undefined'
    ) {
      original._retry = true;
      sessionTokenCache = null;
      const newSession = await getSession();
      if ((newSession as any)?.error === 'RefreshAccessTokenError') {
        if (!isDevAccessToken(newSession?.user?.accessToken)) {
          await signOut({ callbackUrl: '/auth/sign-in' });
        }
        return Promise.reject(error);
      }
      const newToken = newSession?.user?.accessToken;
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      }
    }

    if (status === 401 && typeof window !== 'undefined') {
      const session = await getSession();
      if (!isDevAccessToken(session?.user?.accessToken)) {
        await signOut({ callbackUrl: '/auth/sign-in' });
      }
    }
    return Promise.reject(error);
  }
);

axiosInstanceWithoutTimer.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const session = await getSession();
      const token = session?.user?.accessToken;
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstanceWithoutTimer.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      typeof window !== 'undefined'
    ) {
      original._retry = true;
      sessionTokenCache = null;
      const newSession = await getSession();
      if ((newSession as any)?.error === 'RefreshAccessTokenError') {
        if (!isDevAccessToken(newSession?.user?.accessToken)) {
          await signOut({ callbackUrl: '/auth/sign-in' });
        }
        return Promise.reject(error);
      }
      const newToken = newSession?.user?.accessToken;
      if (newToken) {
        original.headers = original.headers ?? {};
        (original.headers as any).Authorization = `Bearer ${newToken}`;
        return axiosInstanceWithoutTimer(original);
      }
    }

    if (status === 401 && typeof window !== 'undefined') {
      const session = await getSession();
      if (!isDevAccessToken(session?.user?.accessToken)) {
        await signOut({ callbackUrl: '/auth/sign-in' });
      }
    }
    return Promise.reject(error);
  }
);

// ============= FILE UPLOAD ===========

function normalizeUploadResponse(data: any): UploadResult[] {
  // API may return { data: {...} } or { data: [ ... ] }
  const d = data?.data;
  if (!d) return [];
  return Array.isArray(d) ? (d as UploadResult[]) : [d as UploadResult];
}

/** Upload exactly one file and return its public_id */
export async function uploadOneAttachment(
  file: File,
  fieldName = 'files'
): Promise<string> {
  const fd = new FormData();
  fd.append(fieldName, file);
  const res = await axiosInstance.post(
    '/v1/attachments/upload',
    fd
    // {
    // headers: { 'Content-Type': 'multipart/form-data' },
    // }
  );
  const [first] = normalizeUploadResponse(res.data);
  return first?.public_id ?? '';
}

/** Upload multiple files and return their public_ids (order preserved) */
export async function uploadManyAttachments(
  files: File[],
  fieldName = 'files[]'
): Promise<string[]> {
  const fd = new FormData();
  files.forEach((f) => fd.append(fieldName, f));
  const res = await axiosInstance.post(
    '/v1/attachments/upload',
    fd
    // {
    // headers: { 'Content-Type': 'multipart/form-data' },
    // }
  );
  return normalizeUploadResponse(res.data).map((x) => x.public_id);
}

// ============ LOOKUP for Select options ============
export async function getStudentLookup(): Promise<StudentLookup> {
  const { data } = await axiosInstance.get('/v1/lookup/student');
  return data?.data as StudentLookup;
}

// ========= Districts and Schools by region and school type ==========
// Some backends return {id,name}, others {value,label}; normalize both
function toOption(x: any): ApiOption {
  if (!x) return { value: 0, label: '' };
  if ('value' in x && 'label' in x) return x as ApiOption;
  if ('id' in x && 'name' in x)
    return { value: Number(x.id), label: String(x.name) };
  return {
    value: Number(x.value ?? x.id ?? 0),
    label: String(x.label ?? x.name ?? ''),
  };
}

function unwrap<T = any>(res: any): T {
  return (res?.data?.data ?? res?.data ?? []) as T;
}

// ===== Districts =====
export async function getDistricts(regionId: number): Promise<ApiOption[]> {
  // Prefer GET with params
  try {
    const r = await axiosInstance.get('/v1/districts', {
      params: { region_id: regionId },
    });
    const list = unwrap<any[]>(r);
    return list.map(toOption);
  } catch {
    // Fallback to POST if your API only accepts JSON body
    const r = await axiosInstance.post('/v1/districts', {
      region_id: regionId,
    });
    const list = unwrap<any[]>(r);
    return list.map(toOption);
  }
}

// ===== Schools =====
export async function getSchools(filter: SchoolFilter): Promise<School[]> {
  // 1) Try GET with query params (browser-friendly)
  try {
    const r = await axiosInstance.get('/v1/schools', { params: filter });
    return unwrap<School[]>(r);
  } catch {
    // 2) Fallback to POST for servers that read body
    const r = await axiosInstance.post('/v1/schools', filter);
    return unwrap<School[]>(r);
  }
}

export async function getSchoolOptions(
  filter: SchoolFilter
): Promise<ApiOption[]> {
  const schools = await getSchools(filter);
  return schools.map((s) => ({ value: s.id, label: s.name }));
}

// ===== Admin  =====

//advisors crud
export async function getAllAdvisors(params?: Record<string, any>) {
  return await axiosInstance.get('/v1/users/advisors', { params });
}

export async function createAdvisor(data: CreateAdvisorPayload) {
  const res = await axiosInstance.post('/v1/users/advisors', data);
  return res.data;
}

export async function updateAdvisorDetails(id: number, payload: any) {
  const res = await axiosInstance.put(`/v1/users/advisors/${id}`, payload);
  return res.data?.data ?? res.data;
}
export async function getAdvisorDetails(id: number) {
  const res = await axiosInstance.get(`/v1/users/advisors/${id}`);
  return res.data?.data ?? res.data;
}

// counselors crud
export async function getAllCounselors(params?: Record<string, any>) {
  return await axiosInstance.get('/v1/users/counselors', { params });
}

export async function createCounselor(data: CreateCounselorPayload) {
  const res = await axiosInstance.post('/v1/users/counselors', data);
  return res.data;
}

export async function updateCounselorDetails(id: number, payload: any) {
  const res = await axiosInstance.put(`/v1/users/counselors/${id}`, payload);
  return res.data?.data ?? res.data;
}
export async function getCounselorDetails(id: number) {
  const res = await axiosInstance.get(`/v1/users/counselors/${id}`);
  return res.data?.data ?? res.data;
}

// teachers crud
export async function getAllTeachers(params?: Record<string, any>) {
  return await axiosInstance.get('/v1/users/teachers', { params });
}

export async function createTeacher(data: CreateAdvisorPayload) {
  const res = await axiosInstance.post('/v1/users/teachers', data);
  return res.data;
}

export async function updateTeacherDetails(id: number, payload: any) {
  const res = await axiosInstance.put(`/v1/users/teachers/${id}`, payload);
  return res.data?.data ?? res.data;
}
export async function getTeacherDetails(id: number) {
  const res = await axiosInstance.get(`/v1/users/teachers/${id}`);
  return res.data?.data ?? res.data;
}

// profile
export async function getProfile() {
  const now = Date.now();
  if (profileCache && profileCache.expiresAt > now) {
    return profileCache.data;
  }

  if (!profileRequest) {
    profileRequest = axiosInstance
      .get('/v1/users/profile')
      .then((res) => {
        const data = res?.data?.data ?? null;
        profileCache = { data, expiresAt: Date.now() + API_CACHE_TTL };
        return data;
      })
      .finally(() => {
        profileRequest = null;
      });
  }

  return profileRequest;
}
export async function getStudentsOfAdvisor(advisorId: number) {
  const params: Record<string, any> = {};
  if (advisorId) {
    params.advisor_id = advisorId;
  }
  const res = await axiosInstance.get('/v1/users/students', { params });
  return res?.data?.data ?? null;
}

// === Assigned Students ===
export async function getAssignedStudents() {
  const res = await axiosInstance.get('/v1/users');
  return res?.data?.data ?? [];
}

export type StudentCreateAccessValue = {
  status?:
    | 'scheduled'
    | 'open'
    | 'closed'
    | number
    | string
    | ApiOption
    | null;
  is_open?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type AppSettingItem<TValue = any> = {
  key: string;
  value: TValue;
};

function normalizeAppSettings(data: any): AppSettingItem[] {
  const payload = data?.data ?? data;
  if (Array.isArray(payload)) return payload as AppSettingItem[];
  if (Array.isArray(payload?.items)) return payload.items as AppSettingItem[];
  if (payload?.key && 'value' in payload) return [payload as AppSettingItem];
  if (payload && typeof payload === 'object') {
    return Object.entries(payload as Record<string, any>).map(
      ([key, value]) => ({ key, value })
    );
  }
  return [];
}

export async function getStudentCreateAccessSetting() {
  const res = await axiosInstance.get('/v1/app-settings', {
    params: { keys: 'student_create_access' },
  });
  const settings = normalizeAppSettings(res.data);
  return (
    settings.find((item) => item.key === 'student_create_access')
      ?.value as StudentCreateAccessValue | undefined
  );
}

export async function getStudentCreateAccessStatusOptions(): Promise<
  ApiOption[]
> {
  const res = await axiosInstance.get('/v1/lookup', {
    params: { student_create_access_status: 1 },
  });
  return (
    res.data?.data?.student_create_access_status ??
    res.data?.student_create_access_status ??
    []
  );
}

export async function updateStudentCreateAccessSetting(
  value: StudentCreateAccessValue
) {
  const res = await axiosInstance.put('/v1/app-settings', {
    items: [
      {
        key: 'student_create_access',
        value,
      },
    ],
  });
  return res.data;
}

// Deleting the student
export async function deleteStudent(
  studentId: number | string,
  payload: {
    attachment_id: string;
    comment: string;
  }
) {
  const res = await axiosInstance.delete(`/v1/users/students/${studentId}`, {
    data: payload,
  });

  return res.data;
}

// ===== Courses =====
//get all courses
export async function getAllCourses() {
  const res = await axiosInstance.get('/v1/courses');
  return Array.isArray(res?.data?.data) ? res.data.data : [];
}

// get course by id
export async function getCourseById(courseId: string | number) {
  const res = await axiosInstance.get(`/v1/courses/${courseId}`);
  return res?.data?.data;
}

// get lessons of a course
export async function getCourseLessons(courseId: Id, page = 1) {
  // Pass page and per_page as query params
  const res = await axiosInstance.get(`/v1/courses/${courseId}/lessons`, {
    params: { page, per_page: 20 },
  });
  // Return the full object { data: [...], _meta: {...} }
  return res?.data;
}

// get lesson by id
export async function getLessonById(
  lessonId: string | number,
  params?: {
    page?: number;
    per_page?: number;
    review_page?: number;
    review_per_page?: number;
    review_rating?: number;
    status?: string | number;
    q?: string;
  }
) {
  const res = await axiosInstance.get(`/v1/courses/lessons/${lessonId}`, {
    params,
  });
  return res?.data;
}

// ===== Sessions =====
export async function createSession(payload: CreateSessionPayload) {
  const { data } = await axiosInstanceWithoutTimer.post<{
    data: SessionDTO;
    success: boolean;
  }>('/v1/sessions', payload);
  return data.data; // SessionDTO
}

export async function getMySessions() {
  const { data } = await axiosInstance.get<{
    data: SessionDTO[];
    success: boolean;
  }>('/v1/sessions/me');
  return data.data; // SessionDTO[]
}

// export async function getMyCalendar() {
//   const { data } = await axiosInstance.get<{
//     data: TaskDTO[];
//     success: boolean;
//   }>('/v1/calendar/me');
//   return data.data; // TaskDTO[]
// }
export async function getMyCalendar(): Promise<CalendarDTO> {
  const { data } = await axiosInstance.get<{
    data: CalendarDTO;
    success: boolean;
  }>('/v1/calendar/me');
  return data.data; // CalendarDTO
}

export async function getAdvisorData(): Promise<StudentLookup> {
  const { data } = await axiosInstance.get('/v1/lookup/student');
  return data?.data as StudentLookup;
}

// ===== Support =====
export async function getSupportLookUp() {
  const { data } = await axiosInstance.get('/v1/lookup/ticket');
  return data?.data as SupportLookup;
}
export async function createSupportTicket(
  data: any
  //    {
  //   type: number;
  //   priority: number;
  //   message: string;
  // }
) {
  const res = await axiosInstance.post('/v1/support-tickets', data);
  return res.data.data;
}

// dashboard statistics
// const BASE_URL = '/v1/statistics/advisor';
export async function getAllAdvisorStatistics() {
  try {
    const [
      dashboardRes,
      courseRes,
      taskRes,
      practiceRes,
      lessonRes,
      sessionRes,
    ] = await Promise.all([
      axiosInstance('/v1/statistics/advisor/dashboard'),
      axiosInstance('/v1/statistics/advisor/courses'),
      axiosInstance('/v1/statistics/advisor/tasks'),
      axiosInstance('/v1/statistics/advisor/practice'),
      axiosInstance('/v1/statistics/advisor/lessons'),
      axiosInstance('/v1/statistics/advisor/sessions'),
    ]);

    return {
      dashboard: dashboardRes.data?.data,
      course: courseRes.data?.data,
      task: taskRes.data?.data,
      practice: practiceRes.data?.data,
      lesson: lessonRes.data?.data,
      session: sessionRes.data?.data,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      console.error('❌ Failed to load advisor statistics:', error);
      throw new Error(
        error?.response?.data?.message || 'Failed to load advisor statistics'
      );
    }
  }
}

// faq // '@/server/api/faqs.ts'
export type FaqDto = {
  id: number;
  category: string;
  question: string;
  answer: string; // HTML
  role?: { value: number; label: string } | null;
  order_id?: number | null;
  is_active?: boolean;
};

export async function getFaqs(): Promise<FaqDto[]> {
  const res = await axiosInstance('/v1/faqs');
  return res.data.data ?? [];
}

export async function getFaqById(id: number): Promise<FaqDto> {
  const res = await axiosInstance.get(`/v1/faqs/${id}`);
  return res.data.data;
}

export async function getNoticationsAll() {
  const now = Date.now();
  if (notificationsCache && notificationsCache.expiresAt > now) {
    return notificationsCache.data;
  }

  if (!notificationsRequest) {
    notificationsRequest = axiosInstance
      .get('/v1/notifications/me')
      .then((res) => {
        const data = res.data.data as NotificationResponse;
        notificationsCache = { data, expiresAt: Date.now() + API_CACHE_TTL };
        return data;
      })
      .finally(() => {
        notificationsRequest = null;
      });
  }

  return notificationsRequest;
}

export async function getNoticationsOnlyUnread() {
  const res = await axiosInstance.get('/v1/notifications/me/unread');
  return res.data.data as NotificationResponse;
}

export async function patchNoticationsUnread(notifId: string) {
  const res = await axiosInstance.patch(
    `/v1/notifications/${notifId}/mark-read`
  );
  return res.data.data as [];
}

export async function patchNoticationsUnreadAll() {
  const res = await axiosInstance.patch('/v1/notifications/all-mark-read');
  return res.data.data as NotificationResponse;
}

// Announcements
export async function getAllAnnouncements(params?: any) {
  const res = await axiosInstance.get('/v1/announcements', { params });
  return res.data;
}

export async function getAnnouncementById(id: number | string) {
  const res = await axiosInstance.get(`/v1/announcements/${id}`);
  return res.data;
}

export async function approveAnnouncement(id?: Id) {
  const res = await axiosInstance.post(`v1/announcements/${id}/approve`);
  return res.data;
}
export async function rejectAnnouncement(id?: Id) {
  const res = await axiosInstance.post(`v1/announcements/${id}/reject`);
  return res.data;
}

export async function completeStudentCourse(payload: {
  course_id: number;
  student_id: number;
  key?: 'sat_math' | 'sat_english' | 'ielts';
}): Promise<any> {
  const res = await axiosInstance.post('/v1/course/complete', payload);
  return res.data;
}

export async function uncompleteStudentCourse(payload: {
  course_id: number;
  student_id: number;
  key?: 'sat_math' | 'sat_english' | 'ielts';
}): Promise<any> {
  const res = await axiosInstance.delete('/v1/course/uncomplete', {
    data: payload,
  });
  return res.data;
}

export default axiosInstance;
