export interface CreateAdvisorPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  gender: number;
  preferred_language: number;
  avatar: string | null;

  region_id: number;
  school_id: number;

  passport_number: string;
  pinfl: string;
  given_place: string;
  given_date: string;
  expire_date: string;
  passport_file_id: string | null;
  citizenship_id: number;
  nationality_id: number;
}
export interface CreateCounselorPayload {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  secondary_email?: string;
  phone_number: string;
  date_of_birth: string;
  gender: number;
  preferred_language: number;
  avatar: string | null;

  region_id: number;

  work_place: string;
  specialization: string;
  bio?: string;
  social_links?: string[];
  passport_number: string;
  pinfl: string;
  given_place: string;
  given_date: string;
  expire_date: string;
  passport_file_id: string | null;
  citizenship_id: number;
  nationality_id: number;
}

export type ApiOption = {
  value: number | string;
  label: string;
  [key: string]: any;
};
export type User = {
  id: Id;
  username: string | null;
  email: string | null;
  phone_number: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar: ApiThumb;
  last_seen_at: string | null;
  online: boolean;
  role?: ApiOption;
};

export interface Student extends User {
  student_no?: string | null;
}

export type Id = string | number;

export type ProfileUser = {
  id: Id;
  name: string;
  email?: string;
  avatar?: {
    url: string;
  };
  firstName?: string;
  lastName?: string;
  role?: number;
  student_no?: string;
};

export type CourseInstructor = {
  extra_data: {
    Experience?: string;
    Name?: string;
    Position?: string;
    Specialization?: string;
  };
  user: User;
};
export type ApiThumb = {
  public_id: Id;
  file_name: string;
  extension: string;
  file_size?: number;
  size?: string;
  url: string;
  created_at: string;
};

export type ApiProgress = {
  completion_percent: number | null;
  status: ApiOption | null;
  completed_at: string | null;
  completion_date?: string | null;
  enrolled_at?: string | null;
  rating?: number | null;
  is_passed?: boolean;
  behind_by?: number | null; // new field for "behind by" gap
  left_to_do?: number | null;
  color?: ApiOption | null;
} | null;

export type Course = {
  id: Id;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  language_id?: ApiOption;
  level_id?: ApiOption;
  subject_id?: ApiOption;
  subject?: ApiOption;
  status?: { value: number; label: string } | null;
  is_private?: boolean | null;
  student_counts?: number | null;
  lesson_counts?: number | null;
  created_by?: User;
  thumbnail?: ApiThumb;
  created?: User;
  instructors: CourseInstructor[] | null;
  progress?: ApiProgress;
  duration_months?: string | null; // e.g., "two month"
  live_sessions?: number | null;
  video_lessons?: number | null;
  hours_per_week?: number | null;
  key_features?: string[] | null;
  curriculum_modules?: string[] | null;
  additional_resources?: string[] | null;
  target_audience?: string | null;
  lessons?: Lesson[] | null;
  created_at?: string | null;
  updated_at?: string | null;
  students_progress?: StudentProgressItem[];
  first_lesson_slug?: string;
};

export type _Meta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  pages?: number;
  completed?: number;
  in_progress?: number;
  not_started?: number;
  filtered_total?: number;
  status?: number | string | null;
  q?: string | null;
  reviews_pagination?: ReviewsPaginationMeta;
} | null;
//Leson type

export type Lesson = {
  id: Id;
  slug?: string | null;
  title?: string | null;
  description?: string | null;
  content?: Array<{
    title?: string | null;
    sections?: Array<{
      inner_title?: string | null;
      sub_titles?: string[] | null;
    }> | null;
  }> | null;

  status?: { value: number; label: string } | null;

  duration?: number | null; // "0" in sample
  starts_at?: string | null; // "09.01.2024 18:20"

  thumbnail?: ApiThumb;
  video?: ApiThumb;

  attachments?: ApiThumb[] | null; // empty array in sample

  created_at?: string; // "16.09.2025 13:47"
  updated_at?: string;
  next_lesson_id?: string | null;
  next_lesson_slug?: string | null;

  notes?: any[] | null; // backend returns an array; shape not specified
  reviews?: LessonReview[] | null;

  progress?: ApiProgress;
  has_practice_test?: boolean;
  revisions: {
    id: number;
    title: string;
    attachment: Attachment;
    thumbnail: Attachment;
    created_at: string;
  }[];
};

