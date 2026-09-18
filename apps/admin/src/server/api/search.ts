import axiosInstance from '../api';

export type SearchLookupParams = {
  q: string;
  page?: number;
  per_page?: number;
};

export type LookupCourse = {
  id: number | string;
  code: string;
  name: string;
  status?: { value: number; label: string };
  subject?: { value: number; label: string };
  is_private?: boolean;
  instructors?: Array<{ user: any; extra_data?: any }>;
  thumbnail?: { url?: string | null } | null;
  created_by?: any;
  lesson_counts?: number;
  progress?: {
    completion_percent?: number;
    status?: { value: number; label: string };
    completion_date?: string | null;
    completed_at?: string | null;
  } | null;
};

export type LookupLesson = {
  id: number | string;
  slug: string;
  title: string;
  course_id: number;
  status?: { value: number; label: string };
  description?: string;
  duration?: number;
  starts_at?: string;
  thumbnail?: { url?: string | null } | null;
  video?: { url?: string | null } | null;
  has_practice_test?: boolean;
  progress?: {
    completion_percent?: number;
    status?: { value: number; label: string };
    completed_at?: string | null;
    rating?: number;
  } | null;
};

export type LookupTask = {
  id: number | string;
  title: string;
  status?: { value: number; label: string };
  due_at?: string;
  attachments_count?: number;
  sources_count?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: any;
};

export type LookupFaq = {
  id: number | string;
  category: string;
  role: { value: number; label: string };
  answer: string;
  question: string;
  order_id: number;
  is_active: boolean;
};
export type SearchLookupResponse = {
  data: {
    courses?: LookupCourse[];
    lessons?: LookupLesson[];
    tasks?: LookupTask[];
    pagination?: { page: number; per_page: number };
    faqs: LookupFaq[];
  };
  success: boolean;
};

export async function searchLookup(params: SearchLookupParams) {
  const { q, page = 1, per_page = 30 } = params;
  const res = await axiosInstance.get<SearchLookupResponse>(
    '/v1/lookup/search',
    {
      params: { q, page, per_page },
    }
  );
  return (
    res?.data?.data ?? {
      courses: [],
      lessons: [],
      tasks: [],
      faqs: [],
      pagination: { page, per_page },
    }
  );
}
