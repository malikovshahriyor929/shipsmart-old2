import { _Meta, ApiThumb, Student, User } from '@core/types';

export interface StudentRatingStatus {
  value: number;
  label: string;
}

export interface IeltsCategoryResult {
  id: number;
  trf_number?: string | null;
  overall?: number | null;
  listening?: number | null;
  reading?: number | null;
  writing?: number | null;
  speaking?: number | null;
  test_date?: string | null;
  expiry_date?: string | null;
  certificate?: ApiThumb | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface SatCategoryResult {
  id: number;
  registration_no?: string | null;
  total_score?: number | null;
  math_score?: number | null;
  english_score?: number | null;
  test_date?: string | null;
  certificate?: ApiThumb | null;
  created_at?: string;
  [key: string]: unknown;
}

export type StudentRatingCategoryResult =
  | IeltsCategoryResult
  | SatCategoryResult
  | Record<string, unknown>
  | null;

export interface StudentRatingCategory {
  value: number;
  label: string;
  result?: StudentRatingCategoryResult;
}

export interface StudentRatingCompletionItem {
  label: string;
  completed: boolean;
}

export interface StudentRatingCompletionMap {
  ielts?: StudentRatingCompletionItem;
  sat_math?: StudentRatingCompletionItem;
  sat_english?: StudentRatingCompletionItem;
  [key: string]: StudentRatingCompletionItem | undefined;
}

export interface RatingProgress {
  id: number;
  student_rating_id: number;
  status: StudentRatingStatus;
  score: number | null;
  comment: string;
  creator: User;
  checker?: User;
  checked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentRatingAttachment {
  id: number;
  student_rating_id: number;
  attachment: ApiThumb;
  created_at: string;
}

export interface StudentRating {
  id: number;
  student_id: number;
  category: StudentRatingCategory;
  score: number | null;
  status: StudentRatingStatus;
  student: Student;
  attachments: StudentRatingAttachment[];
  progresses: RatingProgress[];
  created_at: string;
  updated_at: string;
  mark_as_completed?: StudentRatingCompletionMap | null;
}

export interface StudentRatingResponse {
  data: StudentRating[];
  _meta: _Meta;
  success: boolean;
}

export interface StudentRatingDetailsResponse {
  data: StudentRating;
  success: boolean;
}

export interface ReviewStudentRatingPayload {
  student_rating_id: number;
  is_accepted: boolean;
  score?: number;
  comment?: string;
}