export interface LessonDetailsItem {
  lesson: Lesson;
  students_progress: StudentProgressItem[];
  students_progress_meta?: _Meta;
  reviews_meta?: ReviewsPaginationMeta;
  course_rating?: CourseRatingSummary | null;
}

export type ReviewsPaginationMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  rating: number | null;
} | null;

export type CourseRatingSummary = {
  average_rating: number;
  total_reviews: number;
  rating_breakdown?: {
    one_star_count?: number;
    two_star_count?: number;
    three_star_count?: number;
    four_star_count?: number;
    five_star_count?: number;
  } | null;
  reviews?: LessonReview[] | null;
  reviews_pagination?: ReviewsPaginationMeta;
} | null;

//student progress item

export type StudentProgressItem = {
  student: {
    id: number | string;
    username?: string | null;
    email?: string | null;
    phone_number?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    last_seen_at?: string | null;
    online?: boolean;
    student_no?: number | string | null;
    avatar?: { url?: string | null } | null;
  };
  progress: {
    viewed_duration?: number | null; // seconds (assumed)
    status?: { value: number; label: string } | null;
    last_viewed_at?: number | null; // epoch seconds (assumed)
    completed_at?: string | null; // "dd.mm.yyyy HH:MM"
  };
};

//Lesson review
export type LessonReview = {
  id: Id;
  lesson_id?: Id | null;
  rating?: number | null;
  content?: string | null;
  student?: User | null;
  comment?: string | null;
  user_id?: User | null;
  created_at?: string | null;
  updated_at?: string | null;
} | null;

/// Instructor type
// export interface InstructorApi {
//   id: Id;
//   username?: string;
//   email?: string;
//   phone_number?: string;
//   first_name?: string;
//   last_name?: string;
//   middle_name?: string | null;
//   avatar?: ApiThumb;
//   status?: ApiOption;
//   preferred_lang?: string | null;
//   date_of_birth?: string | null;
//   gender?: ApiOption;
//   role?: ApiOption;
//   last_login_at?: string | null; // "YYYY-MM-DD HH:mm:ss"
// }

// Student App types
// A convenient ID alias used across API entities

export interface MediaThumb {
  public_id?: Id;
  file_name?: string;
  extension?: string; // e.g. png, jpg, mp4, pdf
  file_size?: number;
  url?: string;
  created_at?: string; // ISO or server-formatted date
}

export interface UserSummary {
  id?: Id;
  username?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  avatar?: MediaThumb | string;
}

// export interface Course {
//   id: Id;
//   name?: string;
//   title?: string;
//   code?: string;
//   description?: string;
//   status?: ApiOption;
//   subject?: ApiOption;
//   subject_id?: ApiOption;
//   level_id?: ApiOption;
//   is_private?: boolean;
//   thumbnail?: MediaThumb | string;
//   created_by?: UserSummary;
//   lesson_counts?: number;
//   progress?: number; // 0..100
//   enrolled_at?: string | null; // e.g. "18.09.2025 05:08"
//   completion_date?: string | null;
// }
export interface Attachment {
  public_id: string;
  file_name?: string;
  extension?: string; // pdf, png, etc.
  file_size?: number;
  url?: string;
  created_at?: string; // ISO or server-formatted date
}

export interface StudentRatingAttachment {
  id: Id;
  student_rating_id?: Id;
  attachment: Attachment;
  created_at?: string;
}

export interface StudentRatingProgress {
  id: Id;
  student_rating_id: Id;
  status: ApiOption;
  score: number | null;
  comment?: string | null;
  creator?: User | null;
  checker?: User | null;
  checked_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StudentRating {
  id: Id;
  student_id: Id;
  category: ApiOption;
  score: number | null;
  status: ApiOption;
  attachments: StudentRatingAttachment[];
  progresses?: StudentRatingProgress[];
  student?: User | null;
  created_at?: string;
  updated_at?: string;
}

export interface Video {
  public_id?: string;
  file_name?: string;
  extension?: string;
  file_size?: number;
  url?: string;
  created_at?: string;
}

// export interface Lesson {
//   id: Id;
//   title?: string;
//   description?: string;
//   duration?: number | string;
//   starts_at?: string; // "dd.MM.yyyy HH:mm" or ISO — we parse it where needed
//   status?: ApiOption;
//   attachments?: Attachment[];
//   thumbnail?: ApiThumb | string;
//   video?: Video;
//   content?: string;
//   progressPercentage?: number;
//   completed?: boolean;
// }

/// File upload response type
export type UploadResult = {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number;
  url: string;
};

export type StudentLookup = {
  gender: LookupItem[];
  language: LookupItem[];
  nationality: LookupItem[];
  school_type: LookupItem[];
  region: LookupItem[];
  citizenship: LookupItem[];
  achievement_level: LookupItem[];
  passport: LookupItem[];
};
export type StudentRatingLookup = {
  rating_status: LookupItem[];
  rating_category: LookupItem[];
  rating_progress_status: LookupItem[];
  region: LookupItem[];
};
export type PracticeLookup = {
  "practice-status": LookupItem[];
  "practice-type": LookupItem[];
  "practice-test": LookupItem[];
};
export type CourseLookup = {
  "course-name": { id: number; name: string; thumbnail: Attachment }[];
  language: LookupItem[];
  level: LookupItem[];
  subject: LookupItem[];
  "course-type": LookupItem[];
};

export type LookupItem = { value: number; label: string };

// School-related types
export interface School {
  id: Id;
  name: string;
  type: ApiOption;
  region: ApiOption;
  district: ApiOption;
  address?: string;
  postal_code?: string;
  phone_number?: string;
  website_url?: string;
}

export interface SchoolFilter {
  type?: number;
  region_id?: Id;
  district_id?: Id;
  q?: string;
}

export interface CalendarEvent {
  id: Id;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
  meetingId?: Id;
  resource?: {
    session?: SessionDTO;
  };
}

export interface SessionCreator {
  id: Id;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: string | null;
  online: boolean;
  avatar: null | {
    public_id: Id;
    file_name: string;
    extension: string;
    file_size: number;
    url: string;
  };
}

export interface SessionAttendance {
  has_joined: boolean;
  join_time: string | null;
  leave_time: string | null;
  duration_minutes: number | null;
  duration_intervals: unknown | null;
}

// export interface SessionDTO {
//   id: Id;
//   name: string;
//   description: string | null;
//   type: ApiOption;
//   location: string | null;
//   starts_at: string; // "DD.MM.YYYY HH:mm"
//   ends_at: string; // "DD.MM.YYYY HH:mm"
//   created_by: SessionCreator;
//   meeting_id: Id;
//   status: ApiOption;
//   created_at: string;
//   updated_at: string;
//   attendance?: SessionAttendance;
// }

export type CreateSessionPayload = {
  name: string;
  description: string;
  start_timestamp: string;
  end_timestamp: string;
  is_online: boolean;
  location?: string | null;
  advisors?: number[];
  students?: number[];
};

export interface SessionResponse {
  session: SessionDTO;
  participants: Participant[];
  pagination: Pagination;
}

/** Session info */
export interface Session {
  id: number;
  name: string;
  description: string | null;
  type: {
    label: string;
    value: number;
  };
  location: string | null;
  starts_at: string;
  ends_at: string;
  status: {
    label: string;
    value: number;
  };
  meeting_id: string;
  created_at: string;
}

/** Session participant */
export interface Participant {
  id: number;
  session_id: number;
  user: User;
  has_joined: boolean;
  join_time: string | null;
  leave_time: string | null;
  duration_m: number | null;
  intervals:
    | {
        name: string;
        email: string | null;
        device: string | null;
        join_time: string | null;
        duration_m: number | null;
        ip_address: string | null;
        leave_time: string | null;
      }[]
    | null;
  email: string | null;
  device: string | null;
  ip_address: string | null;
}

/** Pagination info */
export interface Pagination {
  total: number;
  page: number;
  per_page: number;
  page_count: number;
}

// == Practice Test Types ==

export type LabelValue = { value: number; label: string };

export type QType =
  | 1 // Multiple Choice
  | 2 // True/False
  | 3 // Numeric
  | 4 // Short answer / Fill
  | 5 // Note / Paragraph
  | 6 // Matching Headings
  | 7 // Summary with {INPUT}
  | 8 // Flow chart
  | 9 // Matching Sentence Endings
  | 10; // Table completion

export type AnswerOption = { id: number; answer: string };

export type SubQuestion = {
  attachment: any;
  id: number;
  type: { id?: QType; value?: { value: QType; label: string } } | QType;
  question: string;
  attachment_id?: string | null;
  question_order: number; // 1-based
};

export type SelectedAnswer = {
  selected_answer_id?: number | null;
  response?: any;
  has_review?: 0 | 1;
  answered_at?: string | null;
  question_order: number; // 1-based
};

export type GroupInfo = {
  id: number;
  practice_test_id?: number;
  title?: string; // shown on the left above context
  context?: string; // passage
  hint?: string;
  audio?: Attachment;
  audio_id?: string;
  question_title?: string; // shown on the right under main range title
  created_at?: number;
  updated_at?: number;
};

export type MetaData = {
  total_questions: number;
  answered_questions: Array<{ question_order: number; has_review?: boolean }>;
  unanswered_questions: Array<{ question_order: number; has_review?: boolean }>;
  remaining_time: number; // in seconds
};

export type GetQuestionType = {
  is_grouped?: boolean;
  group?: { min_order: number; max_order: number };
  group_info?: GroupInfo;
  questions: SubQuestion[]; // grouped: many sub-qs
  answers: AnswerOption[] | Record<string, AnswerOption[]>;
  selected_answer?: SelectedAnswer; // single
  selected_answers?: Record<string | number, SelectedAnswer>; // grouped
  meta: MetaData;
};

export type PracticeTest = {
  id: number;
  title: string;
  time_limit?: number;
  total_questions?: number;
  passing_score?: number;
  difficulty_id?: LabelValue;
  difficulty?: LabelValue;
  created_by?: {
    first_name?: string;
    last_name?: string;
    username?: string | null;
    email?: string | null;
    avatar?: { url?: string | null };
  };
  active_session?: boolean;
  active_session_info?: {
    lesson_slug: string;
    lesson_title: string;
    session_id: number;
    session_token: string;
    course_id: number;
  };
};

export type PracticeTestResponse = { data: PracticeTest };

export type PracticeSession = {
  id: number;
  session_token: string;
  practice_test_id: {
    id: number;
    title: string;
    total_questions?: number;
    time_limit?: number;
  };
  student: { id: number };
  status: string;
  current_question_index: number;
  created_at: string;
};

export type PracticeSessionCookie = {
  session_id: number;
  practice_test_id: number;
  course_id?: Id;
  lesson_id?: Id;
  student_id: number;
  total_questions?: number;
  title?: string;
  time_limit: number;
  status: string;
  current_question_index: number;
  created_at: string;
  expires_at_ms: number;
  session_token: string;
};

export type PracticeTestsData = {
  info: {
    stats: {};
    results?: Result[];
  };
};

export type WritingScoreBreakdown = {
  task_response?: number | null;
  coherence_and_cohesion?: number | null;
  lexical_resource?: number | null;
  grammar_range_and_accuracy?: number | null;
  overall?: number | null;
  rounding_rule?: string | null;
  [key: string]: number | string | null | undefined;
};

export type WritingFeedbackQuestion = {
  scores?: WritingScoreBreakdown | null;
  overall_comment?: string | null;
  criterion_comments?: Record<string, string> | null;
  strengths?: string[] | null;
  weaknesses?: string[] | null;
  [key: string]: any;
};

export type WritingFeedback = {
  questions?: WritingFeedbackQuestion[];
  [key: string]: any;
};

export type Result = {
  attempt_id: number;
  passed: boolean;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  unanswered: number;
  time_taken?: number;
  started_at?: number;
  ended_at?: number;
  difficulty?: { label: string };
  passing_score: number;
  answered_questions: number;
  status?: { label: string; value: number };
  writing_result?: WritingFeedback | string | null;
  writing_feedback?: WritingFeedback | string | null;
  writing_review?: WritingFeedback | string | null;
  writing_report?: WritingFeedback | string | null;
  meta?: Record<string, unknown> | null;
  extra_data?: Record<string, unknown> | null;
  evaluation_data: {
    status: string;
    openai_batch_id: string;
    openai_batch_status: string;
    result: {
      overall_band: number;
      criteria: {
        task_response: {
          band: number;
          comment: string;
        };
        coherence_and_cohesion: {
          band: number;
          comment: string;
        };
      };
      lexical_resource: {
        band: number;
        comment: string;
      };
      grammar_range_and_accuracy: {
        band: number;
        comment: string;
      };
    };
    strengths: string[];
    areas_to_improve: string[];
    recommendations: string[];
  } | null;
};

// =========== Existing APP TYPES ===========

export interface Section {
  id: string;
  name: string;
  icon: string;
  color: string;
  buttonColor: string;
  questions: number;
  duration: number; // in minutes
  isCompleted?: boolean;
}

export interface PracticeTest2 {
  id: string;
  sections: Section[];
  isCompleted: boolean;
  progress: number; // 0-100 percentage
}

export interface MockExam {
  id: string;
  title: string;
  type: "IELTS" | "SAT";
  month: string;
  year: string;
  thumbnail: string;
  rating: number;
  votes: number;
  publishedDate: string;
  testsTaken: number;
  practiceSets: PracticeTest2[];
  sections: Section[];
  description?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
}
export type TestMode = "practice" | "simulation";

export interface TestOptions {
  mode: TestMode;
  selectedSections: string[];
  timeLimit?: number;
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface TestProgress {
  examId: string;
  practiceId: string;
  section: string;
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
}

export type ProductColor = {
  name?: string;
  code?: string;
};

export interface CartItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  color?: ProductColor | null;
  price: number;
  salePrice?: number;
  quantity: number;
  size: number;
  stock?: number;
  discount?: number;
}

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
};

export type PosProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
};
// export interface CalendarEvent {
//   id?: string;
//   start: Date;
//   end: Date;
//   allDay?: boolean;
//   title: string;
//   description?: string;
//   location?: string;
// }

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

export type LayoverAirPortOptionType = {
  id: number;
  name: string;
  isGroupTitle?: boolean;
  checked?: boolean;
  disabled?: boolean;
};

export type TanTableProductsDataType = {
  id: Id;
  name: string;
  category: string;
  image: string;
  price: string;
  quantity: number;
};

// =========== API YPES ===========

// /// File upload response type
// export type UploadResult = {
//   public_id: string;
//   file_name: string;
//   extension: string;
//   file_size: number;
// };

// // Student lookup type
// export type LookupItem = { value: number; label: string };
// export type StudentLookup = {
//   gender: LookupItem[];
//   language: LookupItem[];
//   nationality: LookupItem[];
//   school_type: LookupItem[];
//   region: LookupItem[];
//   citizenship: LookupItem[];
//   achievement_level: LookupItem[];
//   passport: LookupItem[];
// };

// // School type
// export type Option = { value: number; label: string };

// export interface School {
//   id: number;
//   name: string;
//   type: Option;
//   region: Option;
//   district: Option;
//   address?: string;
//   postal_code?: string;
//   phone_number?: string;
//   website_url?: string;
// }

// export interface SchoolFilter {
//   type?: number; // school type value (0..n)
//   region_id?: number;
//   district_id?: number;
//   q?: string; // optional search
// }

// // advisor Types
// export type FileInfo = {
//   public_id: string;
//   file_name: string;
//   extension: string;
//   file_size: number;
//   url: string;
//   created_at: string;
// };

// export type Passport = {
//   passport_number: string;
//   passport_photo: FileInfo;
//   passport_file: FileInfo;
//   citizenship: Option;
//   nationality: Option;
//   pinfl: string;
//   given_place: string;
//   expire_date: string;
//   given_date: string;
// };

// export type User = {
//   id: number;
//   username: string;
//   email: string;
//   phone_number: string;
//   first_name: string;
//   last_name: string;
//   middle_name: string;
//   avatar: {
//     public_id: string;
//     url: string;
//   } | null;
//   status: Option;
//   preferred_lang: string;
//   date_of_birth: string | null;
//   gender: Option;
//   role: Option;
//   last_login_at: string;
//   passport: Passport;
//   school: School;
// };

// ----------------- chat types ------------------------- //
export type MessagesType = {
  id: number;
  chat_id: number;
  sent_by_me: boolean;
  sender: {
    avatar: Attachment;
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    username: string;
    phone_number: string;
  };
  type: string; // you can extend later
  body: string | null;
  attachment: Array<Attachment> | null;
  reply_to: MessagesType | null;
  forward_from: MessagesType | null;
  pinned: boolean;
  seq: number;
  meta: string;
  edited_at: string | null;
  created_at: string;
};
export type Creater = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: string;
  online: boolean;
  avatar: {
    public_id: string;
    file_name: string;
    extension: string;
    file_size: number;
    url: string;
    created_at: string; // ISO timestamp
  } | null;
  stats?: {
    files: number;
    messages: number;
    videos: number;
    photos: number;
  };
  type: string;
};
export type GroupType = {
  created_at: string;
  id: number;
  title: string;
  online_members: string;
  created_by: number;
  total_members: number;
  type: string;
  stats?: {
    files: number;
    messages: number;
    videos: number;
    photos: number;
  };
  updated_at: string;
};
export type ChatMessageType = {
  messages: Array<MessagesType>;
  chat: Creater | GroupType;
};

export type ChatType = {
  id: number;
  type: "private" | "group" | string; // adjust if you have more types
  title: string | null;
  other_user: Creater & { role: LookupOption };
  member_last_read_seq: number | null;
  last_message: MessagesType | null;
  unread_count: number;
  has_new: boolean;
};

export type ChatMessagesHandle = {
  scrollToBottom: () => void;
};

// ------------ Support types ------------ //

export type SupportLookup = {
  "ticket-priority": LookupItem[];
  "ticket-status": LookupItem[];
  "ticket-type": LookupItem[];
};

export interface StudentDashboardResponse {
  overview: {
    courses: {
      enrolled_total: number;
      active_total: number;
      completed_total: number;
    };
    lessons: {
      total_lessons_in_enrolled_courses: number;
      completed_total: number;
      in_progress_total: number;
      completion_rate: number;
    };
    practice: {
      questions_answered_total: number;
      correct_total: number;
      accuracy_total: number;
      time_spent_seconds_total: number;
      avg_time_per_question_sec_total: number;
    };
    last_activity_at: number | null;
  };
  courses: {
    summary: {
      enrolled_count: number;
      active_count: number;
      completed_count: number;
    };
    top: top_courses[];
  };
  lessons: {
    summary: {
      total: number;
      completed: number;
      in_progress: number;
      completion_rate: number;
      last_activity_at: number | null;
    };
    recent: {
      lesson_id: number;
      course_id: number;
      title: string;
      completed_at: number;
      last_viewed_at: number;
      time_spent_seconds: number;
      questions_answered: number;
    }[];
  };
  practice: {
    summary: {
      window_days: number;
      questions_answered: number;
      correct: number;
      accuracy: number;
      time_spent_seconds: number;
      avg_time_per_question_sec: number;
    };
    top_tests: top_tests[];
    weaknesses: any[];
  };
  trends: {
    window_days: number;
    series: {
      day: string;
      answered: number;
      accuracy: number;
      time_spent_seconds: number;
    }[];
    streak_days: number;
  };
}

export type top_tests = {
  test_id: number;
  test_title: string;
  answered: number;
  accuracy: number;
  avg_time_sec: number;
  last_activity_at: number;
};
export type top_courses = {
  course_id: number;
  course_code: string;
  course_name: string;
  status: number;
  enrolled_at: number;
  lessons: {
    total: number;
    completed: number;
    completion_rate: number;
  };
  practice: {
    answered: number;
    accuracy: number;
  };
  last_activity_at: number;
};

type LookupOption = {
  value: number;
  label: string;
};

export type SupportTicket = {
  id: number;
  title: string | null;
  created_by: User;
  type: LookupOption;
  priority: LookupOption;
  status: LookupOption;
  ticket_code: string;
  created_at: string;
  updated_at: string;
};
export type SupportMessage = {
  id: number;
  ticket_id: number;
  message: string;
  user: User;
  created_at: string;
  attachments: Attachment[] | null;
};

export type SupportTicketResponse = {
  ticket: SupportTicket;
  messages: SupportMessage[];
};

// notification
export interface NotificationResponse {
  notifications: NotificationItem[];
  count: number;
}

export interface NotificationItem {
  id: number;
  user_id: User;
  type: LookupItem;
  title: string;
  message: string;
  is_read: boolean;
  is_notified: boolean;
  created_at: string;
}

export type PracticeTestType = {
  id: number;
  practice_test_id: number;
  test_title: string;
  test_description: string;
  lesson_title: string;
  course_name: string;
  status: LookupItem;
  answered_questions: number;
  correct_answers: number;
  percentage_score: number;
  time_taken_seconds: number;
  time_taken: string | null;
  difficulty: LookupItem;
  passing_score: number;
  is_passed: boolean;
  total_questions: number;
  completion_rate: number; // sample shows 0.0
  accuracy: number; // percentage
  avg_time_per_question: number; // seconds
  created_at: string; // e.g. "2025.10.10 20:55:48"
  completed_at: string | null;
};
export type TaskType = {
  id: number;
  task_id: ``;
  status: LookupItem;
  status_label: string;
  advisor_comment: string | null;
  task_title: string;
  task_description: string;
  task_due_at: string;
  created_by: Creater;
};

export interface CourseProgress {
  completion_percent: number;
  status: LookupItem;
  completion_date: string | null;
  left_to_do?: number | null;
  color?: LookupItem | null;
}

// export interface CourseSummary {
//   id: number;
//   code: string;
//   name: string;
//   status: LookupItem;
//   subject: LookupItem;
//   is_private: boolean;
//   instructors: UserSummary[];
//   thumbnail: ApiThumb | null;
//   created_by: UserSummary;
//   lesson_counts: number;
//   progress: CourseProgress;
// }

export interface CourseEnrollment {
  enrollment_id: number;
  course: Course;
  enrolled_at: string | null;
  progress: number;
  status: LookupItem;
  completion_date: string | null;
}

export type ProfileType = {
  latest_practices: PracticeTestType[];
  latest_tasks: TaskType[];
  courses: CourseEnrollment[];
};

export type IeltsData = {
  id: number;
  trf_number: string;
  overall: number;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
  test_date: string; // e.g. "05.06.2022"
  expiry_date: string; // e.g. "05.06.2025"
  certificate: AttachmentFile;
  created_at: string;
};
export type SatData = {
  id: number;
  registration_no: string; // e.g. "Te98st2"
  total_score: number; // e.g. 1500
  math_score: number; // e.g. 700
  english_score: number; // e.g. 800
  test_date: string; // e.g. "03.09.2024"
  certificate: AttachmentFile;
};
type TestScore =
  | { type: "ielts"; data: IeltsData }
  | { type: "sat"; data: SatData }
  | { type: string; data: any };

export type StudentGradeCourse = {
  value?: number | string;
  label?: string;
  point?: number | string;
  grade?: number | string;
  created_at?: string | null;
};

export type StudentGradeSlot = {
  slot_no?: number;
  courses?: StudentGradeCourse[] | Record<string, StudentGradeCourse>;
};

export type CertificateFile = {
  file_name: string;
  extension: string;
  file_size?: number;
  url: string;
  created_at?: string;
};

type AchievementApi = {
  id: number;
  title?: string;
  subject?: string;
  level_id?: { value?: number; label?: string };
  award?: string;
  description?: string;
  date_awarded?: string; // e.g. "12.12.2025"
  certificate?: CertificateFile;
};
// Helpers
type DateDDMMYYYY = string;
type PINFL14 = string;
export interface AttachmentFile {
  public_id: string;
  file_name: string;
  extension: string;
  file_size: number;
  url: string;
  created_at: string; // ISO datetime string
}

export interface LabeledOption {
  value: number;
  label: string;
}

export interface Passport {
  passport_number: string; // e.g. "AT1234530"
  passport_photo: AttachmentFile | null; // or null if not uploaded
  passport_file: AttachmentFile; // uploaded file info
  citizenship: LabeledOption; // { value, label }
  nationality: LabeledOption; // { value, label }
  pinfl: PINFL14; // 14 digits
  given_place: string; // e.g. "Tashkent IIB"
  expire_date: DateDDMMYYYY; // "DD.MM.YYYY"
  given_date: DateDDMMYYYY; // "DD.MM.YYYY"
  act_number?: "3013";
  type: LabeledOption;
}

export type StudentDataType = {
  student: {
    id: number | string;
    student_no?: string;
    username?: string | null;
    email?: string | null;
    phone_number?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    middle_name?: string | null;
    student_year?: string | null;
    avatar?: { url?: string } | null;
    date_of_birth?: string | null;
    test_scores?: TestScore[];
    grades?: StudentGradeSlot[];
    gender?: { value: number; label: string };
    role?: { value: number; label: string };
    status?: { value: number; label: string };
  };
  advisor?: {
    id: number | string;
    username?: string | null;
    email?: string | null;
    phone_number?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    last_seen_at?: string | null;
    online?: boolean;
    student_no?: string | number | null;
    role?: { value: number; label: string };
    avatar?: { url?: string } | null;
  } | null;
  related_data: {
    ielts?: IeltsData & { created_at?: string };
    sat?: SatData & { created_at?: string };
    contact: {
      parent_full_name?: string;
      parent_phone?: string;
      region?: { value?: number; label?: string };
      district?: { value?: number; label?: string };
      address?: string;
    };
    education?: {
      school?: {
        id?: number;
        name?: string;
        type?: { value?: number; label?: string };
        region?: { value?: number; label?: string };
        district?: { value?: number; label?: string };
        address?: string;
        postal_code?: string;
        phone_number?: string;
        website_url?: string;
      };
      graduation_year?: number;
      gpa?: number | string;
      transcript_file?: CertificateFile;
    };
    achievement?: AchievementApi[];
    passport: Passport;
    student_rating?: StudentRating[];
  };
};

export interface LeaderboardStudent {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: string;
  online: boolean;
  student_no: number;
  role: ApiOption;
  avatar: ApiThumb;
}

export interface AdviseesType {
  id: number;
  student_no: string;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  avatar?: Attachment | null;
  status: LookupItem;
  test_scores: TestScore[];
  preferred_lang: string;
  date_of_birth: string; // e.g., "20.02.2004"
  gender: LookupItem;
  role: LookupItem;
  last_login_at: string | null;
}

export type PersonRef = {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  last_seen_at: string; // 'YYYY-MM-DD HH:mm:ss'
  online: boolean;
  student_no: string | null;
  role: LookupItem;
  avatar: Attachment;
};

export type TaskDTO = {
  id: number;
  title: string;
  status: LookupItem;
  due_at: string; // 'DD.MM.YYYY HH:mm'
  created_by: PersonRef;
  attachments_count: number;
  sources_count: number;
  created_at: string;
  updated_at: string;
};

export type SessionDTO = {
  id: number;
  name: string;
  description: string;
  type: LookupItem;
  location: string | null;
  starts_at: string; // 'DD.MM.YYYY HH:mm'
  ends_at: string; // 'DD.MM.YYYY HH:mm'
  created_by: PersonRef;
  meeting_id: string;
  status: LookupItem;
  created_at: string;
  updated_at: string;
  attendance: {
    has_joined: boolean;
    join_time: string | null;
    leave_time: string | null;
    duration_minutes: number | null;
    duration_intervals: number | null;
  };
};

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type CalendarDTO = {
  tasks: Page<TaskDTO>;
  sessions: Page<SessionDTO>;
};

// Student Leaderboard types
export interface LeaderboardStatistics {
  completed_lessons: number;
  avg_best_test_score: number;
}

export interface LeaderboardItem {
  student: LeaderboardStudent;
  rank: number;
  statistics: LeaderboardStatistics;
}

// raw `_meta.current_user.statistics`
export interface CurrentUserStatistics {
  completed_lessons: number;
  avg_best_test_score: number;
}

// normalized current user rank used by the component
export interface CurrentUserRank {
  student: LeaderboardStudent;
  rank: number;
  total_students: number;
  statistics: CurrentUserStatistics;
}

// raw API meta (_meta)
export interface RawLeaderboardMetaCurrentUser {
  student: LeaderboardStudent;
  rank: number;
  statistics: CurrentUserStatistics;
  total_students: number;
}

export interface RawLeaderboardMeta {
  total: number;
  page: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  current_user: RawLeaderboardMetaCurrentUser | null;
}

// raw API response (exactly like your example)
export interface RawLeaderboardApiResponse {
  data: LeaderboardItem[];
  _meta: RawLeaderboardMeta;
  success: boolean;
}

// what our fetch function returns (normalized)
export interface LeaderboardResponseData {
  leaderboard: LeaderboardItem[];
  pagination: _Meta;
  current_user_rank: CurrentUserRank | null;
}

export interface FetchLeaderboardArgs {
  courseId: number | string;
  page?: number;
  perPage?: number;
}

interface point {
  value: number;
  label: string;
  point: number;
  grade: number;
}

export interface RenesansPoints {
  student_id: number;
  student_no: string;
  full_name: string;
  region: null;
  slot_no: number;
  courses: point[];
}
